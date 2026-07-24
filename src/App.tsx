import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Tv, Heart, Clock, DownloadCloud, Sparkles, User, Settings, 
  Lightbulb, RefreshCw, Eye, Calendar, Flame, Baby, LogOut, BookOpen, 
  Smartphone, Signal, WifiOff, Info, HelpCircle, ArrowRight,
  Smile, ZoomIn, ZoomOut, Volume2, Gamepad2, Music, Clapperboard, MonitorPlay,
  Upload, Radio, MessageCircle, Home, PlaySquare, PlusCircle, Bell, Cast,
  Search, Menu, Mic, Compass, PlayCircle, History, ListVideo, ThumbsUp, ChevronDown, Bot
, AlertCircle, Lock, ShieldAlert, X, Delete, Trash2, Check, Fingerprint, Download } from "lucide-react";

import { YouTubeVideo, SyncSession } from "./types";
import NetworkSpeedIndicator from "./components/NetworkSpeedIndicator";
import IntroAnimation from "./components/IntroAnimation";
import SearchBar from "./components/SearchBar";
import VideoGrid from "./components/VideoGrid";
import VideoPlayerModal from "./components/VideoPlayerModal";
import SyncHub from "./components/SyncHub";
import AdBanner from "./components/AdBanner";
import PopunderAd from "./components/PopunderAd";
import IssueReporter from "./components/IssueReporter";
import { NexusAiAssistant } from "./components/NexusAiAssistant";

// -----------------------------------------------------------------
// RESILIENT PLAYGROUND FALLBACK VIDEOS
// (To ensure the app remains gorgeous and fully functional even if API quota is reached!)
// -----------------------------------------------------------------
const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: "bhakti1",
    title: "Bageshwar Dham Sarkar | Guruji Ke Divya Darshan Aur Updesh",
    thumbnail: "https://images.unsplash.com/photo-1590059942691-62d22d5f3069?w=600&auto=format&fit=crop&q=60",
    channelId: "BageshwarDham",
    channelTitle: "Guruji Khabar",
    description: "Janiye Guruji Bageshwar Dham Sarkar ke divya pravachan aur khabar.",
    publishedAt: "2025-05-12T00:00:00Z",
    viewCount: "1250000",
    likeCount: "120000",
    duration: "25:12",
    tags: ["Bhakti", "Guruji Khabar", "Bageshwar Dham"]
  },
  {
    id: "bhakti2",
    title: "Shree Hanuman Chalisa (Hanuman Ashtak) | Best Devotional Song",
    thumbnail: "https://images.unsplash.com/photo-1570716616086-a21a50df8ddf?w=600&auto=format&fit=crop&q=60",
    channelId: "BhaktiSagar",
    channelTitle: "Bhakti Song Option",
    description: "Sunein pavitra Hanuman Chalisa. Achha achha video aur bhakti geet.",
    publishedAt: "2024-03-14T12:00:00Z",
    viewCount: "8900000",
    likeCount: "420000",
    duration: "10:35",
    tags: ["Bhakti Song", "Devotional", "Hanuman Chalisa"]
  },
  {
    id: "bhakti3",
    title: "Pandit Pradeep Mishra Ji Ke Anmol Vachan | Shiv Puran Katha",
    thumbnail: "https://images.unsplash.com/photo-1601633519842-1e90d7f4bebd?w=600&auto=format&fit=crop&q=60",
    channelId: "PradeepMishraJi",
    channelTitle: "Guruji Khabar",
    description: "Janiye Guruji Pradeep Mishra ji ke Shiv Puran Katha ke niyam aur upay.",
    publishedAt: "2025-01-01T08:00:00Z",
    viewCount: "4500000",
    likeCount: "120000",
    duration: "45:00",
    tags: ["Guruji", "Shiv Puran", "Katha"]
  },
  {
    id: "bhakti4",
    title: "Mata Rani Ke Best Bhajans | Navratri Special (Achha Achha Video)",
    thumbnail: "https://images.unsplash.com/photo-1621251346083-d023b7a8a65c?w=600&auto=format&fit=crop&q=60",
    channelId: "BhaktiHits",
    channelTitle: "Bhakti Song",
    description: "Mata rani ke sabse pyare aur achhe achhe bhajan aur video dekhein.",
    publishedAt: "2023-10-12T00:00:00Z",
    viewCount: "24000000",
    likeCount: "530000",
    duration: "1:04:41",
    tags: ["Bhakti Song", "Bhajan", "Mata Rani"]
  }
];

const FALLBACK_KIDS_VIDEOS: YouTubeVideo[] = [
  {
    id: "WRVsOCh907o",
    title: "Bal Ganesha - Kids Devotional Animated Movie",
    thumbnail: "https://images.unsplash.com/photo-1629851410190-671c6d173360?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE4",
    channelTitle: "Kids Devotional",
    description: "Watch the fun and magical adventures of Bal Ganesha. Safe and inspiring.",
    publishedAt: "2025-04-12T00:00:00Z",
    viewCount: "1200000",
    likeCount: "95000",
    duration: "45:22",
    tags: ["Kids", "Bal Ganesha", "Devotional", "Cartoons"]
  },
  {
    id: "lG8eB0zAn_Y",
    title: "Hanuman Chalisa For Kids - Animated Chants",
    thumbnail: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE5",
    channelTitle: "Bhakti For Kids",
    description: "Sing along to Hanuman Chalisa with these beautiful animations for kids.",
    publishedAt: "2024-09-20T00:00:00Z",
    viewCount: "3400000",
    likeCount: "180000",
    duration: "12:15",
    tags: ["Kids", "Hanuman Chalisa", "Singalong", "Music"]
  },
  {
    id: "3AenU5tXh2Q",
    title: "Little Krishna - Beautiful Tales of Vrindavan",
    thumbnail: "https://images.unsplash.com/photo-1601633519842-1e90d7f4bebd?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE6",
    channelTitle: "Vrindavan Tales",
    description: "Enjoy the beautiful stories of Little Krishna in Vrindavan.",
    publishedAt: "2025-02-15T00:00:00Z",
    viewCount: "980000",
    likeCount: "75000",
    duration: "20:40",
    tags: ["Kids", "Krishna", "Devotional", "Stories"]
  }
];

import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

import confetti from "canvas-confetti";

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

export default function App() {
  // Navigation & view states
  const [introFinished, setIntroFinished] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "favorites" | "history" | "offline" | "live" | "profile" | "issues">("home");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Custom preference setups
  const [kidsMode, setKidsMode] = useState(false);
  const [isTransitioningMode, setIsTransitioningMode] = useState(false);

  // User State
  const [user, setUser] = useState<GoogleUser | null>(() => {
    const savedUser = localStorage.getItem("nexus_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [savedUser, setSavedUser] = useState<GoogleUser | null>(() => {
    const saved = localStorage.getItem("nexus_saved_user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isSimulatingBiometric, setIsSimulatingBiometric] = useState(false);
  const [apkUpdateAvailable, setApkUpdateAvailable] = useState<{ version: string; changes: string[]; apkUrl: string } | null>(null);

  // Premium State
  const [premiumState, setPremiumState] = useState<{ name: string | null, claimedAt: number | null, durationMs: number | null, active: boolean }>(() => {
    const savedUser = localStorage.getItem("nexus_user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const subs = JSON.parse(localStorage.getItem("nexus_subscriptions") || "{}");
      const userSub = subs[parsedUser.email];
      if (userSub) {
        const { name, claimedAt, durationMs } = userSub;
        const now = Date.now();
        return { name, claimedAt, durationMs, active: now - claimedAt < durationMs };
      }
    }
    return { name: null, claimedAt: null, durationMs: null, active: false };
  });

  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  // Ad Refresh State
  const [adRefreshKey, setAdRefreshKey] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    // Instantly start interval when not in kids mode and no premium
    if (!kidsMode && !premiumState.active) {
      interval = setInterval(() => {
        setAdRefreshKey(prev => prev + 1);
      }, 35000); // 35 seconds refresh rate
    }
    return () => clearInterval(interval);
  }, [kidsMode, premiumState.active]);

  useEffect(() => {
    if (premiumState.claimedAt && premiumState.durationMs) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (now - premiumState.claimedAt! >= premiumState.durationMs! && premiumState.active) {
          setPremiumState(prev => ({ ...prev, active: false }));
        }
      }, 10000); // Check every 10 seconds
      return () => clearInterval(interval);
    }
  }, [premiumState.claimedAt, premiumState.durationMs, premiumState.active]);

  useEffect(() => {
    if (user) {
      // Check for APK updates
      fetch('/api/version')
        .then(res => res.json())
        .then(data => {
          const currentVersion = "1.1.0"; // current client version
          if (data.version && data.version !== currentVersion) {
            // Wait a small delay so it doesn't interrupt immediate login transitions abruptly
            setTimeout(() => {
              setApkUpdateAvailable(data);
            }, 1500);
          }
        })
        .catch(err => console.error("Failed to check for updates:", err));
        
      fetch(`/api/subscription/${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.name) {
            const now = Date.now();
            setPremiumState({ 
              name: data.name, 
              claimedAt: data.claimedAt, 
              durationMs: data.durationMs, 
              active: now - data.claimedAt < data.durationMs 
            });
            const subs = JSON.parse(localStorage.getItem("nexus_subscriptions") || "{}");
            subs[user.email] = data;
            localStorage.setItem("nexus_subscriptions", JSON.stringify(subs));
          } else {
            setPremiumState({ name: null, claimedAt: null, durationMs: null, active: false });
          }
        })
        .catch(() => {
          const subs = JSON.parse(localStorage.getItem("nexus_subscriptions") || "{}");
          const userSub = subs[user.email];
          if (userSub) {
            const { name, claimedAt, durationMs } = userSub;
            const now = Date.now();
            setPremiumState({ name, claimedAt, durationMs, active: now - claimedAt < durationMs });
          } else {
            setPremiumState({ name: null, claimedAt: null, durationMs: null, active: false });
          }
        });
    } else {
      setPremiumState({ name: null, claimedAt: null, durationMs: null, active: false });
    }
  }, [user]);

  useEffect(() => {
    if (premiumState.claimedAt && !premiumState.active) {
      const hasShownPopup = sessionStorage.getItem("nexus_premium_popup_shown");
      if (!hasShownPopup) {
         setShowSubscriptionPopup(true);
         sessionStorage.setItem("nexus_premium_popup_shown", "true");
      }
    }
  }, [premiumState]);

  const claimPremium = async (name: string, durationMs: number) => {
    if (!user) {
      setToastMsg("Please sign in from the Profile tab to access subscriptions and trials.");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }

    try {
      const response = await fetch(`/api/subscription/${encodeURIComponent(user.email)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, durationMs })
      });
      const data = await response.json();
      
      if (!response.ok) {
        setToastMsg(data.error || "Failed to claim subscription.");
        setTimeout(() => setToastMsg(""), 3000);
        return;
      }
      
      const subs = JSON.parse(localStorage.getItem("nexus_subscriptions") || "{}");
      subs[user.email] = data;
      localStorage.setItem("nexus_subscriptions", JSON.stringify(subs));
      setPremiumState({ ...data, active: true });
    } catch (e) {
      // Fallback
      const subs = JSON.parse(localStorage.getItem("nexus_subscriptions") || "{}");
      if (subs[user.email] && subs[user.email].name === name) {
        setToastMsg(`You have already claimed the ${name} plan.`);
        setTimeout(() => setToastMsg(""), 3000);
        return;
      }
      const now = Date.now();
      const newSub = { name, claimedAt: now, durationMs };
      subs[user.email] = newSub;
      localStorage.setItem("nexus_subscriptions", JSON.stringify(subs));
      setPremiumState({ ...newSub, active: true });
    }
       
    // Trigger celebration animation
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6']
    });
  };

  const [kidsPin, setKidsPin] = useState<string | null>(localStorage.getItem("nexus_kids_pin"));
  const [showKidsPinPrompt, setShowKidsPinPrompt] = useState<"setup" | "enter-enable" | "enter-disable" | false>(false);
  const [kidsPinInput, setKidsPinInput] = useState("");
  const [kidsPinError, setKidsPinError] = useState("");

  const requestToggleKidsMode = () => {
    if (kidsMode) {
      // Attempting to turn OFF
      if (kidsPin) {
        setShowKidsPinPrompt("enter-disable");
        setKidsPinInput("");
        setKidsPinError("");
      } else {
        executeToggleKidsMode();
      }
    } else {
      // Attempting to turn ON
      if (!kidsPin) {
        setShowKidsPinPrompt("setup");
        setKidsPinInput("");
        setKidsPinError("");
      } else {
        setShowKidsPinPrompt("enter-enable");
        setKidsPinInput("");
        setKidsPinError("");
      }
    }
  };

  const handleKidsPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showKidsPinPrompt === "setup") {
      if (kidsPinInput.length !== 4) {
        setKidsPinError("PIN must be 4 digits.");
        return;
      }
      localStorage.setItem("nexus_kids_pin", kidsPinInput);
      setKidsPin(kidsPinInput);
      setShowKidsPinPrompt(false);
      executeToggleKidsMode();
    } else if (showKidsPinPrompt === "enter-enable" || showKidsPinPrompt === "enter-disable") {
      if (kidsPinInput === kidsPin) {
        setShowKidsPinPrompt(false);
        executeToggleKidsMode();
      } else {
        setKidsPinError("Incorrect PIN.");
        setKidsPinInput("");
      }
    }
  };

  const executeToggleKidsMode = () => {
    setIsTransitioningMode(true);
    setTimeout(() => {
      setKidsMode((prev) => {
        const nextMode = !prev;
        if (nextMode && activeTab === "issues") {
          setActiveTab("home"); // Navigate away from issues if entering kids mode
        }
        return nextMode;
      });
      setTimeout(() => {
        setIsTransitioningMode(false);
      }, 800);
    }, 400);
  };
  const [fontSize, setFontSize] = useState<"sm" | "md" | "lg" | "xl">("md");
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);


  // Sync state managers
  const [syncCode, setSyncCode] = useState("");
  const [favorites, setFavorites] = useState<YouTubeVideo[]>([]);
  const [watchHistory, setWatchHistory] = useState<YouTubeVideo[]>([]);
  const [downloadedVideos, setDownloadedVideos] = useState<YouTubeVideo[]>([]);
  const [vaultPassword, setVaultPassword] = useState<string | null>(localStorage.getItem("nexus_vault_pw"));
  const [vaultIcon, setVaultIcon] = useState<string>(() => localStorage.getItem("nexus_vault_icon") || "");
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [showVaultPrompt, setShowVaultPrompt] = useState(false);
  const [vaultInput, setVaultInput] = useState("");
  const [pendingVaultVideo, setPendingVaultVideo] = useState<YouTubeVideo | null>(null);
  const [vaultVideos, setVaultVideos] = useState<YouTubeVideo[]>(() => {
    const saved = localStorage.getItem("nexus_vault_videos");
    return saved ? JSON.parse(saved) : [];
  });

  // Videos search cache
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [hiddenVideoIds, setHiddenVideoIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("hiddenVideos");
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState("");

  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    try {
      if (window.IntersectionObserver) {
        observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && pageToken) {
            fetchFeeds(true);
          }
        });
        if (node) observer.current.observe(node);
      }
    } catch (e) {
      console.warn("IntersectionObserver not supported or threw error", e);
    }
  }, [isLoadingMore, pageToken]);

  // Modals state
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isSyncOpen, setIsSyncOpen] = useState(false);

  // Handle browser back button for Video Player Modal
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (selectedVideo) {
        setSelectedVideo(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [selectedVideo]);

  const closeVideoPlayer = () => {
    if (window.history.state?.videoOpen) {
      window.history.back();
    } else {
      setSelectedVideo(null);
    }
  };

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
  const fetchFeeds = async (loadMore = false) => {
    if (loadMore) {
      if (!pageToken || isLoadingMore) return;
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setPageToken(null);
    }

    try {
      let endpoint = `/api/youtube/search?maxResults=16&q=${encodeURIComponent("bhakti gyan uday guruji class 10 hindi")}&kidsMode=${kidsMode}`;
      
      // Category routing
      if (activeCategory !== "all" && !currentQuery) {
        if (activeCategory === "shorts") {
          endpoint = `/api/youtube/search?maxResults=16&q=${encodeURIComponent("youtube shorts tiktok funny")}&kidsMode=${kidsMode}`;
        } else {
          endpoint = `/api/youtube/search?maxResults=16&q=${encodeURIComponent(activeCategory)}&kidsMode=${kidsMode}`;
          if (activeCategory.includes("live")) {
            endpoint += "&live=true";
          }
        }
      } else if (currentQuery) {
        endpoint = `/api/youtube/search?maxResults=16&q=${encodeURIComponent(currentQuery)}&kidsMode=${kidsMode}`;
        if (currentQuery.toLowerCase().includes("live")) {
          endpoint += "&live=true";
        }
      } else if (kidsMode) {
        // If Kids Mode is on and no query/category, fetch fun kids stuff
        endpoint = `/api/youtube/search?maxResults=16&q=educational+kids+cartoons+stories&kidsMode=true`;
      }

      // Add pagination
      if (loadMore && pageToken) {
        endpoint += `&pageToken=${pageToken}`;
      }

      const res = await fetch(endpoint);
      const data = await res.json();

      if (data.nextPageToken) {
        setPageToken(data.nextPageToken);
      } else {
        setPageToken(null);
      }

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

        // Filter valid parsed
        const validParsed = parsed.filter(v => v && v.id);

        if (loadMore) {
          setVideos(prev => {
            const newVideos = [...prev];
            validParsed.forEach(v => {
              if (!newVideos.find(existing => existing.id === v.id)) {
                newVideos.push(v);
              }
            });
            return newVideos;
          });
        } else {
          setVideos(validParsed);
        }
      } else {
        // Quota fallback / Error fallback
        setToastMsg("YouTube API limit reached or search failed. Showing offline preview videos.");
        setTimeout(() => setToastMsg(""), 5000);
        if (!loadMore) {
          setVideos(kidsMode ? FALLBACK_KIDS_VIDEOS : FALLBACK_VIDEOS);
        }
      }
    } catch (e) {
      console.warn("YouTube Proxy failed or throttled. Initiating high-fidelity resilience fallback.", e);
      setToastMsg("Search is currently unavailable due to high API demand. Showing offline preview videos.");
      setTimeout(() => setToastMsg(""), 5000);
      if (!loadMore) {
        setVideos(kidsMode ? FALLBACK_KIDS_VIDEOS : FALLBACK_VIDEOS);
      }
    } finally {
      if (loadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
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
    window.history.pushState({ videoOpen: true }, "");
    setSelectedVideo(video);
    
    // Add to Watch History (if not already the first element)
    const filtered = watchHistory.filter((item) => item.id !== video.id);
    const updated = [video, ...filtered].slice(0, 16); // keep last 16 views
    setWatchHistory(updated);
    localStorage.setItem("nexus_history", JSON.stringify(updated));
  };

    const handleToggleVault = (video: YouTubeVideo) => {
    if (!user) {
      alert("Please sign in from the Profile tab to use the Secure Vault.");
      return;
    }
    if (!vaultPassword) {
      setPendingVaultVideo(video);
      setShowVaultPrompt(true);
    } else if (!isVaultUnlocked) {
      setPendingVaultVideo(video);
      setShowVaultPrompt(true);
    } else {
      setVaultVideos(prev => {
        const exists = prev.some(v => v.id === video.id);
        let next;
        if (exists) {
          next = prev.filter(v => v.id !== video.id);
          alert("Removed from Secure Vault");
        } else {
          next = [...prev, video];
          alert("Added to Secure Vault");
        }
        localStorage.setItem("nexus_vault_videos", JSON.stringify(next));
        return next;
      });
    }
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

  const handleBiometricLogin = async () => {
    try {
      if (!window.PublicKeyCredential) {
        setToastMsg("Biometric authentication is not supported on this device/browser.");
        setTimeout(() => setToastMsg(""), 3000);
        return;
      }

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const storedCredId = localStorage.getItem("nexus_biometric_id");

      if (storedCredId) {
        const credIdUint8 = Uint8Array.from(atob(storedCredId), c => c.charCodeAt(0));
        
        await navigator.credentials.get({
          publicKey: {
            challenge,
            allowCredentials: [{
              id: credIdUint8,
              type: "public-key"
            }],
            userVerification: "required"
          }
        });
        
        if (savedUser) {
          setUser(savedUser);
          localStorage.setItem("nexus_user", JSON.stringify(savedUser));
        }
      } else {
        const userId = new Uint8Array(16);
        window.crypto.getRandomValues(userId);
        
        const cred = await navigator.credentials.create({
          publicKey: {
            challenge,
            rp: { name: "Nexus App" },
            user: {
              id: userId,
              name: savedUser ? savedUser.email : "user@nexus",
              displayName: savedUser ? savedUser.name : "Nexus User"
            },
            pubKeyCredParams: [
              { type: "public-key", alg: -7 },
              { type: "public-key", alg: -257 }
            ],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required"
            },
            timeout: 60000,
            attestation: "none"
          }
        }) as PublicKeyCredential;
        
        if (cred) {
          const credIdBase64 = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
          localStorage.setItem("nexus_biometric_id", credIdBase64);
          
          if (savedUser) {
            setUser(savedUser);
            localStorage.setItem("nexus_user", JSON.stringify(savedUser));
          }
        }
      }
    } catch (err: any) {
      console.error("Biometric auth error:", err);
      if (err.name === "NotAllowedError") {
        setToastMsg("Biometric authentication was cancelled.");
      } else {
        setToastMsg("Biometric auth failed. Please use Google Sign In.");
      }
      setTimeout(() => setToastMsg(""), 3000);
    }
  };

  const handleLogout = () => {
    if (user) {
      localStorage.setItem("nexus_saved_user", JSON.stringify(user));
      setSavedUser(user);
    }
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
    let result = videos;
    if (isOfflineMode) {
      // Offline mode restricts views to ONLY downloaded local cache
      result = downloadedVideos;
    } else {
      switch (activeTab) {
        case "favorites": result = favorites; break;
        case "history": result = watchHistory; break;
        case "offline": result = downloadedVideos; break;
        default: result = videos; break;
      }
    }
    return result.filter(v => !hiddenVideoIds.includes(v.id));
  };

  const handleRemoveVideo = (video: YouTubeVideo) => {
    const newHidden = [...hiddenVideoIds, video.id];
    setHiddenVideoIds(newHidden);
    localStorage.setItem("hiddenVideos", JSON.stringify(newHidden));
  };

  // Category array based on Kids Mode
  const categories = kidsMode
    ? [
        { id: "all", name: "Bal Bhakti 🎈", icon: Baby },
        { id: "bal ganesha cartoon", name: "Bal Ganesha 🐘", icon: Clapperboard },
        { id: "little krishna cartoon", name: "Krishna Tales 🦚", icon: Lightbulb },
        { id: "kids hanuman chalisa", name: "Hanuman 🐒", icon: Gamepad2 },
        { id: "live kids bhajan aarti", name: "Live TV 🔴", icon: Radio },
        { id: "kids devotional singalong", name: "Bhajan 🎶", icon: Music }
      ]
    : [
        { id: "all", name: "Home", icon: Flame },
        { id: "live bhakti aarti katha bageshwar dham", name: "Live 🔴", icon: Radio },
        { id: "bhakti shorts whatsapp status", name: "Shorts", icon: Smartphone },
        { id: "bhakti song", name: "Bhakti Song", icon: Music },
        { id: "guruji bageshwar dham khabar", name: "Guruji Khabar", icon: Info },
        { id: "achha achha bhajan video", name: "Achha Video", icon: Sparkles },
        { id: "pradeep mishra ji katha", name: "Katha", icon: BookOpen }
      ];

  const handleFactoryReset = () => {
    if (window.confirm("Are you sure you want to completely reset the app? This will clear all data, including history, favorites, downloads, vault, and logins.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className={`fixed inset-0 w-full h-full transition-all duration-700 overflow-hidden transform-gpu will-change-transform ${
      kidsMode
        ? "bg-gradient-to-tr from-[#ffeef2] via-[#fff5f7] to-[#eef9ff] text-rose-950"
        : "bg-[#0f0f0f] text-gray-100"
    } ${getFontSizeClass()}`}>
      {!premiumState.active && !kidsMode && <PopunderAd refreshKey={adRefreshKey} />}
      <AnimatePresence>
        {isTransitioningMode && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px) saturate(100%)" }}
            animate={{ opacity: 1, backdropFilter: "blur(40px) saturate(200%)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px) saturate(100%)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/20 pointer-events-none"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }} 
                transition={{ duration: 1, repeat: Infinity }}
                className={`w-24 h-24 rounded-[40%] blur-xl opacity-70 ${kidsMode ? 'bg-rose-400' : 'bg-indigo-500'}`} 
              />
              <motion.div 
                animate={{ scale: [1.2, 1, 1.2], rotate: [180, 270, 360] }} 
                transition={{ duration: 1.2, repeat: Infinity }}
                className={`w-24 h-24 rounded-[40%] blur-xl opacity-70 absolute top-0 ${kidsMode ? 'bg-amber-300' : 'bg-purple-500'}`} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      
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
            className="flex flex-col h-full overflow-hidden"
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
              activeCategory === "shorts" ? "hidden md:block" : "block"
            } ${
              kidsMode
                ? "bg-white/80 border-rose-100 backdrop-blur-md"
                : "bg-[#0f0f0f] border-white/10"
            }`}>
              <div className="max-w-screen-2xl w-full mx-auto flex items-center justify-between gap-4 2xl:px-8 py-1 md:py-0">
                {/* Brand title */}
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${kidsMode ? "bg-rose-500" : "bg-red-600"}`}>
                      <PlayCircle className="w-4 h-4 ml-0.5" />
                    </span>
                    Nexus
                  </h1>
                </div>

                <div className="flex-1 max-w-5xl xl:max-w-6xl mx-auto px-4 lg:px-12 w-full">
                   <SearchBar onSearch={setCurrentQuery} kidsMode={kidsMode} fontSizeClass={getFontSizeClass()} />
                </div>
                
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                  <button onClick={handleFactoryReset} className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors" title="Reset App Data">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  
                  <button onClick={() => setIsSyncOpen(true)} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </header>

            {/* MAIN LAYOUT */}
            <div className="flex flex-1 overflow-hidden">
               {/* SIDEBAR */}
               <aside className={`hidden md:flex flex-col w-64 lg:w-72 border-r overflow-hidden relative justify-between ${kidsMode ? "bg-white/40 border-white/50 backdrop-blur-3xl backdrop-saturate-200" : "bg-[#0b0b12]/50 border-white/10 backdrop-blur-3xl backdrop-saturate-200"}`}>
                  {/* Sidebar VFX Background */}
                  <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none z-0"></div>
                  <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-rose-500/10 to-transparent pointer-events-none z-0"></div>

                  <div className="p-4 space-y-2 relative z-10 overflow-y-auto scrollbar-none flex-1">
                     <p className={`px-4 text-xs font-bold tracking-wider uppercase mb-4 mt-2 ${kidsMode ? "text-rose-400" : "text-gray-500"}`}>Menu</p>
                     <button onClick={() => { setActiveTab("home"); setIsOfflineMode(false); }} className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${activeTab === "home" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}>
                       {activeTab === "home" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-50" />}
                       <Home className={`w-6 h-6 relative z-10 transition-transform duration-300 ${activeTab === "home" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}`} /> <span className="font-bold relative z-10">Home</span>
                     </button>
                     <button onClick={() => { setIsOfflineMode(true); setActiveTab("offline"); }} className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}>
                       {isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-50" />}
                       <DownloadCloud className={`w-6 h-6 relative z-10 transition-transform duration-300 ${isOfflineMode ? "scale-110" : "group-hover:scale-110"}`} /> <span className="font-bold relative z-10">Offline</span>
                     </button>
                     <button onClick={() => { setActiveTab("history"); setIsOfflineMode(false); }} className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${activeTab === "history" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}>
                       {activeTab === "history" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-50" />}
                       <History className={`w-6 h-6 relative z-10 transition-transform duration-300 ${activeTab === "history" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}`} /> <span className="font-bold relative z-10">History</span>
                     </button>
                     {user && !kidsMode && (
                       <button onClick={() => { setActiveTab("issues"); setIsOfflineMode(false); }} className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${activeTab === "issues" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}>
                         {activeTab === "issues" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-50" />}
                         <AlertCircle className={`w-6 h-6 relative z-10 transition-transform duration-300 ${activeTab === "issues" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}`} /> <span className="font-bold relative z-10">Issues</span>
                       </button>
                     )}
                  </div>
                  <div className="p-4 space-y-2 border-t border-white/10 relative z-10 bg-black/10 backdrop-blur-md">
                     <p className={`px-4 text-xs font-bold tracking-wider uppercase mb-4 ${kidsMode ? "text-rose-400" : "text-gray-500"}`}>Account</p>
                     <button onClick={() => { setActiveTab("favorites"); setIsOfflineMode(false); }} className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${activeTab === "favorites" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}>
                       {activeTab === "favorites" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-transparent opacity-50" />}
                       <Heart className={`w-6 h-6 relative z-10 transition-transform duration-300 ${activeTab === "favorites" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}`} /> <span className="font-bold relative z-10">Subscriptions</span>
                     </button>
                     <button onClick={() => { setActiveTab("profile"); setIsOfflineMode(false); }} className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${activeTab === "profile" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}`}>
                       {activeTab === "profile" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-50" />}
                       {user && user.picture ? (
                           <img src={user.picture} alt="Profile" className={`w-6 h-6 rounded-full border relative z-10 transition-transform duration-300 ${activeTab === "profile" && !isOfflineMode ? "border-white scale-110" : "border-transparent group-hover:scale-110"}`} />
                       ) : (
                           <User className={`w-6 h-6 relative z-10 transition-transform duration-300 ${activeTab === "profile" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}`} /> 
                       )}
                       <span className="font-bold relative z-10">Profile</span>
                     </button>
                     <button onClick={requestToggleKidsMode} className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden mt-2 ${kidsMode ? "bg-rose-500 text-white shadow-lg hover:bg-rose-600 hover:shadow-rose-500/30" : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"}`}>
                       <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                       <Baby className="w-6 h-6 relative z-10 group-hover:animate-bounce" /> <span className="font-bold relative z-10">{kidsMode ? "Exit Kids Mode" : "Kids Mode"}</span>
                     </button>
                     <button onClick={() => setShowAiAssistant(true)} className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden mt-2 ${kidsMode ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20"}`}>
                       <Bot className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" /> <span className="font-bold relative z-10">Nexus AI</span>
                       <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-400/20 rounded-full blur-[10px] group-hover:scale-150 transition-transform"></div>
                     </button>
                     {!premiumState.active && (
                       <a href="https://www.effectivecpmnetwork.com/kv20f6wp?key=a819d50594ca2271376e8a6f650047a7" target="_blank" rel="noopener noreferrer" className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden mt-2 ${kidsMode ? "bg-amber-100 text-amber-600 hover:bg-amber-200" : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"}`}>
                         <Sparkles className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" /> <span className="font-bold relative z-10">Special Offers</span>
                       </a>
                     )}
                  </div>
               </aside>

               {/* MAIN CONTENT AREA */}
               <main className="flex-1 relative overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 scrollbar-none transform-gpu will-change-transform touch-pan-y contain-content">
                  {activeTab === "home" && !isOfflineMode && (
                     <>
                       {!premiumState.active && !kidsMode && <AdBanner refreshKey={adRefreshKey} />}
                       <VideoGrid
                          videos={getDisplayedVideos()}
                          onSelectVideo={handleSelectVideo}
                          kidsMode={kidsMode}
                          isLoading={isLoading}
                          downloadedVideos={downloadedVideos}
                          onRemoveVideo={handleRemoveVideo}
                          onToggleDownload={handleToggleDownload}

                       />
                     </>
                  )}
                  {activeTab === "favorites" && !isOfflineMode && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full h-full flex flex-col items-center justify-center max-w-4xl mx-auto"
                     >
                        <div className="w-full text-center mb-10 mt-8 relative">
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/20 blur-[100px] rounded-full pointer-events-none" />
                           <h1 className={`text-5xl md:text-6xl font-bold font-display tracking-tight mb-4 ${kidsMode ? "text-rose-600" : "text-white"}`}>
                             Go Premium
                           </h1>
                           <p className={`text-lg md:text-xl ${kidsMode ? "text-rose-500" : "text-gray-400"}`}>
                             Unlock an ad-free experience, offline downloads, and more.
                           </p>
                           
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
                           {/* 1-Hour Trial Plan */}
                           <div className={`rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 border ${kidsMode ? "bg-white/60 border-white shadow-xl hover:shadow-rose-200" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}>
                              <div className="relative z-10">
                                 <h3 className={`text-2xl font-bold mb-2 ${kidsMode ? "text-rose-600" : "text-white"}`}>1-Hour Trial</h3>
                                 <div className="flex items-baseline gap-2 mb-6">
                                    <span className={`text-4xl font-black ${kidsMode ? "text-rose-500" : "text-white"}`}>Free</span>
                                    <span className="text-gray-500">/1 hr</span>
                                 </div>
                                 <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Quick ad-free session</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Test all premium features</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>One-time claim</span>
                                    </li>
                                 </ul>
                                 <button 
                                    onClick={!premiumState.claimedAt ? () => claimPremium('1-hour', 60 * 60 * 1000) : undefined} 
                                    disabled={!!premiumState.claimedAt}
                                    className={`w-full py-4 rounded-2xl font-bold transition-all ${premiumState.claimedAt ? (premiumState.name === '1-hour' && premiumState.active ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-gray-500/20 text-gray-500 cursor-not-allowed") : kidsMode ? "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg" : "bg-white/10 text-white hover:bg-white/20"}`}
                                 >
                                    {premiumState.claimedAt ? (premiumState.name === '1-hour' && premiumState.active ? "Trial Active" : premiumState.name === '1-hour' ? "Trial Ended" : "Another Plan Active") : "Claim Free Trial"}
                                 </button>
                              </div>
                           </div>

                           {/* 1-Day Trial Plan */}
                           <div className={`rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 border ${kidsMode ? "bg-white/60 border-white shadow-xl hover:shadow-rose-200" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}>
                              <div className="relative z-10">
                                 <h3 className={`text-2xl font-bold mb-2 ${kidsMode ? "text-rose-600" : "text-white"}`}>1-Day Trial</h3>
                                 <div className="flex items-baseline gap-2 mb-6">
                                    <span className={`text-4xl font-black ${kidsMode ? "text-rose-500" : "text-white"}`}>Free</span>
                                    <span className="text-gray-500">/24 hrs</span>
                                 </div>
                                 <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Ad-free streaming</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Test all premium features</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>One-time claim</span>
                                    </li>
                                 </ul>
                                 <button 
                                    onClick={!premiumState.claimedAt ? () => claimPremium('1-day', 24 * 60 * 60 * 1000) : undefined} 
                                    disabled={!!premiumState.claimedAt}
                                    className={`w-full py-4 rounded-2xl font-bold transition-all ${premiumState.claimedAt ? (premiumState.name === '1-day' && premiumState.active ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-gray-500/20 text-gray-500 cursor-not-allowed") : kidsMode ? "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg" : "bg-white/10 text-white hover:bg-white/20"}`}
                                 >
                                    {premiumState.claimedAt ? (premiumState.name === '1-day' && premiumState.active ? "Trial Active" : premiumState.name === '1-day' ? "Trial Ended" : "Another Plan Active") : "Claim Free Trial"}
                                 </button>
                              </div>
                           </div>

                           {/* Weekly Plan */}
                           <div className={`rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 border ${kidsMode ? "bg-white/60 border-white shadow-xl hover:shadow-rose-200" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}>
                              <div className="relative z-10">
                                 <h3 className={`text-2xl font-bold mb-2 ${kidsMode ? "text-rose-600" : "text-white"}`}>Weekly Pass</h3>
                                 <div className="flex items-baseline gap-2 mb-6">
                                    <span className={`text-4xl font-black ${kidsMode ? "text-rose-500" : "text-white"}`}>$1.49</span>
                                    <span className="text-gray-500">/7 days</span>
                                 </div>
                                 <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Ad-free streaming</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Offline downloads</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Short-term access</span>
                                    </li>
                                 </ul>
                                 <button 
                                    onClick={!premiumState.claimedAt ? () => claimPremium('7-day', 7 * 24 * 60 * 60 * 1000) : undefined} 
                                    disabled={!!premiumState.claimedAt}
                                    className={`w-full py-4 rounded-2xl font-bold transition-all ${premiumState.claimedAt ? (premiumState.name === '7-day' && premiumState.active ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-gray-500/20 text-gray-500 cursor-not-allowed") : kidsMode ? "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg" : "bg-white/10 text-white hover:bg-white/20"}`}
                                 >
                                    {premiumState.claimedAt ? (premiumState.name === '7-day' && premiumState.active ? "Pass Active" : premiumState.name === '7-day' ? "Pass Ended" : "Another Plan Active") : "Claim 7-Day Pass"}
                                 </button>
                              </div>
                           </div>

                           {/* Monthly Plan */}
                           <div className={`rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 border ${kidsMode ? "bg-white/60 border-white shadow-xl hover:shadow-rose-200" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}>
                              <div className="relative z-10">
                                 <h3 className={`text-2xl font-bold mb-2 ${kidsMode ? "text-rose-600" : "text-white"}`}>Monthly Pass</h3>
                                 <div className="flex items-baseline gap-2 mb-6">
                                    <span className={`text-4xl font-black ${kidsMode ? "text-rose-500" : "text-white"}`}>$4.99</span>
                                    <span className="text-gray-500">/mo</span>
                                 </div>
                                 <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Ad-free streaming</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Offline downloads</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className={`w-6 h-6 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Cancel anytime</span>
                                    </li>
                                 </ul>
                                 <button 
                                    onClick={!premiumState.claimedAt ? () => claimPremium('monthly', 30 * 24 * 60 * 60 * 1000) : undefined} 
                                    disabled={!!premiumState.claimedAt}
                                    className={`w-full py-4 rounded-2xl font-bold transition-all ${premiumState.claimedAt ? (premiumState.name === 'monthly' && premiumState.active ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-gray-500/20 text-gray-500 cursor-not-allowed") : kidsMode ? "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg" : "bg-white/10 text-white hover:bg-white/20"}`}
                                 >
                                    {premiumState.claimedAt ? (premiumState.name === 'monthly' && premiumState.active ? "Pass Active" : premiumState.name === 'monthly' ? "Pass Ended" : "Another Plan Active") : "Subscribe Monthly"}
                                 </button>
                              </div>
                           </div>

                           {/* Yearly Plan */}
                           <div className={`rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 border-2 shadow-2xl ${kidsMode ? "bg-gradient-to-br from-rose-400 to-amber-400 border-white text-white" : "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 text-white"}`}>
                              <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">Most Popular</div>
                              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-3xl rounded-full pointer-events-none" />
                              <div className="relative z-10">
                                 <h3 className="text-2xl font-bold mb-2">Yearly Premium</h3>
                                 <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-4xl font-black">$39.99</span>
                                    <span className="opacity-80">/yr</span>
                                 </div>
                                 <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3">
                                       <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                                       <span>Ad-free streaming</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                                       <span>Offline downloads</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                                       <span>Kids Mode exclusive content</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                                       <span>Save 33% compared to monthly</span>
                                    </li>
                                 </ul>
                                 <button 
                                    onClick={!premiumState.claimedAt ? () => claimPremium('yearly', 365 * 24 * 60 * 60 * 1000) : undefined} 
                                    disabled={!!premiumState.claimedAt}
                                    className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg text-lg ${premiumState.claimedAt ? (premiumState.name === 'yearly' && premiumState.active ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-gray-500/20 text-gray-500 cursor-not-allowed") : kidsMode ? "bg-white text-rose-500 hover:bg-gray-50" : "bg-white text-indigo-600 hover:bg-gray-100"}`}
                                 >
                                    {premiumState.claimedAt ? (premiumState.name === 'yearly' && premiumState.active ? "Pass Active" : premiumState.name === 'yearly' ? "Pass Ended" : "Another Plan Active") : "Get 1 Year Ad-Free"}
                                 </button>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}
                  {activeTab === "history" && !isOfflineMode && (
                     <VideoGrid
                        videos={watchHistory}
                        onSelectVideo={handleSelectVideo}
                        kidsMode={kidsMode}
                        isLoading={false}
                        downloadedVideos={downloadedVideos}
                          onRemoveVideo={handleRemoveVideo}
                        onToggleDownload={handleToggleDownload}

                     />
                  )}
                  {isOfflineMode && (
                     <VideoGrid
                        videos={downloadedVideos}
                        onSelectVideo={handleSelectVideo}
                        kidsMode={kidsMode}
                        isLoading={false}
                        downloadedVideos={downloadedVideos}
                          onRemoveVideo={handleRemoveVideo}
                        onToggleDownload={handleToggleDownload}

                        showDeleteMode={true}
                     />
                  )}
                  {activeTab === "profile" && !isOfflineMode && (
                     <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto w-full p-6">
                       <div className={`w-full rounded-3xl p-8 flex flex-col items-center text-center backdrop-blur-2xl border shadow-2xl ${kidsMode ? "bg-white/40 border-white/50" : "bg-white/5 border-white/10"}`}>
                         {user ? (
                           <>
                             <img src={user.picture} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white/20 mb-4 shadow-xl" />
                             <h2 className="text-2xl font-bold font-display tracking-tight mb-1">{user.name}</h2>
                             <p className="text-gray-400 text-sm mb-8">{user.email}</p>
                             <button onClick={handleLogout} className="px-6 py-3 rounded-xl font-bold bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full flex items-center justify-center gap-2">
                               <LogOut className="w-4 h-4" /> Sign Out
                             </button>
                           </>
                         ) : (
                           <>
                             {savedUser ? (
                               <div className="w-full flex flex-col items-center">
                                 <img src={savedUser.picture} alt="Profile" className="w-20 h-20 rounded-full border-2 border-white/20 mb-3 shadow-xl opacity-70 grayscale" />
                                 <h2 className="text-xl font-bold font-display tracking-tight mb-2">Welcome back, {savedUser.name.split(' ')[0]}</h2>
                                 <p className="text-gray-400 text-sm mb-6">Verify your identity to log in securely.</p>
                                 <button 
                                   onClick={handleBiometricLogin}
                                   className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all mb-4"
                                 >
                                   <Fingerprint className="w-6 h-6" /> Biometric Login
                                 </button>
                                 
                                 <div className="flex items-center w-full my-4">
                                   <div className="flex-1 h-px bg-white/10"></div>
                                   <span className="px-3 text-xs text-gray-500 uppercase font-bold">Or</span>
                                   <div className="flex-1 h-px bg-white/10"></div>
                                 </div>
                               </div>
                             ) : (
                               <>
                                 <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mb-6 shadow-xl">
                                   <User className="w-10 h-10 text-white" />
                                 </div>
                                 <h2 className="text-2xl font-bold font-display tracking-tight mb-3">Welcome to Nexus</h2>
                               </>
                             )}
                             <p className="text-gray-400 text-sm mb-8">{savedUser ? "Sign in with a different account:" : "Sign in with Google to sync your history, favorites, and settings across all your devices."}</p>
                             <div className="w-full rounded-xl overflow-hidden shadow-lg border border-white/10">
                               <GoogleLogin
                                 onSuccess={(credentialResponse) => {
                                   if (credentialResponse.credential) {
                                     const decoded = jwtDecode<GoogleUser>(credentialResponse.credential);
                                     setUser(decoded);
                                     localStorage.setItem("nexus_user", JSON.stringify(decoded));
                                   }
                                 }}
                                 onError={() => {
                                   console.log('Login Failed');
                                 }}
                                 useOneTap
                                 use_fedcm_for_prompt={false}
                                 theme={kidsMode ? "outline" : "filled_black"}
                                 shape="pill"
                               />
                             </div>
                           </>
                         )}
                       </div>
                     </div>
                  )}
                  <AnimatePresence mode="wait">
                    {activeTab === "issues" && !isOfflineMode && (
                       <motion.div 
                         key="issue-reporter" 
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 20 }}
                         transition={{ duration: 0.2 }}
                         className="flex-1 w-full flex flex-col min-h-0"
                       >
                         <IssueReporter user={user} isPremium={premiumState.active} />
                       </motion.div>
                    )}
                  </AnimatePresence>
               </main>
            </div>

            {/* MOBILE NAVIGATION */}
            <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-3 border-t ${
              kidsMode ? "bg-white/40 border-white/50 backdrop-blur-3xl backdrop-saturate-200" : "bg-[#0b0b12]/50 border-white/10 backdrop-blur-3xl backdrop-saturate-200"
            }`}>
              <button
                onClick={() => { setActiveTab("home"); setIsOfflineMode(false); }}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                  activeTab === "home" && !isOfflineMode
                    ? kidsMode ? "text-rose-500" : "text-white"
                    : "text-gray-500"
                }`}
              >
                <Home className="w-6 h-6" />
                <span>Home</span>
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
              
              <button
                id="mob-nav-kids"
                onClick={requestToggleKidsMode}
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                  kidsMode
                    ? "text-rose-500"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                <Baby className="w-6 h-6" />
                <span>Kids</span>
              </button>
              
              {user && !kidsMode && (
                <button
                  id="mob-nav-issue"
                  onClick={() => { setActiveTab("issues"); setIsOfflineMode(false); }}
                  className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                    activeTab === "issues" && !isOfflineMode
                      ? kidsMode ? "text-rose-500" : "text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <AlertCircle className="w-6 h-6" />
                  <span>Issues</span>
                </button>
              )}
            </nav>

            {/* 3. CORE VIDEO PLAYER OVERLAY */}
            <AnimatePresence>
              {selectedVideo && (
                <VideoPlayerModal
                  video={selectedVideo}
                  onClose={closeVideoPlayer}
                  kidsMode={kidsMode}
                  fontSizeClass={getFontSizeClass()}
                  isDownloaded={downloadedVideos.some((item) => item.id === selectedVideo.id)}
                  onToggleDownload={handleToggleDownload}

                  onToggleVault={handleToggleVault}
                />
              )}
            </AnimatePresence>

                        {/* VAULT PROMPT MODAL */}
            <AnimatePresence>
              {showVaultPrompt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center relative overflow-hidden"
                  >
                    <button 
                      onClick={() => { setShowVaultPrompt(false); setPendingVaultVideo(null); setVaultInput(""); }}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                      {vaultIcon ? <span className="text-3xl leading-none">{vaultIcon}</span> : <Lock className="w-8 h-8 text-white" />}
                    </div>
                    
                    <h2 className="text-xl font-bold text-white mb-2 font-display">
                      {vaultPassword ? "Enter Vault Password" : "Set Vault Password"}
                    </h2>
                    
                    <p className="text-sm text-gray-400 mb-6">
                      {vaultPassword 
                        ? "Enter your password to access your secure vault." 
                        : "Set a password to create a secure vault for your private content."}
                    </p>
                    
                    <div className="flex flex-col items-center gap-6">
                      {/* PIN Display */}
                      <div className="flex gap-3 justify-center mb-2">
                        {Array.from({ length: Math.max(4, vaultInput.length) }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-4 h-4 rounded-full transition-all duration-200 ${
                              i < vaultInput.length 
                                ? "bg-white scale-110" 
                                : "bg-white/10"
                            }`} 
                          />
                        ))}
                      </div>
                      
                      {/* Dial Pad */}
                      <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                          <button
                            key={num}
                            onClick={() => setVaultInput(prev => prev + num)}
                            className="w-full aspect-square rounded-full bg-white/5 hover:bg-white/15 text-white text-2xl font-display font-medium flex items-center justify-center transition-colors active:scale-95"
                          >
                            {num}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setVaultInput("")}
                          className="w-full aspect-square rounded-full text-white/50 hover:text-white hover:bg-white/10 text-sm font-bold flex items-center justify-center transition-colors active:scale-95 uppercase tracking-wider"
                        >
                          Clear
                        </button>
                        
                        <button
                          onClick={() => setVaultInput(prev => prev + "0")}
                          className="w-full aspect-square rounded-full bg-white/5 hover:bg-white/15 text-white text-2xl font-display font-medium flex items-center justify-center transition-colors active:scale-95"
                        >
                          0
                        </button>
                        
                        <button
                          onClick={() => setVaultInput(prev => prev.slice(0, -1))}
                          className="w-full aspect-square rounded-full text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors active:scale-95"
                        >
                          <Delete className="w-7 h-7" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (vaultPassword) {
                            if (vaultInput === vaultPassword) {
                              setIsVaultUnlocked(true);
                              setShowVaultPrompt(false);
                              setVaultInput("");
                              if (pendingVaultVideo) {
                                setVaultVideos(prev => {
                                  const exists = prev.some(v => v.id === pendingVaultVideo.id);
                                  if (!exists) {
                                    const next = [...prev, pendingVaultVideo];
                                    localStorage.setItem("nexus_vault_videos", JSON.stringify(next));
                                    alert("Added to Secure Vault");
                                    return next;
                                  }
                                  return prev;
                                });
                                setPendingVaultVideo(null);
                              }
                            } else {
                              alert("Incorrect password");
                              setVaultInput("");
                            }
                          } else {
                            if (vaultInput.trim().length < 4) {
                              alert("PIN must be at least 4 digits");
                              return;
                            }
                            setVaultPassword(vaultInput);
                            localStorage.setItem("nexus_vault_pw", vaultInput);
                            setIsVaultUnlocked(true);
                            setShowVaultPrompt(false);
                            setVaultInput("");
                          }
                        }}
                        disabled={vaultInput.length === 0}
                        className={`w-full font-bold py-3.5 rounded-xl transition-all ${
                          vaultInput.length > 0 
                            ? "bg-white text-black hover:bg-gray-200" 
                            : "bg-white/10 text-white/30 cursor-not-allowed"
                        }`}
                      >
                        {vaultPassword ? "Unlock Vault" : "Create Vault"}
                      </button>
                      
                      {vaultPassword && (
                        <button
                          onClick={() => {
                            if (confirm("Resetting your vault will delete all your secured content. Are you sure?")) {
                              setVaultPassword(null);
                              localStorage.removeItem("nexus_vault_pw");
                              setVaultVideos([]);
                              localStorage.removeItem("nexus_vault_videos");
                              setIsVaultUnlocked(false);
                            }
                          }}
                          className="text-[10px] uppercase tracking-wider font-bold text-red-500/60 hover:text-red-400 mt-2 transition-colors"
                        >
                          Reset Vault
                        </button>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* VAULT VIEW OVERLAY */}
            <AnimatePresence>
              {isVaultUnlocked && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed inset-0 z-[9990] bg-[#0f0f0f] flex flex-col"
                >
                  <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0f0f0f]/80 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        {vaultIcon ? <span className="text-xl leading-none">{vaultIcon}</span> : <Lock className="w-5 h-5 text-red-500" />}
                      </div>
                      <h2 className="text-xl font-bold text-white font-display">Secure Vault</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newIcon = prompt("Enter a custom emoji or short text for the Vault icon (leave empty to reset):", vaultIcon);
                          if (newIcon !== null) {
                            setVaultIcon(newIcon);
                            localStorage.setItem("nexus_vault_icon", newIcon);
                          }
                        }}
                        className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                        title="Customize Icon"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setIsVaultUnlocked(false)}
                        className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {vaultVideos.length > 0 ? (
                      <VideoGrid
                        videos={vaultVideos}
                        onSelectVideo={handleSelectVideo}
                        kidsMode={kidsMode}
                        isLoading={false}
                        downloadedVideos={downloadedVideos}
                          onRemoveVideo={handleRemoveVideo}
                        onToggleDownload={handleToggleDownload}

                      />
                    ) : (
                      <div className="py-20 flex flex-col items-center justify-center text-center">
                        <ShieldAlert className="w-16 h-16 text-white/20 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Vault is Empty</h3>
                        <p className="text-gray-400 max-w-sm">
                          Content added to your secure vault will appear here. Tap the circle icon on any video to add it.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
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

            {/* 5. SUBSCRIPTION POPUP */}
            <AnimatePresence>
              {showSubscriptionPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                    onClick={() => setShowSubscriptionPopup(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className={`relative z-10 w-full max-w-md rounded-3xl overflow-hidden p-8 text-center shadow-2xl ${kidsMode ? "bg-white text-rose-900 border-2 border-rose-200" : "bg-gray-900 text-white border border-gray-700"}`}
                  >
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 shadow-lg ${kidsMode ? "bg-rose-100 text-rose-500" : "bg-gradient-to-br from-amber-500 to-orange-600 text-white"}`}>
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold font-display tracking-tight mb-4">Your Trial Has Ended</h2>
                    <p className={`mb-8 ${kidsMode ? "text-rose-600" : "text-gray-400"}`}>
                      We hope you enjoyed your ad-free experience! Subscribe now to keep enjoying unlimited, uninterrupted streaming.
                    </p>
                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => {
                          setShowSubscriptionPopup(false);
                          setActiveTab("favorites");
                        }} 
                        className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${kidsMode ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white"}`}
                      >
                        View Premium Plans
                      </button>
                      <button 
                        onClick={() => setShowSubscriptionPopup(false)} 
                        className={`w-full py-3 rounded-xl font-bold transition-all ${kidsMode ? "text-rose-500 hover:bg-rose-50" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                      >
                        Maybe Later
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* KIDS PIN MODAL */}
            <AnimatePresence>
              {showKidsPinPrompt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                    onClick={() => setShowKidsPinPrompt(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden p-8 text-center shadow-2xl bg-gray-900 text-white border border-gray-700"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 shadow-lg bg-rose-500/20 text-rose-500">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold font-display tracking-tight mb-2">
                      {showKidsPinPrompt === "setup" ? "Set Parental PIN" : "Enter Parental PIN"}
                    </h2>
                    <p className="mb-6 text-gray-400 text-sm">
                      {showKidsPinPrompt === "setup" 
                        ? "Create a 4-digit PIN to secure Kids Mode."
                        : "Enter your 4-digit PIN to proceed."}
                    </p>
                    
                    <form onSubmit={handleKidsPinSubmit} className="flex flex-col gap-4">
                      <input
                        type="password"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        maxLength={4}
                        value={kidsPinInput}
                        onChange={(e) => setKidsPinInput(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-center text-2xl tracking-[1em] text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:tracking-normal placeholder:text-gray-600"
                        autoFocus
                      />
                      {kidsPinError && (
                        <p className="text-rose-500 text-xs font-bold">{kidsPinError}</p>
                      )}
                      <div className="flex gap-3 mt-2">
                        <button 
                          type="button"
                          onClick={() => {
                            setShowKidsPinPrompt(false);
                            setKidsPinInput("");
                            setKidsPinError("");
                          }}
                          className="flex-1 py-3 rounded-xl font-bold transition-all text-gray-400 hover:bg-white/5 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 py-3 rounded-xl font-bold transition-all shadow-lg bg-rose-500 text-white hover:bg-rose-600"
                        >
                          Confirm
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* BIOMETRIC LOGIN MODAL */}
            <AnimatePresence>
              {isSimulatingBiometric && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                    onClick={() => setIsSimulatingBiometric(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden p-8 text-center shadow-2xl bg-gray-900 border border-blue-500/30"
                  >
                    <h2 className="text-2xl font-bold font-display tracking-tight text-white mb-2">Biometric Scan</h2>
                    <p className="text-gray-400 text-sm mb-8">Touch the fingerprint sensor to log in securely.</p>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // Simulate successful scan
                        setTimeout(() => {
                          if (savedUser) {
                            setUser(savedUser);
                            localStorage.setItem("nexus_user", JSON.stringify(savedUser));
                          }
                          setIsSimulatingBiometric(false);
                        }, 800);
                      }}
                      className="w-32 h-32 mx-auto rounded-full bg-blue-500/10 border-2 border-blue-500/50 flex items-center justify-center relative overflow-hidden group cursor-pointer shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all"
                    >
                      <Fingerprint className="w-16 h-16 text-blue-400 group-hover:text-blue-300 transition-colors" />
                      <div className="absolute inset-0 bg-blue-400/20 translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite]"></div>
                    </motion.button>
                    
                    <p className="text-blue-400 text-xs mt-8 font-bold tracking-widest uppercase">Awaiting Input...</p>
                    
                    <button 
                      onClick={() => setIsSimulatingBiometric(false)}
                      className="mt-6 text-gray-500 hover:text-white text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* APK OTA UPDATE MODAL */}
            <AnimatePresence>
              {apkUpdateAvailable && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative z-10 w-full max-w-md rounded-3xl overflow-hidden p-8 text-center shadow-2xl bg-gray-900 border border-indigo-500/30"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 shadow-lg bg-indigo-500/20 text-indigo-400">
                      <Download className="w-8 h-8 animate-bounce" />
                    </div>
                    <h2 className="text-2xl font-bold font-display tracking-tight text-white mb-2">Update Available</h2>
                    <p className="text-indigo-400 text-sm font-bold mb-4">Version {apkUpdateAvailable.version}</p>
                    
                    <div className="text-left bg-black/30 rounded-xl p-4 mb-8">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">What's New</p>
                      <ul className="space-y-2">
                        {apkUpdateAvailable.changes.map((change, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      <a 
                        href={apkUpdateAvailable.apkUrl} 
                        download="nexus-app.apk"
                        target="_top"
                        onClick={() => {
                          setTimeout(() => setApkUpdateAvailable(null), 500);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all"
                      >
                        <Download className="w-5 h-5" /> Download Update
                      </a>
                      <button 
                        onClick={() => setApkUpdateAvailable(null)}
                        className="w-full py-3 rounded-xl font-bold transition-all text-gray-400 hover:bg-white/5 hover:text-white"
                      >
                        Remind Me Later
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
