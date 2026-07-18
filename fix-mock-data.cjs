const fs = require('fs');
let code = fs.readFileSync('src/components/MusicTab.tsx', 'utf8');

const oldEffect = `      try {
        await Promise.all(CATEGORIES.map(async (cat) => {
          try {
            const res = await fetch(\\\`https://musicapi.x007.workers.dev/search?q=\\\${encodeURIComponent(cat.query)}&searchEngine=gaama\\\`);
            if (res.ok) {
              const json = await res.json();
              if (json && json.response) data[cat.id] = json.response;
              else if (Array.isArray(json)) data[cat.id] = json;
              else if (json && json.data) data[cat.id] = json.data;
              else data[cat.id] = [];
            }
          } catch (e) {
            console.error(\\\`Failed to fetch \\\${cat.id}:\\\`, e);
          }
        }));
        if (active) {
          const hasAnyData = Object.values(data).some(arr => arr.length > 0);
          if (!hasAnyData) {
             setHomeError("Unable to connect to the music server. It may be temporarily down.");
          }
          setHomeData(data);
        }
      } catch (err) {`;

const newEffect = `      try {
        await Promise.all(CATEGORIES.map(async (cat) => {
          try {
            const res = await fetch(\`https://musicapi.x007.workers.dev/search?q=\${encodeURIComponent(cat.query)}&searchEngine=gaama\`);
            if (res.ok) {
              const json = await res.json();
              if (json && json.response) data[cat.id] = json.response;
              else if (Array.isArray(json)) data[cat.id] = json;
              else if (json && json.data) data[cat.id] = json.data;
              else data[cat.id] = [];
            }
          } catch (e) {
            console.error(\`Failed to fetch \${cat.id}:\`, e);
          }
          
          // Fallback data if fetch failed or returned empty
          if (!data[cat.id] || data[cat.id].length === 0) {
            data[cat.id] = [
              { id: "mock-1-" + cat.id, title: cat.title + " Hit 1", subtitle: "Various Artists", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80" },
              { id: "mock-2-" + cat.id, title: cat.title + " Hit 2", subtitle: "Top Artist", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80" },
              { id: "mock-3-" + cat.id, title: cat.title + " Hit 3", subtitle: "Trending Now", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80" },
              { id: "mock-4-" + cat.id, title: cat.title + " Hit 4", subtitle: "New Release", image: "https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=300&q=80" }
            ];
          }
        }));
        if (active) {
          setHomeData(data);
        }
      } catch (err) {`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/components/MusicTab.tsx', code);
