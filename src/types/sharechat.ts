export interface ReportLevel {
  level: number;
  label: string;
  labelBn: string;
  badge: string;
  strength: 'MILD' | 'MEDIUM' | 'STRONG' | 'VERY STRONG' | 'EXTREME' | 'ULTRA STRONG';
  dangerCodeSuffix: string;
  shortDesc: string;
  shortDescBn: string;
  formalTitle: string;
}

export interface SharechatProfile {
  username: string;
  name: string;
  handle: string;
  profileUrl: string;
  userId: string;
  avatarUrl: string;
  coverUrl: string;
  bio?: string;
  followers?: string;
  following?: string;
  posts?: string;
  gender?: string;
  language?: string;
  isVerified?: boolean;
  isRealScraped?: boolean;
  isProfileLocked?: boolean;
  lockBypassed?: boolean;
}

export interface SharechatVideo {
  postId: string;
  postUrl: string;
  title: string;
  caption: string;
  videoUrl: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  authorName?: string;
  authorHandle?: string;
  authorAvatar?: string;
  views?: string;
  likes?: string;
  shares?: string;
  isRealScraped?: boolean;
}

export type AppLanguage = 'en' | 'bn';
export type ActiveTab = 'profile' | 'video' | 'vip_frame' | 'safety_audit';

