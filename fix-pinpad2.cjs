const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('Delete,')) {
    code = code.replace(/import \{([\s\S]*?)\} from "lucide-react";/, 'import {$1, Delete} from "lucide-react";');
}

const startIndex = code.indexOf('<div className="flex flex-col gap-3">');
const endIndex = code.indexOf('Reset Vault (Deletes Everything)');

if (startIndex !== -1 && endIndex !== -1) {
    // Find the end of the button
    const trueEnd = code.indexOf('</button>', endIndex) + 9;
    const finalEnd = code.indexOf('</div>', trueEnd) + 6;
    
    const oldBlock = code.substring(startIndex, finalEnd);
    
    const newVaultBody = `<div className="flex flex-col items-center gap-6">
                      {/* PIN Display */}
                      <div className="flex gap-3 justify-center mb-2">
                        {Array.from({ length: Math.max(4, vaultInput.length) }).map((_, i) => (
                          <div 
                            key={i} 
                            className={\`w-4 h-4 rounded-full transition-all duration-200 \${
                              i < vaultInput.length 
                                ? "bg-white scale-110" 
                                : "bg-white/10"
                            }\`} 
                          />
                        ))}
                      </div>
                      
                      {/* Dial Pad */}
                      <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                          <button
                            key={num}
                            onClick={() => setVaultInput(prev => prev + num)}
                            className="w-full aspect-square rounded-full bg-white/5 hover:bg-white/15 text-white text-2xl font-display font-medium flex items-center justify-center transition-colors active:scale-95"
                          >
                            {num}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setVaultInput("")}
                          className="w-full aspect-square rounded-full text-white/50 hover:text-white hover:bg-white/10 text-sm font-bold flex items-center justify-center transition-colors active:scale-95 uppercase tracking-wider"
                        >
                          Clear
                        </button>
                        
                        <button
                          onClick={() => setVaultInput(prev => prev + "0")}
                          className="w-full aspect-square rounded-full bg-white/5 hover:bg-white/15 text-white text-2xl font-display font-medium flex items-center justify-center transition-colors active:scale-95"
                        >
                          0
                        </button>
                        
                        <button
                          onClick={() => setVaultInput(prev => prev.slice(0, -1))}
                          className="w-full aspect-square rounded-full text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors active:scale-95"
                        >
                          <Delete className="w-7 h-7" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (vaultPassword) {
                            if (vaultInput === vaultPassword) {
                              setIsVaultUnlocked(true);
                              setShowVaultPrompt(false);
                              setVaultInput("");
                              if (pendingVaultVideo) {
                                setVaultVideos(prev => {
                                  const exists = prev.some(v => v.id === pendingVaultVideo.id);
                                  if (!exists) {
                                    const next = [...prev, pendingVaultVideo];
                                    localStorage.setItem("nexus_vault_videos", JSON.stringify(next));
                                    alert("Added to Secure Vault");
                                    return next;
                                  }
                                  return prev;
                                });
                                setPendingVaultVideo(null);
                              }
                            } else {
                              alert("Incorrect password");
                              setVaultInput("");
                            }
                          } else {
                            if (vaultInput.trim().length < 4) {
                              alert("PIN must be at least 4 digits");
                              return;
                            }
                            setVaultPassword(vaultInput);
                            localStorage.setItem("nexus_vault_pw", vaultInput);
                            setIsVaultUnlocked(true);
                            setShowVaultPrompt(false);
                            setVaultInput("");
                          }
                        }}
                        disabled={vaultInput.length === 0}
                        className={\`w-full font-bold py-3.5 rounded-xl transition-all \${
                          vaultInput.length > 0 
                            ? "bg-white text-black hover:bg-gray-200" 
                            : "bg-white/10 text-white/30 cursor-not-allowed"
                        }\`}
                      >
                        {vaultPassword ? "Unlock Vault" : "Create Vault"}
                      </button>
                      
                      {vaultPassword && (
                        <button
                          onClick={() => {
                            if (confirm("Resetting your vault will delete all your secured content. Are you sure?")) {
                              setVaultPassword(null);
                              localStorage.removeItem("nexus_vault_pw");
                              setVaultVideos([]);
                              localStorage.removeItem("nexus_vault_videos");
                              setIsVaultUnlocked(false);
                            }
                          }}
                          className="text-[10px] uppercase tracking-wider font-bold text-red-500/60 hover:text-red-400 mt-2 transition-colors"
                        >
                          Reset Vault
                        </button>
                      )}
                    </div>`;

    code = code.replace(oldBlock, newVaultBody);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Success");
} else {
    console.log("Could not find boundaries", startIndex, endIndex);
}
