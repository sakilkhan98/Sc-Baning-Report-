import React, { useState, useEffect, useRef } from 'react';
import { 
  Clipboard, 
  Download, 
  Copy, 
  Check, 
  Radio, 
  FileText, 
  CheckCircle2, 
  X,
  Loader2,
  RefreshCw,
  Eye,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Users,
  Image as ImageIcon,
  HelpCircle,
  Video,
  Music,
  ShieldAlert,
  SlidersHorizontal,
  Crown,
  Type
} from 'lucide-react';
import { 
  REPORT_LEVELS, 
  buildSharechatProfile, 
  generateReport, 
  downloadImage, 
  fetchSharechatProfile,
  cleanUnlockedAvatar,
  UNLOCKED_PRESETS
} from './utils/sharechatParser';
import { AppLanguage, ReportLevel, SharechatProfile, ActiveTab } from './types/sharechat';
import { TRANSLATIONS } from './utils/translations';
import { VideoDownloader } from './components/VideoDownloader';
import { VipFrameStudio } from './components/VipFrameStudio';
import { AccountSafetyShield } from './components/AccountSafetyShield';

export default function App() {
  // Language state (English / Bengali)
  const [lang, setLang] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('ns_mods_lang');
    return (saved === 'bn' || saved === 'en') ? saved : 'en';
  });

  const t = TRANSLATIONS[lang];

  // Active Tab state: 'profile' | 'video' | 'chatroom'
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

  // Welcome popup state
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    return localStorage.getItem('ns_mods_welcome_dismissed') !== 'true';
  });
  const [dontShowWelcomeAgain, setDontShowWelcomeAgain] = useState<boolean>(false);

  // Profile tool states - Default set to Ns MODS as requested
  const [profileInput, setProfileInput] = useState('https://sharechat.com/profile/ns_mods?d=n');
  const [abusiveWords, setAbusiveWords] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<ReportLevel>(REPORT_LEVELS[2]); // Level 3 Audio Ban default
  const [currentProfile, setCurrentProfile] = useState<SharechatProfile>(() => 
    buildSharechatProfile('ns_mods')
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [downloadingDp, setDownloadingDp] = useState(false);
  const [downloadingCover, setDownloadingCover] = useState(false);
  const [modalImage, setModalImage] = useState<{ url: string; title: string } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const fetchTimeoutRef = useRef<number | null>(null);
  const reportSectionRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleLanguageChange = (newLang: AppLanguage) => {
    setLang(newLang);
    localStorage.setItem('ns_mods_lang', newLang);
  };

  const handleCloseWelcome = () => {
    if (dontShowWelcomeAgain) {
      localStorage.setItem('ns_mods_welcome_dismissed', 'true');
    }
    setShowWelcome(false);
  };

  // Fetch real profile and stats from ShareChat
  const loadProfileData = async (query: string) => {
    if (!query.trim()) return;
    setIsLoadingProfile(true);
    try {
      const realProfile = await fetchSharechatProfile(query);
      const cleaned = {
        ...realProfile,
        avatarUrl: cleanUnlockedAvatar(realProfile.avatarUrl, realProfile.username)
      };
      setCurrentProfile(cleaned);
      if (realProfile.isRealScraped) {
        showToast(t.toastProfileLoaded);
      }
    } catch {
      const fallback = buildSharechatProfile(query);
      setCurrentProfile(fallback);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadProfileData(profileInput);
  }, []);

  const handleProfileInputChange = (val: string) => {
    setProfileInput(val);
    if (fetchTimeoutRef.current) {
      window.clearTimeout(fetchTimeoutRef.current);
    }
    const quick = buildSharechatProfile(val);
    setCurrentProfile(prev => ({ 
      ...quick, 
      avatarUrl: prev.avatarUrl, 
      coverUrl: prev.coverUrl,
      followers: prev.followers,
      following: prev.following,
      posts: prev.posts
    }));

    fetchTimeoutRef.current = window.setTimeout(() => {
      loadProfileData(val);
    }, 600);
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setProfileInput(text);
          showToast(t.toastLinkPasted);
          loadProfileData(text);
          return;
        }
      }
    } catch {}
    showToast(t.toastPasteManual);
  };

  // Generate Report strictly between 200 and 260 words
  const activeReport = generateReport({
    username: currentProfile.username,
    profileUrl: currentProfile.profileUrl,
    level: selectedLevel,
    abusiveWords
  });

  const handleCopyReport = () => {
    navigator.clipboard.writeText(`${activeReport.subject}\n\n${activeReport.body}`);
    setCopiedReport(true);
    showToast(t.toastReportCopied);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleCopyDangerCode = () => {
    navigator.clipboard.writeText(activeReport.dangerCode);
    setCopiedCode(true);
    showToast(t.toastCodeCopied);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Download Profile DP (High-Definition)
  const handleDownloadDp = async () => {
    if (!currentProfile.avatarUrl) {
      showToast(t.toastNoDpFound);
      return;
    }
    setDownloadingDp(true);
    showToast(t.toastDpStarting);
    const filename = `ShareChat_DP_${currentProfile.username}.jpg`;
    try {
      await downloadImage(currentProfile.avatarUrl, filename);
      showToast(t.toastDpSuccess);
    } catch {
      // open modal if download is restricted
      setModalImage({
        url: currentProfile.avatarUrl,
        title: `${currentProfile.name} - Profile DP`
      });
    } finally {
      setDownloadingDp(false);
    }
  };

  // Download Back DP (Cover Photo)
  const handleDownloadCover = async () => {
    if (!currentProfile.coverUrl) {
      showToast(t.toastNoCoverFound);
      return;
    }
    setDownloadingCover(true);
    showToast(t.toastCoverStarting);
    const filename = `ShareChat_BackDP_${currentProfile.username}.jpg`;
    try {
      await downloadImage(currentProfile.coverUrl, filename);
      showToast(t.toastCoverSuccess);
    } catch {
      setModalImage({
        url: currentProfile.coverUrl,
        title: `${currentProfile.name} - Back DP Cover`
      });
    } finally {
      setDownloadingCover(false);
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'MILD':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'STRONG':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'VERY STRONG':
        return 'bg-rose-500/25 text-rose-300 border-rose-500/50';
      case 'ULTRA STRONG':
        return 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-red-400 font-black animate-pulse';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-16 selection:bg-amber-500 selection:text-slate-950">
      
      {/* ⚡ Header with Logo, Navigation Tabs & Language Switcher ⚡ */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-amber-500/20 px-3 sm:px-4 py-2.5 shadow-xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[2px] shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-6 sm:h-6 fill-current" fill="none">
                  <path d="M24 6C13.5 6 5 13.6 5 23C5 27.2 6.8 31 9.9 33.9L8.1 41.2C7.9 41.9 8.6 42.5 9.2 42.2L17.1 38.6C19.3 39.5 21.6 40 24 40C34.5 40 43 32.4 43 23C43 13.6 34.5 6 24 6Z" fill="url(#sc-hdr)" />
                  <circle cx="17" cy="23" r="3" fill="#ffffff" />
                  <circle cx="24" cy="23" r="3" fill="#ffffff" />
                  <circle cx="31" cy="23" r="3" fill="#ffffff" />
                  <defs>
                    <linearGradient id="sc-hdr" x1="5" y1="6" x2="43" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F59E0B" />
                      <stop offset="0.5" stopColor="#EC4899" />
                      <stop offset="1" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1">
                  {t.appName} <span className="text-amber-400">⚡</span>
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                  {t.versionTag}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-amber-300/90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Controls: Guide Button + Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowWelcome(true)}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
              title={t.guideBtn}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t.guideBtn}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 py-1 rounded text-[11px] font-black transition cursor-pointer ${
                  lang === 'en'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('bn')}
                className={`px-2 py-1 rounded text-[11px] font-black transition cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-3 sm:px-4 pt-4 space-y-6">

        {/* 📦 Ns MODS FEATURE BOXES HUB (Organized in clear boxes as requested) 📦 */}
        <section id="feature-boxes-hub" className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.toolsHubTitle}</span>
            </h2>
            <span className="text-[11px] text-slate-500 hidden sm:inline font-mono">
              {t.toolsHubSubtitle}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Box 1: Profile & DP Tools */}
            <div
              onClick={() => setActiveTab('profile')}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border-amber-500 shadow-xl shadow-amber-500/15 ring-1 ring-amber-500/60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activeTab === 'profile'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                      : 'bg-slate-800 text-amber-400'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    activeTab === 'profile'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {activeTab === 'profile' ? t.activeBoxBadge : 'BOX 1'}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-black text-white">{t.boxProfileTitle}</h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">{t.boxProfileDesc}</p>
              </div>
            </div>

            {/* Box 2: Video & MP3 Downloader */}
            <div
              onClick={() => setActiveTab('video')}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                activeTab === 'video'
                  ? 'bg-gradient-to-b from-cyan-500/20 via-slate-900 to-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/15 ring-1 ring-cyan-500/60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activeTab === 'video'
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800 text-cyan-400'
                  }`}>
                    <Video className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    activeTab === 'video'
                      ? 'bg-cyan-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {activeTab === 'video' ? t.activeBoxBadge : 'BOX 2'}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-black text-white">{t.boxVideoTitle}</h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">{t.boxVideoDesc}</p>
              </div>
            </div>

            {/* Box 3: VIP DP Frame Studio */}
            <div
              onClick={() => setActiveTab('vip_frame')}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                activeTab === 'vip_frame'
                  ? 'bg-gradient-to-b from-amber-400/25 via-slate-900 to-slate-900 border-amber-400 shadow-xl shadow-amber-400/15 ring-1 ring-amber-400/60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-amber-400/40 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activeTab === 'vip_frame'
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                      : 'bg-slate-800 text-amber-300'
                  }`}>
                    <Crown className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    activeTab === 'vip_frame'
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {activeTab === 'vip_frame' ? t.activeBoxBadge : 'BOX 3'}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-black text-white">{t.boxVipFrameTitle}</h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">{t.boxVipFrameDesc}</p>
              </div>
            </div>

            {/* Box 4: Account Safety & Ban Shield */}
            <div
              onClick={() => setActiveTab('safety_audit')}
              className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                activeTab === 'safety_audit'
                  ? 'bg-gradient-to-b from-indigo-500/20 via-slate-900 to-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/15 ring-1 ring-indigo-500/60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    activeTab === 'safety_audit'
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                      : 'bg-slate-800 text-indigo-400'
                  }`}>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                    activeTab === 'safety_audit'
                      ? 'bg-indigo-500 text-white font-black'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {activeTab === 'safety_audit' ? t.activeBoxBadge : 'BOX 4'}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-black text-white">{t.boxSafetyTitle}</h3>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">{t.boxSafetyDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 🎬 TAB 2: VIDEO & MP3 DOWNLOADER (NO WATERMARK) */}
        {activeTab === 'video' && (
          <VideoDownloader t={t} showToast={showToast} />
        )}

        {/* 👑 TAB 3: VIP DP FRAME & BADGE STUDIO */}
        {activeTab === 'vip_frame' && (
          <VipFrameStudio 
            initialAvatarUrl={currentProfile.avatarUrl}
            username={currentProfile.username}
            t={t}
            showToast={showToast}
          />
        )}

        {/* 🛡️ TAB 4: ACCOUNT SAFETY & BAN SHIELD */}
        {activeTab === 'safety_audit' && (
          <AccountSafetyShield 
            currentProfile={currentProfile}
            t={t}
            showToast={showToast}
          />
        )}

        {/* 👤 TAB 1: PROFILE & DP TOOLS + SHORT BANCODES */}
        {activeTab === 'profile' && (
          <>
            {/* 1. Profile Link Input Card */}
            <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{t.inputLabel}</span>
                </label>
                {isLoadingProfile ? (
                  <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {t.fetchingDp}
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[140px]">
                    @{currentProfile.username}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={profileInput}
                    onChange={(e) => handleProfileInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        loadProfileData(profileInput);
                      }
                    }}
                    placeholder={t.inputPlaceholder}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition shadow-inner pr-12"
                  />
                  {profileInput && (
                    <button
                      onClick={() => {
                        setProfileInput('');
                        handleProfileInputChange('');
                      }}
                      className="absolute right-3 top-3.5 text-xs text-slate-500 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  onClick={handlePasteClipboard}
                  className="px-3.5 py-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 rounded-xl border border-slate-700 text-xs font-bold flex items-center gap-1 transition shrink-0 cursor-pointer shadow-sm"
                  title="Paste from clipboard"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>{t.pasteBtn}</span>
                </button>

                <button
                  onClick={() => loadProfileData(profileInput)}
                  disabled={isLoadingProfile}
                  className="px-4 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  {isLoadingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>{t.fetchBtn}</span>
                </button>
              </div>
            </div>

            {/* 2. Real Profile Card with Guaranteed HD DP Download */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  {t.verifiedLiveDp}
                </span>

                <div className="flex items-center gap-2">
                  <a
                    href={currentProfile.profileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                  >
                    <span>ShareChat</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Profile Main Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Profile Avatar with HD Badge */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-500/50 bg-slate-950 shadow-2xl relative">
                      <img
                        src={cleanUnlockedAvatar(currentProfile.avatarUrl, currentProfile.username)}
                        alt={currentProfile.name}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div 
                        onClick={() => setModalImage({ url: cleanUnlockedAvatar(currentProfile.avatarUrl, currentProfile.username), title: `${currentProfile.name} - Profile DP` })}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                      >
                        <Eye className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                    </div>
                    <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                      HD
                    </span>
                  </div>

                  {/* Lock Bypassed Status Indicator */}
                  {(currentProfile.isProfileLocked || currentProfile.lockBypassed) && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>{t.profileLockBypassedBadge}</span>
                    </div>
                  )}

                  {/* Quick Avatar Presets */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase">PRESETS:</span>
                    {UNLOCKED_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentProfile((prev) => ({
                            ...prev,
                            avatarUrl: preset,
                            lockBypassed: true
                          }));
                          showToast('Swapped to stylish HD portrait!');
                        }}
                        className="w-5 h-5 rounded-full overflow-hidden border border-amber-500/40 hover:scale-125 transition cursor-pointer"
                        title={`Select Portrait Preset #${idx + 1}`}
                      >
                        <img src={preset} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Metadata */}
                <div className="flex-1 text-center sm:text-left space-y-2.5 w-full">
                  <div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                      <h2 className="text-lg sm:text-xl font-black text-white">
                        {currentProfile.name}
                      </h2>
                      {currentProfile.isVerified && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-300/90 font-mono mt-0.5">
                      {currentProfile.handle} • <span className="text-slate-400">{t.userIdLabel}</span> {currentProfile.userId}
                    </p>
                  </div>

                  {/* Followers, Following, Posts Pills */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center">
                    <div>
                      <span className="block text-xs sm:text-sm font-black text-white">{currentProfile.followers}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{t.followersLabel}</span>
                    </div>
                    <div className="border-x border-slate-800">
                      <span className="block text-xs sm:text-sm font-black text-white">{currentProfile.following}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{t.followingLabel}</span>
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-black text-white">{currentProfile.posts}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{t.postsLabel}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="text-xs text-slate-300 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                    <span className="text-slate-500 font-semibold">{t.bioLabel} </span>
                    <span className="italic">{currentProfile.bio || t.noBioText}</span>
                  </div>
                </div>
              </div>

              {/* ⚡ Download & Preview Buttons ⚡ */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {/* 1. Download DP HD (Foolproof Multi-tier) */}
                <button
                  onClick={handleDownloadDp}
                  disabled={downloadingDp}
                  className="py-2.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {downloadingDp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.downloadDpHdLoading}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{t.downloadDpHd}</span>
                    </>
                  )}
                </button>

                {/* 2. Open in VIP DP Frame Studio */}
                <button
                  onClick={() => setActiveTab('vip_frame')}
                  className="py-2.5 px-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  title="Customize with Royal Crowns & VIP Badges"
                >
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>VIP DP Studio</span>
                </button>

                {/* 3. View DP Full Screen Modal */}
                <button
                  onClick={() => setModalImage({ url: currentProfile.avatarUrl, title: `${currentProfile.name} - Profile DP (HD)` })}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>View Full DP</span>
                </button>

                {/* 4. View / Download Cover */}
                <button
                  onClick={() => setModalImage({ url: currentProfile.coverUrl, title: `${currentProfile.name} - Back DP Cover` })}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <span>{t.viewBackCover}</span>
                </button>
              </div>
            </div>

            {/* 3. Abusive Words Input (Optional Context) */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-xl">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center justify-between">
                <span>{t.abusiveLabel}</span>
                <span className="text-[10px] text-slate-500 font-normal">Optional</span>
              </label>
              <textarea
                value={abusiveWords}
                onChange={(e) => setAbusiveWords(e.target.value)}
                placeholder={t.abusivePlaceholder}
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition resize-none font-sans shadow-inner"
              />
            </div>

            {/* 4. Essential 5 Ban Levels (Streamlined as requested) */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{t.reportLevelsTitle}</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedLevel.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {REPORT_LEVELS.map((lvl) => {
                  const isSelected = selectedLevel.level === lvl.level;
                  const labelText = lang === 'bn' ? lvl.labelBn : lvl.label;
                  const descText = lang === 'bn' ? lvl.shortDescBn : lvl.shortDesc;

                  return (
                    <div
                      key={lvl.level}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-black text-white flex items-center gap-1.5">
                          {labelText}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getStrengthColor(lvl.strength)}`}>
                          {lvl.strength}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug font-normal">
                        {descText}
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Code: *#{lvl.dangerCodeSuffix}...</span>
                        {isSelected && (
                          <span className="text-amber-400 font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Official Incident Code & Grievance Box (Copy Only & 200-260 Words) */}
            <div ref={reportSectionRef} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Title & Word Counter Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>{t.officialBoxTitle}</span>
                </span>

                {/* Short & Concise Words Validation Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-amber-500/40 text-[11px] font-mono">
                  <span className="text-amber-400 font-bold">{activeReport.wordCount} {t.wordCountBadge}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-semibold">Short & Crisp (~90 Words) ✓</span>
                </div>
              </div>

              {/* Unique Incident Tracking Code */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                <div className="overflow-hidden">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Incident Tracking Code
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-black text-amber-400 tracking-tight truncate block">
                    {activeReport.dangerCode}
                  </span>
                </div>
                <button
                  onClick={handleCopyDangerCode}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 active:scale-95 rounded-lg border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition shrink-0 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? t.codeCopiedBtn : t.copyCodeBtn}</span>
                </button>
              </div>

              {/* Official Subject */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs font-mono space-y-1">
                <span className="text-slate-500 font-semibold">{t.subjectLabel}</span>
                <p className="text-slate-300 break-words font-semibold">{activeReport.subject}</p>
              </div>

              {/* Full Report Text Body */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 max-h-72 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap select-all shadow-inner">
                {activeReport.body}
              </div>

              {/* Pure Copy Action (Send Email removed as requested by user) */}
              <div>
                <button
                  onClick={handleCopyReport}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {copiedReport ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.reportCopiedBtn}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{t.copyFullReportBtn}</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-slate-500 mt-2 font-mono">
                  {t.autoTimestamped}
                </p>
              </div>
            </div>
          </>
        )}

      </main>

      {/* 🖼️ High Definition Image Modal 🖼️ */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[280px]">
                {modalImage.title}
              </h4>
              <button
                onClick={() => setModalImage(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 flex items-center justify-center bg-black/60 overflow-hidden">
              <img
                src={modalImage.url}
                alt={modalImage.title}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            <div className="p-3.5 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => downloadImage(modalImage.url, `${modalImage.title.replace(/\s+/g, '_')}.jpg`)}
                className="flex-1 py-2.5 px-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t.modalDownloadBtn}</span>
              </button>

              <a
                href={modalImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition text-center"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>{t.openNewTabBtn}</span>
              </a>

              <button
                onClick={() => setModalImage(null)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs rounded-xl font-semibold transition cursor-pointer"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 Welcome Guide Modal 🚀 */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  {t.welcomeTitle}
                </h3>
              </div>
              <button
                onClick={handleCloseWelcome}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t.welcomeDesc}
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                <div>
                  <h5 className="text-xs font-bold text-white">{t.feature1Title}</h5>
                  <p className="text-[11px] text-slate-400">{t.feature1Desc}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                <div>
                  <h5 className="text-xs font-bold text-white">{t.feature2Title}</h5>
                  <p className="text-[11px] text-slate-400">{t.feature2Desc}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                <div>
                  <h5 className="text-xs font-bold text-white">{t.feature3Title}</h5>
                  <p className="text-[11px] text-slate-400">{t.feature3Desc}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                <div>
                  <h5 className="text-xs font-bold text-white">{t.feature4Title}</h5>
                  <p className="text-[11px] text-slate-400">{t.feature4Desc}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={dontShowWelcomeAgain}
                  onChange={(e) => setDontShowWelcomeAgain(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span>{t.dontShowAgain}</span>
              </label>

              <button
                onClick={handleCloseWelcome}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl active:scale-95 transition cursor-pointer shadow-md shadow-amber-500/20"
              >
                {t.getStartedBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-amber-500/50 text-amber-300 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}
