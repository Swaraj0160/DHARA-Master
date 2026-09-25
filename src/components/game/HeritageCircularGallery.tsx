"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock, MapPin, Compass } from 'lucide-react';
import { CITIES_DATA } from '@/data/gameContent';
import { useGameStore } from '@/store/gameState';

interface CircularGalleryProps {
  onEnterRealm: (cityId: string) => void;
}

export default function HeritageCircularGallery({ onEnterRealm }: CircularGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left
  const { chapterProgress, isCityUnlocked } = useGameStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % CITIES_DATA.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + CITIES_DATA.length) % CITIES_DATA.length);
  };

  const handleCardClick = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] bg-charcoal-900 overflow-hidden flex flex-col items-center justify-center border-b border-white/5 pt-20">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900 via-transparent to-charcoal-900" />
      </div>

      <div className="absolute top-12 left-0 w-full text-center z-20">
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gold-600 font-bold mb-3">Explore the World</h2>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-ivory-100">Heritage Destinations</h3>
      </div>

      <div className="relative w-full max-w-[1200px] h-[400px] flex items-center justify-center mt-12 md:mt-20" style={{ perspective: '1000px' }}>
        <AnimatePresence initial={false} custom={direction}>
          {CITIES_DATA.map((city, index) => {
            // Calculate relative offset handling wrap-around
            const total = CITIES_DATA.length;
            let offset = (index - activeIndex) % total;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
            
            const isCenter = offset === 0;
            const isUnlocked = isCityUnlocked(city.id);
            const completedCount = city.chapters.filter(ch => chapterProgress[ch.id]?.completed).length;
            const totalChapters = city.chapters.length;

            if (Math.abs(offset) > 2) return null; // Only render visible cards

            return (
              <motion.div
                key={city.id}
                custom={direction}
                initial={{ opacity: 0, x: offset * 200 }}
                animate={{
                  opacity: Math.abs(offset) > 1 ? 0.3 : isCenter ? 1 : 0.6,
                  x: offset * (isCenter ? 0 : offset > 0 ? (isMobile ? 100 : 220) : (isMobile ? -100 : -220)),
                  scale: isCenter ? 1 : 0.8,
                  rotateY: offset * -15, // turn inward
                  z: isCenter ? 100 : -50,
                  zIndex: 10 - Math.abs(offset)
                }}
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                className={`absolute w-[280px] md:w-[350px] aspect-[3/4] cursor-pointer group ${isCenter ? 'dhara-surface-panel shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'dhara-surface-glass blur-[1px] hover:blur-none transition-all'}`}
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => handleCardClick(index)}
              >
                <div className="absolute inset-0 overflow-hidden bg-charcoal-900 border border-gold-500/20">
                  {/* Artwork Background */}
                  <motion.div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                    style={{ backgroundImage: `url(${city.artwork})` }}
                    animate={{ scale: isCenter ? 1 : 1.1 }}
                  />
                  <div className={`absolute inset-0 ${isCenter ? 'bg-gradient-to-t from-charcoal-950 via-charcoal-900/60 to-transparent' : 'bg-charcoal-900/60'}`} />

                  {/* Card Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {!isUnlocked && (
                      <div className="absolute top-4 right-4 bg-charcoal-900/80 p-2 rounded-full border border-gold-500/20 backdrop-blur-md">
                        <Lock className="w-4 h-4 text-gold-600" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-3 h-3 text-gold-500" />
                      <span className="text-[9px] uppercase tracking-widest text-ivory-300 font-mono">
                        {city.region} • {city.era}
                      </span>
                    </div>

                    <h4 className={`font-serif font-bold ${isCenter ? 'text-3xl' : 'text-xl'} text-ivory-100 mb-1 transition-all`}>
                      {city.name}
                    </h4>
                    
                    {isCenter && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2"
                      >
                        <p className="text-xs text-ivory-300/80 leading-relaxed mb-6 line-clamp-2">
                          {city.subtitle}
                        </p>
                        
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-[10px] uppercase tracking-widest text-gold-500">Progress</span>
                          <div className="flex gap-1">
                            {[...Array(totalChapters)].map((_, i) => (
                              <div key={i} className={`w-6 h-1 rounded-full ${i < completedCount ? 'bg-gold-500' : 'bg-white/10'}`} />
                            ))}
                          </div>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isUnlocked) onEnterRealm(city.id);
                          }}
                          className={`w-full py-3 px-4 border text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-2 
                            ${isUnlocked 
                              ? 'bg-charcoal-900 border-gold-500/50 text-gold-400 hover:bg-gold-600 hover:text-charcoal-900 shadow-[0_0_20px_rgba(212,175,55,0.15)]' 
                              : 'bg-charcoal-900 border-white/10 text-white/30 cursor-not-allowed'}`}
                        >
                          {isUnlocked ? (
                            <>Enter Realm <Compass className="w-4 h-4" /></>
                          ) : (
                            <>Requires {city.requiredStars} Stars</>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-8 z-50">
           <button 
             onClick={handlePrev} 
             className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gold-500/20 flex items-center justify-center hover:bg-gold-600/10 text-ivory-300 hover:text-gold-400 hover:border-gold-500 transition-all cursor-pointer backdrop-blur-md dhara-surface-glass"
           >
             <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
           </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-8 z-50">
           <button 
             onClick={handleNext} 
             className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gold-500/20 flex items-center justify-center hover:bg-gold-600/10 text-ivory-300 hover:text-gold-400 hover:border-gold-500 transition-all cursor-pointer backdrop-blur-md dhara-surface-glass"
           >
             <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
           </button>
        </div>
      </div>
    </section>
  );
}
