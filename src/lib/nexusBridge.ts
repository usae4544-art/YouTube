import { AISummary, SearchSuggestionResponse, YouTubeComment, YouTubeVideo } from "../types";

export interface NexusAndroidBridge {
  showAdIfEligible?: (kidsMode: boolean, isPremium: boolean) => void;
  requestAppPermissions?: () => void;
  hasMicPermission?: () => boolean;
  hasNotificationPermission?: () => boolean;
  openExternalUrl?: (url: string) => void;
  showToast?: (message: string) => void;
  getAppVersion?: () => string;
}

declare global {
  interface Window {
    NexusAndroid?: NexusAndroidBridge;
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
    };
  }
}

const YOUTUBE_API_KEY =
  import.meta.env.VITE_YOUTUBE_API_KEY ||
  "AIzaSyC2FmiTp2-VvU8DmecUd_3ltLyXsVlY3PY";
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

export const CURATED_DEVOTIONAL_VIDEOS: YouTubeVideo[] = [
  {
    id: "8cTXHng8AHU",
    title: "Bageshwar Dham Sarkar | Divya Darshan Aur Ojaswi Pravachan",
    thumbnail: "https://i.ytimg.com/vi/8cTXHng8AHU/hqdefault.jpg",
    channelId: "UCBageshwarDham",
    channelTitle: "Bageshwar Dham Sarkar",
    description:
      "Janiye Bageshwar Dham Sarkar ke divya pravachan, katha aur aashirwad.",
    publishedAt: "2025-05-12T00:00:00Z",
    viewCount: "1250000",
    likeCount: "120000",
    duration: "25:12",
    tags: ["Bhakti", "Guruji Khabar", "Bageshwar Dham"],
  },
  {
    id: "AETFvQonfV8",
    title: "Shree Hanuman Chalisa Original Video | Gulshan Kumar & Hariharan",
    thumbnail: "https://i.ytimg.com/vi/AETFvQonfV8/hqdefault.jpg",
    channelId: "TSeriesBhaktiSagar",
    channelTitle: "T-Series Bhakti Sagar",
    description:
      "Sunein pavitra Shree Hanuman Chalisa. Bhakti song aur daily prayer.",
    publishedAt: "2024-03-14T12:00:00Z",
    viewCount: "8900000",
    likeCount: "420000",
    duration: "09:42",
    tags: ["Bhakti Song", "Devotional", "Hanuman Chalisa"],
  },
  {
    id: "iB5_YeZSBk0",
    title: "Shiv Mahapuran Katha | Pandit Pradeep Mishra Ji Pravachan",
    thumbnail: "https://i.ytimg.com/vi/iB5_YeZSBk0/hqdefault.jpg",
    channelId: "PradeepMishraJi",
    channelTitle: "Shiv Mahapuran Katha",
    description:
      "Pandit Pradeep Mishra ji ke Shiv Puran Katha ke niyam aur upay.",
    publishedAt: "2025-01-01T08:00:00Z",
    viewCount: "4500000",
    likeCount: "120000",
    duration: "45:00",
    tags: ["Guruji", "Shiv Puran", "Katha"],
  },
  {
    id: "w23OSz4NCX8",
    title: "Mata Rani & Bhakti Geet Special | Devotional Collection",
    thumbnail: "https://i.ytimg.com/vi/w23OSz4NCX8/hqdefault.jpg",
    channelId: "BhaktiHits",
    channelTitle: "Bhakti Hits",
    description:
      "Mata rani ke sabse pyare aur achhe achhe bhajan aur bhakti video.",
    publishedAt: "2024-10-12T00:00:00Z",
    viewCount: "2400000",
    likeCount: "530000",
    duration: "08:15",
    tags: ["Bhakti Song", "Bhajan", "Mata Rani"],
  },
];

export const CURATED_KIDS_VIDEOS: YouTubeVideo[] = [
  {
    id: "WRVsOCh907o",
    title: "Bal Ganesha - Kids Devotional Animated Adventure",
    thumbnail: "https://i.ytimg.com/vi/WRVsOCh907o/hqdefault.jpg",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE4",
    channelTitle: "Kids Devotional",
    description:
      "Watch the fun and magical adventures of Bal Ganesha. Safe, joyful, and inspiring.",
    publishedAt: "2025-04-12T00:00:00Z",
    viewCount: "1200000",
    likeCount: "95000",
    duration: "45:22",
    tags: ["Kids", "Bal Ganesha", "Devotional", "Cartoons"],
  },
  {
    id: "lG8eB0zAn_Y",
    title: "Hanuman Chalisa For Kids - Animated Chants & Singalong",
    thumbnail: "https://i.ytimg.com/vi/lG8eB0zAn_Y/hqdefault.jpg",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE5",
    channelTitle: "Bhakti For Kids",
    description:
      "Sing along to Hanuman Chalisa with colorful animations made for kids.",
    publishedAt: "2024-09-20T00:00:00Z",
    viewCount: "3400000",
    likeCount: "180000",
    duration: "12:15",
    tags: ["Kids", "Hanuman Chalisa", "Singalong", "Music"],
  },
  {
    id: "3AenU5tXh2Q",
    title: "Little Krishna - Stories of Vrindavan for Kids",
    thumbnail: "https://i.ytimg.com/vi/3AenU5tXh2Q/hqdefault.jpg",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE6",
    channelTitle: "Vrindavan Tales",
    description:
      "Enjoy animated bedtime and moral stories of Little Krishna in Vrindavan.",
    publishedAt: "2025-02-15T00:00:00Z",
    viewCount: "980000",
    likeCount: "75000",
    duration: "20:40",
    tags: ["Kids", "Krishna", "Devotional", "Stories"],
  },
  {
    id: "AETFvQonfV8",
    title: "Shree Hanuman Chalisa | Kids Morning Prayer & Bhajan",
    thumbnail: "https://i.ytimg.com/vi/AETFvQonfV8/hqdefault.jpg",
    channelId: "TSeriesBhaktiSagar",
    channelTitle: "Bhakti Sagar Kids",
    description: "Peaceful morning prayer and Hanuman Chalisa for families.",
    publishedAt: "2024-06-18T00:00:00Z",
    viewCount: "4100000",
    likeCount: "210000",
    duration: "09:42",
    tags: ["Kids", "Prayer", "Bhajan", "Music"],
  },
];

export const SAFE_AD_CREATIVES = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    title: "Sport Pulse Collection",
    subtitle: "Lightweight everyday comfort — Sponsored Showcase",
    ctaUrl: "https://www.google.com/search?q=sport+running+shoes",
    reason: "Verified family-safe sports footwear creative.",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
    title: "Smart Chrono Series",
    subtitle: "Precision minimalist design — Sponsored Showcase",
    ctaUrl: "https://www.google.com/search?q=minimalist+watch",
    reason: "Verified family-safe wristwatch product showcase.",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    title: "Studio Pure Audio",
    subtitle: "Crystal clear devotional & music sound — Sponsored",
    ctaUrl: "https://www.google.com/search?q=wireless+studio+headphones",
    reason: "Verified family-safe headphones creative.",
  },
];

export function isNativeAndroid(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    window.NexusAndroid ||
      window.Capacitor?.isNativePlatform?.() ||
      window.location.protocol === "capacitor:",
  );
}

/**
 * Returns optional custom backend origin or empty string for same-origin web hosting.
 * Inside standalone APK builds, backend routes fall back seamlessly to direct/local logic.
 */
export function getApiBaseUrl(): string {
  if (typeof window === "undefined") return "";
  const custom = localStorage.getItem("nexus_api_base_url")?.trim();
  if (custom) return custom.replace(/\/+$/, "");
  if (isNativeAndroid()) return "";
  return "";
}

export function hasBackendServer(): boolean {
  if (typeof window === "undefined") return false;
  if (localStorage.getItem("nexus_api_base_url")?.trim()) return true;
  return !isNativeAndroid();
}

export function buildApiUrl(path: string): string {
  const base = getApiBaseUrl();
  return base ? `${base}${path}` : path;
}

export function notifyVideoPlayAds(kidsMode: boolean, isPremium: boolean): void {
  try {
    window.NexusAndroid?.showAdIfEligible?.(Boolean(kidsMode), Boolean(isPremium));
  } catch (e) {
    console.warn("Android AdBridge notify failed:", e);
  }
}

export function requestNativePermissions(): boolean {
  try {
    if (window.NexusAndroid?.requestAppPermissions) {
      window.NexusAndroid.requestAppPermissions();
      return true;
    }
  } catch (e) {
    console.warn("Failed to request native permissions:", e);
  }
  return false;
}

export function openExternalLink(url: string): void {
  try {
    if (window.NexusAndroid?.openExternalUrl) {
      window.NexusAndroid.openExternalUrl(url);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  } catch (e) {
    console.warn("Failed to open external link:", e);
  }
}

export async function apiFetchJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  if (!hasBackendServer()) return null;
  try {
    const res = await fetch(buildApiUrl(path), init);
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok || !contentType.includes("application/json")) {
      return null;
    }
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function formatDurationISO(duration?: string): string {
  if (!duration) return "5:20";
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "5:20";
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function sanitizeKidsQuery(query: string): {
  query: string;
  safe: boolean;
  explanation?: string;
} {
  const maturePattern =
    /\b(18\+|nsfw|porn|xxx|nude|sex|gore|blood|violence|horror|kill|murder|drug|alcohol)\b/i;
  if (maturePattern.test(query)) {
    return {
      query: "kids educational cartoons stories science",
      safe: false,
      explanation:
        "Kids Mode keeps searches safe & friendly. Showing educational cartoons instead!",
    };
  }
  return {
    query: query.trim()
      ? `${query.trim()} kids family cartoon learning animation`
      : "educational kids cartoons stories science",
    safe: true,
  };
}

export async function fetchYouTubeSearchClient(params: {
  q: string;
  kidsMode: boolean;
  live?: boolean;
  maxResults?: number;
  pageToken?: string | null;
}): Promise<{ items: any[]; nextPageToken?: string | null; fromFallback?: boolean }> {
  const { q, kidsMode, live = false, maxResults = 16, pageToken } = params;
  const backendQs = new URLSearchParams({
    maxResults: String(maxResults),
    q,
    kidsMode: String(kidsMode),
  });
  if (live) backendQs.set("live", "true");
  if (pageToken) backendQs.set("pageToken", pageToken);

  const backendData = await apiFetchJson<any>(
    `/api/youtube/search?${backendQs.toString()}`,
  );
  if (backendData?.items?.length) {
    return backendData;
  }

  let effectiveQuery = q || "latest bhakti song bhajan bageshwar dham pradeep mishra";
  if (kidsMode) {
    effectiveQuery = sanitizeKidsQuery(effectiveQuery).query;
  }

  try {
    const directUrl = new URL(`${YOUTUBE_BASE_URL}/search`);
    directUrl.searchParams.set("part", "snippet");
    directUrl.searchParams.set("type", "video");
    directUrl.searchParams.set("videoEmbeddable", "true");
    directUrl.searchParams.set("maxResults", String(maxResults));
    directUrl.searchParams.set("q", effectiveQuery);
    if (live) directUrl.searchParams.set("eventType", "live");
    if (kidsMode) directUrl.searchParams.set("safeSearch", "strict");
    if (pageToken) directUrl.searchParams.set("pageToken", pageToken);
    directUrl.searchParams.set("key", YOUTUBE_API_KEY);

    const res = await fetch(directUrl.toString());
    if (res.ok) {
      const data = await res.json();
      if (data?.items?.length) {
        return data;
      }
    }
  } catch (e) {
    console.warn("Direct YouTube API search failed, using offline fallback:", e);
  }

  return { items: [], nextPageToken: null, fromFallback: true };
}

export function parseYouTubeItems(items: any[]): YouTubeVideo[] {
  return items
    .map((item: any): YouTubeVideo | null => {
      const rawId = item?.id;
      const vId =
        typeof rawId === "object" && rawId !== null ? rawId.videoId : rawId;
      const snippet = item?.snippet;
      if (!vId || !snippet) return null;
      return {
        id: String(vId),
        title: snippet.title || "Untitled Video",
        thumbnail:
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
        channelId: snippet.channelId || "NexusCreator",
        channelTitle: snippet.channelTitle || "Creator",
        description: snippet.description || "",
        publishedAt: snippet.publishedAt || new Date().toISOString(),
        viewCount: item.statistics?.viewCount,
        likeCount: item.statistics?.likeCount,
        duration: item.contentDetails?.duration
          ? formatDurationISO(item.contentDetails.duration)
          : "5:20",
      };
    })
    .filter((v): v is YouTubeVideo => v !== null);
}

export async function fetchSuggestionsClient(params: {
  q: string;
  kidsMode: boolean;
  history: string[];
}): Promise<SearchSuggestionResponse> {
  const { q, kidsMode, history } = params;
  const backendData = await apiFetchJson<SearchSuggestionResponse>("/api/suggest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q, kidsMode, history }),
  });
  if (backendData && Array.isArray(backendData.suggestions)) {
    return backendData;
  }

  if (kidsMode) {
    const safety = sanitizeKidsQuery(q);
    if (!safety.safe) {
      return {
        suggestions: [
          "bal ganesha cartoon",
          "little krishna stories",
          "hanuman chalisa kids",
          "space science cartoons",
        ],
        safe: false,
        safetyExplanation: safety.explanation,
      };
    }
    const base = q.trim();
    const baseList = base
      ? [
          `${base} cartoon`,
          `${base} kids stories`,
          `${base} learning animation`,
          `${base} songs`,
        ]
      : [
          "bal ganesha cartoon",
          "little krishna tales",
          "hanuman chalisa for kids",
          "dinosaur science facts",
        ];
    return { suggestions: baseList, safe: true };
  }

  const base = q.trim();
  const matchingHistory = base
    ? history.filter((h) => h.toLowerCase().includes(base.toLowerCase()))
    : history;
  const suggestions = base
    ? Array.from(
        new Set([
          ...matchingHistory,
          `${base} bhajan`,
          `${base} katha`,
          `${base} live`,
          `${base} status`,
        ]),
      ).slice(0, 4)
    : Array.from(
        new Set([
          ...history.slice(0, 2),
          "bageshwar dham sarkar",
          "hanuman chalisa",
          "pradeep mishra katha",
          "morning bhakti song",
        ]),
      ).slice(0, 4);

  return { suggestions, safe: true };
}

export async function fetchCommentsClient(
  videoId: string,
): Promise<YouTubeComment[] | null> {
  const backendData = await apiFetchJson<any>(
    `/api/youtube/comments?videoId=${encodeURIComponent(videoId)}`,
  );
  const raw = backendData?.items?.length
    ? backendData
    : await (async () => {
        try {
          const res = await fetch(
            `${YOUTUBE_BASE_URL}/commentThreads?part=snippet&videoId=${encodeURIComponent(
              videoId,
            )}&maxResults=15&key=${YOUTUBE_API_KEY}`,
          );
          if (res.ok) return await res.json();
        } catch {
          return null;
        }
        return null;
      })();

  if (!raw?.items?.length) return null;
  return raw.items.map((c: any) => {
    const snippet = c.snippet?.topLevelComment?.snippet;
    return {
      id: c.id,
      authorName: snippet?.authorDisplayName || "Viewer",
      authorAvatar:
        snippet?.authorProfileImageUrl ||
        `https://api.dicebear.com/7.x/pixel-art/svg?seed=${c.id}`,
      textDisplay: snippet?.textDisplay || "",
      publishedAt: snippet?.publishedAt || new Date().toISOString(),
      likeCount: snippet?.likeCount || 0,
    };
  });
}

export async function summarizeVideoClient(video: YouTubeVideo): Promise<AISummary> {
  const backendData = await apiFetchJson<AISummary>("/api/gemini/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: video.title,
      description: video.description,
      channelTitle: video.channelTitle,
      tags: video.tags || [],
    }),
  });
  if (backendData?.summary) return backendData;

  const isKids =
    video.tags?.some((t) => /kid|cartoon|bal|krishna/i.test(t)) ||
    /kids|cartoon|bal ganesha|krishna/i.test(video.title);
  const desc = video.description?.trim()
    ? video.description.trim().slice(0, 180)
    : `Featured stream from ${video.channelTitle}.`;

  return {
    summary: `"${video.title}" by ${video.channelTitle}. ${desc}${
      desc.length >= 180 ? "..." : ""
    }`,
    bullets: [
      `Creator: ${video.channelTitle}`,
      video.duration ? `Watch duration: ${video.duration}` : "Full HD stream ready",
      isKids
        ? "Family & Kids Mode friendly educational entertainment"
        : "Supports Favorite saving, Secure Vault & Background Audio mode",
    ],
    sentiment: isKids ? "Joyful & Kid-Safe" : "Calm & Inspiring",
    kidsSafety: isKids
      ? "Approved - Great animated & devotional family content"
      : "Approved for general family viewing",
  };
}

export async function chatVideoClient(params: {
  message: string;
  video: YouTubeVideo;
  kidsMode: boolean;
}): Promise<string> {
  const { message, video, kidsMode } = params;
  const backendData = await apiFetchJson<{ reply?: string }>("/api/gemini/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      videoContext: {
        title: video.title,
        description: video.description,
        channelTitle: video.channelTitle,
      },
      kidsMode,
    }),
  });
  if (backendData?.reply) return backendData.reply;

  const lower = message.toLowerCase();
  if (lower.includes("channel") || lower.includes("who") || lower.includes("creator")) {
    return kidsMode
      ? `This fun video is shared by ${video.channelTitle}! 🌟`
      : `This video is published by ${video.channelTitle}.`;
  }
  if (lower.includes("safe") || lower.includes("kid")) {
    return kidsMode
      ? "Yes! You are in Kids Mode, so content and ads stay clean and safe! 🎈"
      : "This video is safe for general viewing and supports Kids Mode filtering.";
  }
  return kidsMode
    ? `Great question! "${video.title}" by ${video.channelTitle} is all about learning and joyful stories. Ask me anything else! ✨`
    : `About "${video.title}" (${video.channelTitle}): ${
        video.description?.slice(0, 160) ||
        "You can save it to Favorites, listen in Audio mode, or add comments."
      }`;
}

export async function assistantClient(params: {
  message: string;
  kidsMode: boolean;
}): Promise<string> {
  const { message, kidsMode } = params;
  const backendData = await apiFetchJson<{ reply?: string }>(
    "/api/gemini/assistant",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, kidsMode }),
    },
  );
  if (backendData?.reply) return backendData.reply;

  const q = message.toLowerCase();
  if (q.includes("kid")) {
    return kidsMode
      ? "Kids Mode is already active! Use the 4-digit Parental PIN anytime to switch back safely. 🧸"
      : "Tap 'Kids Mode' in the menu or bottom bar to set a 4-digit Parental PIN, filter kid-safe videos, and pause all ads!";
  }
  if (q.includes("ad") || q.includes("premium")) {
    return "Free users support the app with safe ads. Activate any Trial or Premium pass in the Premium tab for ad-free playback!";
  }
  if (q.includes("vault") || q.includes("lock")) {
    return "Tap the Lock icon on any video card or player bar to protect private videos inside your PIN-locked Secure Vault.";
  }
  return kidsMode
    ? "Hi Explorer! 🌟 Ask me about cartoons, Kids Mode, Favorites, or finding fun stories!"
    : "I'm Nexus AI! I can help you explore videos, set up Kids Mode PIN lock, manage your Secure Vault, Favorites, and Sync codes.";
}

async function sha256Hex(value: string): Promise<string> {
  if (window.crypto?.subtle) {
    const encoded = new TextEncoder().encode(value);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Minimal deterministic fallback when subtle crypto is unavailable in insecure contexts
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

export async function setupVaultPinClient(
  deviceId: string,
  pin: string,
): Promise<{ success: boolean; error?: string }> {
  const backendRes = await apiFetchJson<{ success?: boolean; error?: string }>(
    "/api/auth/setup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, password: pin }),
    },
  );
  if (backendRes?.success) {
    const hash = await sha256Hex(`${deviceId}:${pin}`);
    localStorage.setItem("nexus_vault_hash", hash);
    return { success: true };
  }
  const hash = await sha256Hex(`${deviceId}:${pin}`);
  localStorage.setItem("nexus_vault_hash", hash);
  return { success: true };
}

export async function loginVaultPinClient(
  deviceId: string,
  pin: string,
): Promise<{ success: boolean; error?: string }> {
  const backendRes = await apiFetchJson<{ success?: boolean; error?: string }>(
    "/api/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, password: pin }),
    },
  );
  if (backendRes) {
    if (backendRes.success) return { success: true };
    if (backendRes.error) return { success: false, error: backendRes.error };
  }
  const storedHash = localStorage.getItem("nexus_vault_hash");
  if (!storedHash) {
    return { success: false, error: "Vault password not found on device." };
  }
  const hash = await sha256Hex(`${deviceId}:${pin}`);
  return hash === storedHash
    ? { success: true }
    : { success: false, error: "Incorrect password" };
}
