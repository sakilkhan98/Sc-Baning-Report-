export interface ReportLevel {
  level: number;
  label: string;
  badge: string;
  strength: 'MILD' | 'MEDIUM' | 'STRONG' | 'VERY STRONG' | 'EXTREME' | 'ULTRA STRONG';
  dangerCodeSuffix: string;
  shortDesc: string;
  formalTitle: string;
}

export interface SharechatProfile {
  username: string;
  name?: string;
  handle: string;
  profileUrl: string;
  userId: string;
  avatarUrl: string;
  coverUrl: string;
  bio?: string;
  isRealScraped?: boolean;
}
