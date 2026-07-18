const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importTarget = `import SyncHub from "./components/SyncHub";`;
const importNew = `import SyncHub from "./components/SyncHub";\nimport { NexusAiAssistant } from "./components/NexusAiAssistant";`;
code = code.replace(importTarget, importNew);

const iconTarget = `ThumbsUp, ChevronDown`;
const iconNew = `ThumbsUp, ChevronDown, Bot`;
code = code.replace(iconTarget, iconNew);

const stateTarget = `  const [isOfflineMode, setIsOfflineMode] = useState(false);`;
const stateNew = `  const [isOfflineMode, setIsOfflineMode] = useState(false);\n  const [showAiAssistant, setShowAiAssistant] = useState(false);`;
code = code.replace(stateTarget, stateNew);

const sidebarTarget = `                       <Baby className="w-6 h-6 relative z-10 group-hover:animate-bounce" /> <span className="font-bold relative z-10">{kidsMode ? "Exit Kids Mode" : "Kids Mode"}</span>
                     </button>
                  </div>`;
const sidebarNew = `                       <Baby className="w-6 h-6 relative z-10 group-hover:animate-bounce" /> <span className="font-bold relative z-10">{kidsMode ? "Exit Kids Mode" : "Kids Mode"}</span>
                     </button>
                     <button onClick={() => setShowAiAssistant(true)} className={\`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden mt-2 \${kidsMode ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20"}\`}>
                       <Bot className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" /> <span className="font-bold relative z-10">Nexus AI</span>
                       <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-400/20 rounded-full blur-[10px] group-hover:scale-150 transition-transform"></div>
                     </button>
                  </div>`;
code = code.replace(sidebarTarget, sidebarNew);

const jsxTarget = `               {/* MOBILE NAVIGATION */}`;
const jsxNew = `               <NexusAiAssistant isOpen={showAiAssistant} onClose={() => setShowAiAssistant(false)} kidsMode={kidsMode} />

               {/* MOBILE NAVIGATION */}`;
code = code.replace(jsxTarget, jsxNew);

fs.writeFileSync('src/App.tsx', code);
