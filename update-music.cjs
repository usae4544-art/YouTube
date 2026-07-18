const fs = require('fs');

const code = `import React, { useState, useRef, useEffect } from 'react';
import { Search, Play, Pause, Music, Disc3, FileText, Loader2, Volume2, X, ChevronRight, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Hls from 'hls.js';

interface Song {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
}

const CATEGORIES = [
  { id: "punjabi", title: "Punjabi Hits", query: "Punjabi top hits 2024" },
  { id: "hindi", title: "Hindi Trending", query: "Hindi trending songs" },
  { id: "english", title: "English Chartbusters", query: "English pop hits" },
  { id: "marathi", title: "Marathi Favorites", query: "Marathi popular songs" },
];

export default function MusicTab({ kidsMode }: { kidsMode: boolean }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const [homeData, setHomeData] = useState<Record<string, Song[]>>({});
  const [isLoadingHome, setIsLoadingHome] = useState(true);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let active = true;
    const fetchHomeData = async () => {
      setIsLoadingHome(true);
      const data: Record<string, Song[]> = {};
      
      try {
        await Promise.all(CATEGORIES.map(async (cat) => {
          const res = await fetch(\`https://musicapi.x007.workers.dev/search?q=\${encodeURIComponent(cat.query)}&searchEngine=gaama\`);
          if (res.ok) {
            const json = await res.json();
            if (json && json.response) data[cat.id] = json.response;
            else if (Array.isArray(json)) data[cat.id] = json;
            else if (json && json.data) data[cat.id] = json.data;
            else data[cat.id] = [];
          }
        }));
        if (active) {
          setHomeData(data);
        }
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        if (active) setIsLoadingHome(false);
      }
    };
    fetchHomeData();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      handleSearch(debouncedQuery);
    } else {
      setResults([]);
      setSearchError(null);
    }
  }, [debouncedQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(\`https://musicapi.x007.workers.dev/search?q=\${encodeURIComponent(searchQuery)}&searchEngine=gaama\`);
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      
      if (data && data.response) {
         setResults(data.response);
      } else if (Array.isArray(data)) {
         setResults(data);
      } else if (data && data.data) {
         setResults(data.data);
      } else {
         setResults([]);
      }
    } catch (err: any) {
      console.error(err);
      setSearchError(err.message || "Something went wrong while searching.");
    } finally {
      setIsSearching(false);
    }
  };

  const playSong = async (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(false);
    setAudioUrl(null);
    setLyrics(null);
    setShowLyrics(false);
    setIsLoadingAudio(true);
    
    try {
      const res = await fetch(\`https://musicapi.x007.workers.dev/fetch?id=\${song.id}\`);
      if (!res.ok) throw new Error("Failed to fetch audio stream");
      let urlToPlay = "";
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (typeof data === "string") urlToPlay = data;
        else if (data && data.url) urlToPlay = data.url;
        else if (data && data.response && data.response.url) urlToPlay = data.response.url;
        else if (data && data.response) urlToPlay = data.response;
      } else {
        const text = await res.text();
        urlToPlay = text.trim();
      }
      
      if (urlToPlay) {
        setAudioUrl(urlToPlay);
        setIsPlaying(true);
      } else {
         console.warn("Could not find audio URL in response");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load audio stream. The API might be down.");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const fetchLyrics = async () => {
    if (!currentSong) return;
    setIsLoadingLyrics(true);
    setShowLyrics(true);
    try {
      const res = await fetch(\`https://musicapi.x007.workers.dev/lyrics?id=\${currentSong.id}\`);
      if (!res.ok) throw new Error("Failed to fetch lyrics");
      const data = await res.json();
      
      if (data && data.lyrics) {
        setLyrics(data.lyrics);
      } else if (data && data.response && data.response.lyrics) {
        setLyrics(data.response.lyrics);
      } else {
        setLyrics("No lyrics found.");
      }
    } catch (err) {
      console.error(err);
      setLyrics("Error fetching lyrics. The API might be down.");
    } finally {
      setIsLoadingLyrics(false);
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      if (audioUrl.includes('.m3u8')) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(audioUrl);
          hls.attachMedia(audioRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (isPlaying) {
              audioRef.current?.play().catch(e => console.error("HLS Playback error", e));
            }
          });
          return () => hls.destroy();
        } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          audioRef.current.src = audioUrl;
          if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Safari HLS Playback error", e));
          }
        }
      } else {
        audioRef.current.src = audioUrl;
        if (isPlaying) {
          audioRef.current.play().catch(e => console.error("Playback error", e));
        }
      }
    }
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      if (isPlaying && audioRef.current.paused) {
        audioRef.current.play().catch(e => console.error("Playback error", e));
      } else if (!isPlaying && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioUrl]);

  const renderSongCard = (song: Song, index: number, isRow: boolean = false) => {
    const isCurrent = currentSong?.id === song.id;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        key={song.id}
        onClick={() => playSong(song)}
        className={\`group \${isRow ? "w-40 md:w-48 shrink-0 flex flex-col" : "flex items-center gap-4"} p-3 rounded-2xl cursor-pointer transition-all \${
          isCurrent
            ? kidsMode ? "bg-rose-100 border-rose-300" : "bg-violet-500/20 border-violet-500/50"
            : kidsMode ? "bg-white hover:bg-rose-50 border-transparent" : "bg-white/5 hover:bg-white/10 border-white/5"
        } border\`}
      >
        <div className={\`\${isRow ? "w-full aspect-square mb-3" : "w-14 h-14"} rounded-xl overflow-hidden bg-gray-800 shrink-0 relative\`}>
          {song.image ? (
            <img src={song.image} alt={song.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <Disc3 className="w-6 h-6 text-gray-500" />
            </div>
          )}
          
          <div className={\`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 \${isCurrent || isRow ? "opacity-0 group-hover:opacity-100" : "opacity-0"}\`}>
            {isCurrent && isPlaying ? (
              <Volume2 className="w-8 h-8 text-white animate-pulse" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
          {isCurrent && !isRow && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
               {isPlaying ? <Volume2 className="w-6 h-6 text-white animate-pulse" /> : <Play className="w-6 h-6 text-white ml-1" />}
            </div>
          )}
        </div>
        <div className={\`flex-1 min-w-0 \${isRow ? "text-center" : ""}\`}>
          <h3 className="font-bold truncate text-sm md:text-base">{song.title}</h3>
          {song.subtitle && <p className="text-xs text-gray-400 truncate mt-0.5">{song.subtitle}</p>}
        </div>
      </motion.div>
    );
  };

  return (
    <div className={\`w-full h-full flex flex-col \${kidsMode ? "bg-rose-50 text-rose-900" : "bg-transparent text-white"}\`}>
      {/* Header & Search */}
      <div className="p-6 md:p-8 shrink-0 pb-4">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Music className={\`w-8 h-8 \${kidsMode ? "text-rose-500" : "text-violet-400"}\`} />
          Music
        </h1>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} className="flex gap-3">
          <div className="relative flex-1 max-w-xl">
            <Search className={\`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 \${isSearching ? 'text-violet-400 animate-pulse' : 'text-gray-400'}\`} />
            <input
              type="text"
              placeholder="Search for songs, artists, albums..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={\`w-full pl-12 pr-10 py-3.5 rounded-2xl outline-none transition-all \${
                kidsMode 
                  ? "bg-white border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100" 
                  : "bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-violet-500"
              } border shadow-lg\`}
            />
            {query && (
              <button 
                type="button" 
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-32 scrollbar-none">
        
        {/* Search Suggestions & Results */}
        {query.trim().length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-violet-400" /> 
              Search Results
            </h2>
            
            {searchError ? (
              <div className="py-12 text-center text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">
                {searchError}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {results.map((song, i) => renderSongCard(song, i, false))}
              </div>
            ) : isSearching ? (
              <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                <p>Searching for "{query}"...</p>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-4">
                <Music className="w-12 h-12 opacity-20" />
                <p>No results found for "{query}"</p>
              </div>
            )}
          </div>
        ) : (
          /* Default Home View with Categories */
          <div className="space-y-10">
            {isLoadingHome ? (
              <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                <p>Loading curated music...</p>
              </div>
            ) : (
              CATEGORIES.map((cat) => {
                const catSongs = homeData[cat.id] || [];
                if (catSongs.length === 0) return null;
                
                return (
                  <div key={cat.id} className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold flex items-center gap-2">
                        <Hash className={\`w-5 h-5 \${kidsMode ? "text-rose-400" : "text-violet-400"}\`} />
                        {cat.title}
                      </h2>
                    </div>
                    
                    <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x">
                      {catSongs.map((song, i) => (
                        <div className="snap-start" key={song.id}>
                           {renderSongCard(song, i, true)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Mini Player */}
      <AnimatePresence>
        {currentSong && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className={\`fixed bottom-0 left-0 right-0 z-50 md:left-64 xl:left-72 p-4 border-t \${
              kidsMode ? "bg-rose-100/95 border-rose-200" : "bg-[#09090e]/95 border-white/10"
            } backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)]\`}
          >
            {showLyrics && (
              <div className={\`mb-4 p-4 rounded-2xl max-h-[50vh] overflow-y-auto shadow-2xl \${
                kidsMode ? "bg-white text-rose-900 border border-rose-200" : "bg-black/60 text-gray-200 border border-white/10"
              }\`}>
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                  <h3 className="font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-violet-400" />
                    Lyrics
                  </h3>
                  <button onClick={() => setShowLyrics(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors bg-white/5">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {isLoadingLyrics ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
                    <p className="text-sm text-gray-400">Fetching lyrics...</p>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed max-w-2xl mx-auto text-center">
                    {lyrics}
                  </pre>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-4 max-w-screen-xl mx-auto">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden bg-gray-800 shrink-0 relative shadow-lg">
                {currentSong.image ? (
                  <img 
                    src={currentSong.image} 
                    alt={currentSong.title} 
                    className={\`w-full h-full object-cover transition-transform duration-[10s] \${isPlaying ? 'scale-125' : 'scale-100'}\`} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Disc3 className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                {isLoadingAudio && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm md:text-lg truncate">{currentSong.title}</h4>
                <p className={\`text-xs md:text-sm truncate \${kidsMode ? "text-rose-600" : "text-gray-400"}\`}>
                  {currentSong.subtitle || "Unknown Artist"}
                </p>
              </div>

              <div className="flex items-center gap-3 md:gap-6 shrink-0">
                <button
                  onClick={fetchLyrics}
                  className={\`p-3 rounded-full transition-colors \${
                    showLyrics 
                      ? kidsMode ? "bg-rose-500 text-white" : "bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                      : kidsMode ? "hover:bg-rose-200 text-rose-700 bg-white" : "hover:bg-white/10 text-gray-300 bg-white/5"
                  }\`}
                  title="Lyrics"
                >
                  <FileText className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isLoadingAudio}
                  className={\`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full transition-all transform active:scale-95 \${
                    kidsMode
                      ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200"
                      : "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  }\`}
                >
                  {isLoadingAudio ? (
                    <Loader2 className="w-6 h-6 animate-spin text-black" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6 md:w-8 md:h-8" />
                  ) : (
                    <Play className="w-6 h-6 md:w-8 md:h-8 translate-x-1" />
                  )}
                </button>
              </div>
            </div>
            
            <audio
              ref={audioRef}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`

fs.writeFileSync('src/components/MusicTab.tsx', code);
