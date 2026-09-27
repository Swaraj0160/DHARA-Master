"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sun, Moon, ShieldCheck, Info } from "lucide-react";
import { useGameStore } from "@/store/gameState";
import { useVedaStore } from "@/store/vedaStore";
import { VedaEmotion } from "@/components/veda/types";

interface KonarkTimeLensProps {
  onClose: () => void;
}

const KONARK_EXPLANATIONS: Record<string, { text: string; emotion: VedaEmotion }> = {
  SUNRISE: {
    text: "At dawn, the first rays of Surya pierce through the main entrance, illuminating the sanctum. The wheels on the eastern side cast long, precise shadow markers.",
    emotion: "Excited"
  },
  MORNING: {
    text: "As the sun rises, notice how the shadow falls across the hub and spokes. The 8 major spokes divide the day into 3-hour Praharas.",
    emotion: "Pointing"
  },
  NOON: {
    text: "Midday! The sun is directly overhead. Shadow lengths are minimal. The architectural alignment here is a masterpiece of Kalinga astronomical precision.",
    emotion: "Proud"
  },
  AFTERNOON: {
    text: "The sun descends westward. Now the western wheels become the active timekeepers. The exact minute can be read from the intricate bead carvings on the rim.",
    emotion: "Thinking"
  },
  SUNSET: {
    text: "Dusk approaches. The temple's profile darkens across the sands of Chandrabhaga. This is the 'Black Pagoda' that European sailors used as a landmark.",
    emotion: "Namaste"
  },
  NIGHT: {
    text: "By moonlight, the sundials sleep. But the celestial alignments of the temple continue to map the stars. What secrets does the night hold?",
    emotion: "Curious"
  }
};

export default function KonarkTimeLens({ onClose }: KonarkTimeLensProps) {
  // Time from 0 (Sunrise) to 24 (Sunrise next day)
  const [time, setTime] = useState<number>(6);
  const [showDataPanel, setShowDataPanel] = useState(false);

  const { completeQuest, completedQuests } = useGameStore();
  const { popWithDialogue } = useVedaStore();

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(parseFloat(e.target.value));
  };

  const getDayPhase = (t: number) => {
    if (t >= 5 && t < 8) return "SUNRISE";
    if (t >= 8 && t < 11) return "MORNING";
    if (t >= 11 && t < 14) return "NOON";
    if (t >= 14 && t < 17) return "AFTERNOON";
    if (t >= 17 && t < 20) return "SUNSET";
    return "NIGHT";
  };

  const phase = getDayPhase(time);

  // VEDA explains the sun phase when it shifts significantly
  useEffect(() => {
    const explanation = KONARK_EXPLANATIONS[phase];
    if (explanation) {
      popWithDialogue(explanation.text, explanation.emotion);
    }
  }, [phase, popWithDialogue]);

  useEffect(() => {
    if ((phase === "NIGHT" || phase === "NOON") && !completedQuests.includes('konarkTimeLens')) {
      completeQuest('konarkTimeLens', { xp: 50 });
    }
  }, [phase, completedQuests, completeQuest]);

  // Lighting calculations based on time (6 = 0deg, 12 = 90deg, 18 = 180deg)
  const sunAngle = ((time - 6) / 12) * 180;
  const isNight = time < 5 || time > 19;

  // Sky Gradients
  const getSkyBackground = () => {
    if (isNight) return "linear-gradient(to top, #0B0E14, #040508)";
    if (phase === "SUNRISE") return "linear-gradient(to top, #FF7B54, #FFB26B, #1B3B5A)";
    if (phase === "MORNING") return "linear-gradient(to top, #FFE2A6, #A6D0DD, #458DB8)";
    if (phase === "NOON") return "linear-gradient(to top, #90E0EF, #0077B6, #03045E)";
    if (phase === "AFTERNOON") return "linear-gradient(to top, #F4A261, #E76F51, #2A9D8F)";
    if (phase === "SUNSET") return "linear-gradient(to top, #9D0208, #DC2F02, #370617)";
    return "#000";
  };

  // Shadow angle
  const shadowAngle = sunAngle + 180;
  const shadowLength = isNight ? 0 : Math.max(20, Math.abs(time - 12) * 20);
  const opacity = isNight ? 0 : Math.max(0.2, 1 - Math.abs(time - 12) * 0.1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black overflow-hidden font-sans select-none touch-none"
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-[210] w-12 h-12 flex items-center justify-center rounded-full bg-earth-950/50 backdrop-blur-md border border-white/10 text-parchment-200 hover:text-white transition-colors"
        aria-label="Close Time Lens"
      >
        <X className="w-6 h-6" />
      </button>

      {/* TRUTH LAYER OVERLAY */}
      <div className="absolute top-8 left-8 z-[210] flex items-center gap-4 pointer-events-auto">
         <div
           className="w-12 h-12 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-900/50 backdrop-blur-sm cursor-pointer hover:bg-blue-800/50 transition-colors"
           onClick={() => setShowDataPanel(!showDataPanel)}
         >
           <ShieldCheck className="w-5 h-5 text-blue-400" />
         </div>
         <div>
           <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-blue-400 mb-1 flex items-center gap-1.5">
             Interactive Mechanism <Info className="w-3 h-3 text-blue-500" />
           </h4>
           <p className="text-xs font-mono text-ivory-300/70 tracking-widest">KONARK SOLAR ALIGNMENT</p>
         </div>
      </div>

      <AnimatePresence>
        {showDataPanel && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-24 left-8 z-[210] w-80 bg-charcoal-900/95 border border-blue-500/30 backdrop-blur-md p-5 rounded-2xl shadow-2xl"
          >
            <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 mb-3 block">
              Truth Layer: Reconstruction
            </h5>
            <p className="text-xs text-white/80 leading-relaxed font-sans mb-3">
              The 24 wheels of Konark act as highly precise sundials. While we cannot reconstruct the entire ruined monumental tower physically, this simulation accurately represents the celestial mechanics (shadow shifting inverse to sun position) using the authentic layout of the Jagamohana porch.
            </p>
            <span className="text-[9px] font-mono text-white/40 block">
              Source: ASI Technical Structural Analysis, Konark Sun Temple
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ENVIRONMENT / SKY */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-linear pointer-events-none"
        style={{ background: getSkyBackground() }}
      >
        {isNight && (
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-screen animate-pulse" />
        )}
      </div>

      {/* SUN / MOON */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full border border-dashed border-white/10 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ rotate: `${sunAngle}deg` }}
      >
        {!isNight && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-[#FFF5D1] shadow-[0_0_150px_#FFD166] flex items-center justify-center">
             <div className="w-full h-full bg-[#FFF5D1] rounded-full animate-ping opacity-20" />
          </div>
        )}
      </motion.div>

      {/* THE TEMPLE (CENTER) */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[600px] mt-16 pointer-events-none">
         {/* Simple Temple Silhouette */}
         <div className="relative w-64 h-80 transition-all duration-700">
            {/* Shadow */}
            <div
              className="absolute bottom-0 left-1/2 w-64 h-20 bg-black blur-md origin-bottom-left transition-all duration-300"
              style={{
                transform: `translateX(-50%) rotate(${shadowAngle - 90}deg) scaleY(${shadowLength / 100})`,
                opacity: opacity
              }}
            />

            {/* Base */}
            <div className={`absolute bottom-0 w-full h-16 bg-earth-900 border-t-2 border-earth-800 transition-colors duration-700 ${isNight ? 'brightness-50' : ''}`} />
            <div className={`absolute bottom-16 left-4 w-56 h-32 bg-earth-900 border-t-2 border-earth-800 transition-colors duration-700 ${isNight ? 'brightness-50' : ''}`} />

            {/* Shikhara / Dome */}
            <div className={`absolute bottom-48 left-8 w-48 h-32 bg-earth-900 rounded-t-full border-t-2 border-earth-800 transition-colors duration-700 ${isNight ? 'brightness-50' : ''}`} />

            {/* Wheel Motif */}
            <div className="absolute bottom-2 left-12 w-12 h-12 rounded-full border-4 border-earth-950 flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-earth-950" />
            </div>
            <div className="absolute bottom-2 right-12 w-12 h-12 rounded-full border-4 border-earth-950 flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-earth-950" />
            </div>
         </div>
      </div>

      {/* CONTROL HUD (BOTTOM) */}
      <div className="absolute bottom-12 w-full max-w-3xl px-8 z-50 flex flex-col items-center gap-8 pointer-events-auto">

        {/* Phase Text */}
        <div className="text-center pointer-events-none">
          <h2 className="text-4xl md:text-5xl font-serif font-black tracking-widest text-parchment-100 uppercase drop-shadow-lg">
            {phase}
          </h2>
          <p className="text-sm font-mono text-gold-400 mt-2">
            SOLAR POSITION: {Math.floor(time).toString().padStart(2, '0')}:{(Math.floor((time % 1) * 60)).toString().padStart(2, '0')} HR
          </p>
        </div>

        {/* Dial Controller - The tactile interaction mechanism */}
        <div className="relative w-full flex items-center gap-4 bg-charcoal-950/80 p-5 rounded-3xl backdrop-blur-xl border border-gold-500/30 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
          <Moon className="w-6 h-6 text-indigo-400 shrink-0" />
          <input
            type="range"
            min="0"
            max="24"
            step="0.05"
            value={time}
            onChange={handleTimeChange}
            className="w-full h-3 bg-charcoal-900 rounded-full appearance-none cursor-ew-resize accent-gold-500 outline-none focus:ring-2 focus:ring-gold-500 border border-white/5"
            aria-label="Solar Tracker"
            style={{
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)"
            }}
          />
          <Sun className="w-6 h-6 text-gold-500 shrink-0" />
        </div>

        {/* Info text */}
        <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-white/40 text-center max-w-md bg-black/40 px-4 py-2 rounded-full border border-white/10 pointer-events-none">
          Drag the solar tracker to observe shadow mechanics
        </p>

      </div>
    </motion.div>
  );
}
