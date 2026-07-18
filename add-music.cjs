const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Import MusicTab
if (!code.includes('import MusicTab')) {
  code = code.replace(
    'import SyncHub from "./components/SyncHub";',
    'import SyncHub from "./components/SyncHub";\nimport MusicTab from "./components/MusicTab";'
  );
}

// 2. Update activeTab state
code = code.replace(
  /const \[activeTab, setActiveTab\] = useState<"home" \| "favorites" \| "history" \| "offline" \| "live" \| "profile" \| "upload">/,
  'const [activeTab, setActiveTab] = useState<"home" | "favorites" | "history" | "offline" | "live" | "profile" | "upload" | "music">'
);

// 3. Add to Desktop Nav
const historyNavBtn = `<button
                  id="nav-history-btn"
                  onClick={() => { setActiveTab("history"); setIsOfflineMode(false); }}`;
                  
const musicNavBtn = `<button
                  id="nav-music-btn"
                  onClick={() => { setActiveTab("music"); setIsOfflineMode(false); }}
                  className={\`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer \${
                    activeTab === "music" && !isOfflineMode
                      ? kidsMode
                        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                        : "bg-white/5 border border-white/5 text-white"
                      : kidsMode ? "hover:bg-rose-100 text-rose-900" : "text-gray-400 hover:text-white hover:bg-white/3"
                  }\`}
                >
                  <Music className="w-5 h-5" />
                  <span>Music</span>
                </button>

                `;

if (!code.includes('id="nav-music-btn"')) {
  code = code.replace(historyNavBtn, musicNavBtn + historyNavBtn);
}

// 4. Add to Mobile Nav
const mobNavUpload = `<button
                id="mob-nav-upload"`;
const mobNavMusic = `<button
                id="mob-nav-music"
                onClick={() => { setActiveTab("music"); setIsOfflineMode(false); }}
                className={\`flex flex-col items-center gap-1 text-[10px] font-bold \${
                  activeTab === "music" && !isOfflineMode
                    ? kidsMode ? "text-rose-500" : "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }\`}
              >
                <Music className="w-6 h-6" />
                <span>Music</span>
              </button>

              `;

if (!code.includes('id="mob-nav-music"')) {
  code = code.replace(mobNavUpload, mobNavMusic + mobNavUpload);
}

// 5. Render MusicTab in the main content area
const profileRender = `{activeTab === "profile" && !isOfflineMode && (`;
const musicRender = `{activeTab === "music" && !isOfflineMode && (
                    <div className="h-full">
                      <MusicTab kidsMode={kidsMode} />
                    </div>
                  )}

                  `;

if (!code.includes('<MusicTab kidsMode={kidsMode} />')) {
  code = code.replace(profileRender, musicRender + profileRender);
}

fs.writeFileSync('src/App.tsx', code);
