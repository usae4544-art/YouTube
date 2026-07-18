const fs = require('fs');
let code = fs.readFileSync('src/components/VideoPlayerModal.tsx', 'utf8');

const oldRegex = /<span className="font-bold text-teal-400 mr-1">Kids Safe Check:<\/span>\n                        \{aiSummary\.kidsSafety\}\n                      <\/div>\n                    <\/motion\.div>/;

const newBlock = `<span className="font-bold text-teal-400 mr-1">Kids Safe Check:</span>
                        {aiSummary.kidsSafety}
                      </div>

                      {/* Chat Interface */}
                      <div className={\`mt-4 pt-4 border-t \${kidsMode ? "border-rose-100" : "border-white/10"}\`}>
                        <p className={\`text-[10px] uppercase font-bold tracking-widest mb-3 \${kidsMode ? "text-rose-500" : "text-amber-400"}\`}>
                          Ask Gemini
                        </p>
                        
                        <div className="space-y-3 mb-3 max-h-40 overflow-y-auto no-scrollbar">
                          {chatMessages.map((msg, i) => (
                            <div key={i} className={\`flex flex-col \${msg.role === "user" ? "items-end" : "items-start"}\`}>
                              <span className={\`text-[10px] mb-1 opacity-50 uppercase tracking-widest font-bold \${kidsMode ? "text-rose-800" : "text-white"}\`}>
                                {msg.role === "user" ? "You" : "Gemini"}
                              </span>
                              <div className={\`p-3 rounded-2xl text-xs max-w-[90%] leading-relaxed \${
                                msg.role === "user" 
                                  ? kidsMode ? "bg-rose-500 text-white rounded-br-none" : "bg-red-600 text-white rounded-br-none"
                                  : kidsMode ? "bg-white border border-rose-100 text-rose-950 rounded-bl-none" : "bg-white/5 border border-white/10 text-gray-300 rounded-bl-none"
                              }\`}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                          {isChatting && (
                            <div className="flex flex-col items-start">
                              <div className={\`p-3 rounded-2xl text-xs \${kidsMode ? "bg-white border border-rose-100 rounded-bl-none" : "bg-white/5 border border-white/10 rounded-bl-none"}\`}>
                                <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 relative">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") handleChat();
                            }}
                            placeholder="Ask about this video..."
                            className={\`w-full px-4 py-2.5 pr-10 rounded-xl text-xs outline-none transition-all \${
                              kidsMode 
                                ? "bg-white border border-rose-200 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-200" 
                                : "bg-white/5 border border-white/10 text-white focus:border-red-500 focus:bg-white/10"
                            }\`}
                          />
                          <button 
                            onClick={handleChat}
                            disabled={!chatInput.trim() || isChatting}
                            className={\`absolute right-2 p-1.5 rounded-lg transition-colors \${
                              !chatInput.trim() || isChatting
                                ? "opacity-50 cursor-not-allowed text-gray-500"
                                : kidsMode ? "text-rose-600 hover:bg-rose-50" : "text-white hover:bg-white/10"
                            }\`}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </motion.div>`;

code = code.replace(oldRegex, newBlock);
fs.writeFileSync('src/components/VideoPlayerModal.tsx', code);
