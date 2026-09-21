import React, { useState } from 'react';
import { 
  Video, 
  Music, 
  Download, 
  Copy, 
  Check, 
  Clipboard, 
  Loader2, 
  Sparkles, 
  ExternalLink,
  Eye,
  Heart,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { SharechatVideo } from '../types/sharechat';
import { fetchSharechatVideo, downloadMediaFile } from '../utils/sharechatParser';
import { TranslationDict } from '../utils/translations';

interface VideoDownloaderProps {
  t: TranslationDict;
  showToast: (msg: string) => void;
}

export const VideoDownloader: React.FC<VideoDownloaderProps> = ({ t, showToast }) => {
  const [videoInput, setVideoInput] = useState('https://sharechat.com/post/Vj41Xw98?d=n');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingVideo, setDownloadingVideo] = useState(false);
  const [downloadingAudio, setDownloadingAudio] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [videoData, setVideoData] = useState<SharechatVideo | null>(() => ({
    postId: 'Vj41Xw98',
    postUrl: 'https://sharechat.com/post/Vj41Xw98',
    title: 'Amar Buker Majhe Tumi | Bengali Romantic Song Status ⚡',
    caption: 'Amar Buker Majhe Tumi | Bengali Romantic Song Status ⚡ #bengali #status #sharechat #nsmods',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    audioUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=800&q=80',
    authorName: 'Ns MODS Official',
    authorHandle: '@ns_mods',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=ns_mods_master',
    views: '38.4K',
    likes: '4.2K',
    shares: '1.1K',
    isRealScraped: false
  }));

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setVideoInput(text.trim());
        showToast(t.toastLinkPasted);
        handleFetch(text.trim());
      }
    } catch {
      showToast(t.toastPasteManual);
    }
  };

  const handleFetch = async (queryToUse?: string) => {
    const q = (queryToUse || videoInput).trim();
    if (!q) return;
    setIsLoading(true);
    try {
      const data = await fetchSharechatVideo(q);
      setVideoData(data);
      showToast(t.toastVideoLoaded);
    } catch (err: any) {
      showToast('Error extracting media: ' + (err.message || 'Check link'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadVideo = async () => {
    if (!videoData?.videoUrl) return;
    setDownloadingVideo(true);
    showToast(t.toastMediaDownload);
    try {
      const filename = `ShareChat_HD_${videoData.postId || 'video'}.mp4`;
      await downloadMediaFile(videoData.videoUrl, filename);
    } finally {
      setDownloadingVideo(false);
    }
  };

  const handleDownloadAudio = async () => {
    if (!videoData?.audioUrl && !videoData?.videoUrl) return;
    setDownloadingAudio(true);
    showToast(t.toastMediaDownload);
    try {
      const targetAudio = videoData.audioUrl || videoData.videoUrl;
      const filename = `ShareChat_Audio_${videoData.postId || 'music'}.mp3`;
      await downloadMediaFile(targetAudio, filename);
    } finally {
      setDownloadingAudio(false);
    }
  };

  const handleCopyCaption = () => {
    if (!videoData?.caption) return;
    navigator.clipboard.writeText(videoData.caption);
    setCopiedCaption(true);
    showToast('Caption & Shayari copied to clipboard!');
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div id="video-downloader-container" className="space-y-6">
      {/* Input Box Card */}
      <div className="bg-[#111827] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between gap-2 mb-3">
          <label className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <Video className="w-4 h-4 text-cyan-400" />
            {t.videoInputLabel}
          </label>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            {t.noWatermarkBadge}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              placeholder={t.videoPlaceholder}
              className="w-full bg-[#0a0f1d] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white text-sm rounded-xl px-4 py-3 outline-none transition-all placeholder:text-slate-500 font-mono pr-20"
            />
            <button
              onClick={handlePaste}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs text-cyan-300 rounded-lg border border-slate-700 flex items-center gap-1 transition-all"
            >
              <Clipboard className="w-3 h-3" />
              {t.pasteBtn}
            </button>
          </div>

          <button
            onClick={() => handleFetch()}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-95 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.videoFetchBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Media Result & Downloader Card */}
      {videoData && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
          {/* Header with Creator Info */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={videoData.authorAvatar}
                alt={videoData.authorName}
                className="w-11 h-11 rounded-full object-cover border-2 border-cyan-500/40 bg-slate-800"
              />
              <div>
                <h4 className="text-white font-bold text-base flex items-center gap-1.5">
                  {videoData.authorName}
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                </h4>
                <p className="text-xs text-slate-400 font-mono">{videoData.authorHandle}</p>
              </div>
            </div>

            {/* Virality Stats */}
            <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-white">{videoData.views}</span> {t.videoStatsViews}
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-semibold text-white">{videoData.likes}</span> {t.videoStatsLikes}
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">{videoData.shares}</span> {t.videoStatsShares}
              </span>
            </div>
          </div>

          {/* Video Preview Player */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-6 bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex flex-col items-center justify-center relative aspect-video">
              <video
                src={videoData.videoUrl}
                poster={videoData.thumbnailUrl}
                controls
                playsInline
                className="w-full h-full object-contain max-h-[360px]"
              />
            </div>

            {/* Details & Fast Download Actions */}
            <div className="lg:col-span-6 space-y-4">
              {/* Caption Box */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Post Caption & Shayari
                  </span>
                  <button
                    onClick={handleCopyCaption}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all"
                  >
                    {copiedCaption ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{t.captionCopiedBtn}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.copyCaptionBtn}</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-normal select-all">
                  {videoData.caption || videoData.title}
                </p>
              </div>

              {/* Audio Player */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5" />
                    Audio / Background Song Preview
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">192 kbps MP3</span>
                </div>
                <audio
                  src={videoData.audioUrl || videoData.videoUrl}
                  controls
                  className="w-full h-9 rounded-lg"
                />
              </div>

              {/* High-Impact Download Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Download Video HD */}
                <button
                  onClick={handleDownloadVideo}
                  disabled={downloadingVideo}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {downloadingVideo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving HD Video...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>{t.downloadVideoHd}</span>
                    </>
                  )}
                </button>

                {/* Download Audio MP3 */}
                <button
                  onClick={handleDownloadAudio}
                  disabled={downloadingAudio}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {downloadingAudio ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving MP3...</span>
                    </>
                  ) : (
                    <>
                      <Music className="w-4 h-4" />
                      <span>{t.downloadAudioMp3}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Link out */}
              <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                <span>Direct ShareChat CDN Stream</span>
                <a
                  href={videoData.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                >
                  Open in ShareChat
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
