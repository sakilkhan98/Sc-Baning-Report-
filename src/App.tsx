import React, { useState, useEffect, useRef } from 'react';
import { 
  Clipboard, 
  Download, 
  Send, 
  Copy, 
  Check, 
  Radio, 
  Flame, 
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
  UserCheck,
  Image as ImageIcon,
  Languages,
  HelpCircle,
  Globe,
  BadgeCheck
} from 'lucide-react';
import { 
  REPORT_LEVELS, 
  buildSharechatProfile, 
  generateReport, 
  downloadImage, 
  fetchSharechatProfile 
} from './utils/sharechatParser';
import { AppLanguage, ReportLevel, SharechatProfile } from './types/sharechat';
import { TRANSLATIONS } from './utils/translations';

export default function App() {
  // Language state (defaults to English as requested, switchable to Bengali)
  const [lang, setLang] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('ns_mods_lang');
    return (saved === 'bn' || saved === 'en') ? saved : 'en';
  });

  const t = TRANSLATIONS[lang];

  // Welcome popup state (defaults to true if not previously dismissed)
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    return localStorage.getItem('ns_mods_welcome_dismissed') !== 'true';
  });
  const [dontShowWelcomeAgain, setDontShowWelcomeAgain] = useState<boolean>(false);

  const [profileInput, setProfileInput] = useState('https://sharechat.com/profile/3544571828?d=n');
  const [abusiveWords, setAbusiveWords] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<ReportLevel>(REPORT_LEVELS[0]);
  const [currentProfile, setCurrentProfile] = useState<SharechatProfile>(() => 
    buildSharechatProfile('3544571828')
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [downloadingDp, setDownloadingDp] = useState(false);
  const [downloadingCover, setDownloadingCover] = useState(false);
  const [modalImage, setModalImage] = useState<{ url: string; title: string } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const fetchTimeoutRef = useRef<number | null>(null);

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
      setCurrentProfile(realProfile);
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
    // Instant preliminary update for fast UI feedback
    const quick = buildSharechatProfile(val);
    setCurrentProfile(prev => ({ 
      ...quick, 
      avatarUrl: prev.avatarUrl, 
      coverUrl: prev.coverUrl,
      followers: prev.followers,
      following: prev.following,
      posts: prev.posts
    }));

    // Debounced real DP and stats fetch
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
    } catch {
      // ignore
    }
    showToast(t.toastPasteManual);
  };

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

  const handleDirectSendEmail = () => {
    const mailto = `mailto:grievance@sharechat.co?cc=support@sharechat.co&subject=${encodeURIComponent(activeReport.subject)}&body=${encodeURIComponent(activeReport.body)}`;
    window.location.href = mailto;
    showToast(t.toastGmailOpening);
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
    await downloadImage(currentProfile.avatarUrl, filename);
    setTimeout(() => {
      setDownloadingDp(false);
      showToast(t.toastDpSuccess);
    }, 600);
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
    await downloadImage(currentProfile.coverUrl, filename);
    setTimeout(() => {
      setDownloadingCover(false);
      showToast(t.toastCoverSuccess);
    }, 600);
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
      case 'EXTREME':
        return 'bg-red-600/30 text-red-300 border-red-500/60 font-black';
      case 'ULTRA STRONG':
        return 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-red-400 font-black animate-pulse';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-12 selection:bg-amber-500 selection:text-slate-950">
      
      {/* ⚡ Header with Sharechat Logo + Language Switcher (English / বাংলা) ⚡ */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          
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
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-amber-300/90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Controls: Language Selector + Welcome Guide Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Guide Button */}
            <button
              onClick={() => setShowWelcome(true)}
              className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition"
              title={t.guideBtn}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t.guideBtn}</span>
            </button>

            {/* Language Switcher Toggle */}
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

      <main className="max-w-2xl mx-auto px-3 sm:px-4 pt-4 space-y-4">

        {/* 1. Profile Link Input Card */}
        <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
              <span>{t.inputLabel}</span>
            </label>
            {isLoadingProfile ? (
              <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                {t.fetchingDp}
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-400 truncate max-w-[120px]">
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
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-3 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none transition shadow-inner"
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
              className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shrink-0 cursor-pointer"
              title="Paste from clipboard"
            >
              <Clipboard className="w-4 h-4" />
              <span>{t.pasteBtn}</span>
            </button>

            <button
              onClick={() => loadProfileData(profileInput)}
              disabled={isLoadingProfile}
              className="px-3.5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1 transition active:scale-95 shrink-0 cursor-pointer"
              title="Fetch Real Profile and DP"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProfile ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{t.fetchBtn}</span>
            </button>
          </div>

          {/* Real DP & Profile Details Card with Followers, Following, Posts, Bio */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3.5">
            {/* Top Row: Avatar, Name, Handle, ID, and Cover thumbnail */}
            <div className="flex items-start justify-between gap-3">
              {/* DP Avatar */}
              <div className="flex items-center gap-3">
                <div 
                  className="relative group cursor-pointer shrink-0"
                  onClick={() => setModalImage({ 
                    url: currentProfile.avatarUrl, 
                    title: `${currentProfile.name || currentProfile.username} - Profile Picture (HD DP)` 
                  })}
                  title="Click to view full HD"
                >
                  <img 
                    src={currentProfile.avatarUrl} 
                    alt="Target Profile DP" 
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-slate-900 border-2 border-amber-500/70 object-cover shadow-lg shadow-amber-500/10 transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  {currentProfile.isRealScraped && (
                    <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 rounded-full text-slate-950 shadow" title={t.verifiedLiveDp}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white fill-emerald-600" />
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black text-white truncate max-w-[180px] sm:max-w-xs">
                      {currentProfile.name || currentProfile.username}
                    </h3>
                    {currentProfile.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-500/20 shrink-0" />
                    )}
                    {currentProfile.isRealScraped && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                        <ShieldCheck className="w-3 h-3" />
                        {t.verifiedLiveDp}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-amber-400 font-semibold truncate">
                    @{currentProfile.username}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {t.userIdLabel} <span className="text-slate-100 font-bold">{currentProfile.userId}</span>
                  </p>
                </div>
              </div>

              {/* Cover Preview (Back DP) */}
              <div 
                className="relative w-20 sm:w-28 h-16 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden cursor-pointer group shrink-0"
                onClick={() => setModalImage({ 
                  url: currentProfile.coverUrl, 
                  title: `${currentProfile.name || currentProfile.username} - Back DP (Cover Photo)` 
                })}
                title={t.viewBackCover}
              >
                <img 
                  src={currentProfile.coverUrl} 
                  alt="Back DP" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-[10px] text-white font-bold">{t.viewBackCover}</span>
                </div>
              </div>
            </div>

            {/* Middle Stats Grid: Followers, Following, Posts, Gender/Lang */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Followers */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <Users className="w-3 h-3 text-amber-400" />
                  <span>{t.followersLabel}</span>
                </div>
                <div className="text-sm sm:text-base font-black text-amber-400 mt-0.5 font-mono">
                  {currentProfile.followers || '0'}
                </div>
              </div>

              {/* Following */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <UserCheck className="w-3 h-3 text-indigo-400" />
                  <span>{t.followingLabel}</span>
                </div>
                <div className="text-sm sm:text-base font-black text-indigo-300 mt-0.5 font-mono">
                  {currentProfile.following || '0'}
                </div>
              </div>

              {/* Posts */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <ImageIcon className="w-3 h-3 text-rose-400" />
                  <span>{t.postsLabel}</span>
                </div>
                <div className="text-sm sm:text-base font-black text-rose-300 mt-0.5 font-mono">
                  {currentProfile.posts || '0'}
                </div>
              </div>
            </div>

            {/* Bio / Status and Language/Gender Strip */}
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">{t.bioLabel}</span>
                <span className="font-mono text-[10px] text-amber-300/80">
                  {currentProfile.gender && currentProfile.gender !== 'Not specified' ? `${currentProfile.gender} • ` : ''}
                  {currentProfile.language || 'Bengali'}
                </span>
              </div>
              <p className="text-slate-200 text-xs italic line-clamp-2">
                &ldquo;{currentProfile.bio || t.noBioText}&rdquo;
              </p>
            </div>

            {/* Direct Download Buttons for DP & Back DP */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* DP Download Button */}
              <button
                onClick={handleDownloadDp}
                disabled={downloadingDp || !currentProfile.avatarUrl}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40 active:scale-95 transition cursor-pointer"
              >
                {downloadingDp ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>{downloadingDp ? t.downloadDpHdLoading : t.downloadDpHd}</span>
              </button>

              {/* Back DP Download Button */}
              <button
                onClick={handleDownloadCover}
                disabled={downloadingCover || !currentProfile.coverUrl}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                {downloadingCover ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-amber-400" />
                )}
                <span>{downloadingCover ? t.downloadCoverLoading : t.downloadCover}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Abusive words / Mic disturbance box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-xl">
          <label className="text-xs font-bold text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>{t.abusiveLabel}</span>
          </label>
          <textarea
            rows={2}
            value={abusiveWords}
            onChange={(e) => setAbusiveWords(e.target.value)}
            placeholder={t.abusivePlaceholder}
            className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition leading-relaxed"
          />
        </div>

        {/* 3. Report 1 to Report 10 Options */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.reportLevelsTitle}</span>
            </h2>
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              {selectedLevel.badge} {t.selectedBadge}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
            {REPORT_LEVELS.map((item) => {
              const isSelected = selectedLevel.level === item.level;
              const label = lang === 'bn' ? item.labelBn : item.label;
              const desc = lang === 'bn' ? item.shortDescBn : item.shortDesc;

              return (
                <button
                  key={item.level}
                  onClick={() => setSelectedLevel(item)}
                  className={`p-3 rounded-xl text-left border transition-all duration-150 flex flex-col justify-between gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10 scale-[1.01]'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-black ${isSelected ? 'text-amber-400' : 'text-white'} truncate max-w-[120px]`}>
                      {label}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono ${getStrengthColor(item.strength)} shrink-0`}>
                      {item.strength}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                    {desc}
                  </p>

                  <div className="text-[10px] font-mono text-amber-300/80 truncate">
                    Code: *#{item.dangerCodeSuffix}&quot;...
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Active Report Box & Danger Code */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t.officialBoxTitle}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {t.autoTimestamped}
            </span>
          </div>

          {/* Danger Code Strip */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between gap-2">
            <div className="font-mono text-xs text-amber-400 font-bold truncate">
              {activeReport.dangerCode}
            </div>
            <button
              onClick={handleCopyDangerCode}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold border border-slate-700 transition shrink-0 cursor-pointer"
            >
              {copiedCode ? t.codeCopiedBtn : t.copyCodeBtn}
            </button>
          </div>

          {/* Subject Box */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 font-semibold break-all">
            <span className="text-slate-500 mr-1.5">{t.subjectLabel}</span>
            {activeReport.subject}
          </div>

          {/* Body Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 max-h-52 overflow-y-auto text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
            {activeReport.body}
          </div>

          {/* Main Action Buttons */}
          <div className="pt-2 space-y-2.5">
            {/* Direct Send to grievance@sharechat.co */}
            <button
              onClick={handleDirectSendEmail}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wide transition shadow-xl shadow-red-950/40 active:scale-[0.98] cursor-pointer text-center"
            >
              <Send className="w-4 h-4 text-slate-950 stroke-[3] shrink-0" />
              <span>{t.directSendBtn}</span>
            </button>

            {/* Quick Copy Report */}
            <button
              onClick={handleCopyReport}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wide border border-slate-700 transition active:scale-[0.98] cursor-pointer"
            >
              {copiedReport ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copiedReport ? t.reportCopiedBtn : t.copyFullReportBtn}</span>
            </button>
          </div>
        </div>

      </main>

      {/* 🌟 Welcome Popup in English (as requested) 🌟 */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-slate-900 border border-amber-500/40 rounded-2xl overflow-hidden p-5 sm:p-6 space-y-4 shadow-2xl shadow-amber-500/10">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {TRANSLATIONS.en.welcomeTitle}
                  </h3>
                  <p className="text-xs font-semibold text-amber-400">
                    {TRANSLATIONS.en.welcomeSubtitle}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseWelcome}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {TRANSLATIONS.en.welcomeDesc}
            </p>

            {/* Feature Bullets */}
            <div className="space-y-2.5 pt-1">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                <Users className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">{TRANSLATIONS.en.feature1Title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{TRANSLATIONS.en.feature1Desc}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                <Download className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">{TRANSLATIONS.en.feature2Title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{TRANSLATIONS.en.feature2Desc}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">{TRANSLATIONS.en.feature3Title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{TRANSLATIONS.en.feature3Desc}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">{TRANSLATIONS.en.feature4Title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{TRANSLATIONS.en.feature4Desc}</p>
                </div>
              </div>
            </div>

            {/* Don't show again checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="dontShow"
                checked={dontShowWelcomeAgain}
                onChange={(e) => setDontShowWelcomeAgain(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="dontShow" className="text-xs text-slate-400 cursor-pointer select-none">
                {TRANSLATIONS.en.dontShowAgain}
              </label>
            </div>

            {/* Start Button */}
            <button
              onClick={handleCloseWelcome}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition shadow-lg shadow-amber-950/40 active:scale-[0.98] cursor-pointer"
            >
              {TRANSLATIONS.en.getStartedBtn}
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Preview Modal */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate max-w-[80%]">{modalImage.title}</span>
              <button 
                onClick={() => setModalImage(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-black/80 rounded-xl overflow-hidden p-2 flex items-center justify-center">
              <img 
                src={modalImage.url} 
                alt="zoom" 
                referrerPolicy="no-referrer"
                className="w-full max-h-80 object-contain rounded-lg" 
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => downloadImage(modalImage.url, `ShareChat_${currentProfile.username}_HD.jpg`)}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t.modalDownloadBtn}</span>
              </button>
              <a
                href={`/api/download-image?url=${encodeURIComponent(modalImage.url)}&filename=ShareChat_${currentProfile.username}_HD.jpg`}
                download={`ShareChat_${currentProfile.username}_HD.jpg`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1"
                title="Direct Browser Download"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 inset-x-4 max-w-xs mx-auto z-50 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs text-center shadow-2xl flex items-center justify-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}
