const fs = require('fs');
let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

const target = `{/* Auto Suggestions & Search History dropdown */}
      <AnimatePresence>
        {isOpen && (inputValue || history.length > 0) && (`;

const newCode = `{/* Auto Suggestions & Search History dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="search-dropdown"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={\`absolute left-0 right-0 mt-2 p-3 rounded-3xl shadow-2xl border overflow-hidden \${
              kidsMode
                ? "bg-white/90 backdrop-blur-3xl border-rose-100 text-rose-900"
                : "bg-[#0b0b12]/90 backdrop-blur-3xl border-white/10 text-gray-200"
            }\`}
          >
            {/* Visual VFX in dropdown */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>
            
            <div className="relative z-10">
            {/* When empty input, show trending / what to search */}
            {!inputValue && (
              <div className="mb-4 p-4">
                <h3 className={\`text-lg font-display font-bold mb-4 flex items-center gap-2 \${kidsMode ? "text-rose-600" : "text-white"}\`}>
                  <Sparkles className="w-5 h-5" /> What would you like to watch today?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Space Explorer", "Funny Cats", "Study Music", "Gaming Streams", "Cooking"].map((tag, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setInputValue(tag);
                        selectSuggestion(tag);
                      }}
                      className={\`px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 \${kidsMode ? "bg-rose-100 text-rose-700 hover:bg-rose-200" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"}\`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
`;

code = code.replace(target, newCode);

// We need to fix the closing braces for AnimatePresence
code = code.replace(/          <\/motion.div>\n        \)}\n      <\/AnimatePresence>/, `          </div>\n          </motion.div>\n        )}\n      </AnimatePresence>`);

fs.writeFileSync('src/components/SearchBar.tsx', code);
