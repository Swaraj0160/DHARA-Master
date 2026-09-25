"use client";

import React, { useState, useMemo } from 'react';
import { Lock, MapPin, Compass } from 'lucide-react';
import { CITIES_DATA } from '@/data/gameContent';
import { useGameStore } from '@/store/gameState';
import ReactBitsCircularGallery from './ReactBitsCircularGallery';

interface CircularGalleryProps {
  onEnterRealm: (cityId: string) => void;
}

export default function HeritageCircularGallery({ onEnterRealm }: CircularGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { chapterProgress, isCityUnlocked } = useGameStore();

  const galleryItems = useMemo(() => {
    return CITIES_DATA.map((city) => ({
      image: city.artwork,
      text: city.name
    }));
  }, []);

  const activeCity = CITIES_DATA[activeIndex];
  const isUnlocked = activeCity ? isCityUnlocked(activeCity.id) : false;
  const completedCount = activeCity ? activeCity.chapters.filter(ch => chapterProgress[ch.id]?.completed).length : 0;
  const totalChapters = activeCity ? activeCity.chapters.length : 0;

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] bg-charcoal-950 overflow-hidden flex flex-col border-b border-white/5">
      
      {/* Background Ambient Layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950 via-charcoal-900/30 to-charcoal-950" />
      </div>

      {/* Header Overlay */}
      <div className="absolute top-12 left-0 w-full text-center z-20 pointer-events-none">
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gold-600 font-bold mb-3">Explore the World</h2>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-ivory-100">Heritage Destinations</h3>
      </div>

      {/* REACT BITS CIRCULAR GALLERY CANVAS */}
      <div className="absolute inset-0 z-10 pt-20 pb-40">
        <ReactBitsCircularGallery
          items={galleryItems}
          bend={3}
          textColor="#E6DED0" /* Ivory-200 equivalent */
          borderRadius={0.05}
          font="bold 42px serif"
          onItemChange={(index) => setActiveIndex(index)}
        />
      </div>

      {/* BOTTOM UI OVERLAY (DHARA SYNCED UI) */}
      {activeCity && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[320px] z-30 pointer-events-auto">
          <div className="p-5 rounded-2xl bg-charcoal-900/80 border border-gold-500/20 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            {/* Header info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-500" />
                <span className="text-[10px] uppercase tracking-widest text-ivory-300 font-mono">
                  {activeCity.region}
                </span>
              </div>
              {!isUnlocked && (
                <div className="bg-charcoal-800/80 p-1.5 rounded-full border border-gold-500/20">
                  <Lock className="w-3 h-3 text-gold-600" />
                </div>
              )}
            </div>

            <h4 className="font-serif font-bold text-2xl text-ivory-100 mb-2 truncate">
              {activeCity.name}
            </h4>
            
            <p className="text-[11px] text-ivory-300/80 leading-relaxed mb-4 line-clamp-2">
              {activeCity.subtitle}
            </p>

            {/* Progress */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-[9px] uppercase tracking-widest text-gold-500">Progress</span>
              <div className="flex gap-1">
                {[...Array(totalChapters)].map((_, i) => (
                  <div key={i} className={`w-5 h-1 rounded-full ${i < completedCount ? 'bg-gold-500' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>

            {/* CTA */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (isUnlocked) onEnterRealm(activeCity.id);
              }}
              className={`w-full py-3 px-4 border text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-2 
                ${isUnlocked 
                  ? 'bg-charcoal-900 border-gold-500/50 text-gold-400 hover:bg-gold-600 hover:text-charcoal-900 shadow-[0_0_20px_rgba(212,175,55,0.15)]' 
                  : 'bg-charcoal-900 border-white/10 text-white/30 cursor-not-allowed'}`}
            >
              {isUnlocked ? (
                <>Enter Realm <Compass className="w-4 h-4" /></>
              ) : (
                <>Requires {activeCity.requiredStars} Stars</>
              )}
            </button>

          </div>
        </div>
      )}

    </section>
  );
}
