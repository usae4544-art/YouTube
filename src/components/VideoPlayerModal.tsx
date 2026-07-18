import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Sparkles, Heart, ThumbsUp, MessageSquare, Download, Share2, 
  Smile, ShieldCheck, HeartCrack, RefreshCw, SignalHigh,
  DownloadCloud, Trash2, Headphones, Maximize2, Play
, Lock, Send} from "lucide-react";
import { YouTubeVideo, YouTubeComment, AISummary } from "../types";
import { formatViews } from "../utils";

interface VideoPlayerModalProps {
  video: YouTubeVideo;
  onClose: () => void;
  kidsMode: boolean;
  fontSizeClass: string;
  isDownloaded: boolean;
  onToggleDownload: (video: YouTubeVideo) => void;
  onToggleVault?: (video: YouTubeVideo) => void;
}

export default function VideoPlayerModal({ 
  video, 
  onClose, 
  kidsMode, 
  fontSizeClass,
  isDownloaded,
  onToggleDownload,
  onToggleVault
}: VideoPlayerModalProps) {
  const [comments, setComments] = useState<YouTubeComment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'assistant', text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  
  const handleChat = async () => {
    if (!chatInput.trim() || isChatting) return;
    
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsChatting(true);
    
    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          videoContext: {
            title: video.title,
            description: video.description,
            channelTitle: video.channelTitle
          },
          kidsMode
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: "assistant", text: data.reply || "Sorry, I couldn't understand that." }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: "assistant", text: "Oops, something went wrong!" }]);
    } finally {
      setIsChatting(false);
    }
  };
  const [activeTab, setActiveTab] = useState<"info" | "comments" | "ai">("info");
  const [liked, setLiked] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  
  // Simulated Downloading states
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch comments for this video
  useEffect(() => {
    let active = true;
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/youtube/comments?videoId=${video.id}`);
        const data = await res.json();
        
        if (active) {
          if (data.items && data.items.length > 0) {
            const formatted = data.items.map((c: any) => {
              const snippet = c.snippet?.topLevelComment?.snippet;
              return {
                id: c.id,
                authorName: snippet?.authorDisplayName || "Viewer",
                authorAvatar: snippet?.authorProfileImageUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${c.id}`,
                textDisplay: snippet?.textDisplay || "",
                publishedAt: snippet?.publishedAt || new Date().toISOString(),
                likeCount: snippet?.likeCount || 0
              };
            });
            setComments(formatted);
          } else {
            // High fidelity fallback comments
            generateFallbackComments();
          }
        }
      } catch (err) {
        if (active) {
          generateFallbackComments();
        }
      }
    };

    fetchComments();
    return () => {
      active = false;
    };
  }, [video.id]);

  // Handle escape key closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const generateFallbackComments = () => {
    const fallback: YouTubeComment[] = [
      {
        id: "fb-1",
        authorName: kidsMode ? "SuperTeddy 🧸" : "Alex Rivera",
        authorAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=alex",
        textDisplay: kidsMode ? "This is my absolute favorite video ever!! So colorful! 😍" : "The pacing and production values are top tier. Thanks for putting this together!",
        publishedAt: new Date().toISOString(),
        likeCount: 42
      },
      {
        id: "fb-2",
        authorName: kidsMode ? "SpaceExplorer 🚀" : "Hana Sato",
        authorAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=hana",
        textDisplay: kidsMode ? "WOW! I learned so many fun secrets today. 🪐" : "An absolute masterpiece. Found this highly educational and beautifully put together.",
        publishedAt: new Date().toISOString(),
        likeCount: 18
      },
      {
        id: "fb-3",
        authorName: kidsMode ? "NatureLover 🦁" : "Marcus Brody",
        authorAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=marcus",
        textDisplay: kidsMode ? "Super fun! Showing this to my baby sister next! 🐾" : "Outstanding breakdown! Extremely clean visuals and sound design.",
        publishedAt: new Date().toISOString(),
        likeCount: 9
      }
    ];
    setComments(fallback);
  };

  // Run Gemini AI Video Summarization
  const handleSummarize = async () => {
    if (aiSummary) {
      setActiveTab("ai");
      return;
    }
    
    setIsSummarizing(true);
    setActiveTab("ai");
    
    try {
      const res = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: video.title,
          description: video.description,
          channelTitle: video.channelTitle,
          tags: video.tags || []
        })
      });
      
      const data = await res.json();
      if (data.summary) {
        setAiSummary(data);
      }
    } catch (err) {
      console.error("AI summarization error:", err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Add custom comment locally
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: YouTubeComment = {
      id: "local-" + Math.random().toString(),
      authorName: kidsMode ? "Happy Explorer 🌟" : "CurrentUser (Synced)",
      authorAvatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${commentInput}`,
      textDisplay: commentInput,
      publishedAt: new Date().toISOString(),
      likeCount: 0
    };

    setComments([newComment, ...comments]);
    setCommentInput("");
  };

  // Animated Simulated Offline Download Process
  const handleDownload = () => {
    if (isDownloaded) {
      onToggleDownload(video); // delete it
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onToggleDownload(video);
            setIsDownloading(false);
            setDownloadProgress(null);
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 10;
      });
    }, 250);
  };

  return (
    <motion.div
      id="player-modal-backdrop"
      className={`fixed z-50 flex items-center justify-center transition-all duration-500 ${
        isAudioMode 
          ? "bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 h-[72px] bg-transparent p-0 pointer-events-none" 
          : "inset-0 p-0 md:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto"
      }`}
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
    >
      <motion.div
        id="player-modal-content"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`w-full overflow-hidden shadow-2xl border transition-all duration-500 pointer-events-auto ${
          isAudioMode
            ? `h-[72px] rounded-2xl flex flex-row items-center p-3 gap-3 ${kidsMode ? "bg-rose-100 border-rose-300" : "bg-black/95 border-white/10"}`
            : `flex flex-col max-w-6xl xl:max-w-[85vw] h-full md:h-[90vh] rounded-none md:rounded-3xl ${kidsMode ? "bg-rose-50/98 border-rose-200 text-rose-950" : "bg-[#09090e]/95 border-white/10 text-gray-200"}`
        } ${fontSizeClass}`}
      >
                <div className={`w-full h-full flex flex-row items-center p-3 gap-3 ${!isAudioMode ? "hidden" : ""}`}>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-white">{video.title}</p>
              <p className="text-[10px] text-gray-400 truncate">Playing in background...</p>
            </div>
            <button id="minimize-close-btn" onClick={() => setIsAudioMode(false)} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors cursor-pointer shrink-0">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button id="minimize-exit-btn" onClick={onClose} className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 transition-colors cursor-pointer shrink-0">
              <X className="w-4 h-4" />
            </button>
        </div>
        <div className={`flex flex-col w-full h-full overflow-hidden ${isAudioMode ? "opacity-0 absolute pointer-events-none w-px h-px overflow-hidden" : ""}`}>
            {/* Top Header Controls */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          kidsMode ? "border-rose-100 bg-rose-100/50" : "border-white/5 bg-white/2"
        }`}>
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
              kidsMode ? "bg-rose-200 text-rose-700" : "bg-red-500/10 text-red-400 border border-red-500/15"
            }`}>
              <SignalHigh className="w-3.5 h-3.5" />
              <span>Theater Mode</span>
            </span>
            <p className="text-xs text-gray-400 max-w-[200px] md:max-w-md truncate font-medium">
              {video.title}
            </p>
          </div>

          <button
            id="close-player-btn"
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              kidsMode ? "hover:bg-rose-200 text-rose-900" : "hover:bg-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Layout Split */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Panel: YouTube embed player */}
          <div className="flex-1 flex flex-col bg-black">
            <div className="relative aspect-video w-full flex-1 max-h-[60vh] lg:max-h-none">
              <iframe
                id="youtube-player-frame"
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&enablejsapi=1&origin=${window.location.origin}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                allowFullScreen
                className="w-full h-full object-cover"
              />
            </div>

            {/* Quick action bar beneath the video */}
            <div className={`flex items-center gap-2 px-6 py-3.5 border-t overflow-x-auto no-scrollbar ${
              kidsMode ? "bg-rose-50/50 border-rose-100" : "bg-[#0b0b12] border-white/5"
            }`}>
                <button
                  id="like-video-btn"
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    liked 
                      ? kidsMode 
                        ? "bg-rose-500 text-white" 
                        : "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                      : kidsMode 
                        ? "bg-rose-200/50 text-rose-900 hover:bg-rose-200" 
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                  <span>{liked ? "Liked!" : "Like"}</span>
                </button>
                <button
                  id="sparkle-ai-btn"
                  onClick={handleSummarize}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs shrink-0 font-semibold transition-all cursor-pointer ${
                    kidsMode
                      ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white hover:opacity-90"
                      : "bg-gradient-to-r from-red-600 via-rose-600 to-violet-600 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.35)]"
                  }`}
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>AI Summary</span>
                </button>
                <button
                  id="share-video-btn"
                  onClick={async () => {
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: video.title,
                          text: `Check out this video: ${video.title}`,
                          url: `https://www.youtube.com/watch?v=${video.id}`
                        });
                      } else {
                        navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${video.id}`);
                        alert("Link copied to clipboard!");
                      }
                    } catch (err) {
                      console.error("Error sharing", err);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 shrink-0 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    kidsMode 
                      ? "bg-rose-200/50 text-rose-900 hover:bg-rose-200" 
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  id="audio-mode-btn"
                  onClick={() => setIsAudioMode(true)}
                  className={`flex items-center shrink-0 gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    kidsMode 
                      ? "bg-rose-200/50 text-rose-900 hover:bg-rose-200" 
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                  <span>Audio</span>
                </button>
                
                {onToggleVault && (
                  <button
                    onClick={() => onToggleVault(video)}
                    title="Add to Secure Vault"
                    className="w-8 h-8 flex shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                )}

                <a 
                  href={`https://ssyoutube.com/watch?v=${video.id}`}
                  target="_blank" rel="noopener noreferrer"
                  className={`flex items-center shrink-0 gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    kidsMode 
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-200" 
                      : "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-gray-200"
                  }`}
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>Download MP4</span>
                </a>
                <button
                  id="download-video-btn"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isDownloaded 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : kidsMode
                        ? "bg-rose-200/50 text-rose-900 hover:bg-rose-200"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {isDownloading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
                      <span>{Math.min(downloadProgress || 0, 100)}% Caching...</span>
                    </div>
                  ) : isDownloaded ? (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Offline</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Simulate Offline</span>
                    </>
                  )}
                </button>
                <button className={`flex shrink-0 items-center justify-center w-8 h-8 rounded-full font-bold text-sm cursor-pointer ${kidsMode ? "bg-rose-200 text-rose-900" : "bg-white/10 text-white"}`}>
                  0
                </button>
            </div>
          </div>

          {/* Right Panel: Side Panel Tabs */}
          <div className={`w-full lg:w-[400px] flex flex-col border-l overflow-hidden ${
            kidsMode ? "bg-rose-50/50 border-rose-100" : "bg-[#0b0b12] border-white/5"
          }`}>
            {/* Tab bar header */}
            <div className={`flex border-b ${
              kidsMode ? "border-rose-100 bg-rose-100/20" : "border-white/5"
            }`}>
              <button
                id="tab-info"
                onClick={() => setActiveTab("info")}
                className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "info"
                    ? kidsMode ? "border-rose-500 text-rose-600" : "border-red-500 text-white bg-white/2"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                About
              </button>
              <button
                id="tab-comments"
                onClick={() => setActiveTab("comments")}
                className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "comments"
                    ? kidsMode ? "border-rose-500 text-rose-600" : "border-red-500 text-white bg-white/2"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                Comments ({comments.length})
              </button>
              <button
                id="tab-ai"
                onClick={() => setActiveTab("ai")}
                className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  activeTab === "ai"
                    ? kidsMode ? "border-rose-500 text-rose-600" : "border-red-500 text-white bg-white/2"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>AI Insights</span>
              </button>
            </div>

            {/* Tab content wrapper */}
            <div className="flex-1 overflow-y-auto p-5">
              {activeTab === "info" && (
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-display text-base font-bold mb-2 ${kidsMode ? "text-rose-950" : "text-white"}`}>
                      {video.title}
                    </h3>
                    <p className={`text-[11px] font-semibold ${kidsMode ? "text-rose-600" : "text-red-400"}`}>
                      Published by {video.channelTitle}
                    </p>
                  </div>

                  {/* Descriptions block with clean scroll */}
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed max-h-[300px] overflow-y-auto ${
                    kidsMode ? "bg-white border border-rose-100" : "bg-white/2 border border-white/5 text-gray-300"
                  }`}>
                    {video.description || "No description provided."}
                  </div>

                  {/* Video tags */}
                  {video.tags && video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {video.tags.slice(0, 8).map((tag, i) => (
                        <span key={i} className={`px-2.5 py-1 rounded-lg text-[10px] font-medium tracking-wide ${
                          kidsMode ? "bg-rose-100 text-rose-800" : "bg-white/5 text-gray-400"
                        }`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "comments" && (
                <div className="flex flex-col h-full gap-4">
                  {/* Custom comment form */}
                  <form onSubmit={handleAddComment} className="flex gap-2 shrink-0">
                    <input
                      id="comment-input"
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder={kidsMode ? "Type a happy safe comment... 🌸" : "Add a public comment..."}
                      className={`flex-1 px-3 py-2.5 text-xs rounded-xl outline-none border transition-all ${
                        kidsMode
                          ? "bg-white border-rose-200 text-rose-950 focus:border-rose-400"
                          : "bg-white/3 border-white/10 text-white focus:border-red-500/50"
                      }`}
                    />
                    <button
                      id="post-comment-btn"
                      type="submit"
                      className={`px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        kidsMode
                          ? "bg-rose-500 text-white hover:bg-rose-600"
                          : "bg-red-600 hover:bg-red-500 text-white"
                      }`}
                    >
                      Post
                    </button>
                  </form>

                  {/* Comment list */}
                  <div className="flex-1 space-y-3.5 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3 items-start">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-8 h-8 rounded-full bg-white/5 shrink-0 border border-white/10 object-cover"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className={`text-[11px] font-bold ${kidsMode ? "text-rose-900" : "text-gray-300"}`}>
                            {comment.authorName}
                          </span>
                          <span className={`text-xs mt-0.5 leading-relaxed ${kidsMode ? "text-rose-950" : "text-gray-400"}`}>
                            {comment.textDisplay}
                          </span>
                          <span className="text-[9px] text-gray-500 mt-1 flex items-center gap-1">
                            <ThumbsUp className="w-2.5 h-2.5" />
                            {formatViews(comment.likeCount)} likes
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "ai" && (
                <div className="space-y-4">
                  {isSummarizing ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className={`w-8 h-8 ${kidsMode ? "text-rose-400" : "text-amber-400 animate-pulse"}`} />
                      </motion.div>
                      <p className={`text-xs font-semibold ${kidsMode ? "text-rose-700" : "text-gray-300"}`}>
                        Gemini is analyzing this video feed...
                      </p>
                      <p className="text-[10px] text-gray-500 max-w-xs">
                        Reading description transcripts, mapping learning outcomes, and assessing safety ratings...
                      </p>
                    </div>
                  ) : aiSummary ? (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* Mood and Safety header badges */}
                      <div className="flex gap-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          kidsMode ? "bg-teal-50 text-teal-700 border border-teal-200" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                        }`}>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Safety: {aiSummary.kidsSafety.split(" ")[0]}</span>
                        </span>

                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/15">
                          <Smile className="w-3.5 h-3.5" />
                          <span>Vibe: {aiSummary.sentiment}</span>
                        </span>
                      </div>

                      {/* AI Summary Box */}
                      <div className={`p-4 rounded-2xl border ${
                        kidsMode ? "bg-white border-rose-100" : "bg-[#0f0f18] border-white/5"
                      }`}>
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1 ${
                          kidsMode ? "text-rose-500" : "text-amber-400"
                        }`}>
                          <Sparkles className="w-3 h-3" />
                          AI Narrative
                        </p>
                        <p className={`text-xs leading-relaxed ${kidsMode ? "text-rose-950" : "text-gray-300"}`}>
                          {aiSummary.summary}
                        </p>
                      </div>

                      {/* AI Bullets */}
                      <div className={`p-4 rounded-2xl border ${
                        kidsMode ? "bg-white border-rose-100" : "bg-[#0f0f18] border-white/5"
                      }`}>
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-2.5 ${
                          kidsMode ? "text-rose-500" : "text-amber-400"
                        }`}>
                          Key Insights & Secrets
                        </p>
                        <ul className="space-y-2 text-xs">
                          {aiSummary.bullets.map((bullet, i) => (
                            <li key={i} className="flex gap-2 items-start leading-relaxed">
                              <span className={`text-base mt-0.5 ${kidsMode ? "text-rose-500" : "text-rose-500"}`}>•</span>
                              <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Kids Mode rating detail */}
                      <div className="p-3.5 rounded-xl bg-teal-500/5 border border-teal-500/15 text-[11px] leading-relaxed text-gray-400">
                        <span className="font-bold text-teal-400 mr-1">Kids Safe Check:</span>
                        {aiSummary.kidsSafety}
                      </div>

                      {/* Chat Interface */}
                      <div className={`mt-4 pt-4 border-t ${kidsMode ? "border-rose-100" : "border-white/10"}`}>
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-3 ${kidsMode ? "text-rose-500" : "text-amber-400"}`}>
                          Ask Gemini
                        </p>
                        
                        <div className="space-y-3 mb-3 max-h-40 overflow-y-auto no-scrollbar">
                          {chatMessages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                              <span className={`text-[10px] mb-1 opacity-50 uppercase tracking-widest font-bold ${kidsMode ? "text-rose-800" : "text-white"}`}>
                                {msg.role === "user" ? "You" : "Gemini"}
                              </span>
                              <div className={`p-3 rounded-2xl text-xs max-w-[90%] leading-relaxed ${
                                msg.role === "user" 
                                  ? kidsMode ? "bg-rose-500 text-white rounded-br-none" : "bg-red-600 text-white rounded-br-none"
                                  : kidsMode ? "bg-white border border-rose-100 text-rose-950 rounded-bl-none" : "bg-white/5 border border-white/10 text-gray-300 rounded-bl-none"
                              }`}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                          {isChatting && (
                            <div className="flex flex-col items-start">
                              <div className={`p-3 rounded-2xl text-xs ${kidsMode ? "bg-white border border-rose-100 rounded-bl-none" : "bg-white/5 border border-white/10 rounded-bl-none"}`}>
                                <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 relative">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") handleChat();
                            }}
                            placeholder="Ask about this video..."
                            className={`w-full px-4 py-2.5 pr-10 rounded-xl text-xs outline-none transition-all ${
                              kidsMode 
                                ? "bg-white border border-rose-200 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200" 
                                : "bg-white/5 border border-white/10 text-white focus:border-red-500 focus:bg-white/10"
                            }`}
                          />
                          <button 
                            onClick={handleChat}
                            disabled={!chatInput.trim() || isChatting}
                            className={`absolute right-2 p-1.5 rounded-lg transition-colors ${
                              !chatInput.trim() || isChatting
                                ? "opacity-50 cursor-not-allowed text-gray-500"
                                : kidsMode ? "text-rose-600 hover:bg-rose-50" : "text-white hover:bg-white/10"
                            }`}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                      <Sparkles className="w-8 h-8 text-gray-600" />
                      <p className="text-xs text-gray-400">No summary loaded yet.</p>
                      <button
                        id="generate-summary-panel-btn"
                        onClick={handleSummarize}
                        className={`mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                          kidsMode ? "bg-rose-500 hover:bg-rose-600" : "bg-red-600 hover:bg-red-500"
                        }`}
                      >
                        Generate AI Summary Insights
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
              </div>
      </motion.div>
    </motion.div>
  );
}
