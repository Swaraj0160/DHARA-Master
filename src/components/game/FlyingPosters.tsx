"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { City } from '@/data/gameContent';
import { X, ChevronRight, ShieldCheck, BookOpen, Map as MapIcon, Database } from 'lucide-react';
import { useGameStore } from '@/store/gameState';

interface FlyingPostersProps {
  city: City;
  onClose: () => void;
}

export default function FlyingPosters({ city, onClose }: FlyingPostersProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { addXP } = useGameStore();
  const [rewardClaimed, setRewardClaimed] = useState(false);

  // Compile archival fragment details from city and chapter content
  const posters = [
    {
      id: 'intro',
      title: city.name,
      subtitle: 'Geographic & Temporal Context',
      content: `Situated in the heart of ${city.region}, this sanctuary dates back to the ${city.era}. It stands as a testament to the architectural and cultural zenith of its time.`,
      truthStatus: 'VERIFIED FACT',
      truthDesc: 'Demarcated chronological & geographic data.',
      icon: ShieldCheck,
      color: 'text-[#4d9b6e]',
      bg: 'bg-[#4d9b6e]/10',
      border: 'border-[#4d9b6e]/30'
    },
    {
      id: 'desc',
      title: 'Historical Record',
      subtitle: 'Archival Description',
      content: city.description,
      truthStatus: 'SOURCE-QUALIFIED',
      truthDesc: 'Contemporary chronicles, travelogues, edicts.',
      icon: BookOpen,
      color: 'text-[#4d8fc4]',
      bg: 'bg-[#4d8fc4]/10',
      border: 'border-[#4d8fc4]/30'
    },
    ...city.chapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      subtitle: ch.locationName,
      content: ch.description,
      truthStatus: 'EVIDENCE-BASED RECONSTRUCTION',
      truthDesc: 'Architectural models based on ruined foundations.',
      icon: MapIcon,
      color: 'text-[#d4af37]',
      bg: 'bg-[#d4af37]/10',
      border: 'border-[#d4af37]/30'
    }))
  ];

  const handleNext = useCallback(() => {
    if (activeIndex < posters.length - 1) {
      setActiveIndex(prev => prev + 1);
    } else {
      // Claim XP on finishing reading
      if (!rewardClaimed) {
        addXP(25);
        setRewardClaimed(true);
      }
      onClose();
    }
  }, [activeIndex, posters.length, rewardClaimed, addXP, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, handleNext, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal-950/80 backdrop-blur-xl overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-[210] w-12 h-12 flex items-center justify-center rounded-full bg-charcoal-900 border border-white/10 text-ivory-300 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Background Ambience / Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08)_0%,_transparent_70%)] pointer-events-none" />

      {/* HUD Header */}
      <div className="absolute top-8 left-8 z-[210] flex items-center gap-4 pointer-events-none">
         <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center bg-charcoal-900/50 backdrop-blur-sm">
           <Database className="w-5 h-5 text-gold-500" />
         </div>
         <div>
           <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-500 mb-1">VEDA Archive Access</h4>
           <p className="text-xs font-mono text-ivory-300/70 tracking-widest">{city.name.toUpperCase()} DATA FRAGMENTS</p>
         </div>
      </div>

      <div className="relative w-full max-w-[1000px] h-[600px] flex items-center justify-center pointer-events-none pt-12">
        <AnimatePresence>
          {posters.map((poster, index) => {
            const offset = index - activeIndex;
            // Only render active and a few upcoming to save DOM nodes
            if (offset < -1 || offset > 3) return null;

            const isActive = offset === 0;

            return (
              <motion.div
                key={poster.id}
                initial={
                  offset === 0
                    ? { opacity: 0, z: -1000, y: 300 }
                    : { opacity: 0 }
                }
                animate={{
                  opacity: isActive ? 1 : Math.max(0, 1 - Math.abs(offset) * 0.3),
                  z: isActive ? 0 : -offset * 250,
                  y: isActive ? 0 : offset * 30,
                  x: isActive ? 0 : offset * 40,
                  rotateY: isActive ? 0 : -12 + offset * -3,
                  rotateX: isActive ? 0 : offset * 2,
                  scale: isActive ? 1 : 1 - Math.abs(offset) * 0.05,
                }}
                exit={{
                  opacity: 0,
                  z: 600,
                  y: -100,
                  transition: { duration: 0.5, ease: "anticipate" }
                }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 18,
                  mass: 1
                }}
                className={`absolute w-[90%] sm:w-[500px] md:w-[600px] aspect-[4/3] sm:aspect-auto sm:min-h-[420px] rounded-3xl flex flex-col overflow-hidden bg-charcoal-800 border-2 ${isActive ? 'border-gold-500/40 shadow-[0_30px_60px_rgba(0,0,0,0.8)] pointer-events-auto' : 'border-white/5 shadow-2xl pointer-events-none'}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Subtle texture over the card */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />

                {/* TRUTH LAYER HEADER */}
                <div className={`w-full px-6 sm:px-8 py-5 border-b border-white/5 flex items-center gap-4 ${poster.bg}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${poster.border} bg-black/40`}>
                    <poster.icon className={`w-5 h-5 ${poster.color}`} />
                  </div>
                  <div>
                    <h5 className={`text-[10px] uppercase tracking-[0.2em] font-bold ${poster.color}`}>
                      Truth Layer: {poster.truthStatus}
                    </h5>
                    <p className="text-[9px] font-mono tracking-wider text-white/50 mt-0.5 uppercase">
                      {poster.truthDesc}
                    </p>
                  </div>
                </div>

                {/* POSTER CONTENT */}
                <div className="flex-1 p-8 sm:p-10 flex flex-col relative z-10">
                  <h4 className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-mono text-gold-500 mb-3">
                    {poster.subtitle}
                  </h4>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ivory-100 mb-6 leading-tight drop-shadow-md">
                    {poster.title}
                  </h2>
                  <p className="text-sm sm:text-base font-serif text-ivory-300/90 leading-relaxed">
                    {poster.content}
                  </p>
                </div>

                {/* FOOTER ACTIONS */}
                {isActive && (
                  <div className="w-full px-8 py-5 border-t border-white/5 flex justify-between items-center bg-charcoal-900 z-10">
                    <div className="flex gap-2">
                       {[...Array(posters.length)].map((_, dotIdx) => (
                         <div
                           key={dotIdx}
                           className={`w-1.5 h-1.5 rounded-full transition-colors ${dotIdx === activeIndex ? 'bg-gold-500 shadow-[0_0_8px_rgba(212,175,55,0.8)]' : dotIdx < activeIndex ? 'bg-gold-500/30' : 'bg-white/10'}`}
                         />
                       ))}
                    </div>
                    <button
                      onClick={handleNext}
                      className="px-6 py-2.5 bg-gold-600 text-charcoal-950 font-bold uppercase tracking-widest text-[10px] hover:bg-gold-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center gap-2 rounded-full cursor-pointer"
                    >
                      {activeIndex === posters.length - 1 ? 'Finish Archive' : 'Next Entry'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 text-center w-full pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.3em] font-mono text-white/30 truncate">
          Press Space or Arrow Keys to navigate
        </span>
      </div>
    </motion.div>
  );
}
