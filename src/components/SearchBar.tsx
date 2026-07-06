import React, { useState, useEffect, useRef } from "react";
import { Search, Sparkles, X, Clock, AlertTriangle, HelpCircle } from "lucide-react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const removeHistoryItem = (e: React.MouseEvent, q: string) => {
    e.stopPropagation();
    const updated = history.filter((item) => item !== q);
    setHistory(updated);
    localStorage.setItem("nexus_search_history", JSON.stringify(updated));
  };

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce API Suggestions call
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      setSafetyCheck({ safe: true });
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/gemini/suggest?q=${encodeURIComponent(inputValue)}&kidsMode=${kidsMode}`);
        const data: SearchSuggestionResponse = await res.json();
        
        if (data.suggestions) {
          setSuggestions(data.suggestions);
        }
        setSafetyCheck({
          safe: data.safe ?? true,
          explanation: data.safetyExplanation
        });
      } catch (err) {
        console.error("Failed fetching search suggestions:", err);
      } finally {
        setIsLoading(false);
      }
    }, 450); // 450ms debounce

    return () => clearTimeout(timer);
  }, [inputValue, kidsMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    if (safetyCheck.safe) {
      addToHistory(inputValue);
      onSearch(inputValue);
      setIsOpen(false);
    }
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

  return (
    <div className={`relative w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto z-40 ${fontSizeClass}`} ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center w-full rounded-2xl transition-all duration-300 relative overflow-hidden ${
            kidsMode
              ? "bg-rose-50/95 border-2 border-rose-300 focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-200"
              : "bg-white/5 border border-white/10 focus-within:border-red-500/40 focus-within:bg-white/8 focus-within:shadow-[0_0_25px_rgba(239,68,68,0.15)]"
          }`}
        >
          {/* Magnifying Glass */}
          <div className="pl-4 pr-2">
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
            placeholder={
              kidsMode ? "Search fun cartoons, animals, and space secrets! 🦕🚀" : "Search premium video feeds..."
            }
            className={`w-full py-3.5 pr-12 text-sm bg-transparent outline-none border-none font-sans placeholder-gray-400 tracking-wide ${
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
                <Sparkles className={`w-4 h-4 ${kidsMode ? "text-rose-400" : "text-red-400"}`} />
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
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Auto Suggestions & Search History dropdown */}
      <AnimatePresence>
        {isOpen && (inputValue || history.length > 0) && (
          <motion.div
            id="search-dropdown"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute left-0 right-0 mt-2 p-3 rounded-2xl shadow-2xl border ${
              kidsMode
                ? "bg-white border-rose-150 text-rose-900"
                : "bg-[#0b0b12]/95 backdrop-blur-2xl border-white/10 text-gray-200"
            }`}
          >
            {/* Safety block message in Kids Mode */}
            {!safetyCheck.safe && (
              <div className="mb-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-2.5 items-start">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-amber-400">Oops, safety check! 🦖</p>
                  <p className="text-gray-300 mt-0.5 leading-relaxed">
                    {safetyCheck.explanation || "That search query might include mature topics. Let's find something safe!"}
                  </p>
                </div>
              </div>
            )}

            {/* suggestions list */}
            {safetyCheck.safe && suggestions.length > 0 && (
              <div className="mb-3">
                <p className={`text-[10px] uppercase font-bold tracking-widest px-3 mb-1.5 ${
                  kidsMode ? "text-rose-400" : "text-red-400/80"
                }`}>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    AI Suggestions
                  </span>
                </p>
                <ul className="space-y-0.5">
                  {suggestions.map((item, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => selectSuggestion(item)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                          kidsMode
                            ? "hover:bg-rose-50 text-rose-900 font-medium"
                            : "hover:bg-white/5 text-gray-200 hover:text-white"
                        }`}
                      >
                        <Search className={`w-3.5 h-3.5 ${kidsMode ? "text-rose-400" : "text-gray-400"}`} />
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
                <p className={`text-[10px] uppercase font-bold tracking-widest px-3 mb-1.5 ${
                  kidsMode ? "text-rose-400" : "text-gray-400/80"
                }`}>
                  Recent Searches
                </p>
                <ul className="space-y-0.5">
                  {history.map((item, index) => (
                    <li key={index}>
                      <div
                        onClick={() => selectSuggestion(item)}
                        className={`group w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                          kidsMode
                            ? "hover:bg-rose-50 text-rose-900 font-medium"
                            : "hover:bg-white/5 text-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className={`w-3.5 h-3.5 ${kidsMode ? "text-rose-300" : "text-gray-500"}`} />
                          <span className={kidsMode ? "" : "text-gray-300 group-hover:text-white"}>{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => removeHistoryItem(e, item)}
                          className={`p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity ${
                            kidsMode ? "hover:bg-rose-200 text-rose-600" : "hover:bg-white/15 text-gray-400"
                          }`}
                        >
                          <X className="w-3 h-3" />
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
    </div>
  );
}
