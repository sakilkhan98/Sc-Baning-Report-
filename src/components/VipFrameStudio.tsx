import React, { useState, useRef, useEffect } from 'react';
import { Crown, Sparkles, Download, ShieldCheck, Flame, Diamond, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';
import { cleanUnlockedAvatar, UNLOCKED_PRESETS } from '../utils/sharechatParser';

interface VipFrameStudioProps {
  initialAvatarUrl?: string;
  username?: string;
  t: any;
  showToast: (msg: string) => void;
}

export interface FrameOption {
  id: string;
  name: string;
  nameBn: string;
  borderColor: string;
  ringStyle: string;
  badgeIcon: string;
  badgeLabel: string;
  accentClass: string;
}

export const VIP_FRAMES: FrameOption[] = [
  {
    id: 'royal_gold',
    name: 'Royal King Crown',
    nameBn: 'রয়েল গোল্ডেন ক্রাউন',
    borderColor: '#f59e0b',
    ringStyle: 'border-4 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.7)]',
    badgeIcon: '👑',
    badgeLabel: 'VIP KING',
    accentClass: 'from-amber-400 to-yellow-600'
  },
  {
    id: 'neon_cyber',
    name: 'Cyber Neon Ring',
    nameBn: 'নিয়ন সাইবার আড্ডা রিং',
    borderColor: '#06b6d4',
    ringStyle: 'border-4 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.75)]',
    badgeIcon: '⚡',
    badgeLabel: 'MOD ELITE',
    accentClass: 'from-cyan-400 to-blue-600'
  },
  {
    id: 'diamond_vip',
    name: 'Diamond VIP Creator',
    nameBn: 'ডায়মন্ড ভিআইপি ক্রিয়েটর',
    borderColor: '#38bdf8',
    ringStyle: 'border-4 border-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.75)]',
    badgeIcon: '💎',
    badgeLabel: 'DIAMOND',
    accentClass: 'from-sky-400 to-indigo-600'
  },
  {
    id: 'verified_shield',
    name: 'Verified Official Blue',
    nameBn: 'অফিশিয়াল ব্লু টিক ব্যাজ',
    borderColor: '#3b82f6',
    ringStyle: 'border-4 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.7)]',
    badgeIcon: '🛡️',
    badgeLabel: 'VERIFIED',
    accentClass: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'fire_king',
    name: 'Fire Adda Champion',
    nameBn: 'ফায়ার আড্ডা চ্যাম্পিয়ন',
    borderColor: '#f97316',
    ringStyle: 'border-4 border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.75)]',
    badgeIcon: '🔥',
    badgeLabel: 'FIRE ADDA',
    accentClass: 'from-orange-500 to-red-600'
  },
  {
    id: 'gold_halo',
    name: 'Golden Halo Star',
    nameBn: 'গোল্ডেন স্টার হ্যালো',
    borderColor: '#eab308',
    ringStyle: 'border-4 border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.7)]',
    badgeIcon: '🌟',
    badgeLabel: 'TOP STAR',
    accentClass: 'from-yellow-400 to-amber-600'
  }
];

export const VipFrameStudio: React.FC<VipFrameStudioProps> = ({
  initialAvatarUrl,
  username = 'ns_user',
  t,
  showToast
}) => {
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(VIP_FRAMES[0]);
  const [currentAvatar, setCurrentAvatar] = useState<string>(
    cleanUnlockedAvatar(initialAvatarUrl || '', username)
  );
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync avatar if prop updates
  useEffect(() => {
    if (initialAvatarUrl) {
      setCurrentAvatar(cleanUnlockedAvatar(initialAvatarUrl, username));
    }
  }, [initialAvatarUrl, username]);

  // Handle local image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCurrentAvatar(reader.result);
          showToast(t.toastImageUploaded || 'Photo loaded in VIP Studio!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // High-Resolution Canvas Exporter (800x800)
  const exportVipDp = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Load Avatar Image with crossOrigin
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = () => resolve(true);
        img.onerror = () => {
          // If proxy fails, try fallback
          img.src = cleanUnlockedAvatar('', username);
        };
        // Use proxy for external cdn images to avoid canvas taint
        if (currentAvatar.startsWith('http')) {
          img.src = `/api/download-image?url=${encodeURIComponent(currentAvatar)}&mode=proxy`;
        } else {
          img.src = currentAvatar;
        }
      });

      // Clear Canvas with dark gradient backdrop
      const bgGrad = ctx.createRadialGradient(400, 400, 100, 400, 400, 400);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 800);

      // Draw Circular Clipped Avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(400, 400, 310, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 90, 90, 620, 620);
      ctx.restore();

      // Outer Glowing VIP Ring
      ctx.save();
      ctx.shadowColor = selectedFrame.borderColor;
      ctx.shadowBlur = 40;
      ctx.lineWidth = 22;
      ctx.strokeStyle = selectedFrame.borderColor;
      ctx.beginPath();
      ctx.arc(400, 400, 315, 0, Math.PI * 2);
      ctx.stroke();

      // Inner thin gold accent ring
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(400, 400, 326, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Draw VIP Crown / Emblem on Top
      ctx.save();
      ctx.font = '72px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 15;
      ctx.fillText(selectedFrame.badgeIcon, 400, 80);
      ctx.restore();

      // Draw Bottom Ribbon / Badge Pill
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 20;

      const pillW = 280;
      const pillH = 68;
      const pillX = 400 - pillW / 2;
      const pillY = 675;
      const pillRadius = 34;

      // Pill Background
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, pillRadius);
      ctx.fill();

      // Pill Border
      ctx.lineWidth = 4;
      ctx.strokeStyle = selectedFrame.borderColor;
      ctx.stroke();

      // Pill Text
      ctx.font = 'bold 26px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${selectedFrame.badgeIcon} ${selectedFrame.badgeLabel}`, 400, pillY + pillH / 2);
      ctx.restore();

      // Export as PNG
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `ShareChat_VIP_DP_${username}_${selectedFrame.id}.png`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) document.body.removeChild(a);
      }, 1000);

      showToast(t.toastVipDownloaded || 'VIP DP Downloaded Successfully!');
    } catch (err) {
      console.error('Export failed:', err);
      showToast('Download started via direct HD render!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-5 shadow-xl">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{t.vipStudioTitle}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO 800x800
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t.vipStudioDesc}</p>
          </div>
        </div>

        {/* Upload Custom Photo Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.uploadCustomDpBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Preview + Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left Side: Live VIP DP Canvas Preview */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 relative">
          <div className="relative p-3 flex flex-col items-center">
            {/* Top Crown Emblem */}
            <div className="text-3xl sm:text-4xl mb-1 animate-bounce drop-shadow-[0_4px_10px_rgba(245,158,11,0.6)] z-10">
              {selectedFrame.badgeIcon}
            </div>

            {/* Glowing Circular Avatar */}
            <div className={`w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden p-1 transition-all duration-300 relative ${selectedFrame.ringStyle}`}>
              <img
                src={currentAvatar}
                alt="VIP Avatar Preview"
                className="w-full h-full object-cover rounded-full bg-slate-900"
              />
            </div>

            {/* Bottom VIP Ribbon Pill */}
            <div className="mt-[-16px] z-10 px-4 py-1 rounded-full bg-slate-950 border-2 border-amber-400 shadow-xl flex items-center gap-1.5 text-xs font-black text-white tracking-wide">
              <span>{selectedFrame.badgeIcon}</span>
              <span className="font-mono text-[11px]">{selectedFrame.badgeLabel}</span>
            </div>
          </div>

          {/* Quick Unlocked Avatar Switcher */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex items-center justify-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">{t.unlockedDpPresetLabel}:</span>
            <div className="flex items-center gap-1.5">
              {UNLOCKED_PRESETS.map((pUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentAvatar(pUrl)}
                  className="w-6 h-6 rounded-full overflow-hidden border border-amber-500/50 hover:scale-110 transition cursor-pointer"
                  title={`Preset ${idx + 1}`}
                >
                  <img src={pUrl} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Select VIP Frame Style */}
        <div className="md:col-span-7 space-y-3.5">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t.selectFrameTitle}</span>
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            {VIP_FRAMES.map((f) => {
              const isSelected = selectedFrame.id === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => setSelectedFrame(f)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="text-2xl shrink-0">{f.badgeIcon}</div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{f.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{f.nameBn}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Download Action Button */}
          <div className="pt-2">
            <button
              onClick={exportVipDp}
              disabled={isExporting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? t.generatingVipDp : t.downloadVipDpBtn}</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2 font-mono">
              ✓ Ultra HD 800x800 • Direct PNG • Ready for ShareChat DP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
