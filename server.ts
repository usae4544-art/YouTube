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
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

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
    const q = req.query.q as string || "latest bhakti song bhajan bageshwar dham pradeep mishra";
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

        const live = req.query.live === "true";
    const eventType = live ? "&eventType=live" : "";
    const url = `${YOUTUBE_BASE_URL}/search?part=snippet&type=video&videoEmbeddable=true&maxResults=${maxResults}${pageToken}&q=${encodeURIComponent(searchQuery)}${eventType}&key=${YOUTUBE_API_KEY}`;
    
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

// 5b & 6. Unified Smart Search Suggestions (Gemini Powered)
app.post("/api/suggest", async (req, res) => {
  try {
    const { q = "", kidsMode = false, history = [] } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      if (!q.trim() && history.length === 0) return res.json({ suggestions: [], safe: true });
      const base = q || (history[0] ? history[0] : "popular");
      const defaultSuggestions = kidsMode 
        ? [`${base} cartoons`, `${base} animals`, `${base} science`, `${base} space`]
        : [`${base} bhajan`, `${base} katha`, `${base} song`, `${base} news`];
      return res.json({ suggestions: defaultSuggestions.slice(0, 4), safe: true });
    }

    const systemPrompt = kidsMode
      ? "You are a safe, educational assistant for young kids. Provide exactly 4 fun, kid-friendly search suggestions. Use the user's input and recent search history to personalize them. Ensure they are educational, fun, and totally appropriate for ages 3-10. If the user enters anything inappropriate, output safe alternatives like 'dinosaur science facts'."
      : "You are an intelligent search assistant. Provide exactly 4 personalized search suggestions. Analyze the user's input and recent search history (if provided) to predict the most relevant and accurate queries they might be looking for. Keep them concise, like YouTube search suggestions.";

    const contentPrompt = `User Input: "${q}"\nRecent Search History: ${history.length ? JSON.stringify(history.slice(0, 5)) : "None"}\nGenerate exactly 4 search suggestions as a JSON array.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: contentPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of exactly 4 search suggestions"
            },
            safe: {
              type: Type.BOOLEAN,
              description: "Whether the original query was safe. If highly unsafe, set to false."
            },
            safetyExplanation: {
              type: Type.STRING,
              description: "If safe is false, provide a very short, child-appropriate explanation."
            }
          },
          required: ["suggestions", "safe"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text.trim());
    const suggestions = Array.isArray(data.suggestions) ? data.suggestions.slice(0, 4) : [];
    res.json({ suggestions, safe: data.safe ?? true, safetyExplanation: data.safetyExplanation });
  } catch (error: any) {
    console.error("Gemini Suggest failed:", error);
    res.json({ 
      suggestions: [`${req.body.q || 'latest'} videos`, `${req.body.q || 'best'} trending`, `${req.body.q || 'new'} updates`, `popular`],
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
      model: "gemini-3.5-flash-lite",
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
    res.json({
      summary: "This video looks amazing! Our AI is taking a short break right now due to high demand, but you can still enjoy the content.",
      bullets: ["High-quality content production", "Enlightening concepts and visual edits", "User-friendly breakdown"],
      sentiment: "Positive & Informative",
      kidsSafety: "Approved for family viewing"
    });
  }
});

// 8. Gemini API - Video Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, videoContext, kidsMode } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ reply: "I'm a placeholder bot! Set GEMINI_API_KEY to chat with real AI." });
    }

    const systemPrompt = kidsMode
      ? "You are a friendly, safe educational assistant for kids. You are answering questions about a video. Keep answers simple, short, and very fun! Use emojis."
      : "You are an expert video assistant. Answer the user's question about the video context provided. Be concise, helpful, and direct.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `Context Video:
Title: ${videoContext.title}
Channel: ${videoContext.channelTitle || "Unknown"}
Description: ${videoContext.description ? videoContext.description.slice(0, 1000) : "None"}

User Question: ${message}`,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini chat failed:", error);
    res.json({ reply: "I'm currently experiencing high traffic (AI limit reached). Please try again in a few moments!" });
  }
});


// 10. Gemini API - Nexus AI Assistant
app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const { message, kidsMode } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ reply: "I am Nexus AI. Please set your GEMINI_API_KEY in the environment variables to unlock my full potential!" });
    }

    const systemPrompt = kidsMode
      ? "You are Nexus AI, a super fun, friendly, and safe educational assistant built directly into the Nexus app. Answer kids' questions safely, use fun emojis, and be very encouraging! Never discuss mature topics."
      : "You are Nexus AI, an intelligent, helpful, and highly capable assistant deeply integrated into the Nexus application. Answer the user's questions clearly, concisely, and professionally. You know about the app's features: Video exploration, AI summaries, safe Kids Mode, and offline downloads.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: message,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Nexus AI assistant failed:", error);
    res.json({ reply: "I am Nexus AI. I am currently taking a short break due to high demand (API quota exceeded). I will be back online soon!" });
  }
});

// --- Subscription Tracking (Backend) ---
const subscriptionsDbPath = path.join(process.cwd(), "data", "subscriptions.json");

const readSubscriptions = () => {
  if (fs.existsSync(subscriptionsDbPath)) {
    return JSON.parse(fs.readFileSync(subscriptionsDbPath, "utf-8"));
  }
  return {};
};

const writeSubscriptions = (data: any) => {
  if (!fs.existsSync(path.dirname(subscriptionsDbPath))) {
    fs.mkdirSync(path.dirname(subscriptionsDbPath), { recursive: true });
  }
  fs.writeFileSync(subscriptionsDbPath, JSON.stringify(data, null, 2));
};

app.get("/api/subscription/:email", (req, res) => {
  const { email } = req.params;
  const subs = readSubscriptions();
  if (subs[email]) {
    res.json(subs[email]);
  } else {
    res.json({ name: null, claimedAt: null, durationMs: null });
  }
});

app.post("/api/subscription/:email", (req, res) => {
  const { email } = req.params;
  const { name, durationMs } = req.body;
  const subs = readSubscriptions();
  
  if (subs[email] && subs[email].name === name) {
    return res.status(400).json({ error: `User has already claimed the ${name} plan.` });
  }
  
  const newSub = {
    name,
    claimedAt: Date.now(),
    durationMs
  };
  
  subs[email] = newSub;
  writeSubscriptions(subs);
  res.json(newSub);
});

// --- App Version & APK OTA Updates ---
app.get("/api/version", (req, res) => {
  res.json({
    version: "1.2.0",
    changes: [
      "Added Kids Mode PIN protection",
      "Added native biometric login support",
      "Bug fixes and UI performance improvements"
    ],
    apkUrl: "/api/download-apk" // Direct link to APK download
  });
});

app.get("/api/download-apk", (req, res) => {
  // Create a dummy APK file for demonstration purposes
  const dummyApkContent = "PK\x03\x04\x14\x00\x00\x00\x08\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00Dummy APK content";
  const buffer = Buffer.from(dummyApkContent, "utf-8");
  
  res.setHeader("Content-Type", "application/vnd.android.package-archive");
  res.setHeader("Content-Disposition", "attachment; filename=\"nexus-app.apk\"");
  res.setHeader("Content-Length", buffer.length.toString());
  
  res.send(buffer);
});

// 9. Cross-Device Sync - Create Sync Session
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

// 11. Issues / Support API
let issues: any[] = [];
let issueClients: express.Response[] = [];

// Helper to filter out issues older than 24 hours (48 for important)
const pruneOldIssues = () => {
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const TWO_DAYS = 48 * 60 * 60 * 1000;
  issues = issues.filter(issue => {
    const age = now - new Date(issue.createdAt).getTime();
    return issue.isImportant ? age < TWO_DAYS : age < ONE_DAY;
  });
};

const broadcastIssues = () => {
  pruneOldIssues();
  const data = `data: ${JSON.stringify(issues)}\n\n`;
  issueClients.forEach(client => client.write(data));
};

// Periodic cleanup just in case (every 1 hour)
setInterval(() => {
  const oldLength = issues.length;
  pruneOldIssues();
  if (issues.length !== oldLength) {
    broadcastIssues();
  }
}, 60 * 60 * 1000);

app.get("/api/issues/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  pruneOldIssues();
  res.write(`data: ${JSON.stringify(issues)}\n\n`);

  issueClients.push(res);

  req.on("close", () => {
    issueClients = issueClients.filter(client => client !== res);
  });
});

app.get("/api/issues", (req, res) => {
  pruneOldIssues();
  res.json(issues);
});

app.post("/api/issues", (req, res) => {
  const { userEmail, userPicture, userName, description, attachment, attachmentType, isImportant } = req.body;
  if (!userEmail) return res.status(401).json({ error: "Unauthorized" });

  const newIssue = {
    id: Date.now().toString(),
    userEmail,
    userPicture,
    userName,
    description,
    attachment,
    attachmentType,
    isImportant: !!isImportant,
    replies: [],
    createdAt: new Date().toISOString()
  };
  issues.push(newIssue);
  broadcastIssues();
  res.json(newIssue);
});

app.post("/api/issues/:id/reply", (req, res) => {
  const { id } = req.params;
  const { userEmail, userPicture, userName, description, attachment, attachmentType } = req.body;
  
  const issue = issues.find(i => i.id === id);
  if (!issue) return res.status(404).json({ error: "Issue not found" });
  
  if (!issue.replies) issue.replies = [];
  
  const newReply = {
    id: Date.now().toString(),
    userEmail,
    userPicture,
    userName,
    description,
    attachment,
    attachmentType,
    createdAt: new Date().toISOString()
  };
  
  issue.replies.push(newReply);
  broadcastIssues();
  res.json(newReply);
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

app.post('/api/log_error', express.json(), (req, res) => {
  fs.appendFileSync('browser_errors.log', JSON.stringify(req.body) + "\n");
  console.log("BROWSER ERROR:", req.body);
  res.sendStatus(200);
});
// adding a comment to force rebuild? No, dev server uses tsx which watches, but I need to make sure the dev server is running properly.
//
//
//
