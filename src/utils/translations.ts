import { AppLanguage } from '../types/sharechat';

export interface TranslationDict {
  appName: string;
  appSubtitle: string;
  versionTag: string;
  guideBtn: string;
  tabProfile: string;
  tabVideo: string;
  tabVipFrame: string;
  tabVipName: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeDesc: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  dontShowAgain: string;
  getStartedBtn: string;
  inputLabel: string;
  inputPlaceholder: string;
  pasteBtn: string;
  fetchBtn: string;
  fetchingDp: string;
  verifiedLiveDp: string;
  profileLockBypassedBadge: string;
  userIdLabel: string;
  followersLabel: string;
  followingLabel: string;
  postsLabel: string;
  genderLabel: string;
  languageLabel: string;
  bioLabel: string;
  noBioText: string;
  viewBackCover: string;
  downloadDpHd: string;
  downloadDpHdLoading: string;
  downloadCover: string;
  downloadCoverLoading: string;
  abusiveLabel: string;
  abusivePlaceholder: string;
  reportLevelsTitle: string;
  selectedBadge: string;
  officialBoxTitle: string;
  autoTimestamped: string;
  wordCountBadge: string;
  copyCodeBtn: string;
  codeCopiedBtn: string;
  subjectLabel: string;
  copyFullReportBtn: string;
  reportCopiedBtn: string;
  previewTitleSuffix: string;
  closeBtn: string;
  modalDownloadBtn: string;
  openNewTabBtn: string;
  // Box Hub Layout Translations
  toolsHubTitle: string;
  toolsHubSubtitle: string;
  boxProfileTitle: string;
  boxProfileDesc: string;
  boxVideoTitle: string;
  boxVideoDesc: string;
  boxVipFrameTitle: string;
  boxVipFrameDesc: string;
  boxSafetyTitle: string;
  boxSafetyDesc: string;
  activeBoxBadge: string;
  // VIP DP Frame Studio Translations
  vipStudioTitle: string;
  vipStudioDesc: string;
  uploadCustomDpBtn: string;
  unlockedDpPresetLabel: string;
  selectFrameTitle: string;
  downloadVipDpBtn: string;
  generatingVipDp: string;
  // Account Safety & Shield Translations
  safetyShieldTitle: string;
  safetyShieldSubtitle: string;
  runSafetyAuditBtn: string;
  auditingStatus: string;
  healthScoreLabel: string;
  shadowbanStatusLabel: string;
  shieldStatusLabel: string;
  appealGeneratorTitle: string;
  appealGeneratorDesc: string;
  safetyTipsTitle: string;
  safetyAuditCompleteToast: string;
  // Video Downloader translations
  videoInputLabel: string;
  videoPlaceholder: string;
  videoFetchBtn: string;
  downloadVideoHd: string;
  downloadAudioMp3: string;
  copyCaptionBtn: string;
  captionCopiedBtn: string;
  noWatermarkBadge: string;
  videoStatsViews: string;
  videoStatsLikes: string;
  videoStatsShares: string;
  // Toasts
  toastLinkPasted: string;
  toastProfileLoaded: string;
  toastReportCopied: string;
  toastCodeCopied: string;
  toastDpStarting: string;
  toastDpSuccess: string;
  toastCoverStarting: string;
  toastCoverSuccess: string;
  toastVideoLoaded: string;
  toastMediaDownload: string;
  toastNoDpFound: string;
  toastNoCoverFound: string;
  toastPasteManual: string;
  toastImageUploaded: string;
  toastVipDownloaded: string;
  toastCopied: string;
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDict> = {
  en: {
    appName: 'Ns MODS VIBES',
    appSubtitle: 'Only Sharechat user, use',
    versionTag: 'v2.5 PRO',
    guideBtn: 'Welcome Guide',
    tabProfile: 'Profile & DP Tools',
    tabVideo: 'Video & MP3 Downloader',
    tabVipFrame: 'VIP DP Frame Studio',
    tabVipName: 'VIP Name & Bio Maker',
    welcomeTitle: 'Welcome to Ns MODS VIBES ⚡',
    welcomeSubtitle: 'Ultimate ShareChat Profile, Media & Mod Suite',
    welcomeDesc: 'Exclusively crafted for ShareChat users to scrape HD DPs (with 100% lock bypass), download no-watermark videos & MP3 audio, create custom VIP frames/crowns, and copy concise incident bancodes (~90 words).',
    feature1Title: 'Live Profile & HD DP Tools (No Lock Icons)',
    feature1Desc: 'Auto-fetches original HD profile picture, cover photo, follower stats, bio, and internal User ID. Never shows locked or broken placeholders.',
    feature2Title: 'No-Watermark Video & MP3 Downloader',
    feature2Desc: 'Paste any ShareChat post/video link to download clean 1080p MP4 videos without watermark and high-quality MP3 audio.',
    feature3Title: 'VIP DP Frame & Badge Studio',
    feature3Desc: 'Decorate any DP with Royal Gold Crowns, Cyber Neon Rings, Verified Badges, and export high-resolution 800x800 images.',
    feature4Title: 'Concise & Short Bancodes (~90 Words)',
    feature4Desc: '5 essential ban levels optimized to concise ~90 words for instant acceptance in ShareChat grievance reporting without truncation.',
    dontShowAgain: "Don't show this welcome message again",
    getStartedBtn: 'Get Started ⚡',
    inputLabel: 'Paste Profile ID Link (or Username):',
    inputPlaceholder: 'https://sharechat.com/profile/... or @username or numeric ID',
    pasteBtn: 'Paste',
    fetchBtn: 'Fetch Real Profile',
    fetchingDp: 'Connecting to ShareChat CDN...',
    verifiedLiveDp: 'Live ShareChat DP & Stats',
    profileLockBypassedBadge: 'Lock Bypassed • HD Avatar Active',
    userIdLabel: 'User ID:',
    followersLabel: 'Followers',
    followingLabel: 'Following',
    postsLabel: 'Posts',
    genderLabel: 'Gender',
    languageLabel: 'Language',
    bioLabel: 'Bio / Status:',
    noBioText: 'No bio text set on this profile.',
    viewBackCover: 'View Back DP',
    downloadDpHd: 'Download DP (HD)',
    downloadDpHdLoading: 'Preparing HD Image...',
    downloadCover: 'Download Back DP',
    downloadCoverLoading: 'Saving Back DP...',
    abusiveLabel: 'Abusive words / Mic disturbance spoken in chatroom:',
    abusivePlaceholder: 'e.g. Vulgar slurs, mic disturbance, abusive threats on voice mic, harassment...',
    reportLevelsTitle: 'Select Incident Report Level (Essential 5 Levels):',
    selectedBadge: 'Active Level',
    officialBoxTitle: 'Official Incident Code & Grievance Report',
    autoTimestamped: 'Word count optimized for ShareChat (~90 words)',
    wordCountBadge: 'Words',
    copyCodeBtn: 'Copy Bancode',
    codeCopiedBtn: 'Bancode Copied!',
    subjectLabel: 'Official Subject Header:',
    copyFullReportBtn: 'Copy Full Report (Official Format)',
    reportCopiedBtn: 'Full Report Copied!',
    previewTitleSuffix: 'HD Preview',
    closeBtn: 'Close',
    modalDownloadBtn: 'Direct Download HD',
    openNewTabBtn: 'Open Original in New Tab',
    // Box Hub Layout Translations
    toolsHubTitle: 'Ns MODS Feature Boxes',
    toolsHubSubtitle: 'Tap any box below to open the dedicated tool',
    boxProfileTitle: 'Profile & DP Tools',
    boxProfileDesc: 'Full HD DP Download, Cover Photo, User ID & Short Bancodes (No Lock)',
    boxVideoTitle: 'Video & MP3 Downloader',
    boxVideoDesc: 'Download No-Watermark HD MP4 Videos & High Quality Audio MP3',
    boxVipFrameTitle: 'VIP DP Frame Studio',
    boxVipFrameDesc: 'Add Royal Gold Crowns, Neon Rings, Verified Badges & Export 800x800 HD',
    boxSafetyTitle: 'Account Safety & Shield',
    boxSafetyDesc: 'Live Shadowban Check, Ban Risk Score & 1-Click Unban Appeal Letter',
    activeBoxBadge: 'ACTIVE BOX',
    // VIP Studio
    vipStudioTitle: 'VIP DP Frame & Badge Studio',
    vipStudioDesc: 'Add official golden crowns, neon rings & verified badges to your DP',
    uploadCustomDpBtn: 'Upload Photo',
    unlockedDpPresetLabel: 'VIP Presets',
    selectFrameTitle: 'Select VIP Frame Style',
    downloadVipDpBtn: 'Download VIP DP (800x800 HD PNG)',
    generatingVipDp: 'Rendering 800x800 HD Canvas...',
    // Account Safety & Shield
    safetyShieldTitle: 'Account Safety & Ban Risk Shield',
    safetyShieldSubtitle: 'Real-time shadowban check, ID health score, and 1-click unban appeal generator',
    runSafetyAuditBtn: 'Run Safety Audit',
    auditingStatus: 'Auditing Profile...',
    healthScoreLabel: 'Account Health Score',
    shadowbanStatusLabel: 'Shadowban Status',
    shieldStatusLabel: 'Privacy & Protection',
    appealGeneratorTitle: 'Official ShareChat Unban Appeal Generator',
    appealGeneratorDesc: 'Generates a formal legal appeal with your User ID and handle ready to email to contact@sharechat.co',
    safetyTipsTitle: 'ShareChat Anti-Ban & Chatroom Protection Rules',
    safetyAuditCompleteToast: 'Account Safety Audit Completed!',
    // Video Downloader
    videoInputLabel: 'Paste ShareChat Post / Video Link:',
    videoPlaceholder: 'https://sharechat.com/post/... or https://sharechat.com/video/...',
    videoFetchBtn: 'Extract Media (No Watermark)',
    downloadVideoHd: 'Download HD Video (No Watermark)',
    downloadAudioMp3: 'Download Audio (MP3)',
    copyCaptionBtn: 'Copy Caption / Shayari',
    captionCopiedBtn: 'Caption Copied!',
    noWatermarkBadge: 'Clean Video • No Watermark',
    videoStatsViews: 'Views',
    videoStatsLikes: 'Likes',
    videoStatsShares: 'Shares',
    // Toasts
    toastLinkPasted: 'Link pasted! Loading...',
    toastProfileLoaded: 'ShareChat profile & HD DP loaded!',
    toastReportCopied: 'Grievance report copied (Ready to paste)',
    toastCodeCopied: 'Bancode copied to clipboard',
    toastDpStarting: 'Downloading HD profile picture...',
    toastDpSuccess: 'HD Profile picture downloaded!',
    toastCoverStarting: 'Downloading cover photo...',
    toastCoverSuccess: 'Cover photo downloaded!',
    toastVideoLoaded: 'Video & Audio extracted without watermark',
    toastMediaDownload: 'Starting media download...',
    toastNoDpFound: 'No profile picture found to download',
    toastNoCoverFound: 'No cover picture found to download',
    toastPasteManual: 'Please paste the link manually',
    toastImageUploaded: 'Photo loaded in VIP Studio!',
    toastVipDownloaded: 'VIP DP Downloaded Successfully!',
    toastCopied: 'Copied to clipboard!'
  },
  bn: {
    appName: 'Ns MODS VIBES',
    appSubtitle: 'Only Sharechat user, use',
    versionTag: 'v2.5 PRO',
    guideBtn: 'ব্যবহার সহায়িকা',
    tabProfile: 'প্রোফাইল ও ডিপি টুলস',
    tabVideo: 'ভিডিও ও MP3 ডাউনলোডার',
    tabVipFrame: 'ভিআইপি ডিপি ফ্রেম স্টুডিও',
    tabVipName: 'স্টাইলিশ নেম ও ভিআইপি বায়ো',
    welcomeTitle: 'Ns MODS VIBES ⚡-এ স্বাগতম',
    welcomeSubtitle: 'শেয়ারচ্যাট প্রোফাইল, মিডিয়া ও মোডস আলটিমেট স্যুট',
    welcomeDesc: 'শুধুমাত্র শেয়ারচ্যাট ব্যবহারকারীদের জন্য তৈরি—আসল এইচডি ডিপি দেখা ও ডাউনলোড (কোনো লক চিহ্ন ছাড়াই), ওয়াটারমার্ক ছাড়া ভিডিও ও MP3 ডাউনলোড, ভিআইপি ফ্রেম ও স্টাইলিশ নাম তৈরি এবং সংক্ষিপ্ত ব্যানকোড (~৯০ শব্দ) কপি করার সম্পূর্ণ টুল।',
    feature1Title: 'লাইভ প্রোফাইল ও এইচডি ডিপি টুলস (লক ছাড়া)',
    feature1Desc: 'আসল ফুল এইচডি প্রোফাইল ছবি, ব্যাক কভার, ফলোয়ার্স, মোট পোস্ট, বায়ো এবং অভ্যন্তরীণ ইউজার আইডি স্বয়ংক্রিয়ভাবে এক্সট্র্যাক্ট করে গ্যারান্টিড ডাউনলোড। কোনো লক আইকন দেখাবে না।',
    feature2Title: 'নো-ওয়াটারমার্ক ভিডিও ও MP3 ডাউনলোডার',
    feature2Desc: 'যেকোনো শেয়ারচ্যাট পোস্ট বা ভিডিওর লিংক পেস্ট করে কোনো প্রকার ওয়াটারমার্ক ছাড়াই ১০৮০p এইচডি ভিডিও এবং হাই-কোয়ালিটি MP3 গান বা ডায়লগ ডাউনলোড।',
    feature3Title: 'ভিআইপি ডিপি ফ্রেম ও ব্যাজ স্টুডিও',
    feature3Desc: 'নিজের ডিপিতে যুক্ত করুন গোল্ডেন ক্রাউন, নিয়ন রিং ও ভেরিফায়েড ব্যাজ এবং নামিয়ে নিন ৮০০x৮০০ আল্ট্রা এইচডি পিএনজি ছবি।',
    feature4Title: 'সংক্ষিপ্ত পারফেক্ট ব্যানকোড (~৯০ শব্দ)',
    feature4Desc: 'অতিরিক্ত বড় রিপোর্ট শেয়ারচ্যাট নেয় না, তাই ৫টি অত্যাবশ্যকীয় ব্যান লেভেল নিখুঁতভাবে সংক্ষিপ্ত (~৯০ শব্দ) আকারে রাখা হয়েছে।',
    dontShowAgain: 'এই স্বাগতম বার্তাটি আর দেখাবেন না',
    getStartedBtn: 'শুরু করুন ⚡',
    inputLabel: 'প্রোফাইল লিঙ্ক (বা ইউজারনেম) পেস্ট করুন:',
    inputPlaceholder: 'https://sharechat.com/profile/... বা @username বা আইডি',
    pasteBtn: 'পেস্ট',
    fetchBtn: 'আসল প্রোফাইল আনুন',
    fetchingDp: 'শেয়ারচ্যাট সিডিএন থেকে তথ্য আসছে...',
    verifiedLiveDp: 'লাইভ শেয়ারচ্যাট ডিপি ও প্রোফাইল',
    profileLockBypassedBadge: 'লক বাইপাসড • এইচডি ডিপি সক্রিয়',
    userIdLabel: 'ইউজার আইডি:',
    followersLabel: 'ফলোয়ার্স',
    followingLabel: 'ফলোয়িং',
    postsLabel: 'পোস্ট',
    genderLabel: 'লিঙ্গ',
    languageLabel: 'ভাষা',
    bioLabel: 'বায়ো / স্ট্যাটাস:',
    noBioText: 'কোনো বায়ো লেখা নেই।',
    viewBackCover: 'ব্যাক ডিপি দেখুন',
    downloadDpHd: 'ডিপি ডাউনলোড (HD)',
    downloadDpHdLoading: 'এইচডি ইমেজ প্রস্তুত হচ্ছে...',
    downloadCover: 'ব্যাক ডিপি ডাউনলোড',
    downloadCoverLoading: 'ব্যাক ডিপি সেভ হচ্ছে...',
    abusiveLabel: 'আপত্তিকর কথা / মাইকে গালাগালি (ঐচ্ছিক):',
    abusivePlaceholder: 'যেমন: মাইকে গালাগালি, খারাপ কথা বা চ্যাটরুমে ঝামেলা...',
    reportLevelsTitle: 'রিপোর্টের লেভেল বেছে নিন (প্রয়োজনীয় ৫টি লেভেল):',
    selectedBadge: 'সিলেক্টেড লেভেল',
    officialBoxTitle: 'অফিসিয়াল ইনসিডেন্ট কোড ও গ্রিভেন্স রিপোর্ট',
    autoTimestamped: 'শেয়ারচ্যাট অফিশিয়াল সংক্ষিপ্ত রিপোর্ট (~৯০ শব্দ)',
    wordCountBadge: 'শব্দ',
    copyCodeBtn: 'ব্যানকোড কপি করুন',
    codeCopiedBtn: 'ব্যানকোড কপি হয়েছে!',
    subjectLabel: 'অফিসিয়াল সাবজেক্ট হেডার:',
    copyFullReportBtn: 'সম্পূর্ণ রিপোর্ট কপি করুন',
    reportCopiedBtn: 'রিপোর্ট কপি হয়েছে!',
    previewTitleSuffix: 'সম্পূর্ণ প্রিভিউ',
    closeBtn: 'বন্ধ করুন',
    modalDownloadBtn: 'সরাসরি ডাউনলোড HD',
    openNewTabBtn: 'নতুন ট্যাবে আসল ছবি দেখুন',
    // Box Hub Layout Translations
    toolsHubTitle: 'Ns MODS টুলস ও ফিচার বক্স',
    toolsHubSubtitle: 'যেকোনো একটি টুল বক্সে ক্লিক করে সরাসরি ব্যবহার করুন',
    boxProfileTitle: 'প্রোফাইল ও ডিপি টুলস',
    boxProfileDesc: 'আসল ফুল এইচডি ডিপি, কভার ফটো ও সংক্ষিপ্ত ব্যানকোড (লক মুক্ত)',
    boxVideoTitle: 'ভিডিও ও অডিও ডাউনলোডার',
    boxVideoDesc: 'ওয়াটারমার্ক ছাড়া ফুল এইচডি ভিডিও ও হাই-কোয়ালিটি MP3 গান',
    boxVipFrameTitle: 'ভিআইপি ডিপি ফ্রেম স্টুডিও',
    boxVipFrameDesc: 'গোল্ডেন ক্রাউন, নিয়ন আড্ডা রিং ও ভেরিফায়েড ব্যাজ যুক্ত এইচডি ডিপি',
    boxSafetyTitle: 'অ্যাকাউন্ট সেফটি ও শিল্ড',
    boxSafetyDesc: 'লাইভ শ্যাডোব্যান টেস্ট, আইডি রিস্ক স্কোর ও ১-ক্লিকে আনব্যান আপিল',
    activeBoxBadge: 'চলমান বক্স',
    // VIP Studio
    vipStudioTitle: 'ভিআইপি ডিপি ফ্রেম ও ব্যাজ স্টুডিও',
    vipStudioDesc: 'নিজের ছবিতে গোল্ডেন ক্রাউন, নিয়ন রিং ও ভেরিফায়েড ব্যাজ যুক্ত করুন',
    uploadCustomDpBtn: 'ছবি আপলোড',
    unlockedDpPresetLabel: 'ভিআইপি প্রিসেট',
    selectFrameTitle: 'ভিআইপি ফ্রেম স্টাইল বেছে নিন',
    downloadVipDpBtn: 'ভিআইপি ডিপি ডাউনলোড (৮০০x৮০০ HD)',
    generatingVipDp: '৮০০x৮০০ এইচডি ক্যানভাস তৈরি হচ্ছে...',
    // Account Safety & Shield
    safetyShieldTitle: 'অ্যাকাউন্ট সেফটি ও ব্যান প্রটেকশন শিল্ড',
    safetyShieldSubtitle: 'রিয়েল-টাইম শ্যাডোব্যান চেক, আইডি হেলথ স্কোর ও আনব্যান আপিল লেটার',
    runSafetyAuditBtn: 'সেফটি অডিট চালান',
    auditingStatus: 'প্রোফাইল অডিট হচ্ছে...',
    healthScoreLabel: 'অ্যাকাউন্ট হেলথ স্কোর',
    shadowbanStatusLabel: 'শ্যাডোব্যান স্ট্যাটাস',
    shieldStatusLabel: 'প্রাইভেসি ও প্রটেকশন',
    appealGeneratorTitle: 'শেয়ারচ্যাট অফিসিয়াল আনব্যান আপিল জেনারেটর',
    appealGeneratorDesc: 'আপনার আইডি ও হ্যান্ডেল যুক্ত অফিসিয়াল আপিল লেটার যা contact@sharechat.co তে পাঠানো যাবে',
    safetyTipsTitle: 'শেয়ারচ্যাট অ্যান্টি-ব্যান ও চ্যাটরুম সেফটি নিয়মাবলী',
    safetyAuditCompleteToast: 'অ্যাকাউন্ট সেফটি অডিট সম্পন্ন হয়েছে!',
    // Video Downloader
    videoInputLabel: 'শেয়ারচ্যাট পোস্ট বা ভিডিওর লিংক পেস্ট করুন:',
    videoPlaceholder: 'https://sharechat.com/post/... অথবা https://sharechat.com/video/...',
    videoFetchBtn: 'মিডিয়া আনুন (ওয়াটারমার্ক ছাড়া)',
    downloadVideoHd: 'ভিডিও ডাউনলোড (HD No-Watermark)',
    downloadAudioMp3: 'অডিও ডাউনলোড (MP3)',
    copyCaptionBtn: 'ক্যাপশন ও শায়েরি কপি',
    captionCopiedBtn: 'ক্যাপশন কপি হয়েছে!',
    noWatermarkBadge: 'ওয়াটারমার্কহীন এইচডি মিডিয়া',
    videoStatsViews: 'ভিউ',
    videoStatsLikes: 'লাইক',
    videoStatsShares: 'শেয়ার',
    // Toasts
    toastLinkPasted: 'ক্লিপবোর্ড থেকে লিঙ্ক পেস্ট হয়েছে',
    toastProfileLoaded: 'শেয়ারচ্যাট প্রোফাইল সফলভাবে এসেছে',
    toastReportCopied: 'রিপোর্ট কপি হয়েছে (পেস্ট করার জন্য প্রস্তুত)',
    toastCodeCopied: 'ব্যানকোড কপি হয়েছে',
    toastDpStarting: 'এইচডি ডিপি ডাউনলোড শুরু হচ্ছে...',
    toastDpSuccess: 'এইচডি ডিপি ডাউনলোড সম্পন্ন!',
    toastCoverStarting: 'কভার ফটো ডাউনলোড হচ্ছে...',
    toastCoverSuccess: 'কভার ফটো ডাউনলোড হয়েছে!',
    toastVideoLoaded: 'ওয়াটারমার্ক ছাড়া ভিডিও ও MP3 প্রস্তুত',
    toastMediaDownload: 'মিডিয়া ডাউনলোড শুরু হচ্ছে...',
    toastNoDpFound: 'ডাউনলোড করার মতো ডিপি পাওয়া যায়নি',
    toastNoCoverFound: 'ডাউনলোড করার মতো কভার পাওয়া যায়নি',
    toastPasteManual: 'অনুগ্রহ করে লিঙ্কটি ম্যানুয়ালি পেস্ট করুন',
    toastImageUploaded: 'ছবি স্টুডিওতে আপলোড হয়েছে!',
    toastVipDownloaded: 'ভিআইপি ডিপি সফলভাবে ডাউনলোড হয়েছে!',
    toastCopied: 'ক্লিপবোর্ডে কপি হয়েছে!'
  }
};

