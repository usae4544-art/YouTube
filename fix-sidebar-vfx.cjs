const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{/* SIDEBAR */}
               <aside className={\`hidden md:flex flex-col w-64 lg:w-72 border-r overflow-y-auto scrollbar-none justify-between \${kidsMode ? "bg-white/40 border-white/50 backdrop-blur-3xl backdrop-saturate-200" : "bg-[#0b0b12]/50 border-white/10 backdrop-blur-3xl backdrop-saturate-200"}\`}>
                  <div className="p-4 space-y-2">`;

const replacement = `{/* SIDEBAR */}
               <aside className={\`hidden md:flex flex-col w-64 lg:w-72 border-r overflow-hidden relative justify-between \${kidsMode ? "bg-white/40 border-white/50 backdrop-blur-3xl backdrop-saturate-200" : "bg-[#0b0b12]/50 border-white/10 backdrop-blur-3xl backdrop-saturate-200"}\`}>
                  {/* Sidebar VFX Background */}
                  <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none z-0"></div>
                  <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-rose-500/10 to-transparent pointer-events-none z-0"></div>

                  <div className="p-4 space-y-2 relative z-10 overflow-y-auto scrollbar-none flex-1">
                     <p className={\`px-4 text-xs font-bold tracking-wider uppercase mb-4 mt-2 \${kidsMode ? "text-rose-400" : "text-gray-500"}\`}>Menu</p>`;

code = code.replace(target, replacement);

const btnTarget = `                     <button onClick={() => { setActiveTab("home"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "home" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>`;
const btnReplace = `                     <button onClick={() => { setActiveTab("home"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "home" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "home" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-50" />}
                       <Home className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "home" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">Home</span>
                     </button>`;
code = code.replace(btnTarget, btnReplace);

const btn2Target = `                     <button onClick={() => { setIsOfflineMode(true); setActiveTab("offline"); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <DownloadCloud className="w-6 h-6" /> <span className="font-bold">Offline</span>
                     </button>`;
const btn2Replace = `                     <button onClick={() => { setIsOfflineMode(true); setActiveTab("offline"); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-50" />}
                       <DownloadCloud className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">Offline</span>
                     </button>`;
code = code.replace(btn2Target, btn2Replace);

const btn3Target = `                     <button onClick={() => { setActiveTab("history"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "history" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <History className="w-6 h-6" /> <span className="font-bold">History</span>
                     </button>`;
const btn3Replace = `                     <button onClick={() => { setActiveTab("history"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "history" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "history" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-50" />}
                       <History className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "history" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">History</span>
                     </button>`;
code = code.replace(btn3Target, btn3Replace);

const btn4Target = `                     <button onClick={() => { setActiveTab("upload"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "upload" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <Upload className="w-6 h-6" /> <span className="font-bold">Upload</span>
                     </button>`;
const btn4Replace = `                     <button onClick={() => { setActiveTab("upload"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "upload" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "upload" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-50" />}
                       <Upload className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "upload" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">Upload</span>
                     </button>`;
code = code.replace(btn4Target, btn4Replace);


const bottomMenuTarget = `                  <div className="p-4 space-y-2 border-t border-white/10">`;
const bottomMenuReplace = `                  <div className="p-4 space-y-2 border-t border-white/10 relative z-10 bg-black/10 backdrop-blur-md">
                     <p className={\`px-4 text-xs font-bold tracking-wider uppercase mb-4 \${kidsMode ? "text-rose-400" : "text-gray-500"}\`}>Account</p>`;
code = code.replace(bottomMenuTarget, bottomMenuReplace);

const btn5Target = `                     <button onClick={() => { setActiveTab("favorites"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "favorites" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <Heart className="w-6 h-6" /> <span className="font-bold">Subscriptions</span>
                     </button>`;
const btn5Replace = `                     <button onClick={() => { setActiveTab("favorites"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "favorites" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "favorites" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-transparent opacity-50" />}
                       <Heart className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "favorites" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">Subscriptions</span>
                     </button>`;
code = code.replace(btn5Target, btn5Replace);

const btn6Target = `                     <button onClick={() => { setActiveTab("profile"); setIsOfflineMode(false); }} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors \${activeTab === "profile" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700" : "bg-white/10 text-white") : "text-gray-500 hover:bg-white/5"}\`}>
                       <User className="w-6 h-6" /> <span className="font-bold">Profile</span>
                     </button>`;
const btn6Replace = `                     <button onClick={() => { setActiveTab("profile"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "profile" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "profile" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-50" />}
                       {user && user.picture ? (
                           <img src={user.picture} alt="Profile" className={\`w-6 h-6 rounded-full border relative z-10 transition-transform duration-300 \${activeTab === "profile" && !isOfflineMode ? "border-white scale-110" : "border-transparent group-hover:scale-110"}\`} />
                       ) : (
                           <User className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "profile" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> 
                       )}
                       <span className="font-bold relative z-10">Profile</span>
                     </button>`;
code = code.replace(btn6Target, btn6Replace);

const btn7Target = `                     <button onClick={toggleKidsMode} className={\`w-full flex items-center gap-4 p-3 rounded-xl transition-colors mt-2 \${kidsMode ? "bg-rose-500 text-white shadow-md hover:bg-rose-600" : "bg-white/10 text-white hover:bg-white/20"}\`}>
                       <Baby className="w-6 h-6" /> <span className="font-bold">{kidsMode ? "Exit Kids Mode" : "Kids Mode"}</span>
                     </button>`;
const btn7Replace = `                     <button onClick={toggleKidsMode} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden mt-2 \${kidsMode ? "bg-rose-500 text-white shadow-lg hover:bg-rose-600 hover:shadow-rose-500/30" : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"}\`}>
                       <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                       <Baby className="w-6 h-6 relative z-10 group-hover:animate-bounce" /> <span className="font-bold relative z-10">{kidsMode ? "Exit Kids Mode" : "Kids Mode"}</span>
                     </button>`;
code = code.replace(btn7Target, btn7Replace);


fs.writeFileSync('src/App.tsx', code);
