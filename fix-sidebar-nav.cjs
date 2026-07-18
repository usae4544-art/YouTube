const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const sidebarTarget = `<aside className={\`hidden md:flex flex-col w-64 lg:w-72 border-r overflow-y-auto scrollbar-none \${kidsMode ? "bg-white/40 border-white/50 backdrop-blur-3xl backdrop-saturate-200" : "bg-[#0b0b12]/50 border-white/10 backdrop-blur-3xl backdrop-saturate-200"}\`}>
                  <div className="p-4 space-y-2">
                     <button onClick={() => { setActiveTab("home"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "home" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <Home className="w-6 h-6" /> <span className="font-bold">Home</span>
                     </button>
                     <button onClick={() => { setActiveTab("favorites"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "favorites" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <Heart className="w-6 h-6" /> <span className="font-bold">Favorites</span>
                     </button>
                     <button onClick={() => { setIsOfflineMode(true); setActiveTab("offline"); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <DownloadCloud className="w-6 h-6" /> <span className="font-bold">Offline</span>
                     </button>
                     <button onClick={() => { setActiveTab("history"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "history" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <History className="w-6 h-6" /> <span className="font-bold">History</span>
                     </button>
                     <button onClick={() => { setActiveTab("upload"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "upload" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <Upload className="w-6 h-6" /> <span className="font-bold">Upload</span>
                     </button>
                     <button onClick={() => { setActiveTab("profile"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "profile" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <User className="w-6 h-6" /> <span className="font-bold">Profile</span>
                     </button>
                  </div>
               </aside>`;

const sidebarNew = `<aside className={\`hidden md:flex flex-col w-64 lg:w-72 border-r overflow-y-auto scrollbar-none justify-between \${kidsMode ? "bg-white/40 border-white/50 backdrop-blur-3xl backdrop-saturate-200" : "bg-[#0b0b12]/50 border-white/10 backdrop-blur-3xl backdrop-saturate-200"}\`}>
                  <div className="p-4 space-y-2">
                     <button onClick={() => { setActiveTab("home"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "home" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <Home className="w-6 h-6" /> <span className="font-bold">Home</span>
                     </button>
                     <button onClick={() => { setIsOfflineMode(true); setActiveTab("offline"); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <DownloadCloud className="w-6 h-6" /> <span className="font-bold">Offline</span>
                     </button>
                     <button onClick={() => { setActiveTab("history"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "history" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <History className="w-6 h-6" /> <span className="font-bold">History</span>
                     </button>
                     <button onClick={() => { setActiveTab("upload"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "upload" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <Upload className="w-6 h-6" /> <span className="font-bold">Upload</span>
                     </button>
                  </div>
                  <div className="p-4 space-y-2 border-t border-white/10">
                     <button onClick={() => { setActiveTab("favorites"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "favorites" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <Heart className="w-6 h-6" /> <span className="font-bold">Subscriptions</span>
                     </button>
                     <button onClick={() => { setActiveTab("profile"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "profile" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <User className="w-6 h-6" /> <span className="font-bold">Profile</span>
                     </button>
                     <button onClick={toggleKidsMode} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors mt-2 \${kidsMode ? "bg-rose-500 text-white shadow-md hover:bg-rose-600" : "bg-white/10 text-white hover:bg-white/20"}\`}>
                       <Baby className="w-6 h-6" /> <span className="font-bold">{kidsMode ? "Exit Kids Mode" : "Kids Mode"}</span>
                     </button>
                  </div>
               </aside>`;

code = code.replace(sidebarTarget, sidebarNew);

const headerKidsBtn = `<button onClick={toggleKidsMode} className={\`px-4 py-2 rounded-full font-bold text-sm transition-all \${kidsMode ? "bg-white text-rose-500 shadow-md" : "bg-white/10 text-white hover:bg-white/20"}\`}>
                    {kidsMode ? "Exit Kids Mode" : "Kids Mode"}
                  </button>`;
code = code.replace(headerKidsBtn, ''); // Remove kids mode from header since it's now in the sidebar

fs.writeFileSync('src/App.tsx', code);
