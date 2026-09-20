import { AppLanguage } from '../types/sharechat';

export interface TranslationDict {
  appName: string;
  appSubtitle: string;
  versionTag: string;
  guideBtn: string;
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
  copyCodeBtn: string;
  codeCopiedBtn: string;
  subjectLabel: string;
  directSendBtn: string;
  copyFullReportBtn: string;
  reportCopiedBtn: string;
  previewTitleSuffix: string;
  closeBtn: string;
  modalDownloadBtn: string;
  // Toasts
  toastLinkPasted: string;
  toastProfileLoaded: string;
  toastReportCopied: string;
  toastCodeCopied: string;
  toastDpStarting: string;
  toastDpSuccess: string;
  toastCoverStarting: string;
  toastCoverSuccess: string;
  toastGmailOpening: string;
  toastNoDpFound: string;
  toastNoCoverFound: string;
  toastPasteManual: string;
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDict> = {
  en: {
    appName: 'Ns MODS VIBES',
    appSubtitle: 'Only Sharechat user, use',
    versionTag: 'v2.4 PRO',
    guideBtn: 'Welcome Guide',
    welcomeTitle: 'Welcome to Ns MODS VIBES ⚡',
    welcomeSubtitle: 'Ultimate ShareChat Profile & Official Grievance Suite',
    welcomeDesc: 'Exclusively built for ShareChat users to scrape real high-definition profile pictures, inspect hidden statistics, and file legally compliant incident reports.',
    feature1Title: 'Live Profile & DP Intelligence',
    feature1Desc: 'Auto-fetches original HD profile picture, cover photo, followers, following count, total posts, bio, and internal User ID.',
    feature2Title: '1-Click Guaranteed HD Downloads',
    feature2Desc: 'Download original full-resolution profile pictures and cover photos directly to your mobile or PC without blur or compression.',
    feature3Title: 'Level 1 to 10 Grievance Reports',
    feature3Desc: 'Generate official, timestamped complaint emails addressed to grievance@sharechat.co equipped with unique incident tracking codes (*#5786...).',
    feature4Title: 'Bilingual Interface (English / বাংলা)',
    feature4Desc: 'Switch the entire interface seamlessly between English and Bengali using the top language switch button.',
    dontShowAgain: "Don't show this welcome message again",
    getStartedBtn: 'Get Started ⚡',
    inputLabel: 'Paste Profile ID Link (or Username):',
    inputPlaceholder: 'https://sharechat.com/profile/... or @username or numeric ID',
    pasteBtn: 'Paste',
    fetchBtn: 'Fetch',
    fetchingDp: 'Fetching Real DP...',
    verifiedLiveDp: 'Live HD DP Verified',
    userIdLabel: 'User ID:',
    followersLabel: 'Followers',
    followingLabel: 'Following',
    postsLabel: 'Posts',
    genderLabel: 'Gender',
    languageLabel: 'Language',
    bioLabel: 'Bio / Status:',
    noBioText: 'No bio provided on profile',
    viewBackCover: 'View Back DP',
    downloadDpHd: 'Download DP (HD)',
    downloadDpHdLoading: 'Downloading DP...',
    downloadCover: 'Download Back DP',
    downloadCoverLoading: 'Downloading Back DP...',
    abusiveLabel: 'Abusive words / Mic disturbance spoken in chatroom:',
    abusivePlaceholder: 'e.g. Vulgar slurs, mic disturbance, abusive threats on voice mic, harassment...',
    reportLevelsTitle: 'Report Severity Options (Report 1 to 10):',
    selectedBadge: 'Selected',
    officialBoxTitle: 'Official Report for ShareChat Grievance Officers (ENGLISH):',
    autoTimestamped: 'Auto-Timestamped',
    copyCodeBtn: 'Copy Code',
    codeCopiedBtn: 'Code Copied!',
    subjectLabel: 'SUBJECT:',
    directSendBtn: 'SEND DIRECT EMAIL TO SHARECHAT GRIEVANCE',
    copyFullReportBtn: 'Copy Full Report',
    reportCopiedBtn: 'Report Copied!',
    previewTitleSuffix: 'HD Preview',
    closeBtn: 'Close',
    modalDownloadBtn: 'Download HD Image',
    toastLinkPasted: 'Link pasted! Loading profile & DP...',
    toastProfileLoaded: 'Real profile data & HD DP loaded!',
    toastReportCopied: 'Full report copied to clipboard!',
    toastCodeCopied: 'Incident code copied to clipboard!',
    toastDpStarting: 'Downloading HD Profile Picture...',
    toastDpSuccess: 'Profile DP downloaded successfully ✓',
    toastCoverStarting: 'Downloading Back DP (Cover)...',
    toastCoverSuccess: 'Back DP downloaded successfully ✓',
    toastGmailOpening: 'Opening Email client with complaint...',
    toastNoDpFound: 'No Profile DP found to download!',
    toastNoCoverFound: 'No Cover Photo found to download!',
    toastPasteManual: 'Paste the link into the box and click Fetch'
  },
  bn: {
    appName: 'Ns MODS VIBES',
    appSubtitle: 'Only Sharechat user, use',
    versionTag: 'v2.4 PRO',
    guideBtn: 'ব্যবহার সহায়িকা',
    welcomeTitle: 'Ns MODS VIBES ⚡ তে স্বাগতম',
    welcomeSubtitle: 'শেয়ারচ্যাট প্রোফাইল তথ্য ও অফিসিয়াল রিপোর্ট টুল',
    welcomeDesc: 'শেয়ারচ্যাট ব্যবহারকারীদের জন্য আসল এইচডি ডিপি দেখা, ব্যাক ডিপি ডাউনলোড, ফলোয়ার ও পোস্টের সংখ্যা জানা এবং অফিসিয়াল অভিযোগ তৈরি করার জন্য তৈরি।',
    feature1Title: 'লাইভ প্রোফাইল ও ডিপি এক্সট্রাক্টর',
    feature1Desc: 'সরাসরি আসল সাইজের প্রোফাইল ডিপি, কভার ফটো, ফলোয়ার, ফলোয়িং, পোস্ট সংখ্যা এবং আসল ইউজার আইডি খুঁজে এনে দেখায়।',
    feature2Title: '১-ক্লিকে আসল কোয়ালিটি HD ডাউনলোড',
    feature2Desc: 'কোনো ঝাপসা ছাড়া সরাসরি আপনার মোবাইলের গ্যালারিতে বা কম্পিউটারে অরিজিনাল এইচডি ডিপি ও ব্যাক ডিপি সেভ করুন।',
    feature3Title: 'লেভেল ১ থেকে ১০ অফিসিয়াল কমপ্লেইন রিপোর্ট',
    feature3Desc: 'শেয়ারচ্যাট অফিশিয়াল গ্রিভ্যান্স টিমের (grievance@sharechat.co) জন্য স্বয়ংক্রিয় ইনসিডেন্ট কোড (*#5786...) সহ ইংরেজি অভিযোগ পত্র।',
    feature4Title: 'দ্বিভাষিক ইন্টারফেস (English / বাংলা)',
    feature4Desc: 'উপরের বোতাম থেকে যেকোনো মুহূর্তে সম্পূর্ণ অ্যাপটি ইংরেজি অথবা বাংলায় রূপান্তর করুন।',
    dontShowAgain: 'এই স্বাগত বার্তাটি আর দেখাবেন না',
    getStartedBtn: 'শুরু করুন ⚡',
    inputLabel: 'প্রোফাইল লিংক পেস্ট করুন (Profile ID Link):',
    inputPlaceholder: 'https://sharechat.com/profile/... বা @ইউজারনেম বা আইডি',
    pasteBtn: 'পেস্ট',
    fetchBtn: 'খুঁজুন',
    fetchingDp: 'আসল ডিপি লোড হচ্ছে...',
    verifiedLiveDp: 'আসল লাইভ ডিপি',
    userIdLabel: 'ইউজার আইডি:',
    followersLabel: 'অনুসারী (Followers)',
    followingLabel: 'ফলোয়িং (Following)',
    postsLabel: 'পোস্ট (Posts)',
    genderLabel: 'লিঙ্গ',
    languageLabel: 'ভাষা',
    bioLabel: 'বায়ো / স্ট্যাটাস:',
    noBioText: 'কোনো বায়ো দেওয়া নেই',
    viewBackCover: 'ব্যাক ডিপি দেখুন',
    downloadDpHd: 'DP ডাউনলোড (HD)',
    downloadDpHdLoading: 'ডাউনলোড হচ্ছে...',
    downloadCover: 'Back DP ডাউনলোড',
    downloadCoverLoading: 'ডাউনলোড হচ্ছে...',
    abusiveLabel: 'মাইক বা চ্যাটে কি খারাপ কথা/গালি দিয়েছে:',
    abusivePlaceholder: 'যেমন: মাইকে বিশৃঙ্খলা, অকথ্য গালিগালাজ, চ্যাটরুমে হুমকি...',
    reportLevelsTitle: 'রিপোর্ট অপশন (Report 1 to 10):',
    selectedBadge: 'সিলেক্টেড',
    officialBoxTitle: 'শেয়ারচ্যাট অফিসিয়ালদের জন্য তৈরি রিপোর্ট (ENGLISH):',
    autoTimestamped: 'অটো টাইমস্ট্যাম্পড',
    copyCodeBtn: 'কোড কপি',
    codeCopiedBtn: 'কপি হয়েছে!',
    subjectLabel: 'SUBJECT:',
    directSendBtn: 'শেয়ারচ্যাট অফিসে মেইল পাঠান (DIRECT SEND)',
    copyFullReportBtn: 'ফুল রিপোর্ট কপি',
    reportCopiedBtn: 'কপি সফল হয়েছে!',
    previewTitleSuffix: 'এইচডি প্রিভিউ',
    closeBtn: 'বন্ধ করুন',
    modalDownloadBtn: 'ছবি ডাউনলোড (HD)',
    toastLinkPasted: 'লিংক পেস্ট হয়েছে, ডিপি খোঁজা হচ্ছে...',
    toastProfileLoaded: 'আসল প্রোফাইল ও ডিপি লোড হয়েছে!',
    toastReportCopied: 'ফুল রিপোর্ট কপি হয়েছে!',
    toastCodeCopied: 'ইনসিডেন্ট কোড কপি হয়েছে!',
    toastDpStarting: 'ডিপি ডাউনলোড শুরু হয়েছে...',
    toastDpSuccess: 'ডিপি ফাইল ডাউনলোড সম্পন্ন হয়েছে ✓',
    toastCoverStarting: 'ব্যাক ডিপি ডাউনলোড শুরু হয়েছে...',
    toastCoverSuccess: 'ব্যাক ডিপি ডাউনলোড সম্পন্ন হয়েছে ✓',
    toastGmailOpening: 'জিমেইল ওপেন হচ্ছে...',
    toastNoDpFound: 'কোনো ডিপি পাওয়া যায়নি!',
    toastNoCoverFound: 'কোনো ব্যাক ডিপি পাওয়া যায়নি!',
    toastPasteManual: 'বক্সে সরাসরি লিংক পেস্ট করে Fetch চাপুন'
  }
};
