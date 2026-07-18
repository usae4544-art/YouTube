const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const homeTarget = `                     <button onClick={() => { setActiveTab("home"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "home" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "home" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-50" />}
                       <Home className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "home" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">Home</span>
                     </button>
                       <Home className="w-6 h-6" /> <span className="font-bold">Home</span>
                     </button>`;

const homeNew = `                     <button onClick={() => { setActiveTab("home"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "home" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "home" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-50" />}
                       <Home className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "home" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">Home</span>
                     </button>`;

code = code.replace(homeTarget, homeNew);


const offlineTarget = `                     <button onClick={() => { setIsOfflineMode(true); setActiveTab("offline"); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-50" />}
                       <DownloadCloud className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">Offline</span>
                     </button>
                       <DownloadCloud className="w-6 h-6" /> <span className="font-bold">Offline</span>
                     </button>`;

const offlineNew = `                     <button onClick={() => { setIsOfflineMode(true); setActiveTab("offline"); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-50" />}
                       <DownloadCloud className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">Offline</span>
                     </button>`;

code = code.replace(offlineTarget, offlineNew);


const historyTarget = `                     <button onClick={() => { setActiveTab("history"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "history" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "history" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-50" />}
                       <History className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "history" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">History</span>
                     </button>
                       <History className="w-6 h-6" /> <span className="font-bold">History</span>
                     </button>`;

const historyNew = `                     <button onClick={() => { setActiveTab("history"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "history" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "history" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-50" />}
                       <History className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "history" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">History</span>
                     </button>`;
                     
code = code.replace(historyTarget, historyNew);

const uploadTarget = `                     <button onClick={() => { setActiveTab("upload"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "upload" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "upload" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-50" />}
                       <Upload className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "upload" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">Upload</span>
                     </button>
                       <Upload className="w-6 h-6" /> <span className="font-bold">Upload</span>
                     </button>`;

const uploadNew = `                     <button onClick={() => { setActiveTab("upload"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "upload" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "upload" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-50" />}
                       <Upload className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "upload" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">Upload</span>
                     </button>`;

code = code.replace(uploadTarget, uploadNew);


const favTarget = `                     <button onClick={() => { setActiveTab("favorites"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "favorites" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "favorites" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-transparent opacity-50" />}
                       <Heart className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "favorites" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">Subscriptions</span>
                     </button>
                       <Heart className="w-6 h-6" /> <span className="font-bold">Subscriptions</span>
                     </button>`;

const favNew = `                     <button onClick={() => { setActiveTab("favorites"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "favorites" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "favorites" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-transparent opacity-50" />}
                       <Heart className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "favorites" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> <span className="font-bold relative z-10">Subscriptions</span>
                     </button>`;
                     
code = code.replace(favTarget, favNew);

const profTarget = `                     <button onClick={() => { setActiveTab("profile"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "profile" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "profile" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-50" />}
                       {user && user.picture ? (
                           <img src={user.picture} alt="Profile" className={\`w-6 h-6 rounded-full border relative z-10 transition-transform duration-300 \${activeTab === "profile" && !isOfflineMode ? "border-white scale-110" : "border-transparent group-hover:scale-110"}\`} />
                       ) : (
                           <User className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "profile" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> 
                       )}
                       <span className="font-bold relative z-10">Profile</span>
                     </button>
                       <User className="w-6 h-6" /> <span className="font-bold">Profile</span>
                     </button>`;
                     
const profNew = `                     <button onClick={() => { setActiveTab("profile"); setIsOfflineMode(false); }} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden \${activeTab === "profile" && !isOfflineMode ? (kidsMode ? "bg-rose-100 text-rose-700 shadow-sm" : "bg-white/10 text-white shadow-lg shadow-white/5") : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}\`}>
                       {activeTab === "profile" && !isOfflineMode && !kidsMode && <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-50" />}
                       {user && user.picture ? (
                           <img src={user.picture} alt="Profile" className={\`w-6 h-6 rounded-full border relative z-10 transition-transform duration-300 \${activeTab === "profile" && !isOfflineMode ? "border-white scale-110" : "border-transparent group-hover:scale-110"}\`} />
                       ) : (
                           <User className={\`w-6 h-6 relative z-10 transition-transform duration-300 \${activeTab === "profile" && !isOfflineMode ? "scale-110" : "group-hover:scale-110"}\`} /> 
                       )}
                       <span className="font-bold relative z-10">Profile</span>
                     </button>`;

code = code.replace(profTarget, profNew);

fs.writeFileSync('src/App.tsx', code);
