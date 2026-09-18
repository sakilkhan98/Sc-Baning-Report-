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
  ExternalLink
} from 'lucide-react';
import { 
  REPORT_LEVELS, 
  buildSharechatProfile, 
  generateReport, 
  downloadImage, 
  fetchSharechatProfile 
} from './utils/sharechatParser';
import { ReportLevel, SharechatProfile } from './types/sharechat';

export default function App() {
  const [profileInput, setProfileInput] = useState('https://sharechat.com/profile/sakilkhan');
  const [abusiveWords, setAbusiveWords] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<ReportLevel>(REPORT_LEVELS[0]);
  const [currentProfile, setCurrentProfile] = useState<SharechatProfile>(() => 
    buildSharechatProfile('sakilkhan')
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

  // Fetch real profile and real DP from ShareChat
  const loadProfileData = async (query: string) => {
    if (!query.trim()) return;
    setIsLoadingProfile(true);
    try {
      const realProfile = await fetchSharechatProfile(query);
      setCurrentProfile(realProfile);
      if (realProfile.isRealScraped) {
        showToast('আসল প্রোফাইল ও ডিপি লোড হয়েছে!');
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
    loadProfileData('https://sharechat.com/profile/sakilkhan');
  }, []);

  const handleProfileInputChange = (val: string) => {
    setProfileInput(val);
    if (fetchTimeoutRef.current) {
      window.clearTimeout(fetchTimeoutRef.current);
    }
    // Instant fallback update for immediate UI response
    const quick = buildSharechatProfile(val);
    setCurrentProfile(prev => ({ ...quick, avatarUrl: prev.avatarUrl }));

    // Debounced real DP fetch
    fetchTimeoutRef.current = window.setTimeout(() => {
      loadProfileData(val);
    }, 700);
  };

  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setProfileInput(text);
          showToast('লিংক পেস্ট হয়েছে, ডিপি খোঁজা হচ্ছে...');
          loadProfileData(text);
          return;
        }
      }
    } catch {
      // ignore
    }
    showToast('বক্সে সরাসরি লিংক পেস্ট করে Fetch চাপুন');
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
    showToast('ফুল রিপোর্ট কপি হয়েছে!');
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleCopyDangerCode = () => {
    navigator.clipboard.writeText(activeReport.dangerCode);
    setCopiedCode(true);
    showToast('ডেঞ্জার কোড কপি হয়েছে!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDirectSendEmail = () => {
    const mailto = `mailto:grievance@sharechat.co?cc=support@sharechat.co&subject=${encodeURIComponent(activeReport.subject)}&body=${encodeURIComponent(activeReport.body)}`;
    window.location.href = mailto;
    showToast('জিমেইল ওপেন হচ্ছে...');
  };

  // Download Profile DP (High-Definition)
  const handleDownloadDp = async () => {
    if (!currentProfile.avatarUrl) {
      showToast('কোনো ডিপি পাওয়া যায়নি!');
      return;
    }
    setDownloadingDp(true);
    showToast('DP ডাউনলোড শুরু হয়েছে...');
    const filename = `ShareChat_DP_${currentProfile.username}.jpg`;
    await downloadImage(currentProfile.avatarUrl, filename);
    setTimeout(() => {
      setDownloadingDp(false);
      showToast('ডিপি ফাইল ডাউনলোড সম্পন্ন হয়েছে ✓');
    }, 600);
  };

  // Download Back DP (Cover Photo)
  const handleDownloadCover = async () => {
    if (!currentProfile.coverUrl) {
      showToast('কোনো ব্যাক ডিপি পাওয়া যায়নি!');
      return;
    }
    setDownloadingCover(true);
    showToast('Back DP ডাউনলোড শুরু হয়েছে...');
    const filename = `ShareChat_BackDP_${currentProfile.username}.jpg`;
    await downloadImage(currentProfile.coverUrl, filename);
    setTimeout(() => {
      setDownloadingCover(false);
      showToast('ব্যাক ডিপি ডাউনলোড সম্পন্ন হয়েছে ✓');
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
      
      {/* ⚡ Header with Sharechat Logo + Ns MODS VIBES ⚡ */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Sharechat Brand Logo */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[2px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg viewBox="0 0 48 48" className="w-6 h-6 fill-current" fill="none">
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
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                  Ns MODS VIBES <span className="text-amber-400">⚡</span>
                </h1>
              </div>
              <p className="text-[11px] font-semibold text-amber-300/90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Only Sharechat user, use
              </p>
            </div>
          </div>

          <div className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            v2.4 PRO
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-4">

        {/* 1. প্রোফাইল লিংক পেস্ট করার জায়গা */}
        <div className="p-4 rounded-2xl bg-slate-900/95 border border-slate-800 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
              <span>প্রোফাইল লিংক পেস্ট করুন (Profile ID Link):</span>
            </label>
            {isLoadingProfile ? (
              <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                ডিপি লোড হচ্ছে...
              </span>
            ) : (
              <span className="text-[11px] font-mono text-slate-400">
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
                placeholder="https://sharechat.com/profile/... or @username"
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
              className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shrink-0"
              title="Paste from clipboard"
            >
              <Clipboard className="w-4 h-4" />
              <span>Paste</span>
            </button>

            <button
              onClick={() => loadProfileData(profileInput)}
              disabled={isLoadingProfile}
              className="px-3 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center gap-1 transition active:scale-95 shrink-0"
              title="Fetch Real Profile and DP"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProfile ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Fetch</span>
            </button>
          </div>

          {/* Real DP & Back DP Showcase Card */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-3">
              {/* DP Avatar */}
              <div className="flex items-center gap-3">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => setModalImage({ url: currentProfile.avatarUrl, title: `${currentProfile.name || currentProfile.username} - Profile Picture (DP)` })}
                  title="ক্লিক করে বড় করে দেখুন"
                >
                  <img 
                    src={currentProfile.avatarUrl} 
                    alt="Target Profile DP" 
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl bg-slate-900 border-2 border-amber-500/60 object-cover shadow-lg shadow-amber-500/10 transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  {currentProfile.isRealScraped && (
                    <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 rounded-full text-slate-950" title="আসল শেয়ারচ্যাট ডিপি">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white fill-emerald-600" />
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-sm font-black text-white">
                      {currentProfile.name || currentProfile.username}
                    </h3>
                    {currentProfile.isRealScraped && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        আসল ডিপি
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-amber-400 font-medium">
                    @{currentProfile.username}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    User ID: <span className="text-slate-200">{currentProfile.userId}</span>
                  </p>
                </div>
              </div>

              {/* Cover Preview (Back DP) */}
              <div 
                className="relative hidden sm:block w-24 h-16 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden cursor-pointer group"
                onClick={() => setModalImage({ url: currentProfile.coverUrl, title: `${currentProfile.name || currentProfile.username} - Back DP` })}
                title="ব্যাক ডিপি বড় করে দেখুন"
              >
                <img 
                  src={currentProfile.coverUrl} 
                  alt="Back DP" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-[10px] text-white font-bold">View Back</span>
                </div>
              </div>
            </div>

            {/* Direct Download Buttons */}
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
                <span>{downloadingDp ? 'ডাউনলোড হচ্ছে...' : 'DP ডাউনলোড (HD)'}</span>
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
                <span>{downloadingCover ? 'ডাউনলোড হচ্ছে...' : 'Back DP ডাউনলোড'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. ওই গালির জায়গা */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-xl">
          <label className="text-xs font-bold text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>মাইক বা চ্যাটে কি খারাপ কথা/গালি দিয়েছে:</span>
          </label>
          <textarea
            rows={2}
            value={abusiveWords}
            onChange={(e) => setAbusiveWords(e.target.value)}
            placeholder="e.g. Vulgar slurs, mic disturbance, abusive threats on voice mic..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition leading-relaxed"
          />
        </div>

        {/* 3. Report 1 to Report 10 Options (Strong হিসেবে ১০ পর্যন্ত) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>রিপোর্ট অপশন (Report 1 to 10):</span>
            </h2>
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              {selectedLevel.badge} সিলেক্টেড
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
            {REPORT_LEVELS.map((item) => {
              const isSelected = selectedLevel.level === item.level;
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
                    <span className={`text-xs font-black ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                      {item.label}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono ${getStrengthColor(item.strength)}`}>
                      {item.strength}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                    {item.shortDesc}
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
                শেয়ারচ্যাট অফিসিয়ালদের জন্য তৈরি রিপোর্ট (ENGLISH):
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Auto-Timestamped
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
              {copiedCode ? 'কপি হয়েছে' : 'কোড কপি'}
            </button>
          </div>

          {/* Subject Box */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 font-semibold break-all">
            <span className="text-slate-500 mr-1.5">SUBJECT:</span>
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
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wide transition shadow-xl shadow-red-950/40 active:scale-[0.98] cursor-pointer"
            >
              <Send className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>শেয়ারচ্যাট অফিসে মেইল পাঠান (DIRECT SEND)</span>
            </button>

            {/* Quick Copy Report */}
            <button
              onClick={handleCopyReport}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wide border border-slate-700 transition active:scale-[0.98] cursor-pointer"
            >
              {copiedReport ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copiedReport ? 'রিপোর্ট কপি সফল হয়েছে!' : 'ফুল রিপোর্ট কপি'}</span>
            </button>
          </div>
        </div>

      </main>

      {/* Fullscreen Photo Modal */}
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
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>ডাউনলোড করুন (HD)</span>
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
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}
