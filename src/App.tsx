import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Tv, Heart, Clock, DownloadCloud, Sparkles, User, Settings, 
  Lightbulb, RefreshCw, Eye, Calendar, Flame, Baby, LogOut, 
  Smartphone, Signal, WifiOff, Info, HelpCircle, ArrowRight,
  Smile, ZoomIn, ZoomOut, Volume2, Gamepad2, Music, Clapperboard, MonitorPlay,
  Upload, Radio, MessageCircle
} from "lucide-react";

import { YouTubeVideo, SyncSession } from "./types";
import IntroAnimation from "./components/IntroAnimation";
import SearchBar from "./components/SearchBar";
import VideoGrid from "./components/VideoGrid";
import VideoPlayerModal from "./components/VideoPlayerModal";
import SyncHub from "./components/SyncHub";

// -----------------------------------------------------------------
// RESILIENT PLAYGROUND FALLBACK VIDEOS
// (To ensure the app remains gorgeous and fully functional even if API quota is reached!)
// -----------------------------------------------------------------
const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: "9bZkp7q19f0",
    title: "PSY - GANGNAM STYLE (강남스타일) M/V",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qEA",
    channelTitle: "officialpsy",
    description: "Official Music Video for Gangnam Style. Visual feast and world-famous dance loops.",
    publishedAt: "2012-07-15T00:00:00Z",
    viewCount: "5100000000",
    likeCount: "28000000",
    duration: "4:12",
    tags: ["Music", "Gangnam Style", "K-pop", "Dance"]
  },
  {
    id: "fKopy74sxnw",
    title: "SpaceX Starship Flight Test Flight Mapped on Orbit",
    thumbnail: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE1",
    channelTitle: "SpaceX",
    description: "Starship's orbital trajectory and atmospheric reentry highlights. Watch the largest spacecraft ever built.",
    publishedAt: "2024-03-14T12:00:00Z",
    viewCount: "8900000",
    likeCount: "420000",
    duration: "10:35",
    tags: ["Space", "SpaceX", "Starship", "Rocket", "Engineering"]
  },
  {
    id: "R7OAtvT9jX4",
    title: "Nature Drone Footage 4K - Ultra HD Relaxation Tour",
    thumbnail: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE2",
    channelTitle: "Ambient Planet",
    description: "Soothing drone views of the world's most scenic waterfalls, lush green canyons, and high alpine ridges.",
    publishedAt: "2025-01-01T08:00:00Z",
    viewCount: "4500000",
    likeCount: "120000",
    duration: "25:00",
    tags: ["Relaxation", "Nature", "Drone", "4K", "Ambient"]
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Luis Fonsi - Despacito ft. Daddy Yankee",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE3",
    channelTitle: "LuisFonsiVEVO",
    description: "Luis Fonsi - Despacito ft. Daddy Yankee Music Video. Sunny beaches and addictive dance beats.",
    publishedAt: "2017-01-12T00:00:00Z",
    viewCount: "8400000000",
    likeCount: "53000000",
    duration: "4:41",
    tags: ["Music", "Despacito", "Dance", "Hits"]
  }
];

const FALLBACK_KIDS_VIDEOS: YouTubeVideo[] = [
  {
    id: "WRVsOCh907o",
    title: "Dinosaur Educational Facts - Cute Science Tour for Kids!",
    thumbnail: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE4",
    channelTitle: "DinoSchool",
    description: "Learn fun science facts about the Tyrannosaurus Rex, Triceratops, and flying Pterodactyls! Super safe and fun cartoons.",
    publishedAt: "2025-04-12T00:00:00Z",
    viewCount: "1200000",
    likeCount: "95000",
    duration: "8:22",
    tags: ["Kids", "Dinosaurs", "Science", "Cartoons", "Educational"]
  },
  {
    id: "lG8eB0zAn_Y",
    title: "Animated Nursery Rhymes and Safe Singalong Songs",
    thumbnail: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE5",
    channelTitle: "Melody Garden",
    description: "Bright colors, friendly animals, and cheerful singalong songs perfect for ages 2 to 7. Safely compiled nursery loops.",
    publishedAt: "2024-09-20T00:00:00Z",
    viewCount: "3400000",
    likeCount: "180000",
    duration: "12:15",
    tags: ["Kids", "Nursery Rhymes", "Singalong", "Music"]
  },
  {
    id: "3AenU5tXh2Q",
    title: "Space Secrets 101 - Planetary Adventures for Young Astronomers",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE6",
    channelTitle: "CosmicJunior",
    description: "Fly across the solar system! Discover glowing rings on Saturn, crater peaks on Mars, and how hot our Sun shines.",
    publishedAt: "2025-02-15T00:00:00Z",
    viewCount: "980000",
    likeCount: "75000",
    duration: "9:40",
    tags: ["Kids", "Space", "Science", "Education", "Solar System"]
  }
];

import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

export default function App() {
  // Navigation & view states
  const [introFinished, setIntroFinished] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "favorites" | "history" | "offline" | "live" | "profile" | "upload">("home");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Custom preference setups
  const [kidsMode, setKidsMode] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // User State
  const [user, setUser] = useState<GoogleUser | null>(() => {
    const savedUser = localStorage.getItem("nexus_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Sync state managers
  const [syncCode, setSyncCode] = useState("");
  const [favorites, setFavorites] = useState<YouTubeVideo[]>([]);
  const [watchHistory, setWatchHistory] = useState<YouTubeVideo[]>([]);
  const [downloadedVideos, setDownloadedVideos] = useState<YouTubeVideo[]>([]);

  // Videos search cache
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  // Modals state
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isSyncOpen, setIsSyncOpen] = useState(false);

  // Load Local Sync Cache and Offline Storage
  useEffect(() => {
    // Sync Code
    const savedCode = localStorage.getItem("nexus_sync_code");
    if (savedCode) {
      setSyncCode(savedCode);
      fetchSyncSession(savedCode);
    }

    // Favorites
    const savedFavs = localStorage.getItem("nexus_favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    // History
    const savedHist = localStorage.getItem("nexus_history");
    if (savedHist) setWatchHistory(JSON.parse(savedHist));

    // Offline Downloads
    const savedOffline = localStorage.getItem("nexus_offline");
    if (savedOffline) setDownloadedVideos(JSON.parse(savedOffline));
  }, []);

  // Fetch Videos (on category shift, search query shift, or Kids Mode toggle)
  useEffect(() => {
    if (!introFinished) return;
    
    // If we are currently simulating offline mode, do not trigger API requests
    if (isOfflineMode) return;

    fetchFeeds();
  }, [activeCategory, currentQuery, kidsMode, introFinished, isOfflineMode]);

  // Synchronize favorites/history back up to server whenever they change
  useEffect(() => {
    if (!syncCode || !introFinished) return;
    triggerServerSyncUpload();
  }, [favorites, watchHistory, kidsMode, fontSize, syncCode]);

  // -------------------------------------------------------------
  // DATA FETCH OPERATIONS
  // -------------------------------------------------------------
  const fetchFeeds = async () => {
    setIsLoading(true);
    try {
      let endpoint = `/api/youtube/search?maxResults=16&q=${encodeURIComponent("bhakti gyan uday guruji class 10 hindi")}&kidsMode=${kidsMode}`;
      
      // Category routing
      if (activeCategory !== "all" && !currentQuery) {
        endpoint = `/api/youtube/search?maxResults=16&q=${encodeURIComponent(activeCategory)}&kidsMode=${kidsMode}`;
      } else if (currentQuery) {
        endpoint = `/api/youtube/search?maxResults=16&q=${encodeURIComponent(currentQuery)}&kidsMode=${kidsMode}`;
      } else if (kidsMode) {
        // If Kids Mode is on and no query/category, fetch fun kids stuff
        endpoint = `/api/youtube/search?maxResults=16&q=educational+kids+cartoons+stories&kidsMode=true`;
      }

      const res = await fetch(endpoint);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        // Parse results
        const parsed: YouTubeVideo[] = data.items.map((item: any) => {
          const isSearch = item.id?.kind === "youtube:video" || !item.statistics;
          const vId = isSearch ? item.id.videoId : item.id;
          const snippet = item.snippet;
          
          return {
            id: vId,
            title: snippet.title,
            thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || "",
            channelId: snippet.channelId,
            channelTitle: snippet.channelTitle,
            description: snippet.description || "",
            publishedAt: snippet.publishedAt,
            viewCount: item.statistics?.viewCount,
            likeCount: item.statistics?.likeCount,
            duration: item.contentDetails?.duration 
              ? formatDurationISO(item.contentDetails.duration) 
              : "5:20"
          };
        });
        setVideos(parsed);
      } else {
        // Quota fallback / Error fallback
        setVideos(kidsMode ? FALLBACK_KIDS_VIDEOS : FALLBACK_VIDEOS);
      }
    } catch (e) {
      console.warn("YouTube Proxy failed or throttled. Initiating high-fidelity resilience fallback.", e);
      setVideos(kidsMode ? FALLBACK_KIDS_VIDEOS : FALLBACK_VIDEOS);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch full sync session from server
  const fetchSyncSession = async (code: string) => {
    try {
      const res = await fetch(`/api/sync/get/${code}`);
      if (res.status === 200) {
        const session: SyncSession = await res.json();
        applySyncSession(session);
      }
    } catch (err) {
      console.error("Could not fetch sync session:", err);
    }
  };

  // Upload current local states to synchronize with server database
  const triggerServerSyncUpload = async () => {
    try {
      await fetch(`/api/sync/update/${syncCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          favorites,
          history: watchHistory,
          preferences: {
            theme: kidsMode ? "kids" : "dark",
            kidsMode,
            fontSize
          }
        })
      });
    } catch (err) {
      console.error("Sync upload failed:", err);
    }
  };

  const applySyncSession = (session: SyncSession) => {
    if (session.favorites) {
      setFavorites(session.favorites);
      localStorage.setItem("nexus_favorites", JSON.stringify(session.favorites));
    }
    if (session.history) {
      setWatchHistory(session.history);
      localStorage.setItem("nexus_history", JSON.stringify(session.history));
    }
    if (session.preferences) {
      if (session.preferences.kidsMode !== undefined) setKidsMode(session.preferences.kidsMode);
      if (session.preferences.fontSize) setFontSize(session.preferences.fontSize);
    }
  };

  // -------------------------------------------------------------
  // INTERACTIVE FEEDBACK HANDLERS
  // -------------------------------------------------------------
  const handleSelectVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    
    // Add to Watch History (if not already the first element)
    const filtered = watchHistory.filter((item) => item.id !== video.id);
    const updated = [video, ...filtered].slice(0, 16); // keep last 16 views
    setWatchHistory(updated);
    localStorage.setItem("nexus_history", JSON.stringify(updated));
  };

  const handleToggleFavorite = (video: YouTubeVideo) => {
    const exists = favorites.some((item) => item.id === video.id);
    let updated: YouTubeVideo[] = [];
    if (exists) {
      updated = favorites.filter((item) => item.id !== video.id);
    } else {
      updated = [video, ...favorites];
    }
    setFavorites(updated);
    localStorage.setItem("nexus_favorites", JSON.stringify(updated));
  };

  const handleToggleDownload = (video: YouTubeVideo) => {
    const exists = downloadedVideos.some((item) => item.id === video.id);
    let updated: YouTubeVideo[] = [];
    if (exists) {
      updated = downloadedVideos.filter((item) => item.id !== video.id);
    } else {
      updated = [video, ...downloadedVideos];
    }
    setDownloadedVideos(updated);
    localStorage.setItem("nexus_offline", JSON.stringify(updated));
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    setWatchHistory([]);
    setFavorites([]);
    setDownloadedVideos([]);
    localStorage.removeItem("nexus_user");
    localStorage.removeItem("nexus_history");
    localStorage.removeItem("nexus_favorites");
    localStorage.removeItem("nexus_offline");
    localStorage.removeItem("nexus_sync_code");
    setActiveTab("home");
  };

  // Helper to format ISO YouTube Duration format (e.g. PT10M30S -> 10:30)
  const formatDurationISO = (duration: string): string => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "5:20";
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Get Accessible Text size Class
  const getFontSizeClass = () => {
    switch (fontSize) {
      case "sm": return "font-accessible-sm";
      case "lg": return "font-accessible-lg";
      case "xl": return "font-accessible-xl";
      default: return "font-accessible-md";
    }
  };

  // Filter video list based on Active tab
  const getDisplayedVideos = () => {
    if (isOfflineMode) {
      // Offline mode restricts views to ONLY downloaded local cache
      return downloadedVideos;
    }

    switch (activeTab) {
      case "favorites": return favorites;
      case "history": return watchHistory;
      case "offline": return downloadedVideos;
      default: return videos;
    }
  };

  // Category array based on Kids Mode
  const categories = kidsMode
    ? [
        { id: "all", name: "Safe Feeds 🎈", icon: Baby },
        { id: "cartoon+animation", name: "Cartoons 🧸", icon: Clapperboard },
        { id: "kids+learning+science", name: "Science Secrets 🪐", icon: Lightbulb },
        { id: "kids+toys+games", name: "Toy Fun 🦖", icon: Gamepad2 },
        { id: "kids+singalong+songs", name: "Nursery Rhymes 🎶", icon: Music }
      ]
    : [
        { id: "all", name: "Home", icon: Flame },
        { id: "bhakti", name: "Bhakti", icon: Music },
        { id: "gyan uday guruji class 10 hindi board", name: "Gyan Uday Guruji", icon: Lightbulb },
        { id: "study motivation", name: "Study Motivation", icon: ZoomIn },
        { id: "comedy viral clips", name: "Comedy & Fun", icon: Smile }
      ];

  return (
    <div className={`relative min-h-screen transition-all duration-700 overflow-x-hidden ${
      kidsMode
        ? "bg-gradient-to-tr from-[#ffeef2] via-[#fff5f7] to-[#eef9ff] text-rose-950"
        : "bg-[#040407] text-gray-100"
    } ${getFontSizeClass()}`}>
      
      {/* Intro splash cinematic animation */}
      <AnimatePresence>
        {!introFinished && (
          <IntroAnimation onComplete={() => setIntroFinished(true)} />
        )}
      </AnimatePresence>

      {/* Main Container Layer (Only shows after intro) */}
      <AnimatePresence>
        {introFinished && (
          <motion.div
            id="portal-main-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col h-screen"
          >
            {/* Ambient Background Spotlights (Premium Aesthetic) */}
            {!kidsMode && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[10%] left-[25%] w-[45%] h-[45%] rounded-full bg-red-600/5 blur-[120px] animate-glow-mesh-1" />
                <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/5 blur-[120px] animate-glow-mesh-2" />
              </div>
            )}

            {/* 1. TOP PREMIUM HEADER */}
            <header className={`sticky top-0 z-40 px-6 py-4 border-b shrink-0 transition-all ${
              kidsMode
                ? "bg-white/80 border-rose-100 backdrop-blur-md"
                : "bg-[#040407]/80 border-white/5 backdrop-blur-xl"
            }`}>
              <div className="max-w-screen-2xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-4 2xl:px-8">
                {/* Brand title */}
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setActiveTab("home"); setCurrentQuery(""); setActiveCategory("all"); }}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold relative overflow-hidden transition-transform active:scale-95 ${
                    kidsMode
                      ? "bg-gradient-to-tr from-rose-400 to-pink-500 shadow-lg shadow-rose-200"
                      : "bg-gradient-to-tr from-red-600 to-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] border border-red-500/20"
                  }`}>
                    <Tv className="w-5 h-5 text-white" />
                  </div>
                  <h1 className={`font-display text-xl font-black tracking-tight ${
                    kidsMode ? "text-rose-950" : "text-white"
                  }`}>
                    NEXUS<span className={kidsMode ? "text-rose-500" : "text-red-500"}>TV</span>
                  </h1>
                </div>

                {/* Search Bar Segment */}
                <div className="flex-1 max-w-xl w-full">
                  <SearchBar
                    onSearch={(q) => { setCurrentQuery(q); setActiveTab("home"); }}
                    kidsMode={kidsMode}
                    fontSizeClass={getFontSizeClass()}
                  />
                </div>

                {/* Right utility rail */}
                <div className="flex items-center gap-2">
                  {/* Kids Mode trigger */}
                  <button
                    id="toggle-kids-mode-btn"
                    onClick={() => {
                      setKidsMode(!kidsMode);
                      setActiveCategory("all");
                      setCurrentQuery("");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      kidsMode
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-200 hover:opacity-95"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                    title="Toggle Kid Safe Mode"
                  >
                    <Baby className="w-4 h-4 animate-bounce" />
                    <span>{kidsMode ? "Kids Mode Active" : "Kids Mode"}</span>
                  </button>

                  {/* Sync Manager */}
                  <button
                    id="open-sync-hub-btn"
                    onClick={() => setIsSyncOpen(true)}
                    className={`p-2.5 rounded-full transition-all relative cursor-pointer ${
                      syncCode
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : kidsMode
                          ? "bg-rose-100 text-rose-900"
                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                    title={syncCode ? `Linked: ${syncCode}` : "Cross-Device Sync"}
                  >
                    <RefreshCw className={`w-4 h-4 ${syncCode ? "animate-spin" : ""}`} />
                    {syncCode && (
                      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>

                  {/* Font Sizer */}
                  <div className={`flex items-center rounded-full overflow-hidden p-0.5 ${
                    kidsMode ? "bg-rose-100" : "bg-white/5"
                  }`}>
                    <button
                      id="font-size-dec"
                      onClick={() => setFontSize((p) => p === "xl" ? "lg" : p === "lg" ? "md" : "sm")}
                      className={`p-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                        kidsMode ? "text-rose-900 hover:bg-rose-200" : "text-gray-400 hover:text-white"
                      }`}
                      title="Smaller Text"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id="font-size-inc"
                      onClick={() => setFontSize((p) => p === "sm" ? "md" : p === "md" ? "lg" : "xl")}
                      className={`p-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                        kidsMode ? "text-rose-900 hover:bg-rose-200" : "text-gray-400 hover:text-white"
                      }`}
                      title="Larger Text"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Offline simulation warning banner */}
            {isOfflineMode && (
              <div className="bg-amber-600 text-white text-xs font-bold px-6 py-2 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 animate-bounce" />
                  <span>Currently offline mode. Serving cached local downloads ({downloadedVideos.length} videos available).</span>
                </div>
                <button
                  id="disable-offline-banner"
                  onClick={() => setIsOfflineMode(false)}
                  className="bg-white/15 px-3 py-1 rounded-lg text-[10px] hover:bg-white/25 transition-all"
                >
                  Go Back Online
                </button>
              </div>
            )}

            {/* 2. BODYSPLIT STAGE */}
            <div className="flex-1 flex overflow-hidden">
              {/* LEFT FLOATING NAVIGATION SIDEBAR */}
              <nav className={`hidden md:flex flex-col gap-2 p-4 w-60 lg:w-64 xl:w-72 2xl:w-80 border-r shrink-0 z-10 ${
                kidsMode ? "bg-rose-50/20 border-rose-150" : "bg-[#040407]/40 border-white/5"
              }`}>
                <button
                  id="nav-home-btn"
                  onClick={() => { setActiveTab("home"); setIsOfflineMode(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "home" && !isOfflineMode
                      ? kidsMode
                        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                        : "bg-white/5 border border-white/5 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      : kidsMode ? "hover:bg-rose-100 text-rose-900" : "text-gray-400 hover:text-white hover:bg-white/3"
                  }`}
                >
                  <Tv className="w-5 h-5" />
                  <span>Home</span>
                </button>

                <button
                  id="nav-shorts-btn"
                  onClick={() => { setActiveCategory("shorts"); setActiveTab("home"); setIsOfflineMode(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === "shorts" && activeTab === "home" && !isOfflineMode
                      ? kidsMode
                        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                        : "bg-white/5 border border-white/5 text-white"
                      : kidsMode ? "hover:bg-rose-100 text-rose-900" : "text-gray-400 hover:text-white hover:bg-white/3"
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Shorts</span>
                </button>
                
                <button
                  id="nav-subs-btn"
                  onClick={() => { setActiveTab("favorites"); setIsOfflineMode(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "favorites" && !isOfflineMode
                      ? kidsMode
                        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                        : "bg-white/5 border border-white/5 text-white"
                      : kidsMode ? "hover:bg-rose-100 text-rose-900" : "text-gray-400 hover:text-white hover:bg-white/3"
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Subscriptions</span>
                </button>

                <div className="my-3 border-t border-white/5" />

                <button
                  id="nav-profile-btn"
                  onClick={() => { setActiveTab("profile"); setIsOfflineMode(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "profile" && !isOfflineMode
                      ? kidsMode
                        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                        : "bg-white/5 border border-white/5 text-white"
                      : kidsMode ? "hover:bg-rose-100 text-rose-900" : "text-gray-400 hover:text-white hover:bg-white/3"
                  }`}
                >
                  <span className="font-display text-sm tracking-wide mr-1">You</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="nav-history-btn"
                  onClick={() => { setActiveTab("history"); setIsOfflineMode(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "history" && !isOfflineMode
                      ? kidsMode
                        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                        : "bg-white/5 border border-white/5 text-white"
                      : kidsMode ? "hover:bg-rose-100 text-rose-900" : "text-gray-400 hover:text-white hover:bg-white/3"
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span>History</span>
                </button>

                <div className="my-3 border-t border-white/5" />

                <p className={`text-[10px] uppercase font-extrabold tracking-widest px-3.5 py-2 ${
                  kidsMode ? "text-rose-400" : "text-gray-500"
                }`}>
                  Studio
                </p>

                <button
                  id="nav-upload-btn"
                  onClick={() => { setActiveTab("upload"); setIsOfflineMode(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "upload" && !isOfflineMode
                      ? kidsMode
                        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                        : "bg-white/5 border border-white/5 text-white"
                      : kidsMode ? "hover:bg-rose-100 text-rose-900" : "text-gray-400 hover:text-white hover:bg-white/3"
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Video</span>
                </button>

                <button
                  id="nav-live-btn"
                  onClick={() => { setActiveTab("live"); setIsOfflineMode(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "live" && !isOfflineMode
                      ? kidsMode
                        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                        : "bg-white/5 border border-white/5 text-white"
                      : kidsMode ? "hover:bg-rose-100 text-rose-900" : "text-gray-400 hover:text-white hover:bg-white/3"
                  }`}
                >
                  <Radio className="w-5 h-5 text-rose-500" />
                  <span>Live Classes</span>
                </button>
                
                <div className="my-3 border-t border-white/5" />

                <button
                  id="nav-offline-btn"
                  onClick={() => { setIsOfflineMode(true); setActiveTab("offline"); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isOfflineMode
                      ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                      : kidsMode ? "hover:bg-rose-100 text-rose-900" : "text-gray-400 hover:text-white hover:bg-white/3"
                  }`}
                >
                  <DownloadCloud className="w-5 h-5 animate-bounce" />
                  <span>Downloads ({downloadedVideos.length})</span>
                </button>
              </nav>

              {/* CENTER COMPILATION VIEWPORT */}
              <main className="flex-1 overflow-y-auto scroll-smooth overscroll-y-contain p-6 md:p-8">
                <div className="max-w-screen-2xl 2xl:px-8 mx-auto space-y-6">
                  
                  {/* Category Pill Filters (Only show if we aren't displaying specific saved lists) */}
                  {activeTab === "home" && !isOfflineMode && (
                    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        const isActive = activeCategory === category.id;
                        return (
                          <button
                            id={`category-pill-${category.id}`}
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 transform active:scale-95 cursor-pointer shrink-0 ${
                              isActive
                                ? kidsMode
                                  ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                                  : "bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                                : kidsMode
                                  ? "bg-white text-rose-900 border border-rose-100 hover:bg-rose-100/30"
                                  : "bg-white/3 border border-white/5 text-gray-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{category.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Dynamic carousel highlight (Only on home discover view) */}
                  {activeTab === "home" && !currentQuery && activeCategory === "all" && !isOfflineMode && getDisplayedVideos().length > 0 && (
                    <motion.div
                      id="billboard-banner"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col justify-end min-h-[220px] md:min-h-[280px] shadow-2xl border ${
                        kidsMode
                          ? "bg-gradient-to-tr from-rose-200 via-rose-100 to-sky-100 border-rose-250 text-rose-950"
                          : "bg-gradient-to-tr from-red-950/20 via-violet-950/10 to-[#0c0c14] border-white/5"
                      }`}
                    >
                      {/* Ambient background picture representation */}
                      <div className="absolute inset-0 z-0 opacity-15">
                        <img
                          src={getDisplayedVideos()[0].thumbnail}
                          alt="featured"
                          className="w-full h-full object-cover blur-sm"
                        />
                      </div>

                      <div className="relative z-10 max-w-2xl space-y-2">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                          kidsMode ? "bg-rose-300 text-rose-800" : "bg-red-600/90 text-white"
                        }`}>
                          ✨ Featured Feed
                        </span>
                        <h2 className="font-display text-lg md:text-2xl font-extrabold tracking-tight">
                          {getDisplayedVideos()[0].title}
                        </h2>
                        <p className="text-xs text-gray-400 line-clamp-2 md:line-clamp-3">
                          {getDisplayedVideos()[0].description}
                        </p>
                        <button
                          id="play-billboard-btn"
                          onClick={() => handleSelectVideo(getDisplayedVideos()[0])}
                          className={`mt-4 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 max-w-fit cursor-pointer ${
                            kidsMode
                              ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
                              : "bg-white text-black hover:bg-white/90"
                          }`}
                        >
                          <Tv className="w-4 h-4" />
                          <span>Watch Spotlight Stream</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Header title for list display */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h3 className={`font-display text-sm font-extrabold uppercase tracking-widest ${
                      kidsMode ? "text-rose-500" : "text-gray-400"
                    }`}>
                      {isOfflineMode
                        ? "Cached Local Library (Offline)"
                        : activeTab === "favorites"
                          ? "Favorites Playlist"
                          : activeTab === "history"
                            ? "Recent Watch History"
                            : currentQuery
                              ? `Search results: "${currentQuery}"`
                              : "Explore Video Streams"}
                    </h3>

                    {activeTab === "history" && watchHistory.length > 0 && (
                      <button
                        id="clear-history-btn"
                        onClick={() => { setWatchHistory([]); localStorage.setItem("nexus_history", JSON.stringify([])); }}
                        className="text-[10px] uppercase font-bold text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        Clear History
                      </button>
                    )}
                  </div>

                  {/* Dynamic Views */}
                  {activeTab === "live" && !isOfflineMode && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100" : "bg-red-500/10"}`}>
                        <Radio className={`w-10 h-10 ${kidsMode ? "text-rose-500" : "text-red-500"}`} />
                      </div>
                      <h2 className="text-2xl font-bold font-display tracking-tight">Live Classes Studio</h2>
                      <p className="text-gray-400 max-w-md">Tune in to interactive live sessions, broadcast directly to your device. Support for real-time chats coming soon.</p>
                      <button className={`mt-4 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 ${kidsMode ? "bg-rose-500 text-white" : "bg-red-600 text-white"}`}>
                        <Tv className="w-4 h-4" /> Go Live
                      </button>
                    </div>
                  )}

                  {activeTab === "upload" && !isOfflineMode && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${kidsMode ? "bg-sky-100" : "bg-blue-500/10"}`}>
                        <Upload className={`w-10 h-10 ${kidsMode ? "text-sky-500" : "text-blue-500"}`} />
                      </div>
                      <h2 className="text-2xl font-bold font-display tracking-tight">Upload Center</h2>
                      <p className="text-gray-400 max-w-md">Drag and drop your video files to upload them to your channel. High-speed encoding supported natively.</p>
                      <button className={`mt-4 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 ${kidsMode ? "bg-sky-500 text-white" : "bg-blue-600 text-white"}`}>
                        Select Files
                      </button>
                    </div>
                  )}

                  {activeTab === "profile" && !isOfflineMode && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col space-y-8 max-w-5xl mx-auto"
                    >
                      <div className={`flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl shadow-2xl backdrop-blur-2xl border relative overflow-hidden ${
                        kidsMode 
                          ? "bg-white/60 border-rose-200" 
                          : "bg-white/5 border-white/10"
                      }`}>
                        {/* Decorative blur elements behind profile */}
                        {!kidsMode && (
                          <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/20 rounded-full blur-[80px] pointer-events-none" />
                        )}

                        {user ? (
                          <div className="flex flex-col md:flex-row items-center gap-6 w-full relative z-10">
                            <div className={`w-28 h-28 rounded-full flex items-center justify-center overflow-hidden border-4 shadow-xl ${kidsMode ? "bg-rose-100 border-rose-300" : "bg-gray-800 border-gray-600"}`}>
                              {user.picture ? (
                                <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <User className={`w-14 h-14 ${kidsMode ? "text-rose-300" : "text-gray-500"}`} />
                              )}
                            </div>
                            <div className="text-center md:text-left flex-1">
                              <h2 className="text-3xl font-bold font-display tracking-tight">{user.name}</h2>
                              <p className={`mt-1 ${kidsMode ? "text-rose-600" : "text-gray-400"}`}>{user.email}</p>
                              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
                                <button className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
                                  kidsMode ? "bg-rose-100 text-rose-700 hover:bg-rose-200" : "bg-white/10 hover:bg-white/20 text-white"
                                }`}>
                                  Edit Profile
                                </button>
                                <button 
                                  onClick={handleLogout}
                                  className={`px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                                    kidsMode ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                  }`}>
                                  Sign Out
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col md:flex-row items-center gap-8 w-full relative z-10">
                            <div className={`w-28 h-28 rounded-full flex items-center justify-center overflow-hidden border-4 shadow-xl ${kidsMode ? "bg-rose-100 border-rose-300" : "bg-gray-800 border-gray-600"}`}>
                              <User className={`w-14 h-14 ${kidsMode ? "text-rose-300" : "text-gray-500"}`} />
                            </div>
                            <div className="text-center md:text-left flex-1">
                              <h2 className="text-3xl font-bold font-display tracking-tight">Sign in to Nexus</h2>
                              <p className={`mt-2 max-w-md mx-auto md:mx-0 ${kidsMode ? "text-rose-600" : "text-gray-400"}`}>
                                Save your watch history, favorites, and preferences across all your devices.
                              </p>
                              <div className="mt-6 flex justify-center md:justify-start">
                                <div className="bg-white p-1 rounded-xl shadow-lg">
                                  <GoogleLogin
                                    onSuccess={(credentialResponse) => {
                                      if (credentialResponse.credential) {
                                        const decoded = jwtDecode<any>(credentialResponse.credential);
                                        const newUser: GoogleUser = {
                                          name: decoded.name,
                                          email: decoded.email,
                                          picture: decoded.picture
                                        };
                                        setUser(newUser);
                                        localStorage.setItem("nexus_user", JSON.stringify(newUser));
                                      }
                                    }}
                                    onError={() => {
                                      console.log('Login Failed');
                                    }}
                                    theme="outline"
                                    size="large"
                                    shape="rectangular"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* User's History embedded in Profile View */}
                      <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between border-b pb-3 border-white/5">
                          <h3 className={`font-display text-lg font-extrabold tracking-tight ${
                            kidsMode ? "text-rose-900" : "text-white"
                          }`}>
                            History
                          </h3>
                          {watchHistory.length > 0 && (
                            <button
                              id="clear-history-profile-btn"
                              onClick={() => { setWatchHistory([]); localStorage.setItem("nexus_history", JSON.stringify([])); }}
                              className="text-xs font-bold px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
                            >
                              Clear all
                            </button>
                          )}
                        </div>
                        {watchHistory.length > 0 ? (
                          <VideoGrid
                            videos={watchHistory}
                            onSelectVideo={handleSelectVideo}
                            kidsMode={kidsMode}
                            isLoading={isLoading}
                          />
                        ) : (
                          <div className={`py-16 text-center rounded-3xl border border-dashed ${
                            kidsMode ? "border-rose-200 text-rose-400 bg-white/40" : "border-white/10 text-gray-500 bg-white/5"
                          }`}>
                            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="font-bold">No recent history</p>
                            <p className="text-sm mt-1">Videos you watch will appear here</p>
                          </div>
                        )}
                      </div>

                      {/* User's Downloads embedded in Profile View */}
                      <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between border-b pb-3 border-white/5">
                          <h3 className={`font-display text-lg font-extrabold tracking-tight flex items-center gap-2 ${
                            kidsMode ? "text-rose-900" : "text-white"
                          }`}>
                            <DownloadCloud className="w-5 h-5" />
                            Downloads
                          </h3>
                        </div>
                        {downloadedVideos.length > 0 ? (
                          <VideoGrid
                            videos={downloadedVideos}
                            onSelectVideo={handleSelectVideo}
                            kidsMode={kidsMode}
                            isLoading={isLoading}
                          />
                        ) : (
                          <div className={`py-16 text-center rounded-3xl border border-dashed ${
                            kidsMode ? "border-rose-200 text-rose-400 bg-white/40" : "border-white/10 text-gray-500 bg-white/5"
                          }`}>
                            <DownloadCloud className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="font-bold">No downloads yet</p>
                            <p className="text-sm mt-1">Videos you download will appear here for offline viewing</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* MAIN FEED VIDEO GRID */}
                  {["home", "favorites", "history", "offline"].includes(activeTab) && (
                    <VideoGrid
                      videos={getDisplayedVideos()}
                      onSelectVideo={handleSelectVideo}
                      kidsMode={kidsMode}
                      isLoading={isLoading}
                    />
                  )}

                </div>
              </main>
            </div>

            {/* FLOATING MOBILE BOTTOM NAVIGATION (Aesthetic, Touch responsive) */}
            <nav className={`flex md:hidden items-center justify-around py-2 px-2 border-t z-20 shrink-0 pb-safe ${
              kidsMode ? "bg-white border-rose-100" : "bg-[#09090f]/95 backdrop-blur-xl border-white/5"
            }`}>
              <button
                id="mob-nav-home"
                onClick={() => { setActiveTab("home"); setIsOfflineMode(false); setActiveCategory("all"); }}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                  activeTab === "home" && activeCategory !== "shorts" && !isOfflineMode
                    ? kidsMode ? "text-rose-500" : "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <Tv className="w-6 h-6" />
                <span>Home</span>
              </button>

              <button
                id="mob-nav-shorts"
                onClick={() => { setActiveCategory("shorts"); setActiveTab("home"); setIsOfflineMode(false); }}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                  activeCategory === "shorts" && activeTab === "home" && !isOfflineMode
                    ? kidsMode ? "text-rose-500" : "text-white"
                    : "text-gray-500"
                }`}
              >
                <Smartphone className="w-6 h-6" />
                <span>Shorts</span>
              </button>

              <button
                id="mob-nav-upload"
                onClick={() => { setActiveTab("upload"); setIsOfflineMode(false); }}
                className="flex items-center justify-center -translate-y-2 cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                  kidsMode ? "bg-rose-500 text-white shadow-rose-200" : "bg-white/10 border border-white/20 text-white"
                }`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                </div>
              </button>

              <button
                id="mob-nav-subs"
                onClick={() => { setActiveTab("favorites"); setIsOfflineMode(false); }}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                  activeTab === "favorites" && !isOfflineMode
                    ? kidsMode ? "text-rose-500" : "text-white"
                    : "text-gray-500"
                }`}
              >
                <Heart className="w-6 h-6" />
                <span>Subscriptions</span>
              </button>
              
              <button
                id="mob-nav-you"
                onClick={() => { setActiveTab("profile"); setIsOfflineMode(false); }}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                  activeTab === "profile" && !isOfflineMode
                    ? kidsMode ? "text-rose-500" : "text-white"
                    : "text-gray-500"
                }`}
              >
                {user && user.picture ? (
                  <img src={user.picture} alt="Profile" className={`w-6 h-6 rounded-full border ${activeTab === "profile" ? "border-white" : "border-transparent"}`} />
                ) : (
                  <User className="w-6 h-6" />
                )}
                <span>You</span>
              </button>
            </nav>

            {/* 3. CORE VIDEO PLAYER OVERLAY */}
            <AnimatePresence>
              {selectedVideo && (
                <VideoPlayerModal
                  video={selectedVideo}
                  onClose={() => setSelectedVideo(null)}
                  kidsMode={kidsMode}
                  fontSizeClass={getFontSizeClass()}
                  isDownloaded={downloadedVideos.some((item) => item.id === selectedVideo.id)}
                  onToggleDownload={handleToggleDownload}
                />
              )}
            </AnimatePresence>

            {/* 4. SYNC HUB MODAL */}
            <AnimatePresence>
              {isSyncOpen && (
                <SyncHub
                  onClose={() => setIsSyncOpen(false)}
                  syncCode={syncCode}
                  onSetSyncCode={setSyncCode}
                  currentSession={null}
                  onApplySyncSession={applySyncSession}
                  kidsMode={kidsMode}
                  onTriggerManualUpload={triggerServerSyncUpload}
                />
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
