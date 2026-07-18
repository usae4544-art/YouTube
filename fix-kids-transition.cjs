const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We want to add a liquid transition overlay.
const transitionStateTarget = `  const [kidsMode, setKidsMode] = useState(false);`;
const transitionStateNew = `  const [kidsMode, setKidsMode] = useState(false);
  const [isTransitioningMode, setIsTransitioningMode] = useState(false);

  const toggleKidsMode = () => {
    setIsTransitioningMode(true);
    setTimeout(() => {
      setKidsMode(!kidsMode);
      setTimeout(() => {
        setIsTransitioningMode(false);
      }, 800);
    }, 400);
  };`;
code = code.replace(transitionStateTarget, transitionStateNew);

const toggleButtonTarget = `<button onClick={() => setKidsMode(!kidsMode)} className={\`px-4 py-2 rounded-full font-bold text-sm transition-all \${kidsMode ? "bg-white text-rose-500 shadow-md" : "bg-white/10 text-white hover:bg-white/20"}\`}>
                    {kidsMode ? "Exit Kids Mode" : "Kids Mode"}
                  </button>`;
const toggleButtonNew = `<button onClick={toggleKidsMode} className={\`px-4 py-2 rounded-full font-bold text-sm transition-all \${kidsMode ? "bg-white text-rose-500 shadow-md" : "bg-white/10 text-white hover:bg-white/20"}\`}>
                    {kidsMode ? "Exit Kids Mode" : "Kids Mode"}
                  </button>`;
code = code.replace(toggleButtonTarget, toggleButtonNew);

// Add liquid glass overlay in the return
const returnTarget = `return (
    <div className={\`relative min-h-screen transition-all duration-700 overflow-x-hidden \${
      kidsMode
        ? "bg-gradient-to-tr from-[#ffeef2] via-[#fff5f7] to-[#eef9ff] text-rose-950"
        : "bg-[#0f0f0f] text-gray-100"
    } \${getFontSizeClass()}\`}>`;
const returnNew = `return (
    <div className={\`relative min-h-screen transition-all duration-700 overflow-x-hidden \${
      kidsMode
        ? "bg-gradient-to-tr from-[#ffeef2] via-[#fff5f7] to-[#eef9ff] text-rose-950"
        : "bg-[#0f0f0f] text-gray-100"
    } \${getFontSizeClass()}\`}>
      <AnimatePresence>
        {isTransitioningMode && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px) saturate(100%)" }}
            animate={{ opacity: 1, backdropFilter: "blur(40px) saturate(200%)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px) saturate(100%)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/20 pointer-events-none"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }} 
                transition={{ duration: 1, repeat: Infinity }}
                className={\`w-24 h-24 rounded-[40%] blur-xl opacity-70 \${kidsMode ? 'bg-rose-400' : 'bg-indigo-500'}\`} 
              />
              <motion.div 
                animate={{ scale: [1.2, 1, 1.2], rotate: [180, 270, 360] }} 
                transition={{ duration: 1.2, repeat: Infinity }}
                className={\`w-24 h-24 rounded-[40%] blur-xl opacity-70 absolute top-0 \${kidsMode ? 'bg-amber-300' : 'bg-purple-500'}\`} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>`;
code = code.replace(returnTarget, returnNew);

fs.writeFileSync('src/App.tsx', code);
