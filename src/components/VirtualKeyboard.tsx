import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, X, ArrowUp, Crown, Globe, Mic, Smile, Volume2, Vibrate, Image as ImageIcon, Search } from 'lucide-react';

interface VirtualKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  inputValue: string;
  onKeyPress: (key: string) => void;
  onSubmit: () => void;
  kidsMode?: boolean;
}

const topRow = [
  { char: 'q', sup: '1' }, { char: 'w', sup: '2' }, { char: 'e', sup: '3' },
  { char: 'r', sup: '4' }, { char: 't', sup: '5' }, { char: 'y', sup: '6' },
  { char: 'u', sup: '7' }, { char: 'i', sup: '8' }, { char: 'o', sup: '9' },
  { char: 'p', sup: '0' }
];
const midRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const botRow = ['{shift}', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '{backspace}'];
const actionRow = ['{symbols}', '{emoji}', '{comma_mic}', '{space}', '{globe}', '.', '{search}'];

export default function VirtualKeyboard({
  isOpen,
  onClose,
  inputValue,
  onKeyPress,
  onSubmit,
  kidsMode = false
}: VirtualKeyboardProps) {
  const [isShift, setIsShift] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState(0.5);
  const [soundStyle, setSoundStyle] = useState('Mechanical'); // Mechanical, Soft Click, Pop, Silent
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [wallpaper, setWallpaper] = useState('dark-glass'); // dark-glass, carbon, midnight

  const [clipboardText, setClipboardText] = useState("");

  useEffect(() => {
    const readClipboard = async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text) {
             setClipboardText(text);
          }
        }
      } catch (err) {
        // console.warn("Clipboard read not permitted");
      }
    };
    if (isOpen) {
      readClipboard();
    }
  }, [isOpen]);

  useEffect(() => {
     const handleCopy = () => {
        setTimeout(async () => {
           try {
             if (navigator.clipboard && navigator.clipboard.readText) {
                const text = await navigator.clipboard.readText();
                if (text) setClipboardText(text);
             } else {
                const selection = window.getSelection();
                if (selection) setClipboardText(selection.toString());
             }
           } catch (e) {}
        }, 100);
     };
     document.addEventListener('copy', handleCopy);
     return () => document.removeEventListener('copy', handleCopy);
  }, []);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const triggerHaptic = () => {
    if (hapticEnabled && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const playClickSound = () => {
    if (!soundEnabled || soundStyle === 'Silent') return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      if (soundStyle === 'Pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
        gain.gain.setValueAtTime(soundVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (soundStyle === 'Soft Click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(soundVolume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
        osc.start(now);
        osc.stop(now + 0.02);
      } else if (soundStyle === 'Mechanical') {
        const bufferSize = ctx.sampleRate * 0.03; 
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 5000;
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        gain.gain.setValueAtTime(soundVolume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
        noise.start(now);
      }
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  };

  const lastKeyTimeRef = useRef(0);

  const handleKeyClick = (key: string, e: React.PointerEvent<HTMLButtonElement>) => {
    if ('preventDefault' in e) e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    if (now - lastKeyTimeRef.current < 50) return;
    lastKeyTimeRef.current = now;

    playClickSound();
    triggerHaptic();

    if (key === '{shift}') {
      setIsShift(!isShift);
    } else if (key === '{symbols}') {
      // Toggle symbols
    } else if (key === '{search}') {
      onSubmit();
      onClose();
    } else if (key === '{comma_mic}') {
      onKeyPress(',');
    } else {
      const char = isShift && key.length === 1 ? key.toUpperCase() : key;
      onKeyPress(char);
      if (isShift && key.length === 1) setIsShift(false);
    }
  };

  if (!isOpen) return null;

  let containerClass = "fixed bottom-0 left-0 right-0 z-[99999] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t overflow-hidden ";
  let keyStyleClass = "";

  if (wallpaper === 'dark-glass') {
    containerClass += "bg-[#1a1a1a]/95 backdrop-blur-3xl border-white/10";
    keyStyleClass = "bg-white/10 text-white border border-white/5 shadow-[inset_0_1px_rgba(255,255,255,0.1)] active:bg-white/30";
  } else if (wallpaper === 'carbon') {
    containerClass += "bg-[#0d0d12] border-gray-800 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]";
    keyStyleClass = "bg-black/60 text-white border border-gray-800 shadow-[inset_0_1px_rgba(255,255,255,0.05)] active:bg-black/80";
  } else if (wallpaper === 'midnight') {
    containerClass += "bg-[#0a0f1c]/95 backdrop-blur-3xl border-blue-900/50";
    keyStyleClass = "bg-blue-500/10 text-blue-50 border border-blue-500/20 shadow-[inset_0_1px_rgba(255,255,255,0.05)] active:bg-blue-500/30";
  }

  if (kidsMode) {
    containerClass = "fixed bottom-0 left-0 right-0 z-[99999] shadow-2xl border-t bg-white/95 backdrop-blur-xl border-rose-200 overflow-hidden";
    keyStyleClass = "bg-rose-100 text-rose-900 border border-rose-200 active:bg-rose-300 shadow-sm";
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={containerClass}
          style={{ touchAction: 'none' }}
        >

          {/* Clipboard Preview / Paste Bar */}
          <AnimatePresence>
            {clipboardText && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full flex items-center bg-[#1a1a1a] border-b border-white/5"
              >
                <div 
                  className="flex-1 px-4 py-2 text-sm text-gray-300 truncate cursor-pointer hover:bg-white/5 transition-colors"
                  onPointerDown={(e) => {
                    if ('preventDefault' in e) e.preventDefault();
                    e.stopPropagation();
                    playClickSound();
                    triggerHaptic();
                    onKeyPress(clipboardText);
                    setClipboardText("");
                  }}
                >
                  <span className="text-gray-500 mr-2 text-xs font-bold uppercase tracking-widest">Paste</span>
                  {clipboardText}
                </div>
                <button 
                   onPointerDown={(e) => {
                      if ('preventDefault' in e) e.preventDefault();
                      e.stopPropagation();
                      setClipboardText("");
                   }}
                   className="p-3 text-gray-500 hover:text-white"
                >
                   <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Input Display Area */}
          <div className={`w-full backdrop-blur-md border-b px-4 sm:px-6 py-4 sm:py-5 flex items-center shadow-inner min-h-[64px] ${kidsMode ? 'bg-white/50 border-rose-200' : 'bg-black/40 border-white/5'}`}>
             <div className={`flex-1 text-xl sm:text-2xl font-bold tracking-wide truncate overflow-hidden whitespace-nowrap ${kidsMode ? 'text-rose-950' : 'text-white'}`}>
                {inputValue || <span className={kidsMode ? "text-rose-400 font-normal" : "text-gray-500 font-normal"}>Search...</span>}
             </div>
             <div className={`w-1 h-6 sm:h-7 animate-pulse ml-1 rounded-full ${kidsMode ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
          </div>

          {/* Settings Toolbar */}
          <div className="flex justify-between items-center px-4 py-1.5 border-b border-white/5 bg-black/20 backdrop-blur-md">
            <div className="flex gap-4 items-center">
               <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-gray-400 active:scale-90 transition-transform">
                 <X className="w-5 h-5" />
               </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowSettings(!showSettings)} className="p-1.5 rounded-full hover:bg-white/10 text-amber-400 active:scale-90 transition-all bg-white/5 border border-white/5">
                <Crown className="w-4 h-4 fill-amber-400/20" />
              </button>
            </div>
          </div>

          <div className="relative p-2 pb-6 sm:p-4 sm:pb-8">
             <div className="max-w-4xl mx-auto flex flex-col gap-1.5 sm:gap-2">
                {/* Top Row */}
                <div className="flex gap-1 sm:gap-1.5 justify-center w-full">
                    {topRow.map(key => (
                        <button
                            key={key.char}
                            onPointerDown={(e) => handleKeyClick(key.char, e)}
                            
                            className={`relative flex items-center justify-center rounded-[10px] font-medium text-lg sm:text-2xl transition-all select-none active:scale-95 ${keyStyleClass}`}
                            style={{ height: '3.4rem', minWidth: '2rem', flex: 1 }}
                        >
                            <span className="absolute top-1 right-1.5 text-[9px] opacity-60 font-semibold">{key.sup}</span>
                            {isShift ? key.char.toUpperCase() : key.char}
                        </button>
                    ))}
                </div>

                {/* Middle Row */}
                <div className="flex gap-1 sm:gap-1.5 justify-center w-full px-4 sm:px-6">
                  {midRow.map(char => (
                    <button 
                      key={char} 
                      onPointerDown={(e) => handleKeyClick(char, e)} 
                       
                      className={`flex items-center justify-center rounded-[10px] font-medium text-lg sm:text-2xl transition-all select-none active:scale-95 ${keyStyleClass}`} 
                      style={{ height: '3.4rem', minWidth: '2rem', flex: 1 }}
                    >
                        {isShift ? char.toUpperCase() : char}
                    </button>
                  ))}
                </div>

                {/* Bottom Row */}
                <div className="flex gap-1 sm:gap-1.5 justify-center w-full">
                  {botRow.map(char => {
                    let content: any = char;
                    let flex = 1;
                    let extraClass = keyStyleClass;
                    if (char === '{shift}') {
                      content = <ArrowUp className={`w-5 h-5 ${isShift ? (kidsMode ? 'text-rose-500' : 'text-blue-400') : 'text-gray-400'}`} strokeWidth={isShift ? 3 : 2} />;
                      flex = 1.25;
                      extraClass = kidsMode ? "bg-rose-200 text-rose-900 border border-rose-300" : "bg-white/10 text-white border border-white/5 active:bg-white/30";
                    } else if (char === '{backspace}') {
                      content = <Delete className="w-5 h-5 text-gray-400" />;
                      flex = 1.25;
                      extraClass = kidsMode ? "bg-rose-200 text-rose-900 border border-rose-300" : "bg-white/10 text-white border border-white/5 active:bg-white/30";
                    } else {
                      content = isShift ? char.toUpperCase() : char;
                    }
                    
                    return (
                      <button 
                        key={char} 
                        onPointerDown={(e) => handleKeyClick(char, e)} 
                         
                        className={`flex items-center justify-center rounded-[10px] font-medium text-lg sm:text-2xl transition-all select-none active:scale-95 ${extraClass}`} 
                        style={{ height: '3.4rem', minWidth: '2rem', flex }}
                      >
                          {content}
                      </button>
                    )
                  })}
                </div>

                {/* Action Row */}
                <div className="flex gap-1 sm:gap-1.5 justify-center w-full">
                  {actionRow.map(char => {
                    let content: any = char;
                    let flex = 1.2;
                    let extraClass = keyStyleClass;
                    
                    if (char === '{symbols}') {
                      content = <span className="text-sm font-semibold opacity-80">?123</span>;
                      extraClass = kidsMode ? "bg-rose-200 text-rose-900 border border-rose-300" : "bg-white/10 text-white border border-white/5 active:bg-white/30";
                    } else if (char === '{emoji}') {
                      content = <Smile className="w-5 h-5 opacity-80" />;
                      extraClass = kidsMode ? "bg-rose-200 text-rose-900 border border-rose-300" : "bg-white/10 text-white border border-white/5 active:bg-white/30";
                    } else if (char === '{comma_mic}') {
                      content = <div className="flex flex-col items-center justify-center"><Mic className="w-2.5 h-2.5 opacity-60 -mb-1 mt-1"/><span className="leading-none">,</span></div>;
                    } else if (char === '{space}') {
                      content = <span className="text-sm opacity-60 font-semibold tracking-widest">English</span>;
                      flex = 4;
                    } else if (char === '{globe}') {
                      content = <Globe className="w-5 h-5 opacity-80" />;
                    } else if (char === '.') {
                      content = '.';
                    } else if (char === '{search}') {
                      content = <div className="bg-blue-500 rounded-[8px] p-2 sm:p-2.5 shadow-lg flex items-center justify-center w-full h-full"><ArrowUp className="w-5 h-5 text-white rotate-90" /></div>;
                      flex = 1.5;
                      extraClass = "bg-transparent active:scale-90 border-none p-0 overflow-hidden";
                    }

                    return (
                      <button 
                        key={char} 
                        onPointerDown={(e) => handleKeyClick(char, e)} 
                         
                        className={`flex items-center justify-center rounded-[10px] font-medium text-lg sm:text-2xl transition-all select-none active:scale-95 ${extraClass}`} 
                        style={{ height: '3.4rem', minWidth: '2.5rem', flex }}
                      >
                          {content}
                      </button>
                    )
                  })}
                </div>
             </div>

             {/* Settings Overlay */}
             <AnimatePresence>
               {showSettings && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 20 }}
                   className={`absolute inset-0 z-10 flex flex-col p-4 sm:p-6 overflow-y-auto ${kidsMode ? 'bg-white/95' : 'bg-[#111115]/95'} backdrop-blur-xl`}
                 >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className={`font-bold text-lg flex items-center gap-2 ${kidsMode ? 'text-rose-900' : 'text-white'}`}>
                        <Crown className="w-5 h-5 text-amber-400 fill-amber-400/20"/> Keyboard Settings
                      </h3>
                      <button onClick={() => setShowSettings(false)} className={`p-2 rounded-full ${kidsMode ? 'bg-rose-100 text-rose-900' : 'bg-white/10 text-white'}`}>
                        <X className="w-5 h-5"/>
                      </button>
                    </div>
                    
                    <div className={`space-y-6 pb-8 max-w-2xl mx-auto w-full ${kidsMode ? 'text-rose-900' : 'text-gray-200'}`}>
                       {/* Sound */}
                       <div className={`p-4 rounded-xl ${kidsMode ? 'bg-rose-50 border border-rose-100' : 'bg-white/5 border border-white/5'}`}>
                         <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold flex items-center gap-2"><Volume2 className="w-4 h-4"/> Key Click Sound</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                            </label>
                         </div>
                         {soundEnabled && (
                           <div className="pl-6 space-y-4 border-l-2 border-white/10">
                             <div className="flex items-center gap-4">
                               <span className={`text-sm ${kidsMode ? 'text-rose-600' : 'text-gray-400'}`}>Volume</span>
                               <input type="range" min="0" max="1" step="0.1" value={soundVolume} onChange={e => setSoundVolume(parseFloat(e.target.value))} className="w-full accent-blue-500" />
                             </div>
                             <div className="flex flex-wrap gap-2">
                               {['Mechanical', 'Soft Click', 'Pop'].map(s => (
                                 <button 
                                   key={s} 
                                   onClick={() => setSoundStyle(s)} 
                                   className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                                     soundStyle === s 
                                      ? (kidsMode ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white') 
                                      : (kidsMode ? 'bg-rose-200/50 text-rose-700' : 'bg-white/10 text-gray-300 hover:bg-white/20')
                                   }`}
                                 >
                                   {s}
                                 </button>
                               ))}
                             </div>
                           </div>
                         )}
                       </div>

                       {/* Haptic */}
                       <div className={`p-4 rounded-xl flex justify-between items-center ${kidsMode ? 'bg-rose-50 border border-rose-100' : 'bg-white/5 border border-white/5'}`}>
                          <span className="font-semibold flex items-center gap-2"><Vibrate className="w-4 h-4"/> Haptic Feedback</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked={hapticEnabled} onChange={e => setHapticEnabled(e.target.checked)} className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                            </label>
                       </div>

                       {/* Wallpaper */}
                       {!kidsMode && (
                         <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                            <span className="font-semibold flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Background Texture</span>
                            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                              {[
                                { id: 'dark-glass', name: 'Dark Glass' },
                                { id: 'carbon', name: 'Carbon Fibre' },
                                { id: 'midnight', name: 'Midnight Blue' }
                              ].map(w => (
                                <button 
                                  key={w.id} 
                                  onClick={() => setWallpaper(w.id)} 
                                  className={`shrink-0 px-4 py-3 text-sm rounded-xl font-medium border transition-all ${
                                    wallpaper === w.id 
                                      ? 'border-blue-500 bg-blue-500/20 text-white' 
                                      : 'border-white/10 bg-black/20 text-gray-400 hover:border-white/30'
                                  }`}
                                >
                                  {w.name}
                                </button>
                              ))}
                            </div>
                         </div>
                       )}
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
