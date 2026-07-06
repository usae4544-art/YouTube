import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load local environment variables if any (like in local dev)
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// YouTube Data API v3 Key (provided securely)
const YOUTUBE_API_KEY = "AIzaSyC2FmiTp2-VvU8DmecUd_3ltLyXsVlY3PY";
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

// Ensure synchronization storage directory exists in workspace
const SYNC_DIR = path.join(process.cwd(), "data");
const SYNC_FILE_PATH = path.join(SYNC_DIR, "sync_sessions.json");

if (!fs.existsSync(SYNC_DIR)) {
  fs.mkdirSync(SYNC_DIR, { recursive: true });
}
if (!fs.existsSync(SYNC_FILE_PATH)) {
  fs.writeFileSync(SYNC_FILE_PATH, JSON.stringify({}), "utf8");
}

// Helpers for Reading/Writing Sync Sessions
function readSyncSessions(): Record<string, any> {
  try {
    const data = fs.readFileSync(SYNC_FILE_PATH, "utf8");
    return JSON.parse(data || "{}");
  } catch (err) {
    console.error("Error reading sync sessions:", err);
    return {};
  }
}

function writeSyncSessions(sessions: Record<string, any>) {
  try {
    fs.writeFileSync(SYNC_FILE_PATH, JSON.stringify(sessions, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing sync sessions:", err);
  }
}

// ---------------------------------------------------------
// API ROUTES
// ---------------------------------------------------------

// 1. YouTube Proxy - Most Popular Videos
app.get("/api/youtube/popular", async (req, res) => {
  try {
    const maxResults = req.query.maxResults || "12";
    const pageToken = req.query.pageToken ? `&pageToken=${req.query.pageToken}` : "";
    const categoryId = req.query.videoCategoryId ? `&videoCategoryId=${req.query.videoCategoryId}` : "";
    
    const url = `${YOUTUBE_BASE_URL}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&maxResults=${maxResults}${pageToken}${categoryId}&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      return res.status(data.error.code || 400).json(data.error);
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch popular videos", details: error.message });
  }
});

// 2. YouTube Proxy - Search Videos
app.get("/api/youtube/search", async (req, res) => {
  try {
    const q = req.query.q as string || "trending";
    const maxResults = req.query.maxResults || "12";
    const pageToken = req.query.pageToken ? `&pageToken=${req.query.pageToken}` : "";
    const kidsMode = req.query.kidsMode === "true";
    
    // In Kids Mode, we append educational / fun keywords if the query isn't explicitly targeted
    let searchQuery = q;
    if (kidsMode) {
      // Basic check: if query has mature elements, let's sanitize it
      const hasMatureKeywords = /mature|18\+|violence|horror|gore|blood|kiss|sexy|nsfw/i.test(q);
      if (hasMatureKeywords) {
        searchQuery = "kids educational cartoons stories science";
      } else {
        // Boost family friendliness
        searchQuery = `${q} kids family cartoon learning animation educational`;
      }
    }

    const url = `${YOUTUBE_BASE_URL}/search?part=snippet&type=video&videoEmbeddable=true&maxResults=${maxResults}${pageToken}&q=${encodeURIComponent(searchQuery)}&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      return res.status(data.error.code || 400).json(data.error);
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to search videos", details: error.message });
  }
});

// 3. YouTube Proxy - Video Details
app.get("/api/youtube/video-details", async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: "Video ID is required" });
    }
    
    const url = `${YOUTUBE_BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${id}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.error) {
      return res.status(data.error.code || 400).json(data.error);
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch video details", details: error.message });
  }
});

// 4. YouTube Proxy - Comment Threads
app.get("/api/youtube/comments", async (req, res) => {
  try {
    const videoId = req.query.videoId as string;
    if (!videoId) {
      return res.status(400).json({ error: "Video ID is required" });
    }
    
    const url = `${YOUTUBE_BASE_URL}/commentThreads?part=snippet&videoId=${videoId}&maxResults=15&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    // Some videos disable comments. We return a friendly fallback inside the client or a success state with a mock flag
    if (data.error) {
      return res.json({ items: [], disabled: true, error: data.error.message });
    }
    res.json(data);
  } catch (error: any) {
    res.json({ items: [], disabled: true, error: error.message });
  }
});

// 5. YouTube Proxy - Channel details (for avatars)
app.get("/api/youtube/channel", async (req, res) => {
  try {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: "Channel ID is required" });
    }
    const url = `${YOUTUBE_BASE_URL}/channels?part=snippet,statistics&id=${id}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) {
      return res.status(data.error.code || 400).json(data.error);
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch channel details" });
  }
});

// 6. Gemini API - Intelligent Search Suggestions
app.get("/api/gemini/suggest", async (req, res) => {
  try {
    const q = req.query.q as string || "";
    const kidsMode = req.query.kidsMode === "true";
    
    if (!q.trim()) {
      return res.json({ suggestions: [], safe: true });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback suggestions if API key isn't loaded
      const defaultSuggestions = [
        `${q} tutorial`,
        `${q} reaction`,
        `${q} music`,
        `${q} highlight`,
        `${q} gaming review`
      ];
      return res.json({ suggestions: defaultSuggestions, safe: true });
    }

    const systemPrompt = kidsMode
      ? "You are a safe, educational assistant for young kids. Provide a list of exactly 5 fun, kid-friendly search suggestions that start with or relate to the user's input. Ensure they are educational, fun, and totally appropriate for ages 3-10 (no violence, gaming with mature themes, or suggestive text). If the user enters anything inappropriate, output safe alternatives like 'dinosaur science facts'."
      : "You are a helpful, smart search assistant. Provide a list of exactly 5 relevant, popular, and high-quality video search queries or suggestions based on the user's partial text input. Make them diverse and engaging.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Suggest 5 queries based on: "${q}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 5 search suggestions"
            },
            safe: {
              type: Type.BOOLEAN,
              description: "Whether the original query was safe. If highly unsafe, set to false."
            },
            safetyExplanation: {
              type: Type.STRING,
              description: "If unsafe, a friendly child-appropriate explanation of why we filtered it, otherwise empty."
            }
          },
          required: ["suggestions", "safe"]
        }
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    res.json(result);
  } catch (error: any) {
    console.error("Gemini suggestion failed:", error);
    res.json({
      suggestions: [`${req.query.q} review`, `${req.query.q} live`, `${req.query.q} details`],
      safe: true
    });
  }
});

// 7. Gemini API - AI Video Summarization (High Thinking feature can be optional or default to flash)
app.post("/api/gemini/summarize", async (req, res) => {
  try {
    const { title, description, channelTitle, tags } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required for summarization" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        summary: "An interactive, entertaining video by " + (channelTitle || "creator") + ". Watch to learn more details!",
        bullets: ["High-quality content production", "Enlightening concepts and visual edits", "User-friendly breakdown"],
        sentiment: "Positive & Informative",
        kidsSafety: "Approved for family viewing"
      });
    }

    const systemPrompt = "You are an expert video analyst. Analyze the video details provided (title, description, channel, tags) and generate: 1. A 2-sentence summary. 2. Exactly 3 key highlights/bullets. 3. The general mood or sentiment of the video. 4. A kids-safety rating ('Approved', 'Requires Parent Supervision', 'Not recommended for Kids') with a brief 1-sentence explanation.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analyze this video:
Title: ${title}
Channel: ${channelTitle || "Unknown"}
Tags: ${tags ? tags.join(", ") : "None"}
Description: ${description ? description.slice(0, 1000) : "No description provided."}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A concise 2-sentence summary of the video." },
            bullets: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 bulleted key takeaways, highlights, or secrets revealed in the video."
            },
            sentiment: { type: Type.STRING, description: "The overall vibe/mood (e.g. Energetic, Educational, Calming, Hype)." },
            kidsSafety: { type: Type.STRING, description: "Detailed safety rating for kids (e.g., 'Approved - Great educational value')" }
          },
          required: ["summary", "bullets", "sentiment", "kidsSafety"]
        }
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    res.json(result);
  } catch (error: any) {
    console.error("Gemini summarization failed:", error);
    res.status(500).json({ error: "Failed to generate AI summary", details: error.message });
  }
});

// 8. Cross-Device Sync - Create Sync Session
app.post("/api/sync/create", (req, res) => {
  try {
    const sessions = readSyncSessions();
    
    // Generate unique 6-digit uppercase code (e.g., YT-A7B8)
    let code = "";
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // clear readable characters
    do {
      code = "YT-";
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (sessions[code]);

    const initialData = {
      code,
      favorites: [],
      history: [],
      playlists: [],
      preferences: {
        theme: "dark",
        kidsMode: false,
        fontSize: "md",
        kidsTheme: "candy"
      },
      updatedAt: new Date().toISOString()
    };

    sessions[code] = initialData;
    writeSyncSessions(sessions);
    
    res.json(initialData);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate sync code", details: error.message });
  }
});

// 9. Cross-Device Sync - Get Session Data
app.get("/api/sync/get/:code", (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const sessions = readSyncSessions();
    
    if (!sessions[code]) {
      return res.status(404).json({ error: "Invalid sync code. Please check and try again." });
    }
    
    res.json(sessions[code]);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve sync session", details: error.message });
  }
});

// 10. Cross-Device Sync - Update Session Data
app.post("/api/sync/update/:code", (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const { favorites, history, playlists, preferences } = req.body;
    
    const sessions = readSyncSessions();
    if (!sessions[code]) {
      return res.status(404).json({ error: "Sync session not found" });
    }
    
    sessions[code] = {
      ...sessions[code],
      favorites: favorites || sessions[code].favorites || [],
      history: history || sessions[code].history || [],
      playlists: playlists || sessions[code].playlists || [],
      preferences: preferences || sessions[code].preferences || {},
      updatedAt: new Date().toISOString()
    };
    
    writeSyncSessions(sessions);
    res.json({ success: true, session: sessions[code] });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update sync session", details: error.message });
  }
});

// ---------------------------------------------------------
// VITE DEV SERVER / PRODUCTION SERVING
// ---------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Serve HTML fallback for single page application routing
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Premium Dark Video Portal] Server running on http://localhost:${PORT}`);
  });
}

startServer();
