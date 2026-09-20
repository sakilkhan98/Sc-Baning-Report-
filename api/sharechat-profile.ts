// Vercel Serverless Function & Express Route Handler
export default async function handler(req: any, res: any) {
  // Enable CORS for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = (req.query.query as string || '').trim();
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // Extract clean username
  let clean = query.trim().replace(/^['"`]+|['"`]+$/g, '');
  clean = clean.split('?')[0].split('#')[0].trim();

  const profileMatch = clean.match(/(?:(?:sharechat\.com)?\/profile\/|^profile\/)([^/?#]+)/i);
  if (profileMatch && profileMatch[1]) {
    clean = profileMatch[1];
  } else {
    const userMatch = clean.match(/(?:(?:sharechat\.com)?\/user\/|^user\/)([^/?#]+)/i);
    if (userMatch && userMatch[1]) {
      clean = userMatch[1];
    }
  }
  clean = clean.replace(/^[@/'"`]+|[@/'"`]+$/g, '').trim();

  const username = clean || 'sakilkhan';
  const targetUrl = `https://sharechat.com/profile/${username}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8,bn;q=0.7'
      }
    });

    if (!response.ok) {
      return res.json({
        success: false,
        username,
        name: username,
        handle: `@${username}`,
        profileUrl: targetUrl,
        userId: username,
        followers: '0',
        following: '0',
        posts: '0',
        message: `ShareChat returned status ${response.status}`
      });
    }

    const html = await response.text();

    let name = username;
    let avatarUrl = '';
    let coverUrl = '';
    let userId = username;
    let bio = '';
    let followers = '0';
    let following = '0';
    let posts = '0';
    let gender = '';
    let language = '';
    let isVerified = false;

    // 1. JSON-LD Person schema
    const ldMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
    for (const m of ldMatches) {
      const raw = m.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      try {
        const parsed = JSON.parse(raw);
        if (parsed['@type'] === 'Person') {
          if (parsed.name && !parsed.name.toLowerCase().includes('sharechat')) name = parsed.name;
          if (parsed.image) avatarUrl = parsed.image;
          if (parsed.alternateName) name = parsed.name || parsed.alternateName;
          if (parsed.interactionStatistic && parsed.interactionStatistic[0]) {
            followers = String(parsed.interactionStatistic[0].userInteractionCount || '0');
          }
        }
      } catch {}
    }

    // 2. pu: profile pic HD
    const puMatch = html.match(/pu:"([^"]+)"/);
    if (puMatch && puMatch[1]) {
      avatarUrl = puMatch[1].replace(/\\u0026/g, '&').replace(/%26/g, '&');
    }

    // 3. coverPic: back DP
    const coverMatch = html.match(/coverPic:"([^"]+)"/);
    if (coverMatch && coverMatch[1]) {
      coverUrl = coverMatch[1].replace(/\\u0026/g, '&').replace(/%26/g, '&');
    }

    // 4. numeric user ID
    const idMatch = html.match(/i:"(\d+)"/);
    if (idMatch && idMatch[1]) {
      userId = idMatch[1];
    }

    // 5. accurate name from profile state
    const nameMatch = html.match(/,n:"([^"]+)",newsPublisherStatus/);
    if (nameMatch && nameMatch[1]) {
      name = nameMatch[1];
    }

    // 6. bio / status from profile state
    const bioMatch = html.match(/,s:"([^"]+)",showFollowSuggestion/);
    if (bioMatch && bioMatch[1]) {
      bio = bioMatch[1];
    }

    // 7. followers & following from profile state
    const aMatch = html.match(/a:"(\d+)"/);
    if (aMatch && aMatch[1]) {
      followers = aMatch[1];
    }
    const bMatch = html.match(/b:"(\d+)"/);
    if (bMatch && bMatch[1]) {
      following = bMatch[1];
    }

    // 8. post count
    const pcMatch = html.match(/pc:"(\d+)"/);
    if (pcMatch && pcMatch[1]) {
      posts = pcMatch[1];
    }

    // 9. gender & language
    const gMatch = html.match(/gender:"([^"]+)"/);
    if (gMatch && gMatch[1]) {
      gender = gMatch[1] === 'M' ? 'Male' : gMatch[1] === 'F' ? 'Female' : gMatch[1];
    }

    const lMatch = html.match(/language:"([^"]+)"/);
    if (lMatch && lMatch[1]) {
      language = lMatch[1];
    }

    // 10. verification
    if (html.includes('isScBlueSubscribed:true') || html.includes('isVoluntarilyVerified:true')) {
      isVerified = true;
    }

    // Fallbacks
    if (!avatarUrl) {
      const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
      if (ogImageMatch && ogImageMatch[1]) {
        avatarUrl = ogImageMatch[1];
      }
    }

    return res.json({
      success: true,
      username,
      name: name || username,
      handle: `@${username}`,
      profileUrl: targetUrl,
      userId: userId || username,
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}`,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      bio: bio || '',
      followers: followers || '0',
      following: following || '0',
      posts: posts || '0',
      gender: gender || 'Not specified',
      language: language || 'Bengali / Hindi',
      isVerified,
      isRealScraped: Boolean(avatarUrl && !avatarUrl.includes('dicebear'))
    });
  } catch (error: any) {
    console.error('Error fetching ShareChat profile:', error);
    return res.json({
      success: false,
      username,
      name: username,
      handle: `@${username}`,
      profileUrl: targetUrl,
      userId: username,
      followers: '0',
      following: '0',
      posts: '0',
      error: error.message || 'Scraping failed'
    });
  }
}
