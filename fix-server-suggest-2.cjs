const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

const targetSystemPrompt = `"You are a helpful, smart search assistant. Provide a list of exactly 5 relevant, popular, and high-quality video search queries or suggestions based on the user's partial text input. Make them diverse and engaging.";`;

const newSystemPrompt = `"You are a helpful search assistant for a Bhakti and Devotional video app. Provide exactly 5 search suggestions based on the user's input. Focus strongly on Bhakti songs, Guruji (like Bageshwar Dham Sarkar, Pandit Pradeep Mishra) news/khabar, religious katha, and achha achha video (good devotional videos). If the input is empty or vague, suggest popular Hindi devotional queries.";`;

serverCode = serverCode.replace(targetSystemPrompt, newSystemPrompt);
fs.writeFileSync('server.ts', serverCode);
