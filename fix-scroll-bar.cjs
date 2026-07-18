const fs = require('fs');
let code = fs.readFileSync('src/components/VideoPlayerModal.tsx', 'utf8');

const oldBlockRegex = /<div className=\{`flex items-center justify-between px-6 py-3\.5 border-t \$\{[\s\S]*?\{Math\.min\(downloadProgress \|\| 0, 100\)\}% Caching\.\.\.<\/span>\n                    <\/div>\n                  \) : isDownloaded \? \(\n                    <>\n                      <Trash2 className="w-4 h-4" \/>\n                      <span>Remove Offline<\/span>\n                    <\/>\n                  \) : \(\n                    <>\n                      <Download className="w-4 h-4" \/>\n                      <span>Simulate Offline<\/span>\n                    <\/>\n                  \)}\n                <\/button>\n              <\/div>\n            <\/div>/;

const newBlock = `<div className={\`flex items-center gap-2 px-6 py-3.5 border-t overflow-x-auto no-scrollbar \${
              kidsMode ? "bg-rose-50/50 border-rose-100" : "bg-[#0b0b12] border-white/5"
            }\`}>
                <button
                  id="like-video-btn"
                  onClick={() => setLiked(!liked)}
                  className={\`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer \${
                    liked 
                      ? kidsMode 
                        ? "bg-rose-500 text-white" 
                        : "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                      : kidsMode 
                        ? "bg-rose-200/50 text-rose-900 hover:bg-rose-200" 
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }\`}
                >
                  <ThumbsUp className={\`w-4 h-4 \${liked ? "fill-current" : ""}\`} />
                  <span>{liked ? "Liked!" : "Like"}</span>
                </button>
                <button
                  id="sparkle-ai-btn"
                  onClick={handleSummarize}
                  className={\`flex items-center gap-2 px-4 py-2 rounded-xl text-xs shrink-0 font-semibold transition-all cursor-pointer \${
                    kidsMode
                      ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white hover:opacity-90"
                      : "bg-gradient-to-r from-red-600 via-rose-600 to-violet-600 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.35)]"
                  }\`}
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>AI Summary</span>
                </button>
                <button
                  id="share-video-btn"
                  onClick={async () => {
                    try {
                      if (navigator.share) {
                        await navigator.share({
                          title: video.title,
                          text: \`Check out this video: \${video.title}\`,
                          url: \`https://www.youtube.com/watch?v=\${video.id}\`
                        });
                      } else {
                        navigator.clipboard.writeText(\`https://www.youtube.com/watch?v=\${video.id}\`);
                        alert("Link copied to clipboard!");
                      }
                    } catch (err) {
                      console.error("Error sharing", err);
                    }
                  }}
                  className={\`flex items-center gap-2 px-4 py-2 shrink-0 rounded-xl text-xs font-semibold transition-all cursor-pointer \${
                    kidsMode 
                      ? "bg-rose-200/50 text-rose-900 hover:bg-rose-200" 
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }\`}
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  id="audio-mode-btn"
                  onClick={() => setIsAudioMode(true)}
                  className={\`flex items-center shrink-0 gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer \${
                    kidsMode 
                      ? "bg-rose-200/50 text-rose-900 hover:bg-rose-200" 
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }\`}
                >
                  <Headphones className="w-4 h-4" />
                  <span>Audio</span>
                </button>
                
                {onToggleVault && (
                  <button
                    onClick={() => onToggleVault(video)}
                    title="Add to Secure Vault"
                    className="w-8 h-8 flex shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                )}

                <a 
                  href={\`https://ssyoutube.com/watch?v=\${video.id}\`}
                  target="_blank" rel="noopener noreferrer"
                  className={\`flex items-center shrink-0 gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer \${
                    kidsMode 
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-200" 
                      : "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:bg-gray-200"
                  }\`}
                >
                  <DownloadCloud className="w-4 h-4" />
                  <span>Download MP4</span>
                </a>
                <button
                  id="download-video-btn"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={\`flex items-center gap-2 shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer \${
                    isDownloaded 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : kidsMode
                        ? "bg-rose-200/50 text-rose-900 hover:bg-rose-200"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }\`}
                >
                  {isDownloading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
                      <span>{Math.min(downloadProgress || 0, 100)}% Caching...</span>
                    </div>
                  ) : isDownloaded ? (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Offline</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Simulate Offline</span>
                    </>
                  )}
                </button>
                <button className={\`flex shrink-0 items-center justify-center w-8 h-8 rounded-full font-bold text-sm cursor-pointer \${kidsMode ? "bg-rose-200 text-rose-900" : "bg-white/10 text-white"}\`}>
                  0
                </button>
            </div>`;

code = code.replace(oldBlockRegex, newBlock);
fs.writeFileSync('src/components/VideoPlayerModal.tsx', code);
