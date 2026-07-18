import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, X, Send, Sparkles, BrainCircuit } from "lucide-react";

export function NexusAiAssistant({ isOpen, onClose, kidsMode }: { isOpen: boolean, onClose: () => void, kidsMode: boolean }) {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Hello! I am Nexus AI. I know everything about Nexus. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, kidsMode })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply || "I didn't quite get that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`fixed bottom-24 right-4 md:bottom-8 md:right-8 w-[350px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden border ${
            kidsMode 
              ? "bg-white border-rose-200" 
              : "bg-[#0b0b12]/95 backdrop-blur-3xl border-indigo-500/30"
          }`}
        >
          {/* Header */}
          <div className={`p-4 flex items-center justify-between border-b ${kidsMode ? "border-rose-100 bg-rose-50" : "border-white/10 bg-white/5"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kidsMode ? "bg-rose-500 text-white" : "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"}`}>
                <BrainCircuit className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className={`font-bold font-display leading-tight ${kidsMode ? "text-rose-700" : "text-white"}`}>Nexus AI</h3>
                <p className={`text-[10px] uppercase tracking-wider font-semibold ${kidsMode ? "text-rose-400" : "text-indigo-300"}`}>Intelligent Assistant</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${kidsMode ? "hover:bg-rose-200 text-rose-500" : "hover:bg-white/10 text-gray-400 hover:text-white"}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? (kidsMode ? "bg-rose-500 text-white rounded-br-sm" : "bg-indigo-600 text-white rounded-br-sm")
                    : (kidsMode ? "bg-gray-100 text-gray-800 rounded-bl-sm" : "bg-white/10 text-gray-200 rounded-bl-sm")
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-2xl rounded-bl-sm flex items-center gap-1 ${kidsMode ? "bg-gray-100" : "bg-white/10"}`}>
                  <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${kidsMode ? "bg-rose-400" : "bg-indigo-400"}`} style={{ animationDelay: '0ms' }} />
                  <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${kidsMode ? "bg-rose-400" : "bg-indigo-400"}`} style={{ animationDelay: '150ms' }} />
                  <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${kidsMode ? "bg-rose-400" : "bg-indigo-400"}`} style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-3 border-t ${kidsMode ? "border-rose-100 bg-white" : "border-white/10 bg-black/20"}`}>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Nexus AI..."
                className={`flex-1 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all ${
                  kidsMode 
                    ? "bg-rose-50 border border-rose-100 text-rose-900 placeholder:text-rose-300 focus:border-rose-400 focus:bg-white"
                    : "bg-white/5 border border-transparent text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:bg-white/10"
                }`}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  !input.trim() || isTyping
                    ? (kidsMode ? "bg-gray-100 text-gray-400" : "bg-white/5 text-gray-500")
                    : (kidsMode ? "bg-rose-500 text-white hover:bg-rose-600 hover:scale-105" : "bg-indigo-500 text-white hover:bg-indigo-400 hover:scale-105")
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
