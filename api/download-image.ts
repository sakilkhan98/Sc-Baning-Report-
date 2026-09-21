// Vercel Serverless Function: Download Image as forced attachment with CORS
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawUrl = req.query.url as string;
  let filename = (req.query.filename as string) || 'sharechat_media';

  if (!rawUrl) {
    return res.status(400).send('Media URL is required');
  }

  // Ensure valid extension
  if (!/\.(jpg|jpeg|png|webp|mp4|webm|mp3|m4a|aac)$/i.test(filename)) {
    if (rawUrl.includes('.mp4')) {
      filename += '.mp4';
    } else if (rawUrl.includes('.mp3') || rawUrl.includes('.m4a')) {
      filename += '.mp3';
    } else {
      filename += '.jpg';
    }
  }

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
      return res.status(imgRes.status).send(`Failed to fetch image: status ${imgRes.status}`);
    }

    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
    const arrayBuf = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Content-Length', buffer.byteLength.toString());
    res.setHeader('Cache-Control', 'no-cache');
    return res.send(buffer);
  } catch (err: any) {
    console.error('Error downloading image:', err);
    return res.status(500).send('Failed to download image: ' + (err.message || 'Unknown error'));
  }
}
