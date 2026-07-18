const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{activeTab === "favorites" && !isOfflineMode && (
                     <VideoGrid
                        videos={favorites}
                        onSelectVideo={handleSelectVideo}
                        kidsMode={kidsMode}
                        isLoading={false}
                        downloadedVideos={downloadedVideos}
                        onToggleDownload={handleToggleDownload}
                     />
                  )}`;

const replacement = `{activeTab === "favorites" && !isOfflineMode && (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex flex-col"
                     >
                        <div className={\`w-full p-8 md:p-12 rounded-[2.5rem] mb-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl \${kidsMode ? "bg-rose-100 text-rose-800" : "bg-[#1a1a24] border border-white/5"}\`}>
                           
                           {/* Decorative background blur elements */}
                           <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                           <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                           
                           <div className="relative z-10">
                             <motion.div
                               initial={{ scale: 0 }}
                               animate={{ scale: 1 }}
                               transition={{ type: "spring", bounce: 0.5 }}
                               className={\`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-2xl backdrop-blur-md \${kidsMode ? "bg-rose-400 text-white" : "bg-gradient-to-br from-rose-500 to-purple-600 text-white border border-white/20"}\`}
                             >
                               <Heart className="w-12 h-12 fill-current" />
                             </motion.div>
                             <h2 className={\`text-4xl md:text-5xl font-bold font-display tracking-tight mb-4 \${kidsMode ? "text-rose-600" : "text-white"}\`}>Your Subscriptions</h2>
                             <p className={\`text-lg md:text-xl max-w-lg mx-auto \${kidsMode ? "text-rose-500/80" : "text-gray-400"}\`}>
                               {favorites.length > 0 ? \`You have \${favorites.length} saved \${favorites.length === 1 ? 'video' : 'videos'} in your collection.\` : "You haven't saved any videos yet. Click the heart icon on any video to add it here!"}
                             </p>
                           </div>
                        </div>

                        {favorites.length === 0 ? (
                           <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-60 min-h-[300px]">
                              <ListVideo className="w-20 h-20 mb-6 opacity-30" />
                              <h3 className="text-2xl font-display font-bold mb-2">It's quiet here</h3>
                              <p>Your subscription list is empty.</p>
                           </div>
                        ) : (
                           <VideoGrid
                              videos={favorites}
                              onSelectVideo={handleSelectVideo}
                              kidsMode={kidsMode}
                              isLoading={false}
                              downloadedVideos={downloadedVideos}
                              onToggleDownload={handleToggleDownload}
                           />
                        )}
                     </motion.div>
                  )}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
