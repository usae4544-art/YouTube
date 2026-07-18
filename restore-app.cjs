const fs = require('fs');
let code = fs.readFileSync('/tmp/app_current.txt', 'utf8');

const startMarker = '{/* Brand title */}\n                <div className="flex items-center gap-4">';
const endMarker = '              <button\n                id="mob-nav-upload"';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1) {
    console.error("Start marker not found");
    process.exit(1);
}
if (endIndex === -1) {
    console.error("End marker not found");
    process.exit(1);
}

const missingCode = `
                  <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
                    <span className={\`w-8 h-8 rounded-xl flex items-center justify-center text-white \${kidsMode ? "bg-rose-500" : "bg-red-600"}\`}>
                      <Play className="w-4 h-4 ml-0.5" />
                    </span>
                    Nexus
                  </h1>
                </div>

                <div className="flex-1 max-w-2xl mx-auto px-4 md:px-12">
                   <SearchBar query={currentQuery} setQuery={setCurrentQuery} kidsMode={kidsMode} />
                </div>
                
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                  <button onClick={() => setIsKidsMode(!kidsMode)} className={\`px-4 py-2 rounded-full font-bold text-sm transition-all \${kidsMode ? "bg-white text-rose-500 shadow-md" : "bg-white/10 text-white hover:bg-white/20"}\`}>
                    {kidsMode ? "Exit Kids Mode" : "Kids Mode"}
                  </button>
                  <button onClick={() => setIsSyncOpen(true)} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </header>

            {/* MAIN LAYOUT */}
            <div className="flex flex-1 overflow-hidden">
               {/* SIDEBAR */}
               <aside className={\`hidden md:flex flex-col w-64 lg:w-72 border-r overflow-y-auto scrollbar-none \${kidsMode ? "bg-white/50 border-rose-100" : "bg-[#0f0f0f] border-white/10"}\`}>
                  <div className="p-4 space-y-2">
                     <button onClick={() => { setActiveTab("home"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "home" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <Home className="w-6 h-6" /> <span className="font-bold">Home</span>
                     </button>
                     <button onClick={() => { setActiveTab("favorites"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "favorites" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <Heart className="w-6 h-6" /> <span className="font-bold">Favorites</span>
                     </button>
                     <button onClick={() => { setIsOfflineMode(true); setActiveTab("offline"); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <Download className="w-6 h-6" /> <span className="font-bold">Offline</span>
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
               </aside>

               {/* MAIN CONTENT AREA */}
               <main className="flex-1 relative overflow-y-auto p-4 md:p-8 pb-32 md:pb-8 scrollbar-none">
                  {activeTab === "home" && !isOfflineMode && (
                     <VideoGrid
                        videos={getDisplayedVideos()}
                        onSelectVideo={handleSelectVideo}
                        kidsMode={kidsMode}
                        isLoading={isLoading}
                        downloadedVideos={downloadedVideos}
                        onToggleDownload={handleToggleDownload}
                     />
                  )}
                  {activeTab === "favorites" && !isOfflineMode && (
                     <VideoGrid
                        videos={favorites}
                        onSelectVideo={handleSelectVideo}
                        kidsMode={kidsMode}
                        isLoading={false}
                        downloadedVideos={downloadedVideos}
                        onToggleDownload={handleToggleDownload}
                     />
                  )}
                  {activeTab === "history" && !isOfflineMode && (
                     <VideoGrid
                        videos={watchHistory}
                        onSelectVideo={handleSelectVideo}
                        kidsMode={kidsMode}
                        isLoading={false}
                        downloadedVideos={downloadedVideos}
                        onToggleDownload={handleToggleDownload}
                     />
                  )}
                  {isOfflineMode && (
                     <VideoGrid
                        videos={downloadedVideos}
                        onSelectVideo={handleSelectVideo}
                        kidsMode={kidsMode}
                        isLoading={false}
                        downloadedVideos={downloadedVideos}
                        onToggleDownload={handleToggleDownload}
                        showDeleteMode={true}
                     />
                  )}
                  {activeTab === "profile" && !isOfflineMode && (
                     <div className="flex flex-col items-center justify-center h-full">
                       <h2 className="text-2xl font-bold mb-4">Profile</h2>
                       <p className="text-gray-500">Profile features coming soon.</p>
                     </div>
                  )}
                  {activeTab === "upload" && !isOfflineMode && (
                     <div className="flex flex-col items-center justify-center h-full">
                       <h2 className="text-2xl font-bold mb-4">Upload</h2>
                       <p className="text-gray-500">Upload features coming soon.</p>
                     </div>
                  )}
               </main>
            </div>

            {/* MOBILE NAVIGATION */}
            <nav className={\`md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-3 border-t backdrop-blur-xl \${
              kidsMode ? "bg-white/90 border-rose-100" : "bg-[#0f0f0f]/90 border-white/10"
            }\`}>
              <button
                onClick={() => { setActiveTab("home"); setIsOfflineMode(false); }}
                className={\`flex flex-col items-center gap-1 text-[10px] font-bold \${
                  activeTab === "home" && !isOfflineMode
                    ? kidsMode ? "text-rose-500" : "text-white"
                    : "text-gray-500"
                }\`}
              >
                <Home className="w-6 h-6" />
                <span>Home</span>
              </button>
`;

const newCode = code.slice(0, startIndex + startMarker.length) + missingCode + code.slice(endIndex);

fs.writeFileSync('src/App.tsx', newCode);
console.log("Success");
