const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Remove import
code = code.replace(/import MusicTab from "\.\/components\/MusicTab";\n/, "");

// Remove from tab types
code = code.replace(/ \| "music"/g, "");

// Remove the Music Tab render block
const musicTabRender = `                  {activeTab === "music" && !isOfflineMode && (
                    <div className="h-full">
                      <MusicTab kidsMode={kidsMode} />
                    </div>
                  )}\n`;
code = code.replace(musicTabRender, "");

// Remove the sidebar icon
const musicSidebarIconPattern = /<button[\s\S]*?onClick=\{\(\) => setActiveTab\("music"\)\}[\s\S]*?<\/button>\n/g;
code = code.replace(musicSidebarIconPattern, "");

// Remove mobile bottom bar icon
const musicMobileIconPattern = /<button[\s\S]*?onClick=\{\(\) => setActiveTab\("music"\)\}[\s\S]*?<\/button>\n/g;
code = code.replace(musicMobileIconPattern, "");

fs.writeFileSync('src/App.tsx', code);
