import { ReportLevel, SharechatProfile } from '../types/sharechat';

export const REPORT_LEVELS: ReportLevel[] = [
  {
    level: 1,
    label: 'Report 1: Basic Warning',
    badge: 'Level 1',
    strength: 'MILD',
    dangerCodeSuffix: '101warn#notice',
    shortDesc: 'হালকা খারাপ কথা বা অশোভন আচরণের সতর্কবার্তা',
    formalTitle: 'First Notice: Uncivil Language & Code of Conduct Breach'
  },
  {
    level: 2,
    label: 'Report 2: Mic Mute 24H',
    badge: 'Level 2',
    strength: 'MEDIUM',
    dangerCodeSuffix: '202mic#mute24h',
    shortDesc: 'চ্যাটরুম মাইকে গালি দেওয়ার জন্য ২৪ ঘণ্টা মাইক মিউট',
    formalTitle: 'Chatroom Mic Temporary Audio Suspension (24 Hours)'
  },
  {
    level: 3,
    label: 'Report 3: Chatroom Audio Ban',
    badge: 'Level 3',
    strength: 'STRONG',
    dangerCodeSuffix: '303room#audioban',
    shortDesc: 'চ্যাটরুমের মাইক ও কথা বলার অনুমতি স্থায়ীভাবে বাতিল',
    formalTitle: 'Permanent Chatroom Audio & Microphone Revocation'
  },
  {
    level: 4,
    label: 'Report 4: Fake ID / Clone',
    badge: 'Level 4',
    strength: 'STRONG',
    dangerCodeSuffix: '404clone#purge',
    shortDesc: 'অন্যের নাম বা ছবি নকল করে ফেক আইডি চালানো',
    formalTitle: 'Identity Theft & Fraudulent Profile Impersonation'
  },
  {
    level: 5,
    label: 'Report 5: Spam & Room Crasher',
    badge: 'Level 5',
    strength: 'STRONG',
    dangerCodeSuffix: '5786spam#band',
    shortDesc: 'লিঙ্ক স্প্যামিং, বট অ্যাটাক ও চ্যাটরুম ক্র্যাশার',
    formalTitle: 'Automated Bot Flooding & Chatroom Crasher Disruption'
  },
  {
    level: 6,
    label: 'Report 6: Obscene & NSFW Content',
    badge: 'Level 6',
    strength: 'VERY STRONG',
    dangerCodeSuffix: '606nsfw#takedown',
    shortDesc: 'চ্যাটে বা প্রোফাইলে অশ্লীল, ১৮+ বা নোংরা কনটেন্ট ছড়ানো',
    formalTitle: 'Severe Obscenity & Sexually Explicit Content Violation'
  },
  {
    level: 7,
    label: 'Report 7: Abuse & Gali Threat',
    badge: 'Level 7',
    strength: 'VERY STRONG',
    dangerCodeSuffix: '5786abuse#band',
    shortDesc: 'উগ্র গালিগালাজ, ব্যক্তিগত আক্রমণ ও হেনস্তা',
    formalTitle: 'Severe Target Harassment & Obscene Verbal Attacks'
  },
  {
    level: 8,
    label: 'Report 8: Coin & Gift Fraud',
    badge: 'Level 8',
    strength: 'EXTREME',
    dangerCodeSuffix: '808fraud#freeze',
    shortDesc: 'কয়েন হ্যাকিং, ফেক রিচার্জ বা আর্থিক প্রতারণা',
    formalTitle: 'Financial Scam, Phishing & Virtual Currency Fraud'
  },
  {
    level: 9,
    label: 'Report 9: Danger Threat & Blackmail',
    badge: 'Level 9',
    strength: 'EXTREME',
    dangerCodeSuffix: '909threat#lockout',
    shortDesc: 'ব্ল্যাকমেইলিং, সাইবার ক্রাইম ও প্রাণনাশের হুমকি',
    formalTitle: 'Critical Cyber Threat, Extortion & Endangerment'
  },
  {
    level: 10,
    label: 'Report 10: Ultra Strong Permanent Ban',
    badge: 'Level 10 (ULTRA)',
    strength: 'ULTRA STRONG',
    dangerCodeSuffix: '5786ULTRA#MAXTERMINATION',
    shortDesc: 'স্থায়ী একাউন্ট ডিলিট, ডিভাইস ও আইপি হার্ডওয়্যার ব্যান',
    formalTitle: 'Emergency Termination & Complete Device Hardware/IP Ban'
  }
];

export function extractUsername(input: string): string {
  if (!input) return 'sakilkhan';
  let cleaned = input.trim();
  cleaned = cleaned.split('?')[0].split('#')[0];

  if (cleaned.includes('sharechat.com/profile/')) {
    const parts = cleaned.split('sharechat.com/profile/');
    if (parts[1]) cleaned = parts[1].replace('/', '');
  } else if (cleaned.includes('sharechat.com/user/')) {
    const parts = cleaned.split('sharechat.com/user/');
    if (parts[1]) cleaned = parts[1].replace('/', '');
  }

  cleaned = cleaned.replace(/^@+/, '');
  cleaned = cleaned.replace(/[^a-zA-Z0-9._-]/g, '');
  return cleaned || 'sakilkhan';
}

export function buildSharechatProfile(input: string): SharechatProfile {
  const username = extractUsername(input);
  return {
    username,
    handle: `@${username}`,
    profileUrl: `https://sharechat.com/profile/${username}`,
    userId: `SC_${Math.abs(hashString(username)) % 9000000 + 1000000}`,
    avatarUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}&backgroundColor=0f172a,1e1b4b,31104b`,
    coverUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80`
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

export async function fetchSharechatProfile(query: string): Promise<SharechatProfile> {
  const username = extractUsername(query);
  const fallback = buildSharechatProfile(query);

  try {
    const res = await fetch(`/api/sharechat-profile?query=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && (data.avatarUrl || data.coverUrl || data.userId)) {
        return {
          username: data.username || username,
          name: data.name || username,
          handle: data.handle || `@${username}`,
          profileUrl: data.profileUrl || `https://sharechat.com/profile/${username}`,
          userId: data.userId || fallback.userId,
          avatarUrl: data.avatarUrl || fallback.avatarUrl,
          coverUrl: data.coverUrl || fallback.coverUrl,
          bio: data.bio || '',
          isRealScraped: Boolean(data.isRealScraped)
        };
      }
    }
  } catch (err) {
    console.warn('Could not fetch remote profile, using parsed defaults:', err);
  }

  return fallback;
}

export function downloadImage(url: string, filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    // Ensure valid filename extension
    let safeName = filename || 'sharechat_photo.jpg';
    if (!/\.(jpg|jpeg|png|webp)$/i.test(safeName)) {
      safeName += '.jpg';
    }

    // Direct proxy download URL
    const proxyUrl = `/api/download-image?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(safeName)}`;

    // Try fetching via blob first so it downloads seamlessly in-page
    fetch(proxyUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Proxy fetch failed');
        return res.blob();
      })
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = safeName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
        resolve(true);
      })
      .catch(() => {
        // Fallback: direct window download via proxy with Content-Disposition
        const a = document.createElement('a');
        a.href = proxyUrl;
        a.download = safeName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        resolve(true);
      });
  });
}
