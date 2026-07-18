const fs = require('fs');
let code = fs.readFileSync('src/components/MusicTab.tsx', 'utf8');

const oldFetch = `      const res = await fetch(\`https://musicapi.x007.workers.dev/fetch?id=\${song.id}\`);
      const data = await res.json();
      
      // Data might contain stream URL or hls. Assuming direct mp3 or url is in data.response or data.url
      let urlToPlay = "";
      if (typeof data === "string") urlToPlay = data;
      else if (data && data.url) urlToPlay = data.url;
      else if (data && data.response && data.response.url) urlToPlay = data.response.url;
      else if (data && data.response) urlToPlay = data.response;`;

const newFetch = `      const res = await fetch(\`https://musicapi.x007.workers.dev/fetch?id=\${song.id}\`);
      let urlToPlay = "";
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (typeof data === "string") urlToPlay = data;
        else if (data && data.url) urlToPlay = data.url;
        else if (data && data.response && data.response.url) urlToPlay = data.response.url;
        else if (data && data.response) urlToPlay = data.response;
      } else {
        const text = await res.text();
        urlToPlay = text.trim();
      }`;

code = code.replace(oldFetch, newFetch);

fs.writeFileSync('src/components/MusicTab.tsx', code);
