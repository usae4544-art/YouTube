const fs = require('fs');
let code = fs.readFileSync('src/components/VideoGrid.tsx', 'utf8');

// Update imports
code = code.replace(/import \{([\s\S]*?)\} from "lucide-react";/, 'import {$1, Lock} from "lucide-react";');

// Update Props
code = code.replace(/onToggleDownload\?: \(video: YouTubeVideo\) => void;\n  showDeleteMode\?: boolean;\n\}/, 'onToggleDownload?: (video: YouTubeVideo) => void;\n  onToggleVault?: (video: YouTubeVideo) => void;\n  showDeleteMode?: boolean;\n}');

code = code.replace(/onToggleDownload, showDeleteMode = false \}: VideoGridProps/, 'onToggleDownload, onToggleVault, showDeleteMode = false }: VideoGridProps');

// Update map function
const oldButtons = `                ) : onToggleDownload ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDownload(video);
                    }}
                    className={\`p-1.5 rounded-full backdrop-blur-sm transition-colors border \${isDownloaded ? "bg-emerald-500/80 text-white border-emerald-400" : "bg-black/60 hover:bg-white/20 text-white border-white/10"}\`}
                    title={isDownloaded ? "Downloaded" : "Download Video"}
                  >
                    {isDownloaded ? <CheckCircle2 className="w-4 h-4" /> : <DownloadCloud className="w-4 h-4" />}
                  </button>
                ) : null}
              </div>`;

const newButtons = `                ) : onToggleDownload ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDownload(video);
                    }}
                    className={\`p-1.5 rounded-full backdrop-blur-sm transition-colors border \${isDownloaded ? "bg-emerald-500/80 text-white border-emerald-400" : "bg-black/60 hover:bg-white/20 text-white border-white/10"}\`}
                    title={isDownloaded ? "Downloaded" : "Download Video"}
                  >
                    {isDownloaded ? <CheckCircle2 className="w-4 h-4" /> : <DownloadCloud className="w-4 h-4" />}
                  </button>
                ) : null}
                
                {onToggleVault && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVault(video);
                    }}
                    className="p-1.5 rounded-full backdrop-blur-sm transition-colors border bg-black/60 hover:bg-violet-500/80 text-white border-white/10"
                    title="Add to Vault"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                )}
              </div>`;

code = code.replace(oldButtons, newButtons);
fs.writeFileSync('src/components/VideoGrid.tsx', code);
