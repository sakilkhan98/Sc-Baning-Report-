import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import sharechatProfileHandler from './api/sharechat-profile';
import downloadImageHandler from './api/download-image';
import sharechatMediaHandler from './api/sharechat-media';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // API Route: ShareChat Profile Scraper
  app.get('/api/sharechat-profile', async (req, res) => {
    await sharechatProfileHandler(req, res);
  });

  // API Route: ShareChat Video & Chatroom Scraper
  app.get('/api/sharechat-media', async (req, res) => {
    await sharechatMediaHandler(req, res);
  });

  // API Route: Download Image/Video/Audio as forced attachment (bypasses CORS)
  app.get('/api/download-image', async (req, res) => {
    await downloadImageHandler(req, res);
  });

  app.get('/api/download-media', async (req, res) => {
    await downloadImageHandler(req, res);
  });

  // API Route: Image Proxy
  app.get('/api/image-proxy', async (req, res) => {
    const rawUrl = req.query.url as string;
    if (!rawUrl) return res.status(400).send('URL is required');

    try {
      const decodedUrl = decodeURIComponent(rawUrl);
      const imgRes = await fetch(decodedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
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
