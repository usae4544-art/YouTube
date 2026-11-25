import React, { useState, useEffect, useRef } from "react";
import { Search, Sparkles, X, AlertTriangle, Mic } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  fetchSuggestionsClient,
  isNativeAndroid,
  requestNativePermissions,
} from "../lib/nexusBridge";

interface SearchBarProps {
  onSearch: (query: string) => void;
  kidsMode: boolean;
  fontSizeClass: string;
  onFocusChange?: (isFocused: boolean) => void;
}

const SearchBar = ({
  onSearch,
  kidsMode,
  fontSizeClass,
  onFocusChange,
}: SearchBarProps) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [safetyCheck, setSafetyCheck] = useState<{
    safe: boolean;
    explanation?: string;
  }>({ safe: true });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleVoiceSearch = () => {
    if (isNativeAndroid() && window.NexusAndroid?.hasMicPermission?.() === false) {
      requestNativePermissions();
      setVoiceError("Allow Microphone permission and tap Mic again.");
      setTimeout(() => setVoiceError(""), 4000);
      return;
    }

    let recognition: any;
    try {
      if ("SpeechRecognition" in window) {
        const SpeechRecognition = (window as any).SpeechRecognition;
        recognition = new SpeechRecognition();
      } else if ("webkitSpeechRecognition" in window) {
        const WebkitSpeechRecognition = (window as any).webkitSpeechRecognition;
        recognition = new WebkitSpeechRecognition();
      } else {
        setVoiceError("Voice search is unavailable on this WebView/device.");
        setTimeout(() => setVoiceError(""), 4000);
        return;
      }
    } catch {
      setVoiceError("Voice search could not start. Check microphone permission.");
      setTimeout(() => setVoiceError(""), 4000);
      return;
    }

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) {
        setInputValue(transcript);
        addToHistory(transcript);
        onSearch(transcript);
      }
      setIsOpen(false);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        requestNativePermissions();
        setVoiceError("Microphone access denied. Enable Mic permission in App Settings.");
      } else {
        setVoiceError("Voice search unavailable (" + event.error + ").");
      }
      setTimeout(() => setVoiceError(""), 4500);
    };

    recognition.onend = () => setIsListening(false);

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceError("Unable to start voice capture right now.");
      setTimeout(() => setVoiceError(""), 4000);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexus_search_history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const addToHistory = (q: string) => {
    if (!q.trim()) return;
    const filtered = history.filter(
      (item) => item.toLowerCase() !== q.toLowerCase(),
    );
    const updated = [q.trim(), ...filtered].slice(0, 6);
    setHistory(updated);
    localStorage.setItem("nexus_search_history", JSON.stringify(updated));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        requestAnimationFrame(() => {
          setTimeout(() => setIsOpen(false), 160);
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen && !inputValue) return;
    let active = true;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await fetchSuggestionsClient({
          q: inputValue,
          kidsMode,
          history,
        });
        if (!active) return;
        setSuggestions(data.suggestions || []);
        setSafetyCheck({
          safe: data.safe ?? true,
          explanation: data.safetyExplanation,
        });
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    }, 350);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [inputValue, kidsMode, isOpen, history]);

  const handleSubmit = (e?: React.FormEvent | Event) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputValue.trim()) {
      onSearch("");
      setIsOpen(false);
      return;
    }

    if (!safetyCheck.safe) {
      setVoiceError("Please pick a kid-safe topic!");
      setTimeout(() => setVoiceError(""), 3500);
      return;
    }

    addToHistory(inputValue);
    onSearch(inputValue.trim());
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
    onSearch("");
  };

  const highlightMatch = (text: string, query: string, isKidsMode: boolean) => {
    if (!query.trim()) return <>{text}</>;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span
              key={i}
              className={`font-bold ${isKidsMode ? "text-rose-900" : "text-white"}`}
            >
              {part}
            </span>
          ) : (
            <span
              key={i}
              className={isKidsMode ? "text-rose-600" : "text-gray-400"}
            >
              {part}
            </span>
          ),
        )}
      </>
    );
  };

  return (
    <div className={`relative w-full mx-auto z-40 ${fontSizeClass}`} ref={dropdownRef}>
      <AnimatePresence>
        {voiceError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 left-0 right-0 mx-auto max-w-full w-max px-4 py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-lg z-50 flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="truncate">{voiceError}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-2">
        <form onSubmit={handleSubmit} className="relative flex-1 min-w-0">
          <div className="flex items-center w-full shadow-sm rounded-full">
            <div
              className={`flex-1 flex items-center min-w-0 relative transition-all duration-300 rounded-l-full border ${
                kidsMode
                  ? "bg-white/95 border-rose-200 focus-within:border-rose-400 focus-within:bg-white"
                  : "bg-[#121212] border-white/10 focus-within:border-[#3ea6ff]"
              }`}
            >
              <div className="pl-4 pr-1 hidden sm:flex items-center justify-center">
                <Search
                  className={`w-5 h-5 ${kidsMode ? "text-rose-400" : "text-gray-400"}`}
                />
              </div>

              <input
                autoComplete="off"
                id="search-input"
                type="search"
                value={inputValue}
                onChange={(e) => {
                  const val = e.target.value;
                  setInputValue(val);
                  setIsOpen(true);
                  if (!val.trim()) onSearch("");
                }}
                onFocus={() => {
                  setIsOpen(true);
                  if (onFocusChange) onFocusChange(true);
                }}
                onBlur={() => {
                  if (onFocusChange) onFocusChange(false);
                }}
                placeholder={kidsMode ? "Search fun cartoons!" : "Search videos..."}
                className={`w-full h-[46px] sm:h-[52px] box-border min-w-0 px-4 text-[15px] sm:text-[17px] leading-normal font-semibold bg-transparent outline-none border-none placeholder-gray-500 tracking-wide overflow-hidden text-ellipsis ${
                  kidsMode ? "text-rose-950" : "text-white"
                }`}
                style={{ paddingRight: "3.25rem" }}
              />

              <div className="absolute right-2 flex items-center gap-1 h-full top-0">
                {isLoading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles
                      className={`w-4 h-4 ${kidsMode ? "text-rose-400" : "text-gray-400"}`}
                    />
                  </motion.div>
                )}
                {inputValue && (
                  <button
                    id="search-clear-btn"
                    type="button"
                    onClick={handleClear}
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
                      kidsMode
                        ? "hover:bg-rose-200/50 text-rose-500"
                        : "hover:bg-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`w-[54px] sm:w-[74px] h-[46px] sm:h-[52px] flex items-center justify-center shrink-0 cursor-pointer transition-colors rounded-r-full border-y border-r border-l-0 ${
                kidsMode
                  ? "bg-rose-100 border-rose-200 hover:bg-rose-200 text-rose-600"
                  : "bg-[#222222] border-white/10 hover:bg-[#303030] text-gray-200"
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence>
            {isOpen && suggestions.length > 0 && (
              <motion.div
                id="search-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className={`absolute left-0 right-0 top-full mt-1 py-2.5 rounded-xl shadow-xl border z-50 ${
                  kidsMode
                    ? "bg-white border-rose-200 text-rose-900"
                    : "bg-[#1e1e26] border-white/10 text-gray-200"
                }`}
              >
                {!safetyCheck.safe && (
                  <div className="mx-3 mb-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-2.5 items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-400 text-xs sm:text-sm">
                        Safety Check
                      </p>
                      <p className="text-gray-300 mt-0.5 text-xs">
                        {safetyCheck.explanation ||
                          "Let's choose a kid-friendly search!"}
                      </p>
                    </div>
                  </div>
                )}

                {safetyCheck.safe && (
                  <ul className="flex flex-col">
                    {suggestions.slice(0, 4).map((item, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          onClick={() => selectSuggestion(item)}
                          className={`w-full text-left px-4 py-2 text-sm sm:text-base flex items-center gap-3 transition-colors cursor-pointer ${
                            kidsMode
                              ? "hover:bg-rose-50 text-rose-900 font-medium"
                              : "hover:bg-white/10 text-white"
                          }`}
                        >
                          <Search
                            className={`w-4 h-4 shrink-0 ${
                              kidsMode ? "text-rose-400" : "text-gray-400"
                            }`}
                          />
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

        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={handleVoiceSearch}
          className={`flex-shrink-0 w-[46px] h-[46px] sm:w-[52px] sm:h-[52px] rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isListening
              ? kidsMode
                ? "bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-300"
                : "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50"
              : kidsMode
                ? "bg-rose-100 text-rose-500 hover:bg-rose-200"
                : "bg-[#181818] hover:bg-[#303030] text-white border border-white/10"
          }`}
          title="Voice Search"
        >
          <Mic className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}

export default React.memo(SearchBar);
