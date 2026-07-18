import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Sparkles, Volume2, VolumeX } from "lucide-react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [step, setStep] = useState(0);

  // Auto-advance animation steps
  useEffect(() => {
    // Attempt to play sound automatically
    playCinematicSound();

    // Step 0: Initial splash glow
    const t0 = setTimeout(() => setStep(1), 800);

    // Step 1: Text resolve & logo pulse
    const t1 = setTimeout(() => setStep(2), 2400);
    // Step 2: Scale out and finish
    const t2 = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  // Synthesis of an elegant cinematic "whoosh" sound using the browser's Web Audio API
  function playCinematicSound() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      
      // Low rumble synth
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = "sine";
      osc2.type = "sawtooth";
      
      osc1.frequency.setValueAtTime(45, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 2.5);
      
      osc2.frequency.setValueAtTime(50, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 2.5);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(150, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.8);

      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.6);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      
      osc1.stop(ctx.currentTime + 3.2);
      osc2.stop(ctx.currentTime + 3.2);

      // Play a high chime sparkle sound right as the text resolves
      setTimeout(() => {
        const oscChime = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        oscChime.type = "sine";
        oscChime.frequency.setValueAtTime(880, ctx.currentTime);
        oscChime.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.4);

        chimeGain.gain.setValueAtTime(0.12, ctx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        oscChime.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        oscChime.start();
        oscChime.stop(ctx.currentTime + 1.2);
      }, 1000);

      setIsPlayingSound(true);
    } catch (e) {
      console.warn("Audio Context blocked or not supported on this device.", e);
    }
  };

  return (
    <motion.div
      id="intro-container"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050508] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background radial spotlights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] left-[10%] w-[80%] h-[70%] rounded-full bg-red-600/10 blur-[130px] animate-glow-mesh-1" />
        <div className="absolute -bottom-[30%] right-[10%] w-[80%] h-[70%] rounded-full bg-violet-600/10 blur-[130px] animate-glow-mesh-2" />
      </div>

      <div className="relative flex flex-col items-center max-w-md px-6 text-center z-10">
        {/* Floating audio indicator */}
        <button
          id="audio-prompt-btn"
          onClick={playCinematicSound}
          disabled={isPlayingSound}
          className={`absolute -top-16 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-500 hover:scale-105 cursor-pointer ${
            isPlayingSound
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-default"
              : "bg-white/5 text-white/60 border-white/10 hover:text-white"
          }`}
        >
          {isPlayingSound ? (
            <>
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Cinematic Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Tap for Sonic Experience</span>
            </>
          )}
        </button>

        {/* Cinematic Logo Node */}
        <div className="relative mb-8">
          {/* Pulsing ring */}
          <motion.div
            className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 opacity-20 blur-md pointer-events-none"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Core play container */}
          <motion.div
            id="intro-logo-box"
            className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.3)] border border-red-400/30 relative overflow-hidden"
            initial={{ scale: 0.3, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 80, delay: 0.2 }}
          >
            {/* Play symbol */}
            <Play className="w-9 h-9 text-white fill-white translate-x-0.5" />

            {/* Sweep light reflection */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
              animate={{
                translateX: ["100%", "-100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>

        {/* Text Revelations */}
        <div className="space-y-3">
          <motion.h1
            id="intro-title"
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
            initial={{ opacity: 0, y: 15 }}
            animate={step >= 1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            NEXUS <span className="text-red-500 glow-red">VIDEO</span>
          </motion.h1>

          <motion.p
            id="intro-subtitle"
            className="text-sm text-gray-400 font-sans tracking-wide leading-relaxed"
            initial={{ opacity: 0 }}
            animate={step >= 1 ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            A premium immersive portal with smart search, cross-device sync & Kids Mode.
          </motion.p>
        </div>

        {/* Sparkling Loading particles */}
        <div className="mt-8 flex justify-center gap-1.5 h-6">
          <AnimatePresence>
            {step < 2 && (
              <motion.div
                className="flex items-center gap-1 text-red-500/80 text-xs tracking-widest font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin text-red-400" />
                <span>INITIALIZING NEXUS</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
