const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
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
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Nexus AI assistant failed:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});
`;

code = code.replace('// 9. Cross-Device Sync - Create Sync Session', newEndpoint + '\n// 9. Cross-Device Sync - Create Sync Session');
fs.writeFileSync('server.ts', code);
