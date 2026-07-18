const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

const targetPrompt = \`        const prompt = kidsMode
          ? \`You are a safe kids assistant. Generate 5 short, fun, safe YouTube search suggestions for kids based on "\${q}". Return JSON format: { "suggestions": ["query1"] }\`
          : \`Please generate 5 short, popular YouTube search query suggestions based on this partial input: "\${q}"\\n\\nReturn JSON in this format: { "suggestions": ["query1", "query2"] }.\`;\`;

const newPrompt = \`        const prompt = kidsMode
          ? \`You are a safe kids assistant. Generate 5 short, fun, safe YouTube search suggestions for kids based on "\${q}". Return JSON format: { "suggestions": ["query1"] }\`
          : \`Please generate 5 short, popular YouTube search query suggestions based on this partial input: "\${q}". Focus primarily on Bhakti songs, Guruji (Bageshwar Dham / Pradeep Mishra) khabar, devotional content, and nice videos (achha video). If the input is empty or vague, suggest things like "Bhakti song hindi", "Guruji Bageshwar Dham latest khabar", "Best bhajan achha video", "Hanuman chalisa".\\n\\nReturn JSON in this format: { "suggestions": ["query1", "query2"] }.\`;\`;

if (serverCode.includes('Please generate 5 short, popular YouTube search query suggestions')) {
  serverCode = serverCode.replace(targetPrompt, newPrompt);
  fs.writeFileSync('server.ts', serverCode);
} else {
  console.log("Could not find the target string.");
}
