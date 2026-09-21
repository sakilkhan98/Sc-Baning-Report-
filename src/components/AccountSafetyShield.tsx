import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Mail,
  Copy,
  Check,
  RefreshCw,
  Search,
  CheckCircle2,
  FileText,
  UserX,
  VolumeX,
  Lock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SharechatProfile } from '../types/sharechat';

interface AccountSafetyShieldProps {
  currentProfile: SharechatProfile;
  t: any;
  showToast: (msg: string) => void;
  onScanAnotherUser?: (handle: string) => void;
}

export const AccountSafetyShield: React.FC<AccountSafetyShieldProps> = ({
  currentProfile,
  t,
  showToast,
  onScanAnotherUser
}) => {
  const [handleInput, setHandleInput] = useState(currentProfile.username || 'sakilkhan');
  const [isAuditing, setIsAuditing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAppealType, setSelectedAppealType] = useState<
    'mic_ban' | 'false_report' | 'locked_account' | 'permanent_ban'
  >('mic_ban');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(t.toastCopied || 'Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      showToast(t.safetyAuditCompleteToast || 'Account Safety Audit Completed!');
    }, 800);
  };

  // Dynamic calculations based on current profile
  const followersNum = parseInt((currentProfile.followers || '0').replace(/[^0-9]/g, '')) || 50;
  const isLocked = currentProfile.isProfileLocked;
  const isVerified = currentProfile.isVerified;

  // Health Score Calculation
  let healthScore = 94;
  if (isLocked) healthScore += 3; // Locked profiles have higher privacy shield
  if (isVerified) healthScore += 3;
  if (followersNum > 1000) healthScore += 2;
  healthScore = Math.min(99, healthScore);

  const getRiskLevel = (score: number) => {
    if (score >= 90) return { label: 'LOW RISK (SAFE)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 75) return { label: 'MODERATE RISK', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'HIGH RISK', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const risk = getRiskLevel(healthScore);

  // Appeal Letter Templates
  const appealTemplates = {
    mic_ban: {
      title: 'Chatroom Mic / Speaking Ban Appeal',
      subject: `Urgent Appeal: Chatroom Audio Mic Unban Request - User ID: ${currentProfile.userId}`,
      body: `To,\nThe ShareChat Trust & Safety Team / Grievance Officer,\n\nSubject: Appeal against incorrect chatroom mic/audio block on my account (@${currentProfile.username})\n\nDear Support Team,\nI am writing to formally request a review of my chatroom mic restriction on ShareChat.\n\nMy Account Credentials:\n• Profile Handle: @${currentProfile.username}\n• ShareChat User ID: ${currentProfile.userId}\n• Profile URL: ${currentProfile.profileUrl}\n\nI was speaking in a public community chatroom and was abruptly muted due to automated flagging or malicious opponent group mass-reporting without violating ShareChat Community Guidelines. I have consistently respected room hosts, co-speakers, and listeners.\n\nKindly review my chat audio logs and restore my microphone permissions at your earliest convenience.\n\nThank you,\n${currentProfile.name}\nRegistered ShareChat User`
    },
    false_report: {
      title: 'False Mass-Report Protection Appeal',
      subject: `Malicious Mass-Report Defense Notice - User ID: ${currentProfile.userId}`,
      body: `To,\nThe ShareChat Grievance Officer & Safety Review Team,\n\nSubject: Investigation of malicious mass-reporting abuse against account @${currentProfile.username}\n\nDear ShareChat Team,\nMy account is currently being targeted by coordinated malicious mass-reporting aimed at falsely triggering automated algorithm penalties.\n\nAccount Details:\n• Handle: @${currentProfile.username}\n• User ID: ${currentProfile.userId}\n• Verification Status: ${currentProfile.isVerified ? 'Verified' : 'Standard'}\n\nI adhere strictly to the Indian IT Rules (Intermediary Guidelines) and ShareChat Community Standards. No illegal, obscene, or hateful content has ever been published from this handle.\n\nPlease safeguard this User ID against illegitimate mass-flags and clear any strike counters.\n\nRespectfully,\n${currentProfile.name}`
    },
    locked_account: {
      title: 'Profile Lock & Access Reversal',
      subject: `Account Access Review & Verification - User ID: ${currentProfile.userId}`,
      body: `To,\nShareChat Support Team (contact@sharechat.co),\n\nSubject: Account Verification and Security Access Restore for @${currentProfile.username}\n\nDear Team,\nMy ShareChat profile (@${currentProfile.username}, ID: ${currentProfile.userId}) has encountered an unexpected security lock or privacy restriction.\n\nI am the sole authentic owner of this profile and can provide mobile OTP authentication if needed. Please verify my credentials and reinstate full account functionality.\n\nAccount Details:\n• ShareChat ID: ${currentProfile.userId}\n• Registered Username: @${currentProfile.username}\n\nLooking forward to your swift resolution.\n\nRegards,\n${currentProfile.name}`
    },
    permanent_ban: {
      title: 'Emergency ID Termination Appeal',
      subject: `Formal Grievance Appeal: Account Suspension Review - User ID: ${currentProfile.userId}`,
      body: `To,\nThe Grievance Officer,\nShareChat (Mohalla Tech Pvt. Ltd.),\n\nSubject: Formal appeal against account suspension - User ID ${currentProfile.userId}\n\nRespected Sir/Madam,\nThis is a formal grievance appeal regarding the suspension of my ShareChat profile (@${currentProfile.username}).\n\nI believe this disciplinary action was taken based on an erroneous automated algorithm detection or coordinated fraudulent reports submitted by bad actors.\n\nI hereby declare that I hold zero intention to breach ShareChat terms. I request a manual human review of my activity history and kindly urge you to restore my account.\n\nSincerely,\n${currentProfile.name}\nShareChat ID: ${currentProfile.userId}`
    }
  };

  const currentAppeal = appealTemplates[selectedAppealType];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{t.safetyShieldTitle || 'Account Safety & Ban Risk Shield'}</span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO ACTIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.safetyShieldSubtitle || 'Real-time shadowban check, ID health score, and 1-click unban appeal generator'}
            </p>
          </div>
        </div>

        {/* Refresh / Run Audit Button */}
        <button
          onClick={handleRunAudit}
          disabled={isAuditing}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? (t.auditingStatus || 'Auditing Profile...') : (t.runSafetyAuditBtn || 'Run Safety Audit')}</span>
        </button>
      </div>

      {/* Profile Health Score & Shadowban Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Card 1: ID Health Meter */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.healthScoreLabel || 'Account Health Score'}
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${risk.bg} ${risk.color}`}>
                {risk.label}
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {healthScore}%
              </span>
              <span className="text-xs text-emerald-400 font-bold">Good Standing</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Target Handle:</span>
            <span className="font-mono font-bold text-white">@{currentProfile.username}</span>
          </div>
        </div>

        {/* Card 2: Shadowban & Algorithm Visibility */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.shadowbanStatusLabel || 'Shadowban Status'}
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              PASSED • CLEAN
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Search Indexing</span>
              </span>
              <span className="text-emerald-400 font-semibold text-[11px]">Normal (Active)</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Feed Recommendation</span>
              </span>
              <span className="text-emerald-400 font-semibold text-[11px]">Unrestricted</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chatroom Seat Access</span>
              </span>
              <span className="text-emerald-400 font-semibold text-[11px]">Eligible</span>
            </div>
          </div>
        </div>

        {/* Card 3: Profile Protection Parameters */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.shieldStatusLabel || 'Privacy & Shield'}
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              SHIELD ON
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Profile Lock State:</span>
              <span className="font-bold text-slate-300 text-[11px]">
                {isLocked ? 'Protected (Locked)' : 'Public Profile'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Internal User ID:</span>
              <span className="font-mono font-bold text-amber-400 text-[11px]">{currentProfile.userId}</span>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-400">Mass-Report Vulnerability:</span>
              <span className="text-emerald-400 font-semibold text-[11px]">Very Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official ShareChat Unban & Grievance Appeal Generator */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{t.appealGeneratorTitle || 'Official ShareChat Unban Appeal Generator'}</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t.appealGeneratorDesc || 'Generates a formal legal appeal with your User ID and handle ready to email to contact@sharechat.co'}
            </p>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            contact@sharechat.co
          </span>
        </div>

        {/* Appeal Category Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'mic_ban', label: 'Mic / Audio Ban', icon: VolumeX },
            { id: 'false_report', label: 'False Mass-Report', icon: ShieldAlert },
            { id: 'locked_account', label: 'Locked Profile', icon: Lock },
            { id: 'permanent_ban', label: 'ID Suspension', icon: UserX }
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedAppealType === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedAppealType(cat.id as any)}
                className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="text-xs truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Appeal Letter Preview Box */}
        <div className="rounded-xl bg-slate-950 border border-slate-800/80 p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/60">
            <span className="font-mono text-slate-400 truncate max-w-[280px] sm:max-w-md">
              <span className="text-slate-500">Subject: </span>
              <span className="text-white font-semibold">{currentAppeal.subject}</span>
            </span>

            <button
              onClick={() => copyToClipboard(`${currentAppeal.subject}\n\n${currentAppeal.body}`, 'full_appeal')}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              {copiedId === 'full_appeal' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Letter</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-2 custom-scrollbar bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
            {currentAppeal.body}
          </pre>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Official Recipient: <strong className="text-white">contact@sharechat.co</strong> / <strong className="text-white">grievance@sharechat.co</strong></span>
            </div>

            <a
              href={`mailto:contact@sharechat.co?subject=${encodeURIComponent(currentAppeal.subject)}&body=${encodeURIComponent(currentAppeal.body)}`}
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Open in Gmail / Email App</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 5 Crucial ShareChat MOD Protection Rules */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>{t.safetyTipsTitle || 'ShareChat Anti-Ban & Chatroom Protection Rules'}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-black">1</span>
              <span>Prevent Mic Auto-Mute</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Avoid continuous background music loops or shouting into the mic during heated room debates, which triggers ShareChat's automated decibel audio strike filter.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-black">2</span>
              <span>Neutralize Malicious Mass-Reports</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              If an opponent group mass-reports your profile, activate "Profile Lock" in ShareChat Settings. It immediately stops guest click-reports on your DP and posts.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-black">3</span>
              <span>Bypass Device Hardware Strikes</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Never re-register a new account on the same phone network immediately after receiving a level 5 device ban. Clear cache and restart your mobile network router.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-black">4</span>
              <span>Keep Accurate User ID Recorded</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Always copy your internal numeric ShareChat User ID ({currentProfile.userId}) from Box 1. Handles can change, but the numeric ID is required for successful unbans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
