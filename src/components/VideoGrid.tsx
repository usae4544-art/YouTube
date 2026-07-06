import React from "react";
import { motion } from "motion/react";
import { Play, Eye, Calendar, Sparkles, AlertCircle } from "lucide-react";
import { YouTubeVideo } from "../types";

interface VideoGridProps {
  videos: YouTubeVideo[];
  onSelectVideo: (video: YouTubeVideo) => void;
  kidsMode: boolean;
  isLoading: boolean;
}

// Format views helper (e.g., 2304500 -> 2.3M)
function formatViews(viewsStr?: string): string {
  if (!viewsStr) return "120K views";
  const num = parseInt(viewsStr, 10);
  if (isNaN(num)) return viewsStr;
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M views";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K views";
  }
  return num + " views";
}

// Simple date parser (e.g., 2026-07-06T03:50:15Z -> 1 day ago)
function formatRelativeDate(dateStr?: string): string {
  if (!dateStr) return "recently";
  try {
    const published = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - published.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));

    if (diffMins < 60) return `${diffMins || 1}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return `${diffMonths || 1}mo ago`;
  } catch (e) {
    return "recent";
  }
}

export default function VideoGrid({ videos, onSelectVideo, kidsMode, isLoading }: VideoGridProps) {
  
  // Skeleton count helper
  const skeletons = Array.from({ length: 8 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 2xl:gap-8 p-1">
        {skeletons.map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className={`aspect-video w-full rounded-2xl animate-pulse ${
              kidsMode ? "bg-rose-100" : "bg-white/5"
            }`} />
            <div className="flex gap-3">
              <div className={`w-9 h-9 rounded-full shrink-0 animate-pulse ${
                kidsMode ? "bg-rose-200" : "bg-white/10"
              }`} />
              <div className="flex flex-col gap-2 w-full">
                <div className={`h-4 rounded-md w-[85%] animate-pulse ${
                  kidsMode ? "bg-rose-200" : "bg-white/10"
                }`} />
                <div className={`h-3.5 rounded-md w-[60%] animate-pulse ${
                  kidsMode ? "bg-rose-100" : "bg-white/5"
                }`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex flex-col items-center justify-center text-center py-16 px-4 rounded-3xl border ${
          kidsMode
            ? "bg-rose-50 border-rose-100 text-rose-800"
            : "bg-white/2 border-white/5 text-gray-400"
        }`}
      >
        <AlertCircle className={`w-12 h-12 mb-3 ${kidsMode ? "text-rose-400" : "text-gray-500"}`} />
        <h3 className={`font-display text-lg font-bold mb-1 ${kidsMode ? "text-rose-950" : "text-white"}`}>
          No videos found
        </h3>
        <p className="text-xs max-w-sm leading-relaxed">
          {kidsMode
            ? "Let's try searching for something else like 'Cute Puppies' or 'Space science cartoons'! 🌟🐕"
            : "Try adjusting your query or filters to discover new premium video streams."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 2xl:gap-8">
      {videos.map((video, index) => (
        <motion.div
          key={video.id + "-" + index}
          onClick={() => onSelectVideo(video)}
          whileTap={{ scale: 0.96 }}
          className={`group flex flex-col cursor-pointer rounded-2xl overflow-hidden transition-all duration-400 p-1 relative ${
            kidsMode
              ? "bg-white border border-rose-100 hover:shadow-[0_12px_30px_rgba(244,63,94,0.15)] hover:-translate-y-1.5"
              : "hover:bg-white/3 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1.5"
          }`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            damping: 18,
            stiffness: 100,
            delay: Math.min(index * 0.05, 0.4)
          }}
        >
          {/* Card Thumbnail Stage */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-inner bg-black">
            <img
              src={video.thumbnail}
              alt={video.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Dark glassmorphic hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-3.5 rounded-full bg-red-600/90 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Play className="w-5 h-5 fill-white translate-x-0.5" />
              </div>
            </div>

            {/* Video Duration (if available) */}
            {video.duration && (
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono bg-black/85 text-white tracking-widest border border-white/5">
                {video.duration}
              </span>
            )}
          </div>

          {/* Card Metadata Section */}
          <div className="flex gap-3 mt-3.5 px-1 pb-2">
            {/* Channel Avatar */}
            {kidsMode ? (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {video.channelTitle?.charAt(0) || "K"}
              </div>
            ) : (
              <img
                src={video.channelAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${video.channelId}`}
                alt={video.channelTitle}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full shrink-0 bg-white/5 object-cover"
              />
            )}

            <div className="flex flex-col min-w-0">
              {/* Title */}
              <h4 className={`font-medium line-clamp-2 text-xs leading-relaxed transition-colors tracking-wide ${
                kidsMode 
                  ? "text-rose-950 font-bold group-hover:text-rose-600" 
                  : "text-gray-100 group-hover:text-red-400"
              }`}>
                {video.title}
              </h4>

              {/* Creator / Channel Name */}
              <p className={`text-[11px] mt-1 flex items-center gap-1 font-sans ${
                kidsMode ? "text-rose-600 font-medium" : "text-gray-400 group-hover:text-gray-300"
              }`}>
                <span>{video.channelTitle}</span>
                {kidsMode && <Sparkles className="w-3 h-3 text-rose-400" />}
              </p>

              {/* Stats Bar */}
              <div className={`flex items-center gap-2 mt-1 text-[10px] ${
                kidsMode ? "text-rose-400" : "text-gray-500"
              }`}>
                <span className="flex items-center gap-1 shrink-0">
                  <Eye className="w-3 h-3" />
                  {formatViews(video.viewCount)}
                </span>
                <span className="shrink-0">•</span>
                <span className="flex items-center gap-1 shrink-0">
                  <Calendar className="w-3 h-3" />
                  {formatRelativeDate(video.publishedAt)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
