const fs = require('fs');
let code = fs.readFileSync('src/components/MusicTab.tsx', 'utf8');

if (!code.includes('homeError')) {
  code = code.replace(
    'const [isLoadingHome, setIsLoadingHome] = useState(true);',
    'const [isLoadingHome, setIsLoadingHome] = useState(true);\n  const [homeError, setHomeError] = useState<string | null>(null);'
  );

  const oldEffect = `  useEffect(() => {
    let active = true;
    const fetchHomeData = async () => {
      setIsLoadingHome(true);
      const data: Record<string, Song[]> = {};
      
      try {
        await Promise.all(CATEGORIES.map(async (cat) => {
          const res = await fetch(\`https://musicapi.x007.workers.dev/search?q=\${encodeURIComponent(cat.query)}&searchEngine=gaama\`);
          if (res.ok) {
            const json = await res.json();
            if (json && json.response) data[cat.id] = json.response;
            else if (Array.isArray(json)) data[cat.id] = json;
            else if (json && json.data) data[cat.id] = json.data;
            else data[cat.id] = [];
          }
        }));
        if (active) {
          setHomeData(data);
        }
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        if (active) setIsLoadingHome(false);
      }
    };
    fetchHomeData();
    return () => { active = false; };
  }, []);`;

  const newEffect = `  useEffect(() => {
    let active = true;
    const fetchHomeData = async () => {
      setIsLoadingHome(true);
      setHomeError(null);
      const data: Record<string, Song[]> = {};
      
      try {
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
        }));
        if (active) {
          const hasAnyData = Object.values(data).some(arr => arr.length > 0);
          if (!hasAnyData) {
             setHomeError("Unable to connect to the music server. It may be temporarily down.");
          }
          setHomeData(data);
        }
      } catch (err) {
        console.error("Failed to load home data", err);
        if (active) setHomeError("Failed to connect to the music server.");
      } finally {
        if (active) setIsLoadingHome(false);
      }
    };
    fetchHomeData();
    return () => { active = false; };
  }, []);`;

  code = code.replace(oldEffect, newEffect);
  
  const oldHomeView = `<div className="space-y-10">
            {isLoadingHome ? (
              <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                <p>Loading curated music...</p>
              </div>
            ) : (`;
            
  const newHomeView = `<div className="space-y-10">
            {isLoadingHome ? (
              <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                <p>Loading curated music...</p>
              </div>
            ) : homeError ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-400 font-medium">{homeError}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors mt-4">
                   Try Again
                </button>
              </div>
            ) : (`;

  code = code.replace(oldHomeView, newHomeView);

  fs.writeFileSync('src/components/MusicTab.tsx', code);
}
