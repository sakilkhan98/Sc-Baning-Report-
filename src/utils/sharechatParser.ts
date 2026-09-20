import { ReportLevel, SharechatProfile } from '../types/sharechat';

export const REPORT_LEVELS: ReportLevel[] = [
  {
    level: 1,
    label: 'Report 1: Basic Warning',
    labelBn: 'রিপোর্ট ১: প্রাথমিক সতর্কবার্তা',
    badge: 'Level 1',
    strength: 'MILD',
    dangerCodeSuffix: '101warn#notice',
    shortDesc: 'Mild foul language or minor chatroom conduct violation',
    shortDescBn: 'হালকা খারাপ কথা বা অশোভন আচরণের সতর্কবার্তা',
    formalTitle: 'First Notice: Uncivil Language & Code of Conduct Breach'
  },
  {
    level: 2,
    label: 'Report 2: Mic Mute 24H',
    labelBn: 'রিপোর্ট ২: চ্যাটরুম মাইক ২৪ ঘণ্টা মিউট',
    badge: 'Level 2',
    strength: 'MEDIUM',
    dangerCodeSuffix: '202mic#mute24h',
    shortDesc: '24-hour voice mic audio suspension for abusive slurs',
    shortDescBn: 'চ্যাটরুম মাইকে গালি দেওয়ার জন্য ২৪ ঘণ্টা মাইক মিউট',
    formalTitle: 'Chatroom Mic Temporary Audio Suspension (24 Hours)'
  },
  {
    level: 3,
    label: 'Report 3: Chatroom Audio Ban',
    labelBn: 'রিপোর্ট ৩: স্থায়ী অডিও ও মাইক ব্যান',
    badge: 'Level 3',
    strength: 'STRONG',
    dangerCodeSuffix: '303room#audioban',
    shortDesc: 'Permanent revocation of chatroom speaking privileges',
    shortDescBn: 'চ্যাটরুমের মাইক ও কথা বলার অনুমতি স্থায়ীভাবে বাতিল',
    formalTitle: 'Permanent Chatroom Audio & Microphone Revocation'
  },
  {
    level: 4,
    label: 'Report 4: Fake ID / Clone',
    labelBn: 'রিপোর্ট ৪: ফেক আইডি / ক্লোন প্রোফাইল',
    badge: 'Level 4',
    strength: 'STRONG',
    dangerCodeSuffix: '404clone#purge',
    shortDesc: 'Stealing identity, photos, or cloning other user profiles',
    shortDescBn: 'অন্যের নাম বা ছবি নকল করে ফেক আইডি চালানো',
    formalTitle: 'Identity Theft & Fraudulent Profile Impersonation'
  },
  {
    level: 5,
    label: 'Report 5: Spam & Room Crasher',
    labelBn: 'রিপোর্ট ৫: লিঙ্ক স্প্যাম ও রুম ক্র্যাশার',
    badge: 'Level 5',
    strength: 'STRONG',
    dangerCodeSuffix: '5786spam#band',
    shortDesc: 'Flooding malicious links, bot attacks, and room crashing',
    shortDescBn: 'লিঙ্ক স্প্যামিং, বট অ্যাটাক ও চ্যাটরুম ক্র্যাশার',
    formalTitle: 'Automated Bot Flooding & Chatroom Crasher Disruption'
  },
  {
    level: 6,
    label: 'Report 6: Obscene & NSFW Content',
    labelBn: 'রিপোর্ট ৬: অশ্লীল ও ১৮+ কনটেন্ট ছড়ানো',
    badge: 'Level 6',
    strength: 'VERY STRONG',
    dangerCodeSuffix: '606nsfw#takedown',
    shortDesc: 'Sharing explicit, adult, or vulgar content in chats or DP',
    shortDescBn: 'চ্যাটে বা প্রোফাইলে অশ্লীল, ১৮+ বা নোংরা কনটেন্ট ছড়ানো',
    formalTitle: 'Severe Obscenity & Sexually Explicit Content Violation'
  },
  {
    level: 7,
    label: 'Report 7: Abuse & Gali Threat',
    labelBn: 'রিপোর্ট ৭: চরম গালিগালাজ ও ব্যক্তিগত আক্রমণ',
    badge: 'Level 7',
    strength: 'VERY STRONG',
    dangerCodeSuffix: '5786abuse#band',
    shortDesc: 'Aggressive verbal harassment, direct slurs, and bullying',
    shortDescBn: 'উগ্র গালিগালাজ, ব্যক্তিগত আক্রমণ ও হেনস্তা',
    formalTitle: 'Severe Target Harassment & Obscene Verbal Attacks'
  },
  {
    level: 8,
    label: 'Report 8: Coin & Gift Fraud',
    labelBn: 'রিপোর্ট ৮: কয়েন ও গিফট প্রতারণা',
    badge: 'Level 8',
    strength: 'EXTREME',
    dangerCodeSuffix: '808fraud#freeze',
    shortDesc: 'Coin hacking scams, fake recharge fraud, and financial theft',
    shortDescBn: 'কয়েন হ্যাকিং, ফেক রিচার্জ বা আর্থিক প্রতারণা',
    formalTitle: 'Financial Scam, Phishing & Virtual Currency Fraud'
  },
  {
    level: 9,
    label: 'Report 9: Danger Threat & Blackmail',
    labelBn: 'রিপোর্ট ৯: ব্ল্যাকমেইল ও সাইবার ক্রাইম হুমকি',
    badge: 'Level 9',
    strength: 'EXTREME',
    dangerCodeSuffix: '909threat#lockout',
    shortDesc: 'Extortion, life endangerment, blackmailing, and doxxing',
    shortDescBn: 'ব্ল্যাকমেইলিং, সাইবার ক্রাইম ও প্রাণনাশের হুমকি',
    formalTitle: 'Critical Cyber Threat, Extortion & Endangerment'
  },
  {
    level: 10,
    label: 'Report 10: Ultra Permanent Ban',
    labelBn: 'রিপোর্ট ১০: আল্ট্রা স্ট্রং পার্মানেন্ট ব্যান',
    badge: 'Level 10 (ULTRA)',
    strength: 'ULTRA STRONG',
    dangerCodeSuffix: '5786ULTRA#MAXTERMINATION',
    shortDesc: 'Full profile deletion, hardware IMEI & IP blacklist',
    shortDescBn: 'স্থায়ী একাউন্ট ডিলিট, ডিভাইস ও আইপি হার্ডওয়্যার ব্যান',
    formalTitle: 'Emergency Termination & Complete Device Hardware/IP Ban'
  }
];

export function extractUsername(input: string): string {
  if (!input) return 'sakilkhan';
  let cleaned = input.trim();
  // Strip quotes and ticks
  cleaned = cleaned.replace(/^['"`]+|['"`]+$/g, '');
  // Remove query params or hash
  cleaned = cleaned.split('?')[0].split('#')[0].trim();

  const profileMatch = cleaned.match(/(?:(?:sharechat\.com)?\/profile\/|^profile\/)([^/?#]+)/i);
  if (profileMatch && profileMatch[1]) {
    cleaned = profileMatch[1];
  } else {
    const userMatch = cleaned.match(/(?:(?:sharechat\.com)?\/user\/|^user\/)([^/?#]+)/i);
    if (userMatch && userMatch[1]) {
      cleaned = userMatch[1];
    }
  }

  // Strip leading @, slashes, or trailing slashes
  cleaned = cleaned.replace(/^[@/'"`]+|[@/'"`]+$/g, '').trim();
  return cleaned || 'sakilkhan';
}

export function buildSharechatProfile(input: string): SharechatProfile {
  const username = extractUsername(input);
  return {
    username,
    name: username,
    handle: `@${username}`,
    profileUrl: `https://sharechat.com/profile/${username}`,
    userId: `SC_${Math.abs(hashString(username)) % 9000000 + 1000000}`,
    avatarUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}&backgroundColor=0f172a,1e1b4b,31104b`,
    coverUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80`,
    followers: '0',
    following: '0',
    posts: '0',
    gender: 'Not specified',
    language: 'Bengali / Hindi',
    bio: '',
    isVerified: false,
    isRealScraped: false
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

export function getDangerCode(username: string, levelObj: ReportLevel): string {
  const cleanUser = extractUsername(username);
  return `*#${levelObj.dangerCodeSuffix}"∆${cleanUser}`;
}

export function generateReport(params: {
  username: string;
  profileUrl: string;
  level: ReportLevel;
  abusiveWords?: string;
}): { subject: string; body: string; dangerCode: string } {
  const { username, profileUrl, level, abusiveWords } = params;
  const dangerCode = getDangerCode(username, level);
  const now = new Date().toUTCString();

  const subject = `[URGENT INCIDENT CODE: ${dangerCode}] Formal Complaint: Severe Community Guidelines Violation by @${username} (Report Level: ${level.level} - ${level.strength})`;

  const evidenceLine = abusiveWords && abusiveWords.trim()
    ? `Specific abusive / vulgar words reported: "${abusiveWords.trim()}"`
    : `The user was persistently using offensive verbal slurs, provocative insults, and abusive language disrupting chatroom decorum.`;

  const body = `TO:
Grievance Officer & Trust & Safety Team
ShareChat (Mohalla Tech Pvt. Ltd.)
Official Grievance Email: grievance@sharechat.co / support@sharechat.co

DATE & TIMESTAMP:
${now}

CASE INCIDENT ROUTING CODE:
${dangerCode}
REPORT SEVERITY: LEVEL ${level.level} / 10 [${level.strength}]
PRIORITY HASH: [TICKET#${Math.abs(hashString(dangerCode)) % 900000 + 100000}]

TARGET DETAILS:
- ShareChat Username: @${username}
- Target Profile URL: ${profileUrl}
- Classification: ${level.formalTitle} (${level.shortDesc})

INCIDENT DESCRIPTION & EVIDENCE:
1. Nature of Offense:
The user @${username} has deliberately breached ShareChat Community Guidelines and Acceptable Use Policy.
${evidenceLine}

2. Impact:
Hostile disruption of the public audio chatroom, harassing community members, and violating zero-tolerance policies on abuse.

DEMANDED ENFORCEMENT ACTION (LEVEL ${level.level}):
${
  level.level >= 8
    ? `1. Immediate permanent suspension of account ${profileUrl}.\n2. Device hardware MAC address and IP blacklisting to prevent re-registration.\n3. Complete removal of abusive content and retention of audio/text logs for compliance.`
    : level.level >= 4
    ? `1. Immediate chatroom microphone revocation & account suspension.\n2. Invalidation of unauthorized cloned profile assets.\n3. Enhanced security audit on user @${username}.`
    : `1. Immediate 24-hour chatroom mic mute.\n2. Official warning strike on profile @${username}.\n3. Automated moderation flag on chatroom audio stream.`
}

Submitted via: Ns MODS VIBES ⚡ Official Incident Suite
Email: grievance@sharechat.co, support@sharechat.co`;

  return { subject, body, dangerCode };
}

// Client-side parser for HTML when backend is unreachable (e.g. pure static Vercel)
function parseProfileFromHtml(html: string, username: string): SharechatProfile {
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

  // JSON-LD Person schema
  const ldMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  for (const m of ldMatches) {
    const raw = m.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
    try {
      const parsed = JSON.parse(raw);
      if (parsed['@type'] === 'Person') {
        if (parsed.name && !parsed.name.toLowerCase().includes('sharechat')) name = parsed.name;
        if (parsed.image) avatarUrl = parsed.image;
        if (parsed.interactionStatistic && parsed.interactionStatistic[0]) {
          followers = String(parsed.interactionStatistic[0].userInteractionCount || '0');
        }
      }
    } catch {}
  }

  // pu: profile pic HD
  const puMatch = html.match(/pu:"([^"]+)"/);
  if (puMatch && puMatch[1]) {
    avatarUrl = puMatch[1].replace(/\\u0026/g, '&').replace(/%26/g, '&');
  }

  // coverPic: back DP
  const coverMatch = html.match(/coverPic:"([^"]+)"/);
  if (coverMatch && coverMatch[1]) {
    coverUrl = coverMatch[1].replace(/\\u0026/g, '&').replace(/%26/g, '&');
  }

  // numeric user ID
  const idMatch = html.match(/i:"(\d+)"/);
  if (idMatch && idMatch[1]) {
    userId = idMatch[1];
  }

  // name from profile state
  const nameMatch = html.match(/,n:"([^"]+)",newsPublisherStatus/);
  if (nameMatch && nameMatch[1]) {
    name = nameMatch[1];
  }

  // bio from profile state
  const bioMatch = html.match(/,s:"([^"]+)",showFollowSuggestion/);
  if (bioMatch && bioMatch[1]) {
    bio = bioMatch[1];
  }

  // a: followers
  const aMatch = html.match(/a:"(\d+)"/);
  if (aMatch && aMatch[1]) {
    followers = aMatch[1];
  }

  // b: following
  const bMatch = html.match(/b:"(\d+)"/);
  if (bMatch && bMatch[1]) {
    following = bMatch[1];
  }

  // pc: posts
  const pcMatch = html.match(/pc:"(\d+)"/);
  if (pcMatch && pcMatch[1]) {
    posts = pcMatch[1];
  }

  // gender & language
  const gMatch = html.match(/gender:"([^"]+)"/);
  if (gMatch && gMatch[1]) {
    gender = gMatch[1] === 'M' ? 'Male' : gMatch[1] === 'F' ? 'Female' : gMatch[1];
  }

  const lMatch = html.match(/language:"([^"]+)"/);
  if (lMatch && lMatch[1]) {
    language = lMatch[1];
  }

  if (html.includes('isScBlueSubscribed:true') || html.includes('isVoluntarilyVerified:true')) {
    isVerified = true;
  }

  if (!avatarUrl) {
    const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
    if (ogImageMatch && ogImageMatch[1]) {
      avatarUrl = ogImageMatch[1];
    }
  }

  return {
    username,
    name: name || username,
    handle: `@${username}`,
    profileUrl: `https://sharechat.com/profile/${username}`,
    userId: userId || username,
    avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}`,
    coverUrl: coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    bio,
    followers,
    following,
    posts,
    gender: gender || 'Not specified',
    language: language || 'Bengali / Hindi',
    isVerified,
    isRealScraped: Boolean(avatarUrl && !avatarUrl.includes('dicebear'))
  };
}

// Multi-tier profile fetcher: Works on Express, Vercel Serverless, or Static GitHub Pages
export async function fetchSharechatProfile(query: string): Promise<SharechatProfile> {
  const username = extractUsername(query);
  const fallback = buildSharechatProfile(query);

  // 1. Primary: Local or Vercel Serverless API (/api/sharechat-profile)
  try {
    const res = await fetch(`/api/sharechat-profile?query=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && (data.avatarUrl || data.userId || data.followers)) {
        return {
          username: data.username || username,
          name: data.name || username,
          handle: data.handle || `@${username}`,
          profileUrl: data.profileUrl || `https://sharechat.com/profile/${username}`,
          userId: data.userId || fallback.userId,
          avatarUrl: data.avatarUrl || fallback.avatarUrl,
          coverUrl: data.coverUrl || fallback.coverUrl,
          bio: data.bio || '',
          followers: data.followers || '0',
          following: data.following || '0',
          posts: data.posts || '0',
          gender: data.gender || 'Not specified',
          language: data.language || 'Bengali / Hindi',
          isVerified: Boolean(data.isVerified),
          isRealScraped: Boolean(data.isRealScraped)
        };
      }
    }
  } catch (err) {
    console.warn('Backend /api/sharechat-profile failed, attempting fallback scraping:', err);
  }

  // 2. Secondary: Public CORS Proxies (Crucial for static Vercel / Netlify / GitHub Pages deployments)
  const targetUrl = `https://sharechat.com/profile/${username}`;
  const proxyEndpoints = [
    `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
  ];

  for (const pUrl of proxyEndpoints) {
    try {
      const pRes = await fetch(pUrl, { cache: 'no-store' });
      if (pRes.ok) {
        const text = await pRes.text();
        if (text && (text.includes('sharechat') || text.includes('pu:') || text.includes('ProfilePic'))) {
          const parsed = parseProfileFromHtml(text, username);
          if (parsed.isRealScraped) {
            return parsed;
          }
        }
      }
    } catch {
      // try next proxy
    }
  }

  return fallback;
}

// Multi-tier guaranteed image downloader
export function downloadImage(url: string, filename: string): Promise<boolean> {
  return new Promise(async (resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    let safeName = filename || 'ShareChat_Image.jpg';
    if (!/\.(jpg|jpeg|png|webp)$/i.test(safeName)) {
      safeName += '.jpg';
    }

    const saveBlob = (blob: Blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = safeName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
      resolve(true);
    };

    // Strategy 1: Serverless / Express proxy with Content-Disposition
    try {
      const serverProxyUrl = `/api/download-image?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(safeName)}`;
      const res = await fetch(serverProxyUrl);
      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 100) {
          saveBlob(blob);
          return;
        }
      }
    } catch {
      // proceed to strategy 2
    }

    // Strategy 2: Global CORS Image Proxy (images.weserv.nl - always works on client-side)
    try {
      const weservUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=jpg&q=100`;
      const res2 = await fetch(weservUrl);
      if (res2.ok) {
        const blob2 = await res2.blob();
        if (blob2.size > 100) {
          saveBlob(blob2);
          return;
        }
      }
    } catch {
      // proceed to strategy 3
    }

    // Strategy 3: HTML5 Image to Canvas Export
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                saveBlob(blob);
              } else {
                directAnchorDownload();
              }
            }, 'image/jpeg', 0.95);
            return;
          }
        } catch {
          directAnchorDownload();
        }
      };
      img.onerror = () => directAnchorDownload();
      img.src = url;
    } catch {
      directAnchorDownload();
    }

    function directAnchorDownload() {
      const a = document.createElement('a');
      a.href = url;
      a.download = safeName;
      a.target = '_blank';
      a.rel = 'noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      resolve(true);
    }
  });
}
