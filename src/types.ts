export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
  channelAvatar?: string;
  description: string;
  publishedAt: string;
  viewCount?: string;
  likeCount?: string;
  duration?: string;
  tags?: string[];
}

export interface YouTubeComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  textDisplay: string;
  publishedAt: string;
  likeCount: number;
}

export interface AISummary {
  summary: string;
  bullets: string[];
  sentiment: string;
  kidsSafety: string;
}

export interface SyncSession {
  code: string;
  favorites: YouTubeVideo[];
  history: YouTubeVideo[];
  playlists: {
    id: string;
    name: string;
    videoIds: string[];
  }[];
  preferences: {
    theme: "dark" | "kids";
    kidsMode: boolean;
    fontSize: "sm" | "md" | "lg" | "xl";
    kidsTheme?: "candy" | "space" | "jungle";
  };
  updatedAt: string;
}

export interface SearchSuggestionResponse {
  suggestions: string[];
  safe: boolean;
  safetyExplanation?: string;
}

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}
