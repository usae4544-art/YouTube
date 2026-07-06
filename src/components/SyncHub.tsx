import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, RefreshCw, Key, ArrowRight, CheckCircle2, AlertTriangle, 
  Tv, Smartphone, Laptop, Unlink, Copy, Check
} from "lucide-react";
import { SyncSession } from "../types";

interface SyncHubProps {
  onClose: () => void;
  syncCode: string;
  onSetSyncCode: (code: string) => void;
  currentSession: SyncSession | null;
  onApplySyncSession: (session: SyncSession) => void;
  kidsMode: boolean;
  onTriggerManualUpload: () => void;
}

export default function SyncHub({
  onClose,
  syncCode,
  onSetSyncCode,
  currentSession,
  onApplySyncSession,
  kidsMode,
  onTriggerManualUpload
}: SyncHubProps) {
  const [inputCode, setInputCode] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [copied, setCopied] = useState(false);

  // Auto-clear success/error feedback
  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(""), 4000);
      return () => clearTimeout(t);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(""), 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  // Generate a brand new Sync Code
  const handleCreateSession = async () => {
    setIsCreating(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/sync/create", { method: "POST" });
      const data = await res.json();
      
      if (data.code) {
        onSetSyncCode(data.code);
        onApplySyncSession(data);
        setSuccessMsg("Sync session generated! Use this code to link other screens.");
      } else {
        setErrorMsg("Failed to generate code from backend.");
      }
    } catch (e) {
      setErrorMsg("Failed to connect to synchronization server.");
    } finally {
      setIsCreating(false);
    }
  };

  // Link to an existing code
  const handleLinkSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setIsLinking(true);
    setErrorMsg("");
    setSuccessMsg("");

    let codeToUse = inputCode.trim().toUpperCase();
    if (!codeToUse.startsWith("YT-")) {
      codeToUse = "YT-" + codeToUse;
    }

    try {
      const res = await fetch(`/api/sync/get/${codeToUse}`);
      if (res.status === 404) {
        setErrorMsg("Invalid Sync Code. Please check the code and try again.");
        setIsLinking(false);
        return;
      }

      const data: SyncSession = await res.json();
      onSetSyncCode(codeToUse);
      onApplySyncSession(data);
      setSuccessMsg("Linked successfully! Your video feeds are now synchronized.");
      setInputCode("");
    } catch (e) {
      setErrorMsg("Could not sync with the specified code.");
    } finally {
      setIsLinking(false);
    }
  };

  // Copy sync code helper
  const handleCopy = () => {
    navigator.clipboard.writeText(syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Disconnect sync
  const handleDisconnect = () => {
    onSetSyncCode("");
    localStorage.removeItem("nexus_sync_code");
    setSuccessMsg("Disconnected from sync cloud. Reverted to local-only.");
  };

  return (
    <motion.div
      id="sync-hub-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        id="sync-hub-modal"
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", damping: 20, stiffness: 140 }}
        className={`w-full max-w-md rounded-3xl overflow-hidden p-6 border ${
          kidsMode 
            ? "bg-rose-50 border-rose-200 text-rose-950" 
            : "bg-[#0c0c14]/95 border-white/10 text-gray-200"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
          <div className="flex items-center gap-2.5">
            <RefreshCw className={`w-5 h-5 ${kidsMode ? "text-rose-500 animate-spin" : "text-red-500 animate-pulse"}`} />
            <h3 className={`font-display text-base font-bold ${kidsMode ? "text-rose-950" : "text-white"}`}>
              Nexus Sync Cloud
            </h3>
          </div>
          <button
            id="close-sync-btn"
            onClick={onClose}
            className={`p-2 rounded-full cursor-pointer transition-colors ${
              kidsMode ? "hover:bg-rose-100 text-rose-900" : "hover:bg-white/10 text-gray-400"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback indicators */}
        <AnimatePresence>
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

          {successMsg && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-2 items-center text-xs text-emerald-400"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Body content based on whether active sync exists */}
        {syncCode ? (
          <div className="space-y-5">
            {/* Display active code */}
            <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center ${
              kidsMode ? "bg-white border border-rose-100" : "bg-white/3 border border-white/5"
            }`}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
                Active Sync Code
              </span>
              <div className="flex items-center gap-2.5 mt-1">
                <span className={`font-display text-2xl font-black tracking-wider ${
                  kidsMode ? "text-rose-600" : "text-red-500"
                }`}>
                  {syncCode}
                </span>
                <button
                  id="copy-sync-code-btn"
                  onClick={handleCopy}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    kidsMode ? "hover:bg-rose-100 text-rose-600" : "hover:bg-white/10 text-gray-400 hover:text-white"
                  }`}
                  title="Copy Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                Enter this code on other devices to synchronize watchlists and history instantly.
              </p>
            </div>

            {/* Simulated Device Cloud */}
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2.5">
                Linked Network
              </p>
              <div className="space-y-2">
                <div className={`flex items-center justify-between p-3 rounded-xl text-xs ${
                  kidsMode ? "bg-white" : "bg-white/2"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <Laptop className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Primary Interface (Active)</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
                    Connected
                  </span>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-xl text-xs ${
                  kidsMode ? "bg-white" : "bg-white/2"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-400">Mobile Hub</span>
                  </div>
                  <span className="text-[9px] text-gray-500">
                    Standby
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                id="force-sync-btn"
                onClick={onTriggerManualUpload}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  kidsMode 
                    ? "bg-rose-200/50 text-rose-900 hover:bg-rose-200" 
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5"
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Force Sync Now</span>
              </button>

              <button
                id="disconnect-sync-btn"
                onClick={handleDisconnect}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Form to enter existing code */}
            <form onSubmit={handleLinkSession} className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 block">
                Link to Another Device
              </label>
              <div className="flex gap-2">
                <div className={`flex items-center px-3.5 py-2.5 rounded-xl flex-1 border ${
                  kidsMode 
                    ? "bg-white border-rose-200 text-rose-950 focus-within:border-rose-400" 
                    : "bg-white/3 border-white/10 focus-within:border-red-500/50"
                }`}>
                  <Key className="w-4 h-4 text-gray-500 shrink-0 mr-2" />
                  <input
                    id="sync-code-input"
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="e.g. YT-A7B8"
                    className="bg-transparent outline-none border-none text-xs w-full uppercase font-mono font-bold tracking-wider"
                  />
                </div>
                <button
                  id="submit-link-btn"
                  type="submit"
                  disabled={isLinking}
                  className={`px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    kidsMode ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-red-600 hover:bg-red-500 text-white"
                  }`}
                >
                  {isLinking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                OR
              </span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Button to create new session */}
            <div className="text-center">
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Don't have a sync code? Establish a new synchronized session to securely log your preferences, favorites, and history.
              </p>
              <button
                id="create-sync-btn"
                type="button"
                onClick={handleCreateSession}
                disabled={isCreating}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  kidsMode
                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200"
                    : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/10"
                }`}
              >
                {isCreating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 animate-pulse" />
                    <span>Generate Sync Code Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
