const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const profileTarget = `{activeTab === "profile" && !isOfflineMode && (
                     <div className="flex flex-col items-center justify-center h-full">
                       <h2 className="text-2xl font-bold mb-4">Profile</h2>
                       <p className="text-gray-500">Profile features coming soon.</p>
                     </div>
                  )}`;

const profileNew = `{activeTab === "profile" && !isOfflineMode && (
                     <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto w-full p-6">
                       <div className={\`w-full rounded-3xl p-8 flex flex-col items-center text-center backdrop-blur-2xl border shadow-2xl \${kidsMode ? "bg-white/40 border-white/50" : "bg-white/5 border-white/10"}\`}>
                         {user ? (
                           <>
                             <img src={user.picture} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white/20 mb-4 shadow-xl" />
                             <h2 className="text-2xl font-bold font-display tracking-tight mb-1">{user.name}</h2>
                             <p className="text-gray-400 text-sm mb-8">{user.email}</p>
                             <button onClick={() => { googleLogout(); setUser(null); localStorage.removeItem("nexus_user"); }} className="px-6 py-3 rounded-xl font-bold bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full flex items-center justify-center gap-2">
                               <LogOut className="w-4 h-4" /> Sign Out
                             </button>
                           </>
                         ) : (
                           <>
                             <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mb-6 shadow-xl">
                               <User className="w-10 h-10 text-white" />
                             </div>
                             <h2 className="text-2xl font-bold font-display tracking-tight mb-3">Welcome to Nexus</h2>
                             <p className="text-gray-400 text-sm mb-8">Sign in with Google to sync your history, favorites, and settings across all your devices.</p>
                             <div className="w-full rounded-xl overflow-hidden shadow-lg border border-white/10">
                               <GoogleLogin
                                 onSuccess={(credentialResponse) => {
                                   if (credentialResponse.credential) {
                                     const decoded = jwtDecode<GoogleUser>(credentialResponse.credential);
                                     setUser(decoded);
                                     localStorage.setItem("nexus_user", JSON.stringify(decoded));
                                   }
                                 }}
                                 onError={() => {
                                   console.log('Login Failed');
                                 }}
                                 useOneTap
                                 theme={kidsMode ? "outline" : "filled_black"}
                                 shape="pill"
                               />
                             </div>
                           </>
                         )}
                       </div>
                     </div>
                  )}`;

code = code.replace(profileTarget, profileNew);
fs.writeFileSync('src/App.tsx', code);
