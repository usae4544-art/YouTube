const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const chatEndpoint = `// 8. Gemini API - Video Chat
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
      model: "gemini-3.5-flash",
      contents: \`Context Video:
Title: \${videoContext.title}
Channel: \${videoContext.channelTitle || "Unknown"}
Description: \${videoContext.description ? videoContext.description.slice(0, 1000) : "None"}

User Question: \${message}\`,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini chat failed:", error);
    res.status(500).json({ error: "Failed to generate chat response", details: error.message });
  }
});

// 9. Cross-Device Sync - Create Sync Session`;

code = code.replace(/\/\/ 8\. Cross-Device Sync - Create Sync Session/, chatEndpoint);

fs.writeFileSync('server.ts', code);
