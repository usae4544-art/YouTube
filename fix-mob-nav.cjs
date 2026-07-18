const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const navTarget = `<button
                onClick={() => { setActiveTab("history"); setIsOfflineMode(false); }}
                className={\`flex flex-col items-center gap-1 text-[10px] font-bold \${
                  activeTab === "history" && !isOfflineMode
                    ? kidsMode ? "text-rose-500" : "text-white"
                    : "text-gray-500"
                }\`}
              >
                <History className="w-6 h-6" />
                <span>History</span>
              </button>
            </nav>`;

const navNew = `<button
                onClick={() => { setActiveTab("history"); setIsOfflineMode(false); }}
                className={\`flex flex-col items-center gap-1 text-[10px] font-bold \${
                  activeTab === "history" && !isOfflineMode
                    ? kidsMode ? "text-rose-500" : "text-white"
                    : "text-gray-500"
                }\`}
              >
                <History className="w-6 h-6" />
                <span>History</span>
              </button>
              <button
                onClick={() => setShowAiAssistant(true)}
                className={\`flex flex-col items-center gap-1 text-[10px] font-bold \${showAiAssistant ? (kidsMode ? "text-rose-500" : "text-indigo-400") : "text-gray-500"}\`}
              >
                <Bot className="w-6 h-6" />
                <span>Nexus AI</span>
              </button>
            </nav>`;

code = code.replace(navTarget, navNew);
fs.writeFileSync('src/App.tsx', code);
