const fs = require('fs');
let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

// 1. Remove "What would you like to watch"
const emptyTarget = `            {/* When empty input, show trending / what to search */}
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
            )}`;
code = code.replace(emptyTarget, '');

// 2. Make dropdown only appear when input or history exists
const dropdownTarget = `      <AnimatePresence>
        {isOpen && (
          <motion.div`;
const dropdownNew = `      <AnimatePresence>
        {isOpen && (inputValue.trim() || history.length > 0) && (
          <motion.div`;
code = code.replace(dropdownTarget, dropdownNew);

// 3. Make the search bar input height/text larger
const inputTarget = `className={\`w-full py-4 pr-12 text-base bg-transparent outline-none border-none font-sans placeholder-gray-400 tracking-wide \${
                kidsMode ? "text-rose-900 font-medium" : "text-white"
              }\`}`;
const inputNew = `className={\`w-full py-5 pr-14 text-lg bg-transparent outline-none border-none font-sans placeholder-gray-400 tracking-wide \${
                kidsMode ? "text-rose-900 font-medium" : "text-white"
              }\`}`;
code = code.replace(inputTarget, inputNew);

// 4. Make mic button larger
const micTarget = `className={\`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer \${`;
const micNew = `className={\`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer \${`;
code = code.replace(micTarget, micNew);

// 5. Restore dropdown rounded-2xl instead of 3xl, remove VFX for cleaner look just like before
const vfxTarget = `            {/* Visual VFX in dropdown */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div>
            
            <div className="relative z-10">`;
const vfxNew = ``;
code = code.replace(vfxTarget, vfxNew);

const z10Target = `          </div>
          </motion.div>
        )}
      </AnimatePresence>`;
const z10New = `          </motion.div>
        )}
      </AnimatePresence>`;
code = code.replace(z10Target, z10New);

const styleTarget = `className={\`absolute left-0 right-0 mt-2 p-3 rounded-3xl shadow-2xl border overflow-hidden \${
              kidsMode
                ? "bg-white/90 backdrop-blur-3xl border-rose-100 text-rose-900"
                : "bg-[#0b0b12]/90 backdrop-blur-3xl border-white/10 text-gray-200"
            }\`}`;
const styleNew = `className={\`absolute left-0 right-0 mt-2 p-3 rounded-2xl shadow-2xl border \${
              kidsMode
                ? "bg-white border-rose-150 text-rose-900"
                : "bg-[#0b0b12]/95 backdrop-blur-2xl border-white/10 text-gray-200"
            }\`}`;
code = code.replace(styleTarget, styleNew);

fs.writeFileSync('src/components/SearchBar.tsx', code);
