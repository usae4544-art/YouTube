const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});
(async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash-8b",
      contents: "Test video",
    });
    console.log(response.text);
  } catch(e) {
    console.error("ERROR:", e.message);
  }
})();
