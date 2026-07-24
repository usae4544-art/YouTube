import React, { useState, useEffect, useRef } from "react";
import { Search, Sparkles, X, Clock, AlertTriangle, HelpCircle, Mic, History } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SearchSuggestionResponse } from "../types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  kidsMode: boolean;
  fontSizeClass: string;
}

export default function SearchBar({ onSearch, kidsMode, fontSizeClass }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [safetyCheck, setSafetyCheck] = useState<{ safe: boolean; explanation?: string }>({ safe: true });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleVoiceSearch = () => {
    let recognition: any;
    try {
      if ('SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition;
        recognition = new SpeechRecognition();
      } else if ('webkitSpeechRecognition' in window) {
        const WebkitSpeechRecognition = (window as any).webkitSpeechRecognition;
        recognition = new WebkitSpeechRecognition();
      } else {
        setVoiceError("Voice search is not supported in this browser.");
        setTimeout(() => setVoiceError(""), 4000);
        return;
      }
    } catch (e) {
      setVoiceError("Please open the app in a new tab (↗) to use voice search.");
      setTimeout(() => setVoiceError(""), 5000);
      return;
    }
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      addToHistory(transcript);
      onSearch(transcript);
      setIsOpen(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setVoiceError("Microphone access denied. Please allow it or open in a new tab.");
        setTimeout(() => setVoiceError(""), 5000);
      } else {
        setVoiceError("Voice search error: " + event.error);
        setTimeout(() => setVoiceError(""), 5000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Load Search History on Mount
  useEffect(() => {
    const saved = localStorage.getItem("nexus_search_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Save Search History helper
  const addToHistory = (q: string) => {
    if (!q.trim()) return;
    const filtered = history.filter((item) => item.toLowerCase() !== q.toLowerCase());
    const updated = [q, ...filtered].slice(0, 6); // keep last 6 searches
    setHistory(updated);
    localStorage.setItem("nexus_search_history", JSON.stringify(updated));
  };



  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        requestAnimationFrame(() => {
          setTimeout(() => setIsOpen(false), 200);
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced API Call for Suggestions
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: inputValue,
            kidsMode,
            history
          })
        });
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setSafetyCheck({ safe: data.safe ?? true, explanation: data.safetyExplanation });
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [inputValue, kidsMode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    if (!safetyCheck.safe) {
      setVoiceError("Please adjust your search. Let's find something safe!");
      setTimeout(() => setVoiceError(""), 4000);
      return;
    }
    
    addToHistory(inputValue);
    onSearch(inputValue);
    setIsOpen(false);
  };

  const selectSuggestion = (val: string) => {
    setInputValue(val);
    addToHistory(val);
    onSearch(val);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    setSuggestions([]);
    setSafetyCheck({ safe: true });
  };

  const highlightMatch = (text: string, query: string, isKidsMode: boolean) => {
    if (!query.trim()) return <>{text}</>;
    // escape regex characters in query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className={`font-bold ${isKidsMode ? "text-rose-900" : "text-white"}`}>
              {part}
            </span>
          ) : (
            <span key={i} className={isKidsMode ? "text-rose-600" : "text-gray-400"}>
              {part}
            </span>
          )
        )}
      </>
    );
  };

  return (
    <div className={`relative w-full mx-auto z-40 ${fontSizeClass}`} ref={dropdownRef}>
      {voiceError && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-12 left-0 right-0 mx-auto w-max px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full shadow-lg z-50 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {voiceError}
        </motion.div>
      )}
      <div className="flex items-center gap-4">
        <form onSubmit={handleSubmit} className="relative flex-1">
          <div className="flex items-center w-full shadow-sm rounded-full">
            {/* Input Wrapper */}
            <div
              className={`flex-1 flex items-center relative transition-all duration-300 rounded-l-full border ${
                kidsMode
                  ? "bg-white/90 border-rose-200 focus-within:border-rose-400 focus-within:bg-white focus-within:ml-0"
                  : "bg-[#121212] border-white/10 focus-within:border-[#3ea6ff] focus-within:bg-[#121212]"
              }`}
            >
              {/* Magnifying Glass (hidden on small screens, like YT) */}
              <div className="pl-5 pr-1 hidden sm:block opacity-0 focus-within:opacity-100 transition-opacity">
                <Search className={`w-5 h-5 ${kidsMode ? "text-rose-400" : "text-gray-400"}`} />
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
                onBlur={() => {
                  // Defer blur state updates to avoid layout thrashing during keyboard close
                  requestAnimationFrame(() => {
                    setTimeout(() => setIsOpen(false), 200);
                  });
                }}
                placeholder={
                  kidsMode ? "Search fun cartoons, animals, and space secrets! 🦕🚀" : "Search"
                }
                className={`w-full py-2.5 sm:py-3 pl-5 sm:pl-2 pr-14 text-base sm:text-lg bg-transparent outline-none border-none font-sans placeholder-gray-500 tracking-wide ${
                  kidsMode ? "text-rose-900 font-medium" : "text-white"
                }`}
              />

              {/* Right Action Icons (Clear / Sparkle loading indicator) */}
              <div className="absolute right-3 flex items-center gap-1.5">
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
                    className={`p-1.5 rounded-full transition-colors ${
                      kidsMode ? "hover:bg-rose-200/50 text-rose-500" : "hover:bg-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Search Button (YouTube Style) */}
            <button
              type="submit"
              className={`px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center cursor-pointer transition-colors rounded-r-full border-y border-r border-l-0 ${
                kidsMode
                  ? "bg-rose-100 border-rose-200 hover:bg-rose-200 text-rose-600"
                  : "bg-[#222222] border-white/10 hover:bg-[#303030] text-gray-200"
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Auto Suggestions dropdown attached to input */}
          <AnimatePresence>
            {isOpen && suggestions.length > 0 && (
              <motion.div
                id="search-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`absolute left-0 right-0 top-full mt-1 py-3 rounded-xl shadow-lg border ${
                  kidsMode
                    ? "bg-white border-rose-150 text-rose-900"
                    : "bg-[#222222] border-[#303030] text-gray-200"
                }`}
              >
                {/* Safety block message in Kids Mode */}
                {!safetyCheck.safe && (
                  <div className="mx-4 mb-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-400 text-sm">Oops, safety check! 🦖</p>
                      <p className="text-gray-300 mt-0.5 text-xs">
                        {safetyCheck.explanation || "That search query might include mature topics. Let's find something safe!"}
                      </p>
                    </div>
                  </div>
                )}

                {/* suggestions list */}
                {safetyCheck.safe && (
                  <ul className="flex flex-col">
                    {suggestions.slice(0, 4).map((item, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => selectSuggestion(item)}
                          className={`w-full text-left px-5 py-2 text-base flex items-center gap-4 transition-colors cursor-pointer ${
                            kidsMode
                              ? "hover:bg-rose-50 text-rose-900 font-medium"
                              : "hover:bg-[#333333] text-white"
                          }`}
                        >
                          <Search className={`w-4 h-4 shrink-0 ${kidsMode ? "text-rose-400" : "text-gray-400"}`} />
                          <span className="flex-1 truncate">
                            {highlightMatch(item, inputValue, kidsMode)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Microphone Button */}
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
        </button>
      </div>
    </div>
  );
}
