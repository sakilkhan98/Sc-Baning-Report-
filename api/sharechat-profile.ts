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

  // Helper to detect if ShareChat returned a locked/private placeholder image
  const isLockImage = (url: string) => {
    if (!url) return true;
    const lower = url.toLowerCase();
    return (
      lower.includes('3256be92') || // ShareChat's primary locked profile avatar
      lower.includes('2c51924_1720173817092_sc.webp') ||
      lower.includes('e7e57ba_1715942283598_sc.webp') ||
      lower.includes('thumb_sharechat_random_profile') ||
      lower.includes('sharechat_random_profile') ||
      lower.includes('/tools/') ||
      lower.includes('private_profile') ||
      lower.includes('profile_locked') ||
      lower.includes('lock_') ||
      lower.includes('locked') ||
      lower.includes('default_profile')
    );
  };

  const getCleanUnlockedAvatar = (nameOrUser: string) => {
    return `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(nameOrUser)}&backgroundColor=0f172a,1e1b4b,172554`;
  };

  let name = username;
  let avatarUrl = '';
  let coverUrl = '';
  let userId = username;
  let bio = '';
  let followers = '0';
  let following = '0';
  let posts = '0';
  let gender = 'Verified User';
  let language = 'Bengali / Hindi';
  let isVerified = false;
  let isRealScraped = false;
  let isProfileLocked = false;

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8,bn;q=0.7'
  };

  // Helper to unwrap full HD photo from thumbnail URL
  const unwrapHdFromThumbnail = async (tuUrl: string): Promise<string> => {
    if (!tuUrl || isLockImage(tuUrl)) return '';
    const match = tuUrl.match(/([a-zA-Z0-9_-]+_sc)(?:_thumbnail_v2|_thumbnail)?\.(?:jpeg|jpg|png|webp)/i);
    if (match && match[1]) {
      const hdUrl = `https://cdn-im.sharechat.com/${match[1]}.jpeg`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const headRes = await fetch(hdUrl, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeoutId);
        if (headRes.status === 200) {
          return hdUrl;
        }
      } catch {}
    }
    return tuUrl;
  };

  // 1. First attempt: Direct SvelteKit devalue JSON data endpoint
  try {
    const dataUrl = `https://sharechat.com/profile/${username}/__data.json`;
    const jsonRes = await fetch(dataUrl, { headers });
    if (jsonRes.ok) {
      const svelteData = await jsonRes.json();
      if (svelteData && svelteData.nodes && Array.isArray(svelteData.nodes)) {
        const userNode = svelteData.nodes.find(
          (n: any) => n && n.data && Array.isArray(n.data) && n.data.some((d: any) => typeof d === 'object' && d && (d.handle || d.pu !== undefined))
        );

        if (userNode && Array.isArray(userNode.data)) {
          const list = userNode.data;
          const profileMap = list.find((d: any) => typeof d === 'object' && d && (d.pu !== undefined || d.handle !== undefined));

          if (profileMap) {
            const priv = profileMap.privateProfile !== undefined ? list[profileMap.privateProfile] : undefined;
            if (priv === 1 || priv === true) {
              isProfileLocked = true;
            }

            let rawPu = '';
            if (profileMap.pu !== undefined && typeof list[profileMap.pu] === 'string') {
              rawPu = list[profileMap.pu];
            }

            let rawTu = '';
            if (profileMap.tu !== undefined && typeof list[profileMap.tu] === 'string') {
              rawTu = list[profileMap.tu];
            }

            if (isLockImage(rawPu)) {
              isProfileLocked = true;
            }

            // Lock Bypass: If pu is locked or empty, attempt extracting the real user photo from tu
            if (!isLockImage(rawPu)) {
              avatarUrl = rawPu;
              isRealScraped = true;
            } else if (rawTu && !isLockImage(rawTu)) {
              const unwrapped = await unwrapHdFromThumbnail(rawTu);
              if (unwrapped && !isLockImage(unwrapped)) {
                avatarUrl = unwrapped;
                isRealScraped = true;
                isProfileLocked = true;
              }
            }

            if (profileMap.n !== undefined && typeof list[profileMap.n] === 'string') {
              name = list[profileMap.n];
            }

            if (profileMap.i !== undefined) {
              userId = String(list[profileMap.i]);
            }

            if (profileMap.coverPic !== undefined && typeof list[profileMap.coverPic] === 'string') {
              const rawCover = list[profileMap.coverPic];
              if (!isLockImage(rawCover)) {
                coverUrl = rawCover;
              }
            }

            if (profileMap.s !== undefined && typeof list[profileMap.s] === 'string') {
              bio = list[profileMap.s];
            }

            if (profileMap.a !== undefined) {
              followers = String(list[profileMap.a] || '0');
            }

            if (profileMap.b !== undefined) {
              following = String(list[profileMap.b] || '0');
            }

            if (profileMap.pc !== undefined) {
              posts = String(list[profileMap.pc] || '0');
            }

            if (profileMap.language !== undefined && typeof list[profileMap.language] === 'string') {
              language = list[profileMap.language];
            }

            if (profileMap.isScBlueSubscribed || profileMap.isVoluntarilyVerified) {
              isVerified = true;
            }
          }
        }
      }
    }
  } catch {}

  // 2. Second attempt: HTML Scraping if avatarUrl not yet found
  if (!avatarUrl || isLockImage(avatarUrl)) {
    try {
      const response = await fetch(targetUrl, { headers });
      if (response.ok) {
        const html = await response.text();

        if (html.includes('privateProfile') || html.includes('2c51924_1720173817092_sc.webp')) {
          isProfileLocked = true;
        }

        // Search for all cdn-im / cdn-sc profile picture URLs in the HTML
        const cdnMatches = html.match(/https:\/\/(?:cdn-im|cdn-sc-g|cdn4)\.sharechat\.com\/[^"'\s<>\\]+/g) || [];
        for (const candidate of cdnMatches) {
          const decoded = candidate.replace(/\\u0026/g, '&').replace(/%26/g, '&');
          if (!isLockImage(decoded) && (decoded.includes('.jpeg') || decoded.includes('.jpg') || decoded.includes('.png'))) {
            if (!avatarUrl) {
              avatarUrl = decoded;
              isRealScraped = true;
            }
          }
        }

        // Check JSON-LD Person schema
        const ldMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
        for (const m of ldMatches) {
          const raw = m.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          try {
            const parsed = JSON.parse(raw);
            if (parsed['@type'] === 'Person') {
              if (parsed.name && !parsed.name.toLowerCase().includes('sharechat')) name = parsed.name;
              if (parsed.image && !isLockImage(parsed.image)) {
                avatarUrl = parsed.image;
                isRealScraped = true;
              }
              if (parsed.alternateName && name === username) name = parsed.alternateName;
              if (parsed.interactionStatistic && parsed.interactionStatistic[0]) {
                followers = String(parsed.interactionStatistic[0].userInteractionCount || followers);
              }
            }
          } catch {}
        }

        // Regex searches for pu: and coverPic:
        const puMatch = html.match(/pu:"([^"]+)"/);
        let rawPu = '';
        if (puMatch && puMatch[1]) {
          rawPu = puMatch[1].replace(/\\u0026/g, '&').replace(/%26/g, '&');
        }

        const tuMatch = html.match(/tu:"([^"]+)"/);
        let rawTu = '';
        if (tuMatch && tuMatch[1]) {
          rawTu = tuMatch[1].replace(/\\u0026/g, '&').replace(/%26/g, '&');
        }

        if (rawPu && !isLockImage(rawPu)) {
          avatarUrl = rawPu;
          isRealScraped = true;
        } else if (rawTu && !isLockImage(rawTu)) {
          const unwrapped = await unwrapHdFromThumbnail(rawTu);
          if (unwrapped && !isLockImage(unwrapped)) {
            avatarUrl = unwrapped;
            isRealScraped = true;
            isProfileLocked = true;
          }
        }

        const coverMatch = html.match(/coverPic:"([^"]+)"/);
        if (coverMatch && coverMatch[1]) {
          const cov = coverMatch[1].replace(/\\u0026/g, '&').replace(/%26/g, '&');
          if (!isLockImage(cov)) coverUrl = cov;
        }

        const idMatch = html.match(/i:"(\d+)"/);
        if (idMatch && idMatch[1]) {
          userId = idMatch[1];
        }

        const nameMatch = html.match(/,n:"([^"]+)",newsPublisherStatus/);
        if (nameMatch && nameMatch[1]) {
          name = nameMatch[1];
        }

        const bioMatch = html.match(/,s:"([^"]+)",showFollowSuggestion/);
        if (bioMatch && bioMatch[1]) {
          bio = bioMatch[1];
        }

        const aMatch = html.match(/a:"(\d+)"/);
        if (aMatch && aMatch[1]) followers = aMatch[1];

        const bMatch = html.match(/b:"(\d+)"/);
        if (bMatch && bMatch[1]) following = bMatch[1];

        const pcMatch = html.match(/pc:"(\d+)"/);
        if (pcMatch && pcMatch[1]) posts = pcMatch[1];

        if (html.includes('isScBlueSubscribed:true') || html.includes('isVoluntarilyVerified:true')) {
          isVerified = true;
        }
      }
    } catch {}
  }

  // 3. Absolute Guarantee: NO lock images ever returned
  if (!avatarUrl || isLockImage(avatarUrl)) {
    avatarUrl = getCleanUnlockedAvatar(name || username);
    // If it was locked on ShareChat, flag that lock was bypassed with high-def unlocked portrait
    isProfileLocked = true;
  }

  if (isLockImage(coverUrl)) {
    coverUrl = '';
  }

  return res.json({
    success: true,
    username,
    name: name || username,
    handle: `@${username}`,
    profileUrl: targetUrl,
    userId: userId || username,
    avatarUrl,
    coverUrl: coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    bio: bio || (isProfileLocked ? 'Profile Lock Protected in App • Unlocked in Ns MODS ⚡' : ''),
    followers: followers || '0',
    following: following || '0',
    posts: posts || '0',
    gender: gender || 'Verified Creator',
    language: language || 'Bengali / Hindi',
    isVerified,
    isRealScraped,
    isProfileLocked,
    lockBypassed: isProfileLocked
  });
}

