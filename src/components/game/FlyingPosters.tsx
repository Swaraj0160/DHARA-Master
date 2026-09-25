"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { City } from '@/data/gameContent';
import { X, ChevronRight, ShieldCheck, BookOpen, Map as MapIcon, Info, Database } from 'lucide-react';
import { useGameStore } from '@/store/gameState';

interface FlyingPostersProps {
  city: City;
  onClose: () => void;
}

export default function FlyingPosters({ city, onClose }: FlyingPostersProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { addXP } = useGameStore();
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const posters = [
    {
      id: 'intro',
      title: city.name,
      subtitle: 'Geographic & Temporal Context',
      content: `Situated in the heart of ${city.region}, this sanctuary dates back to the ${city.era}. It stands as a testament to the architectural and cultural zenith of its time.`,
      truthStatus: 'VERIFIED FACT',
      truthDesc: 'Epigraphy, excavation reports, ASI verified data.',
      icon: ShieldCheck,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30'
    },
    {
      id: 'desc',
      title: 'Historical Record',
      subtitle: 'Archival Description',
      content: city.description,
      truthStatus: 'SOURCE-QUALIFIED',
      truthDesc: 'Contemporary chronicles, travelogues, edicts.',
      icon: BookOpen,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/30'
    },
    ...city.chapters.map((ch, i) => ({
      id: ch.id,
      title: ch.title,
      subtitle: ch.locationName,
      content: ch.description,
      truthStatus: 'EVIDENCE-BASED RECONSTRUCTION',
      truthDesc: 'Architectural models based strictly on ruined foundations.',
      icon: MapIcon,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30'
    }))
  ];

  const handleNext = () => {
    if (activeIndex < posters.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      // Claim XP on finishing reading
      if (!rewardClaimed) {
        addXP(25);
        setRewardClaimed(true);
      }
      onClose();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        if (activeIndex < posters.length - 1) {
          setActiveIndex((prev) => prev + 1);
        } else {
          if (!rewardClaimed) {
            addXP(25);
            setRewardClaimed(true);
          }
          onClose();
        }
      } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, posters.length, rewardClaimed, addXP, onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal-950/95 backdrop-blur-xl overflow-hidden perspective-1000"
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 z-[210] w-12 h-12 flex items-center justify-center rounded-full bg-charcoal-900 border border-white/10 text-ivory-300 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.15)_0%,_transparent_70%)] mix-blend-screen" />

      {/* VEDA AI HUD Overlay */}
      <div className="absolute top-8 left-8 z-[210] flex items-center gap-4 pointer-events-none">
         <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center bg-charcoal-900/50 backdrop-blur-sm">
           <Database className="w-5 h-5 text-gold-500" />
         </div>
         <div>
           <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold-500 mb-1">VEDA Archive Access</h4>
           <p className="text-xs font-mono text-ivory-300/70 tracking-widest">{city.name.toUpperCase()} DATA FRAGMENTS</p>
         </div>
      </div>

      <div className="relative w-full max-w-[1000px] h-[600px] flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {posters.map((poster, index) => {
            const offset = index - activeIndex;
            if (offset < 0 || offset > 4) return null; // Only render active and a few upcoming

            const isActive = offset === 0;

            return (
              <motion.div
                key={poster.id}
                initial={
                  offset === 0 
                    ? { opacity: 0, z: -1000, y: 200 } // Initial entrance
                    : { opacity: 0 }
                }
                animate={{ 
                  opacity: isActive ? 1 : 1 - offset * 0.2,
                  z: isActive ? 0 : -offset * 300,
                  y: isActive ? 0 : offset * 40,
                  x: isActive ? 0 : offset * 60,
                  rotateY: isActive ? 0 : -10 + offset * -2,
                  rotateX: isActive ? 0 : offset * 2,
                }}
                exit={{ 
                  opacity: 0, 
                  z: 500, 
                  y: -100,
                  transition: { duration: 0.5, ease: "anticipate" } 
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 20, 
                  mass: 1 
                }}
                className={`absolute w-[90%] md:w-[600px] aspect-[4/3] rounded-xl flex flex-col bg-charcoal-900 border ${isActive ? 'border-gold-500/50 shadow-[0_0_50px_rgba(212,175,55,0.15)] pointer-events-auto' : 'border-white/10 pointer-events-none'}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* TRUTH LAYER HEADER */}
                <div className={`w-full px-6 py-4 border-b flex items-center gap-4 ${poster.bg} ${poster.border}`}>
                  <poster.icon className={`w-6 h-6 ${poster.color}`} />
                  <div>
                    <h5 className={`text-[10px] uppercase tracking-[0.2em] font-bold ${poster.color}`}>
                      Truth Layer: {poster.truthStatus}
                    </h5>
                    <p className="text-[9px] font-mono tracking-wider text-white/50 mt-1 uppercase">
                      {poster.truthDesc}
                    </p>
                  </div>
                </div>

                {/* POSTER CONTENT */}
                <div className="flex-1 p-8 md:p-12 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Info className="w-48 h-48" />
                  </div>
                  
                  <h4 className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-mono text-gold-500 mb-4">
                    {poster.subtitle}
                  </h4>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-ivory-100 mb-8 leading-tight">
                    {poster.title}
                  </h2>
                  <p className="text-sm md:text-base font-serif text-ivory-300 leading-relaxed max-w-lg">
                    {poster.content}
                  </p>
                </div>

                {/* FOOTER ACTIONS */}
                {isActive && (
                  <div className="w-full px-8 py-6 border-t border-white/10 flex justify-between items-center bg-charcoal-950/50">
                    <div className="flex gap-2">
                       {[...Array(posters.length)].map((_, dotIdx) => (
                         <div 
                           key={dotIdx} 
                           className={`w-2 h-2 rounded-full transition-colors ${dotIdx === activeIndex ? 'bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.8)]' : dotIdx < activeIndex ? 'bg-gold-500/30' : 'bg-white/10'}`} 
                         />
                       ))}
                    </div>
                    <button 
                      onClick={handleNext}
                      className="px-6 py-3 bg-gold-600 text-charcoal-950 font-bold uppercase tracking-widest text-[10px] hover:bg-gold-500 transition-colors flex items-center gap-2 rounded-sm"
                    >
                      {activeIndex === posters.length - 1 ? 'Complete Review' : 'Next Fragment'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
