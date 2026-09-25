"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Sun, Moon, ShieldCheck } from "lucide-react";
import { useGameStore } from "@/store/gameState";

interface KonarkTimeLensProps {
  onClose: () => void;
}

export default function KonarkTimeLens({ onClose }: KonarkTimeLensProps) {
  // Time from 0 (Sunrise) to 24 (Sunrise next day)
  const [time, setTime] = useState<number>(6); 
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const { addXP } = useGameStore();

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

  useEffect(() => {
    if ((phase === "NIGHT" || phase === "NOON") && !rewardClaimed) {
      addXP(25);
      // eslint-disable-next-line
      setRewardClaimed(true);
    }
  }, [phase, rewardClaimed, addXP]);

  // Lighting calculations based on time (6 = 0deg, 12 = 90deg, 18 = 180deg)
  const sunAngle = ((time - 6) / 12) * 180;
  const isNight = time < 5 || time > 19;

  // Sky Gradients
  const getSkyBackground = () => {
    if (isNight) return "linear-gradient(to top, #0B0E14, #040508)";
    if (phase === "SUNRISE") return "linear-gradient(to top, #FF7B54, #FFB26B, #93B5C6)";
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
      <div className="absolute top-8 left-8 z-[210] flex items-center gap-4 pointer-events-none">
         <div className="w-12 h-12 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-900/50 backdrop-blur-sm">
           <ShieldCheck className="w-5 h-5 text-blue-400" />
         </div>
         <div>
           <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-blue-400 mb-1">INTERACTIVE SIMULATION</h4>
           <p className="text-xs font-mono text-ivory-300/70 tracking-widest">KONARK SOLAR ALIGNMENT</p>
         </div>
      </div>

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
      <div className="absolute bottom-12 w-full max-w-3xl px-8 z-50 flex flex-col items-center gap-8">
        
        {/* Phase Text */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-black tracking-widest text-parchment-100 uppercase drop-shadow-lg">
            {phase}
          </h2>
          <p className="text-sm font-mono text-gold-400 mt-2">
            TIME OF DAY: {Math.floor(time).toString().padStart(2, '0')}:{(Math.floor((time % 1) * 60)).toString().padStart(2, '0')}
          </p>
        </div>

        {/* Slider Input */}
        <div className="relative w-full flex items-center gap-4 bg-earth-950/60 p-4 rounded-2xl backdrop-blur-md border border-gold-500/30 shadow-2xl">
          <Moon className="w-6 h-6 text-indigo-300" />
          <input 
            type="range"
            min="0" 
            max="24"
            step="0.1"
            value={time}
            onChange={handleTimeChange}
            className="w-full h-2 bg-earth-800 rounded-lg appearance-none cursor-ew-resize accent-gold-500"
            aria-label="Time Controller"
          />
          <Sun className="w-6 h-6 text-gold-500" />
        </div>

        {/* Info text */}
        <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-white/50 text-center max-w-md">
          Drag slider or use arrow keys to simulate the Sun&apos;s trajectory across the Konark sanctuary. Observe shadow dynamics.
        </p>

      </div>
    </motion.div>
  );
}
