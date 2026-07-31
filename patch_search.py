import sys

# 1. Update App.tsx Header Layout
with open("src/App.tsx", "r") as f:
    app_content = f.read()

old_search_container = """                <div className="flex-1 min-w-[150px] max-w-5xl xl:max-w-6xl mx-auto px-1 sm:px-4 lg:px-12 w-full order-3 sm:order-none mt-2 sm:mt-0">
                  <SearchBar"""

new_search_container = """                <div className="flex-1 min-w-[200px] w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-12 order-3 sm:order-none mt-2 sm:mt-0">
                  <SearchBar"""

app_content = app_content.replace(old_search_container, new_search_container)

with open("src/App.tsx", "w") as f:
    f.write(app_content)


# 2. Update SearchBar.tsx
with open("src/components/SearchBar.tsx", "r") as f:
    sb_content = f.read()

# Adjust icons padding and flex
old_search_input = """              {/* Core Input */}
              <input autoComplete="off"
                id="search-input"
                type="text"
                inputMode="none" // Prevent native keyboard
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => {
                  setIsOpen(true);
                  if (onFocusChange) onFocusChange(true);
                }}
                onBlur={() => {
                  if (onFocusChange) onFocusChange(false);
                }}
                placeholder={
                  kidsMode ? "Search fun cartoons! 🦕" : "Search"
                }
                className={`w-full max-w-full box-border min-w-0 py-4 sm:py-5 pl-4 pr-12 sm:pr-14 text-base sm:text-lg font-bold bg-transparent outline-none border-none placeholder-gray-500 tracking-wide ${
                  kidsMode ? "text-rose-950" : "text-white"
                }`}
              />"""

new_search_input = """              {/* Core Input */}
              <input autoComplete="off"
                id="search-input"
                type="text"
                inputMode="none" // Prevent native keyboard
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => {
                  setIsOpen(true);
                  if (onFocusChange) onFocusChange(true);
                }}
                onBlur={() => {
                  if (onFocusChange) onFocusChange(false);
                }}
                placeholder={
                  kidsMode ? "Search fun cartoons! 🦕" : "Search"
                }
                className={`w-full h-[48px] sm:h-[56px] box-border min-w-0 px-4 text-[16px] sm:text-[18px] leading-normal font-bold bg-transparent outline-none border-none placeholder-gray-500 tracking-wide overflow-hidden text-ellipsis ${
                  kidsMode ? "text-rose-950" : "text-white"
                }`}
                style={{ paddingRight: '3.5rem' }}
              />"""

sb_content = sb_content.replace(old_search_input, new_search_input)

# Update the right icons inside input
old_right_icons = """              {/* Right Action Icons (Clear / Sparkle loading indicator) */}
              <div className="absolute right-2 sm:right-3 flex items-center gap-1 sm:gap-1.5">
                {isLoading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 ${kidsMode ? "text-rose-400" : "text-gray-400"}`} />
                  </motion.div>
                )}
                {inputValue && (
                  <button
                    id="search-clear-btn"
                    type="button"
                    onClick={handleClear}
                    className={`p-1 sm:p-1.5 rounded-full transition-colors ${
                      kidsMode ? "hover:bg-rose-200/50 text-rose-500" : "hover:bg-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>"""

new_right_icons = """              {/* Right Action Icons (Clear / Sparkle loading indicator) */}
              <div className="absolute right-3 flex items-center gap-2 h-full top-0">
                {isLoading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className={`w-5 h-5 ${kidsMode ? "text-rose-400" : "text-gray-400"}`} />
                  </motion.div>
                )}
                {inputValue && (
                  <button
                    id="search-clear-btn"
                    type="button"
                    onClick={handleClear}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                      kidsMode ? "hover:bg-rose-200/50 text-rose-500" : "hover:bg-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>"""

sb_content = sb_content.replace(old_right_icons, new_right_icons)

# Update Search icon to be permanently visible instead of hidden on mobile, or just aligned well
old_mag = """              {/* Magnifying Glass (hidden on small screens, like YT) */}
              <div className="pl-5 pr-1 hidden sm:block opacity-0 focus-within:opacity-100 transition-opacity">
                <Search className={`w-5 h-5 ${kidsMode ? "text-rose-400" : "text-gray-400"}`} />
              </div>"""
new_mag = """              {/* Magnifying Glass */}
              <div className="pl-4 pr-1 hidden sm:flex items-center justify-center">
                <Search className={`w-5 h-5 ${kidsMode ? "text-rose-400" : "text-gray-400"}`} />
              </div>"""
sb_content = sb_content.replace(old_mag, new_mag)

# Update the Submit Search Button padding
old_search_btn = """            {/* Search Button (YouTube Style) */}
            <button
              type="submit"
              className={`px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center shrink-0 cursor-pointer transition-colors rounded-r-full border-y border-r border-l-0 ${
                kidsMode
                  ? "bg-rose-100 border-rose-200 hover:bg-rose-200 text-rose-600"
                  : "bg-[#222222] border-white/10 hover:bg-[#303030] text-gray-200"
              }`}
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>"""

new_search_btn = """            {/* Search Button (YouTube Style) */}
            <button
              type="submit"
              className={`w-[60px] sm:w-[80px] h-[48px] sm:h-[56px] flex items-center justify-center shrink-0 cursor-pointer transition-colors rounded-r-full border-y border-r border-l-0 ${
                kidsMode
                  ? "bg-rose-100 border-rose-200 hover:bg-rose-200 text-rose-600"
                  : "bg-[#222222] border-white/10 hover:bg-[#303030] text-gray-200"
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>"""

sb_content = sb_content.replace(old_search_btn, new_search_btn)

# Update mic button to have consistent height/width with other icons
old_mic = """        {/* Microphone Button */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isListening 
              ? kidsMode ? "bg-rose-500 text-white animate-pulse shadow-rose-300" : "bg-red-500 text-white animate-pulse shadow-red-500/50"
              : kidsMode ? "bg-rose-100 text-rose-500 hover:bg-rose-200" : "bg-[#181818] hover:bg-[#303030] text-white"
          }`}
          title="Voice Search"
        >
          <Mic className="w-5 h-5" />
        </button>"""
new_mic = """        {/* Microphone Button */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={`flex-shrink-0 w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isListening 
              ? kidsMode ? "bg-rose-500 text-white animate-pulse shadow-rose-300" : "bg-red-500 text-white animate-pulse shadow-red-500/50"
              : kidsMode ? "bg-rose-100 text-rose-500 hover:bg-rose-200" : "bg-[#181818] hover:bg-[#303030] text-white"
          }`}
          title="Voice Search"
        >
          <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>"""

sb_content = sb_content.replace(old_mic, new_mic)

with open("src/components/SearchBar.tsx", "w") as f:
    f.write(sb_content)

