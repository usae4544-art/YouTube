const { GoogleGenAI, Type } = require("@google/genai");
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});
(async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: "Test video",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING }
          },
          required: ["summary"]
        }
      }
    });
    console.log(response.text);
  } catch(e) {
    console.error("ERROR:", e.message);
  }
})();
