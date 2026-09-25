"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { CinematicEasing } from "./MotionSystem";
import Atmosphere from "./Atmosphere";
import { audioSystem } from "./AudioArchitecture";

import { useGameStore } from "@/store/gameState";

// Intro Asset Plan & Configuration
// These are currently placeholders and can be replaced with real URLs later.
const INTRO_ASSETS = {
  modernAerial: {
    type: "REAL",
    src: "/modern_india_placeholder.jpg", // TODO: Replace with CC0/licensed drone video (WebM)
    isPlaceholder: true,
  },
  blueprintOverlay: {
    type: "VERIFIED_PLAN",
    src: "/blueprint_lines.svg", // TODO: Replace with actual ASI plans
    isPlaceholder: true,
  },
  ancientTexture: {
    type: "ARCHIVAL",
    src: "/ancient_india_map.jpg", 
    isPlaceholder: false,
  }
};

export default function CinematicIntro() {
  const router = useRouter();
  const setHasSeenIntro = useGameStore((state) => state.setHasSeenIntro);
  
  // States: "AERIAL" -> "PROMPT" -> "DESCENT" -> "TIME_SHIFT" -> "COMPLETE"
  const [phase, setPhase] = useState<"AERIAL" | "PROMPT" | "DESCENT" | "TIME_SHIFT" | "COMPLETE">("AERIAL");
  const [year, setYear] = useState(2026);

  useEffect(() => {
    // Shot 1 -> Shot 2: Show prompt after a few seconds of pure aerial
    const t = setTimeout(() => setPhase("PROMPT"), 3500);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    if (phase !== "PROMPT") return;
    
    // Play transition audio
    const subBass = new Audio("/audio/sub_bass_drop.mp3"); // Placeholder
    subBass.volume = 0.6;
    subBass.play().catch(() => {});
    
    setPhase("DESCENT");

    // Start time travel sequence after descent picks up speed
    setTimeout(() => {
      setPhase("TIME_SHIFT");
      
      // Animate year ticking backward
      let currentYear = 2026;
      const interval = setInterval(() => {
        currentYear -= Math.floor(Math.random() * 50 + 20);
        if (currentYear <= 650) {
          currentYear = 650;
          clearInterval(interval);
        }
        setYear(currentYear);
      }, 50);
      
    }, 2500);

    // Handoff to Nalanda World Engine
    setTimeout(() => {
      setPhase("COMPLETE");
    }, 5500);

    setTimeout(() => {
      setHasSeenIntro(true);
      router.push("/quest/nalanda");
    }, 6500);
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-earth-950 overflow-hidden select-none z-[200]"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "COMPLETE" ? 0 : 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      {/* 
        THE CAMERA RIG 
        We simulate a continuous camera journey by animating the scale and z-index of the container.
      */}
      <motion.div 
        className="relative w-full h-full origin-center"
        initial={{ scale: 1.05 }}
        animate={{ 
          scale: phase === "AERIAL" || phase === "PROMPT" ? 1.15 : phase === "DESCENT" ? 4 : 8,
          y: phase === "DESCENT" || phase === "TIME_SHIFT" ? "10%" : "0%"
        }}
        transition={{ 
          duration: phase === "AERIAL" || phase === "PROMPT" ? 20 : 6.5, 
          ease: phase === "DESCENT" || phase === "TIME_SHIFT" ? CinematicEasing.cameraPan : "linear" 
        }}
      >
        
        {/* SHOT 1: Modern Aerial Layer */}
        <motion.div 
          className="absolute inset-0 bg-earth-950"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "TIME_SHIFT" ? 0 : 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* REAL MEDIA SLOT: This is where the final aerial drone video goes. */}
          {/* To replace: Add 'modern_india_aerial.mp4' to /public/video/ and set src below. */}
          <video 
            src="/video/modern_india_aerial_placeholder.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-80 mix-blend-screen"
            onError={(e) => {
              // If the video file doesn't exist locally yet, show a clear visual placeholder
              e.currentTarget.style.display = 'none';
              document.getElementById('video-placeholder-text')!.style.display = 'flex';
            }}
          />
          
          <div id="video-placeholder-text" className="absolute inset-0 flex items-center justify-center hidden bg-earth-900">
             <div className="text-center">
               <p className="text-earth-400 font-mono text-sm tracking-widest">[ PLACEHOLDER ]</p>
               <p className="text-earth-500 font-serif text-xs mt-2">Awaiting actual aerial drone footage of India.</p>
             </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-earth-950/40 mix-blend-overlay" />
        </motion.div>

        {/* SHOT 4: Architectural Blueprints & Ancient Texture (Revealed during TIME_SHIFT) */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "TIME_SHIFT" ? 1 : 0 }}
          transition={{ duration: 3, ease: CinematicEasing.slowReveal }}
        >
          <div className="absolute inset-0 bg-[url('/ancient_india_map.jpg')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
          {/* Simulated glowing blueprint lines */}
          <div className="absolute inset-0 border-[1px] border-gold-500/20 rounded-full scale-[2] translate-y-[20%] opacity-30" />
          <div className="absolute inset-0 border-[1px] border-gold-500/10 rounded-full scale-[1.5] translate-y-[10%] opacity-20" />
        </motion.div>

      </motion.div>

      {/* OVERLAYS & ATMOSPHERE */}
      
      {/* Heavy Vignette to keep focus center */}
      <div className="absolute inset-0 pointer-events-none [box-shadow:inset_0_0_200px_150px_rgba(0,0,0,0.95)]" />
      
      <Atmosphere type={phase === "TIME_SHIFT" ? "dust" : "fog"} />

      {/* UI LAYER */}
      <AnimatePresence>
        {phase === "PROMPT" && (
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: CinematicEasing.slowReveal }}
          >
            <h2 className="text-sm font-serif tracking-[0.3em] text-parchment-300/70 mb-8 uppercase drop-shadow-lg">
              Ready to dive into history?
            </h2>
            <button 
              onClick={handleEnter}
              className="text-2xl sm:text-4xl font-serif tracking-widest text-gold-200 hover:text-white transition-colors duration-700 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              ENTER DHARA
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TIME TICKER (Visible only during Time Shift) */}
      <AnimatePresence>
        {phase === "TIME_SHIFT" && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="text-[120px] sm:text-[200px] font-serif text-white/5 font-bold tracking-tighter mix-blend-overlay">
              {year} <span className="text-4xl">CE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
