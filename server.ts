import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // API Route: Download image as forced attachment (bypasses CORS completely)
  app.get('/api/download-image', async (req, res) => {
    const rawUrl = req.query.url as string;
    let filename = (req.query.filename as string) || 'sharechat_dp.jpg';

    if (!rawUrl) {
      return res.status(400).send('Image URL is required');
    }

    // Ensure valid extension
    if (!/\.(jpg|jpeg|png|webp)$/i.test(filename)) {
      filename += '.jpg';
    }

    try {
      const decodedUrl = decodeURIComponent(rawUrl);
      const imgRes = await fetch(decodedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://sharechat.com/'
        }
      });

      if (!imgRes.ok) {
        return res.status(imgRes.status).send(`Failed to fetch image: status ${imgRes.status}`);
      }

      const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
      const arrayBuf = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);

      const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
      res.setHeader('Content-Length', buffer.byteLength.toString());
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-cache');
      return res.send(buffer);
    } catch (err: any) {
      console.error('Error downloading image:', err);
      return res.status(500).send('Failed to download image: ' + (err.message || 'Unknown error'));
    }
  });

  // API Route: Stream image preview through proxy (in case browser blocks Sharechat hotlinking)
  app.get('/api/image-proxy', async (req, res) => {
    const rawUrl = req.query.url as string;
    if (!rawUrl) return res.status(400).send('URL is required');

    try {
      const decodedUrl = decodeURIComponent(rawUrl);
      const imgRes = await fetch(decodedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://sharechat.com/'
        }
      });

      if (!imgRes.ok) {
        return res.status(imgRes.status).send('Failed to fetch image');
      }

      const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
      const arrayBuf = await imgRes.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.send(Buffer.from(arrayBuf));
    } catch {
      return res.status(500).send('Proxy error');
    }
  });

  // API Route: Scrape real ShareChat Profile & DP URLs
  app.get('/api/sharechat-profile', async (req, res) => {
    const query = (req.query.query as string || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Extract clean username
    let username = query;
    username = username.split('?')[0].split('#')[0];
    if (username.includes('sharechat.com/profile/')) {
      const parts = username.split('sharechat.com/profile/');
      if (parts[1]) username = parts[1].replace('/', '');
    } else if (username.includes('sharechat.com/user/')) {
      const parts = username.split('sharechat.com/user/');
      if (parts[1]) username = parts[1].replace('/', '');
    }
    username = username.replace(/^@+/, '').replace(/[^a-zA-Z0-9._-]/g, '');

    if (!username) {
      username = 'sakilkhan';
    }

    const targetUrl = `https://sharechat.com/profile/${username}`;

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8,bn;q=0.7'
        }
      });

      if (!response.ok) {
        return res.json({
          success: false,
          username,
          handle: `@${username}`,
          profileUrl: targetUrl,
          message: `ShareChat returned status ${response.status}`
        });
      }

      const html = await response.text();

      let displayName = username;
      let avatarUrl = '';
      let coverUrl = '';
      let userId = '';
      let bio = '';

      // 1. Try to extract Person schema from JSON-LD
      const ldMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
      for (const m of ldMatches) {
        const raw = m.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
        try {
          const parsed = JSON.parse(raw);
          if (parsed['@type'] === 'Person') {
            if (parsed.name) displayName = parsed.name;
            if (parsed.image) avatarUrl = parsed.image;
            if (parsed.alternateName) username = parsed.alternateName;
          }
        } catch {}
      }

      // 2. Extract pu (Profile URL) from JS state data if not found or low-res
      const puMatch = html.match(/pu:"([^"]+)"/);
      if (puMatch && puMatch[1]) {
        avatarUrl = puMatch[1].replace(/\\u0026/g, '&').replace(/%26/g, '&');
      }

      // 3. Extract coverPic from JS state data
      const coverMatch = html.match(/coverPic:"([^"]+)"/);
      if (coverMatch && coverMatch[1]) {
        coverUrl = coverMatch[1].replace(/\\u0026/g, '&').replace(/%26/g, '&');
      }

      // 4. Extract numeric user ID (i:"1234567")
      const idMatch = html.match(/i:"(\d+)"/);
      if (idMatch && idMatch[1]) {
        userId = idMatch[1];
      }

      // 5. Extract bio/status (s:"...")
      const bioMatch = html.match(/s:"([^"]+)"/);
      if (bioMatch && bioMatch[1]) {
        bio = bioMatch[1];
      }

      // Fallback: og:image if pu not found
      if (!avatarUrl) {
        const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
        if (ogImageMatch && ogImageMatch[1]) {
          avatarUrl = ogImageMatch[1];
        }
      }

      // Fallback: title for display name
      if (displayName === username) {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          const rawTitle = titleMatch[1].split('(@')[0].trim();
          if (rawTitle && !rawTitle.toLowerCase().includes('sharechat')) {
            displayName = rawTitle;
          }
        }
      }

      return res.json({
        success: true,
        username,
        name: displayName,
        handle: `@${username}`,
        profileUrl: targetUrl,
        userId: userId || `SC_${Math.floor(1000000 + Math.random() * 9000000)}`,
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}`,
        coverUrl: coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        bio,
        isRealScraped: Boolean(avatarUrl && !avatarUrl.includes('dicebear'))
      });
    } catch (error: any) {
      console.error('Error fetching ShareChat profile:', error);
      return res.json({
        success: false,
        username,
        handle: `@${username}`,
        profileUrl: targetUrl,
        error: error.message || 'Scraping failed'
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
