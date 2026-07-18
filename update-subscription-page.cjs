const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{activeTab === "favorites" && !isOfflineMode && (
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

const replacement = `{activeTab === "favorites" && !isOfflineMode && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full h-full flex flex-col items-center justify-center max-w-4xl mx-auto"
                     >
                        <div className="w-full text-center mb-10 mt-8 relative">
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-500/20 blur-[100px] rounded-full pointer-events-none" />
                           <h1 className={\`text-5xl md:text-6xl font-bold font-display tracking-tight mb-4 \${kidsMode ? "text-rose-600" : "text-white"}\`}>
                             Go Premium
                           </h1>
                           <p className={\`text-lg md:text-xl \${kidsMode ? "text-rose-500" : "text-gray-400"}\`}>
                             Unlock an ad-free experience, offline downloads, and more.
                           </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8 w-full px-4">
                           {/* Monthly Plan */}
                           <div className={\`rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 border \${kidsMode ? "bg-white/60 border-white shadow-xl hover:shadow-rose-200" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}\`}>
                              <div className="relative z-10">
                                 <h3 className={\`text-2xl font-bold mb-2 \${kidsMode ? "text-rose-600" : "text-white"}\`}>Monthly Pass</h3>
                                 <div className="flex items-baseline gap-2 mb-6">
                                    <span className={\`text-4xl font-black \${kidsMode ? "text-rose-500" : "text-white"}\`}>$4.99</span>
                                    <span className="text-gray-500">/mo</span>
                                 </div>
                                 <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3">
                                       <div className={\`w-6 h-6 rounded-full flex items-center justify-center \${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}\`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Ad-free streaming</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className={\`w-6 h-6 rounded-full flex items-center justify-center \${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}\`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Offline downloads</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className={\`w-6 h-6 rounded-full flex items-center justify-center \${kidsMode ? "bg-rose-100 text-rose-500" : "bg-white/10 text-white"}\`}><Check className="w-4 h-4" /></div>
                                       <span className={kidsMode ? "text-rose-900" : "text-gray-300"}>Cancel anytime</span>
                                    </li>
                                 </ul>
                                 <button className={\`w-full py-4 rounded-2xl font-bold transition-all \${kidsMode ? "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg" : "bg-white/10 text-white hover:bg-white/20"}\`}>
                                    Subscribe Monthly
                                 </button>
                              </div>
                           </div>

                           {/* Yearly Plan */}
                           <div className={\`rounded-3xl p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 border-2 shadow-2xl \${kidsMode ? "bg-gradient-to-br from-rose-400 to-amber-400 border-white text-white" : "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 text-white"}\`}>
                              <div className="absolute top-0 right-0 bg-white text-black text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">Most Popular</div>
                              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-3xl rounded-full pointer-events-none" />
                              <div className="relative z-10">
                                 <h3 className="text-2xl font-bold mb-2">Yearly Premium</h3>
                                 <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-4xl font-black">$39.99</span>
                                    <span className="opacity-80">/yr</span>
                                 </div>
                                 <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3">
                                       <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                                       <span>Ad-free streaming</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                                       <span>Offline downloads</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                                       <span>Kids Mode exclusive content</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                       <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                                       <span>Save 33% compared to monthly</span>
                                    </li>
                                 </ul>
                                 <button className={\`w-full py-4 rounded-2xl font-bold transition-all shadow-lg text-lg \${kidsMode ? "bg-white text-rose-500 hover:bg-gray-50" : "bg-white text-indigo-600 hover:bg-gray-100"}\`}>
                                    Get 1 Year Ad-Free
                                 </button>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  )}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
