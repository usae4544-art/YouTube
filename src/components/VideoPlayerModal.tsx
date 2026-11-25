import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  X,
  Sparkles,
  Heart,
  ThumbsUp,
  Share2,
  Smile,
  ShieldCheck,
  RefreshCw,
  SignalHigh,
  Headphones,
  Maximize2,
  Lock,
  Send,
  ExternalLink,
} from "lucide-react";
import { YouTubeVideo, YouTubeComment, AISummary } from "../types";
import { formatViews } from "../utils";
import {
  chatVideoClient,
  fetchCommentsClient,
  openExternalLink,
  summarizeVideoClient,
} from "../lib/nexusBridge";

interface VideoPlayerModalProps {
  video: YouTubeVideo;
  onClose: () => void;
  kidsMode: boolean;
  fontSizeClass: string;
  onToggleVault?: (video: YouTubeVideo) => void;
  onToggleFavorite?: (video: YouTubeVideo) => void;
  isFavorite?: boolean;
}

export default function VideoPlayerModal({
  video,
  onClose,
  kidsMode,
  fontSizeClass,
  onToggleVault,
  onToggleFavorite,
  isFavorite = false,
}: VideoPlayerModalProps) {
  const [comments, setComments] = useState<YouTubeComment[]>([]);
  const [likedCommentIds, setLikedCommentIds] = useState<Set<string>>(new Set());
  const [commentInput, setCommentInput] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [isChatting, setIsChatting] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "comments" | "ai">("info");
  const [liked, setLiked] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [shareNote, setShareNote] = useState("");

  useEffect(() => {
    let active = true;
    const generateFallbackComments = () => {
      const fallback: YouTubeComment[] = [
        {
          id: "fb-1",
          authorName: kidsMode ? "SuperTeddy" : "Alex Rivera",
          authorAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=alex",
          textDisplay: kidsMode
            ? "This is my favorite video ever! So colorful!"
            : "The pacing and clarity are great. Thanks for sharing!",
          publishedAt: new Date().toISOString(),
          likeCount: 42,
        },
        {
          id: "fb-2",
          authorName: kidsMode ? "SpaceExplorer" : "Hana Sato",
          authorAvatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=hana",
          textDisplay: kidsMode
            ? "WOW! I learned so many fun stories today!"
            : "Very peaceful and informative stream.",
          publishedAt: new Date().toISOString(),
          likeCount: 18,
        },
      ];
      if (active) setComments(fallback);
    };

    const loadComments = async () => {
      const loaded = await fetchCommentsClient(video.id);
      if (!active) return;
      if (loaded && loaded.length > 0) {
        setComments(loaded);
      } else {
        generateFallbackComments();
      }
    };

    setAiSummary(null);
    setChatMessages([]);
    loadComments();
    return () => {
      active = false;
    };
  }, [video.id, kidsMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const handleOnline = () => setRetryKey((prev) => prev + 1);
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const handleSummarize = async () => {
    setActiveTab("ai");
    if (aiSummary) return;

    setIsSummarizing(true);
    try {
      const summary = await summarizeVideoClient(video);
      setAiSummary(summary);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || isChatting) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsChatting(true);

    try {
      const reply = await chatVideoClient({ message: userMsg, video, kidsMode });
      setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: YouTubeComment = {
      id: "local-" + Date.now(),
      authorName: kidsMode ? "Happy Explorer" : "You",
      authorAvatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(
        commentInput,
      )}`,
      textDisplay: commentInput.trim(),
      publishedAt: new Date().toISOString(),
      likeCount: 0,
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentInput("");
  };

  const toggleCommentLike = (id: string) => {
    setLikedCommentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShare = async () => {
    const url = `https://www.youtube.com/watch?v=${video.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: `Check out this video: ${video.title}`,
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareNote("Link copied!");
        setTimeout(() => setShareNote(""), 2000);
      } else {
        openExternalLink(url);
      }
    } catch {
      openExternalLink(url);
    }
  };

  return (
    <motion.div
      id="player-modal-backdrop"
      className={`fixed z-50 flex items-center justify-center transition-all duration-300 ${
        isAudioMode
          ? "bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 h-[72px] bg-transparent p-0 pointer-events-none"
          : "inset-0 p-0 md:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        id="player-modal-content"
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.96 }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className={`w-full overflow-hidden shadow-2xl border transition-all duration-300 pointer-events-auto ${
          isAudioMode
            ? `h-[72px] rounded-2xl flex flex-row items-center p-3 gap-3 ${
                kidsMode
                  ? "bg-rose-100 border-rose-300 text-rose-950"
                  : "bg-[#111118]/95 border-white/15 text-white"
              }`
            : `flex flex-col max-w-6xl xl:max-w-[85vw] h-full md:h-[90vh] rounded-none md:rounded-3xl ${
                kidsMode
                  ? "bg-rose-50/98 border-rose-200 text-rose-950"
                  : "bg-[#09090e]/95 border-white/10 text-gray-200"
              }`
        } ${fontSizeClass}`}
      >
        {isAudioMode && (
          <div className="w-full h-full flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{video.title}</p>
              <p className="text-[10px] opacity-70 truncate">
                Playing in mini audio mode
              </p>
            </div>
            <button
              id="minimize-close-btn"
              onClick={() => setIsAudioMode(false)}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors cursor-pointer shrink-0"
              title="Expand Player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              id="minimize-exit-btn"
              onClick={onClose}
              className="p-2 bg-red-500/15 text-red-500 rounded-full hover:bg-red-500/25 transition-colors cursor-pointer shrink-0"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div
          className={`flex flex-col w-full h-full overflow-hidden ${
            isAudioMode
              ? "opacity-0 absolute pointer-events-none w-px h-px overflow-hidden"
              : ""
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-4 sm:px-6 py-3.5 border-b ${
              kidsMode
                ? "border-rose-100 bg-rose-100/50"
                : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                  kidsMode
                    ? "bg-rose-200 text-rose-700"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                <SignalHigh className="w-3.5 h-3.5" />
                <span>Theater</span>
              </span>
              <p className="text-xs opacity-75 truncate font-medium">
                {video.title}
              </p>
            </div>

            <button
              id="close-player-btn"
              onClick={onClose}
              className={`p-2 rounded-full transition-colors cursor-pointer shrink-0 ${
                kidsMode
                  ? "hover:bg-rose-200 text-rose-900"
                  : "hover:bg-white/10 text-gray-400 hover:text-white"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Video Stage */}
            <div className="flex flex-col bg-black lg:flex-1 shrink-0">
              <div className="relative aspect-video w-full lg:flex-1 max-h-[45vh] lg:max-h-none bg-black">
                <iframe
                  key={`yt-${video.id}-${retryKey}`}
                  id="youtube-player-frame"
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1&enablejsapi=1`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Action Bar */}
              <div
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 border-t overflow-x-auto hide-scrollbar ${
                  kidsMode
                    ? "bg-rose-50/80 border-rose-100"
                    : "bg-[#0b0b12] border-white/10"
                }`}
              >
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  id="like-video-btn"
                  onClick={() => setLiked((p) => !p)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    liked
                      ? kidsMode
                        ? "bg-rose-500 text-white"
                        : "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                      : kidsMode
                        ? "bg-rose-200/60 text-rose-900 hover:bg-rose-200"
                        : "bg-white/10 text-gray-200 hover:bg-white/15"
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                  <span>{liked ? "Liked" : "Like"}</span>
                </motion.button>

                {onToggleFavorite && (
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onToggleFavorite(video)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                      isFavorite
                        ? "bg-rose-500 text-white shadow-lg"
                        : kidsMode
                          ? "bg-rose-200/60 text-rose-900 hover:bg-rose-200"
                          : "bg-white/10 text-gray-200 hover:bg-white/15"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                    <span>{isFavorite ? "Saved" : "Favorite"}</span>
                  </motion.button>
                )}

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  id="sparkle-ai-btn"
                  onClick={handleSummarize}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs shrink-0 font-semibold transition-all cursor-pointer ${
                    kidsMode
                      ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white"
                      : "bg-gradient-to-r from-red-600 via-rose-600 to-violet-600 text-white"
                  }`}
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>AI Summary</span>
                </motion.button>

                <button
                  id="share-video-btn"
                  onClick={handleShare}
                  className={`flex items-center gap-1.5 px-3.5 py-2 shrink-0 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    kidsMode
                      ? "bg-rose-200/60 text-rose-900 hover:bg-rose-200"
                      : "bg-white/10 text-gray-200 hover:bg-white/15"
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>{shareNote || "Share"}</span>
                </button>

                <button
                  id="audio-mode-btn"
                  onClick={() => setIsAudioMode(true)}
                  className={`flex items-center shrink-0 gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    kidsMode
                      ? "bg-rose-200/60 text-rose-900 hover:bg-rose-200"
                      : "bg-white/10 text-gray-200 hover:bg-white/15"
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                  <span>Audio</span>
                </button>

                <button
                  onClick={() =>
                    openExternalLink(`https://www.youtube.com/watch?v=${video.id}`)
                  }
                  className={`flex items-center shrink-0 gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    kidsMode
                      ? "bg-rose-200/60 text-rose-900 hover:bg-rose-200"
                      : "bg-white/10 text-gray-200 hover:bg-white/15"
                  }`}
                  title="Open in YouTube App"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>YouTube</span>
                </button>

                {onToggleVault && (
                  <button
                    onClick={() => onToggleVault(video)}
                    title="Add to Secure Vault"
                    className="w-9 h-9 flex shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Panel Tabs */}
            <div
              className={`flex-1 lg:flex-none lg:w-[400px] flex flex-col border-t lg:border-t-0 lg:border-l overflow-hidden ${
                kidsMode
                  ? "bg-rose-50/70 border-rose-100"
                  : "bg-[#0b0b12] border-white/10"
              }`}
            >
              <div
                className={`flex border-b relative ${
                  kidsMode ? "border-rose-100 bg-rose-100/30" : "border-white/10"
                }`}
              >
                {(
                  [
                    { id: "info", label: "Details" },
                    { id: "comments", label: `Comments (${comments.length})` },
                    { id: "ai", label: "AI Insights" },
                  ] as const
                ).map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`tab-${tab.id}`}
                      onClick={() =>
                        tab.id === "ai" ? handleSummarize() : setActiveTab(tab.id)
                      }
                      className={`flex-1 py-3 text-center text-[11px] font-bold uppercase tracking-wider relative transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                        active
                          ? kidsMode
                            ? "text-rose-600"
                            : "text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {tab.id === "ai" && (
                        <Sparkles className="w-3 h-3 text-amber-400" />
                      )}
                      <span>{tab.label}</span>
                      {active && (
                        <motion.div
                          layoutId="playerActiveTab"
                          className={`absolute bottom-0 inset-x-2 h-0.5 rounded-full ${
                            kidsMode ? "bg-rose-500" : "bg-red-500"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                {activeTab === "info" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3
                        className={`font-display text-base font-bold mb-1.5 ${
                          kidsMode ? "text-rose-950" : "text-white"
                        }`}
                      >
                        {video.title}
                      </h3>
                      <p
                        className={`text-xs font-semibold ${
                          kidsMode ? "text-rose-600" : "text-red-400"
                        }`}
                      >
                        {video.channelTitle}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed max-h-[260px] overflow-y-auto ${
                        kidsMode
                          ? "bg-white border border-rose-100 text-rose-900"
                          : "bg-white/5 border border-white/10 text-gray-300"
                      }`}
                    >
                      {video.description || "No description provided."}
                    </div>

                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {video.tags.slice(0, 8).map((tag, i) => (
                          <span
                            key={i}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-medium ${
                              kidsMode
                                ? "bg-rose-100 text-rose-800"
                                : "bg-white/5 text-gray-400"
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "comments" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col h-full gap-4"
                  >
                    <form onSubmit={handleAddComment} className="flex gap-2 shrink-0">
                      <input
                        id="comment-input"
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder={
                          kidsMode
                            ? "Type a kind comment..."
                            : "Add a comment..."
                        }
                        className={`flex-1 px-3 py-2.5 text-xs rounded-xl outline-none border transition-all ${
                          kidsMode
                            ? "bg-white border-rose-200 text-rose-950 focus:border-rose-400"
                            : "bg-white/5 border-white/10 text-white focus:border-red-500/50"
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

                    <div className="flex-1 space-y-3.5 overflow-y-auto">
                      {comments.map((comment) => {
                        const isCommentLiked = likedCommentIds.has(comment.id);
                        return (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-3 items-start"
                          >
                            <img
                              src={comment.authorAvatar}
                              alt={comment.authorName}
                              className="w-8 h-8 rounded-full bg-white/5 shrink-0 border border-white/10 object-cover"
                            />
                            <div className="flex flex-col min-w-0 flex-1">
                              <span
                                className={`text-[11px] font-bold ${
                                  kidsMode ? "text-rose-900" : "text-gray-200"
                                }`}
                              >
                                {comment.authorName}
                              </span>
                              <span
                                className={`text-xs mt-0.5 leading-relaxed ${
                                  kidsMode ? "text-rose-950" : "text-gray-400"
                                }`}
                              >
                                {comment.textDisplay}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleCommentLike(comment.id)}
                                className={`text-[10px] mt-1 flex items-center gap-1 w-fit ${
                                  isCommentLiked
                                    ? "text-rose-400 font-bold"
                                    : "text-gray-500 hover:text-gray-300"
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                {formatViews(
                                  comment.likeCount + (isCommentLiked ? 1 : 0),
                                )}{" "}
                                likes
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {activeTab === "ai" && (
                  <div className="space-y-4">
                    {isSummarizing ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Sparkles
                            className={`w-8 h-8 ${
                              kidsMode ? "text-rose-400" : "text-amber-400"
                            }`}
                          />
                        </motion.div>
                        <p
                          className={`text-xs font-semibold ${
                            kidsMode ? "text-rose-700" : "text-gray-300"
                          }`}
                        >
                          Analyzing video insights...
                        </p>
                      </div>
                    ) : aiSummary ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="flex gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                              kidsMode
                                ? "bg-teal-50 text-teal-700 border border-teal-200"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>
                              Safety: {aiSummary.kidsSafety.split(" ")[0]}
                            </span>
                          </span>

                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1">
                            <Smile className="w-3.5 h-3.5" />
                            <span>{aiSummary.sentiment}</span>
                          </span>
                        </div>

                        <div
                          className={`p-4 rounded-2xl border ${
                            kidsMode
                              ? "bg-white border-rose-100"
                              : "bg-[#0f0f18] border-white/10"
                          }`}
                        >
                          <p
                            className={`text-[10px] uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1 ${
                              kidsMode ? "text-rose-500" : "text-amber-400"
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            AI Summary
                          </p>
                          <p
                            className={`text-xs leading-relaxed ${
                              kidsMode ? "text-rose-950" : "text-gray-300"
                            }`}
                          >
                            {aiSummary.summary}
                          </p>
                        </div>

                        <div
                          className={`p-4 rounded-2xl border ${
                            kidsMode
                              ? "bg-white border-rose-100"
                              : "bg-[#0f0f18] border-white/10"
                          }`}
                        >
                          <p
                            className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${
                              kidsMode ? "text-rose-500" : "text-amber-400"
                            }`}
                          >
                            Highlights
                          </p>
                          <ul className="space-y-1.5 text-xs">
                            {aiSummary.bullets.map((bullet, i) => (
                              <li key={i} className="flex gap-2 items-start">
                                <span className="text-rose-500">•</span>
                                <span
                                  className={
                                    kidsMode ? "text-rose-900" : "text-gray-300"
                                  }
                                >
                                  {bullet}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div
                          className={`mt-4 pt-4 border-t ${
                            kidsMode ? "border-rose-100" : "border-white/10"
                          }`}
                        >
                          <p
                            className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${
                              kidsMode ? "text-rose-500" : "text-amber-400"
                            }`}
                          >
                            Ask About Video
                          </p>

                          <div className="space-y-2.5 mb-3 max-h-36 overflow-y-auto hide-scrollbar">
                            {chatMessages.map((msg, i) => (
                              <div
                                key={i}
                                className={`flex flex-col ${
                                  msg.role === "user" ? "items-end" : "items-start"
                                }`}
                              >
                                <div
                                  className={`p-2.5 rounded-2xl text-xs max-w-[90%] leading-relaxed ${
                                    msg.role === "user"
                                      ? kidsMode
                                        ? "bg-rose-500 text-white rounded-br-none"
                                        : "bg-red-600 text-white rounded-br-none"
                                      : kidsMode
                                        ? "bg-white border border-rose-100 text-rose-950 rounded-bl-none"
                                        : "bg-white/5 border border-white/10 text-gray-300 rounded-bl-none"
                                  }`}
                                >
                                  {msg.text}
                                </div>
                              </div>
                            ))}
                            {isChatting && (
                              <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                            )}
                          </div>

                          <div className="flex items-center gap-2 relative">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleChat();
                              }}
                              placeholder="Ask about this video..."
                              className={`w-full px-3.5 py-2.5 pr-10 rounded-xl text-xs outline-none transition-all ${
                                kidsMode
                                  ? "bg-white border border-rose-200 text-rose-900 focus:border-rose-500"
                                  : "bg-white/5 border border-white/10 text-white focus:border-red-500"
                              }`}
                            />
                            <button
                              onClick={handleChat}
                              disabled={!chatInput.trim() || isChatting}
                              className={`absolute right-2 p-1.5 rounded-lg transition-colors ${
                                !chatInput.trim() || isChatting
                                  ? "opacity-50 text-gray-500"
                                  : kidsMode
                                    ? "text-rose-600 hover:bg-rose-50"
                                    : "text-white hover:bg-white/10"
                              }`}
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
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
