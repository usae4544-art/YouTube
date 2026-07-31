import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Repeat, Copy, Check, Key, ArrowRight, AlertTriangle, ShieldCheck, ClipboardPaste, RefreshCw } from "lucide-react";
import { db } from "../firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

interface TransferAuthModalProps {
  onClose: () => void;
  kidsMode: boolean;
  user: any | null;
  onLogin: (user: any) => void;
}

export default function TransferAuthModal({ onClose, kidsMode, user, onLogin }: TransferAuthModalProps) {
  const [mode, setMode] = useState<"select" | "generate" | "enter">("select");
  const [transferCode, setTransferCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(""), 4000);
      return () => clearTimeout(t);
    }
  }, [errorMsg]);

  const handleGenerate = async () => {
    if (!user) {
      setErrorMsg("You must be logged in to generate a transfer code.");
      return;
    }
    setIsLoading(true);
    try {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      const expiresAt = Date.now() + 10 * 60 * 1000;
      await setDoc(doc(db, "transfer_codes", code), {
        user,
        expiresAt
      });
      setTransferCode(code);
      setMode("generate");
    } catch (err) {
      setErrorMsg("Failed to generate code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(transferCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePaste = async () => {
    if (navigator.clipboard && navigator.clipboard.readText) {
      try {
        const text = await navigator.clipboard.readText();
        setInputCode(text.trim().toUpperCase());
      } catch (err) {}
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setIsLoading(true);
    setErrorMsg("");
    try {
      const codeToUse = inputCode.trim().toUpperCase();
      const docRef = doc(db, "transfer_codes", codeToUse);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (Date.now() > data.expiresAt) {
          setErrorMsg("This transfer code has expired.");
          await deleteDoc(docRef);
        } else {
          onLogin(data.user);
          await deleteDoc(docRef);
          onClose();
        }
      } else {
        setErrorMsg("Invalid transfer code.");
      }
    } catch (err) {
      setErrorMsg("Error verifying code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`w-full max-w-sm rounded-3xl shadow-2xl p-6 ${
          kidsMode ? "bg-white text-rose-950" : "bg-[#111] border border-white/10 text-white"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${kidsMode ? "bg-rose-100 text-rose-600" : "bg-white/10 text-gray-300"}`}>
              <Repeat className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display">Device Sync Login</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              kidsMode ? "hover:bg-gray-100 text-gray-500" : "hover:bg-white/10 text-gray-400"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-2 items-center text-xs text-red-400"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {mode === "select" && (
          <div className="space-y-4">
            <p className={`text-sm ${kidsMode ? "text-gray-600" : "text-gray-400"}`}>
              Securely transfer your login session to another device without entering your password.
            </p>
            <button
              onClick={handleGenerate}
              disabled={isLoading || !user}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                !user 
                  ? "opacity-50 cursor-not-allowed bg-gray-500/20 text-gray-500"
                  : kidsMode
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10"
              }`}
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Generate Transfer Code</span>
            </button>
            {!user && (
              <p className="text-xs text-center text-red-400 mt-[-8px]">
                You must be logged in to generate a code.
              </p>
            )}

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                OR
              </span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button
              onClick={() => setMode("enter")}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                kidsMode
                  ? "bg-rose-100 hover:bg-rose-200 text-rose-700"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Enter Transfer Code</span>
            </button>
          </div>
        )}

        {mode === "generate" && (
          <div className="space-y-5 text-center">
            <div className={`p-6 rounded-2xl ${kidsMode ? "bg-rose-50" : "bg-white/5"}`}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                Your Transfer Code
              </span>
              <div className={`text-4xl font-black font-mono tracking-widest mt-2 ${kidsMode ? "text-rose-600" : "text-white"}`}>
                {transferCode}
              </div>
            </div>
            
            <p className="text-xs text-gray-400">
              Valid for 10 minutes. Enter this code on your other device to log in instantly.
            </p>

            <button
              onClick={handleCopy}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                kidsMode
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10"
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>
        )}

        {mode === "enter" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className={`text-sm ${kidsMode ? "text-gray-600" : "text-gray-400"}`}>
              Enter the 8-character transfer code generated from your other device.
            </p>

            <div className="flex gap-2">
              <div className={`flex items-center px-4 py-3 rounded-xl flex-1 border ${
                kidsMode
                  ? "bg-white border-rose-200 text-rose-950 focus-within:border-rose-400"
                  : "bg-black/50 border-white/10 focus-within:border-blue-500/50 text-white"
              }`}>
                <input
                  type="text"
                  autoComplete="off"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="e.g. X7B9K2M1"
                  className="bg-transparent outline-none border-none text-sm w-full font-mono font-bold tracking-wider placeholder:text-gray-500 uppercase"
                  maxLength={8}
                />
              </div>
              <button
                type="button"
                onClick={handlePaste}
                className={`px-4 rounded-xl flex items-center justify-center transition-all ${
                  kidsMode ? "bg-rose-100 hover:bg-rose-200 text-rose-700" : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputCode}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                (!inputCode || isLoading)
                  ? "opacity-50 cursor-not-allowed bg-gray-500/20 text-gray-500"
                  : kidsMode
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10"
              }`}
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>Verify & Log In</span>
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
