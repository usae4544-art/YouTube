const fs = require('fs');
let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

const badReturnIndex = code.indexOf('    return (\n    <div className={`relative');
if (badReturnIndex !== -1) {
    code = code.slice(0, badReturnIndex);
}

const correctMiddle = `    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClear = () => {
    setInputValue("");
    setSuggestions([]);
    setSafetyCheck({ safe: true });
  };

`;

const renderBlock = `  return (
    <div className={\`relative w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto z-40 \${fontSizeClass}\`} ref={dropdownRef}>
      <div className="flex items-center gap-4">
        <form onSubmit={handleSubmit} className="relative flex-1">
          <div
            className={\`flex items-center w-full rounded-full transition-all duration-300 relative overflow-hidden \${
              kidsMode
                ? "bg-white/90 border-2 border-rose-200 focus-within:border-rose-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-rose-100/50"
                : "bg-[#16161a] border border-red-500/30 focus-within:border-red-500/70 focus-within:bg-[#1a1a1f]"
            }\`}
          >
            {/* Magnifying Glass */}
            <div className="pl-5 pr-2">
              <Search className={\`w-5 h-5 \${kidsMode ? "text-rose-400" : "text-gray-400"}\`} />
            </div>

            {/* Core Input */}
            <input
              id="search-input"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={
                kidsMode ? "Search fun cartoons, animals, and space secrets! 🦕🚀" : "Search premium video feeds..."
              }
              className={\`w-full py-4 pr-14 text-lg bg-transparent outline-none border-none font-sans placeholder-gray-500 tracking-wide \${
                kidsMode ? "text-rose-900 font-medium" : "text-white"
              }\`}
            />

            {/* Right Action Icons (Clear / Sparkle loading indicator) */}
            <div className="absolute right-4 flex items-center gap-1.5">
              {isLoading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className={\`w-5 h-5 \${kidsMode ? "text-rose-400" : "text-red-400"}\`} />
                </motion.div>
              )}
              {inputValue && (
                <button
                  id="search-clear-btn"
                  type="button"
                  onClick={handleClear}
                  className={\`p-1.5 rounded-full transition-colors \${
                    kidsMode ? "hover:bg-rose-200/50 text-rose-500" : "hover:bg-white/10 text-gray-400 hover:text-white"
                  }\`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Auto Suggestions & Search History dropdown attached to input */}
          <AnimatePresence>
            {isOpen && (inputValue.trim() || history.length > 0) && (
              <motion.div
                id="search-dropdown"
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 5, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={\`absolute left-0 right-0 mt-3 p-4 rounded-3xl shadow-2xl border \${
                  kidsMode
                    ? "bg-white border-rose-150 text-rose-900"
                    : "bg-[#0b0b12] border-white/5 text-gray-200"
                }\`}
              >
                {/* Safety block message in Kids Mode */}
                {!safetyCheck.safe && (
                  <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-400">Oops, safety check! 🦖</p>
                      <p className="text-gray-300 mt-1 leading-relaxed text-sm">
                        {safetyCheck.explanation || "That search query might include mature topics. Let's find something safe!"}
                      </p>
                    </div>
                  </div>
                )}

                {/* suggestions list */}
                {safetyCheck.safe && suggestions.length > 0 && (
                  <div className="mb-4">
                    <p className={\`text-xs uppercase font-bold tracking-[0.15em] px-4 mb-3 flex items-center gap-2 \${
                      kidsMode ? "text-rose-500" : "text-red-500"
                    }\`}>
                      <Sparkles className="w-4 h-4" />
                      AI Suggestions
                    </p>
                    <ul className="space-y-1">
                      {suggestions.map((item, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            onClick={() => selectSuggestion(item)}
                            className={\`w-full text-left px-4 py-3 rounded-2xl text-base flex items-center gap-4 transition-all cursor-pointer \${
                              kidsMode
                                ? "hover:bg-rose-50 text-rose-900 font-medium"
                                : "hover:bg-white/5 text-gray-200 hover:text-white"
                            }\`}
                          >
                            <Search className={\`w-5 h-5 \${kidsMode ? "text-rose-400" : "text-gray-400"}\`} />
                            <span>{item}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* history list */}
                {history.length > 0 && (
                  <div>
                    <p className={\`text-xs uppercase font-bold tracking-[0.15em] px-4 mb-3 flex items-center gap-2 \${
                      kidsMode ? "text-rose-400" : "text-gray-500"
                    }\`}>
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </p>
                    <ul className="space-y-1">
                      {history.map((item, index) => (
                        <li key={index}>
                          <div
                            onClick={() => selectSuggestion(item)}
                            className={\`group w-full text-left px-4 py-3 rounded-2xl text-base flex items-center justify-between transition-all cursor-pointer \${
                              kidsMode
                                ? "hover:bg-rose-50 text-rose-900 font-medium"
                                : "hover:bg-white/5 text-gray-200"
                            }\`}
                          >
                            <div className="flex items-center gap-4">
                              <History className={\`w-5 h-5 \${kidsMode ? "text-rose-300" : "text-gray-500"}\`} />
                              <span className={kidsMode ? "" : "text-gray-300 group-hover:text-white"}>{item}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => removeHistoryItem(e, item)}
                              className={\`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity \${
                                kidsMode ? "hover:bg-rose-200 text-rose-600" : "hover:bg-white/10 text-gray-400 hover:text-white"
                              }\`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Microphone Button */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={\`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer \${
            isListening 
              ? kidsMode ? "bg-rose-500 text-white animate-pulse shadow-rose-300" : "bg-red-500 text-white animate-pulse shadow-red-500/50"
              : kidsMode ? "bg-rose-100 text-rose-500 hover:bg-rose-200" : "bg-[#1e1e24] text-gray-300 hover:bg-[#2a2a32] hover:text-white border border-white/5"
          }\`}
          title="Voice Search"
        >
          <Mic className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/SearchBar.tsx', code + correctMiddle + renderBlock);
