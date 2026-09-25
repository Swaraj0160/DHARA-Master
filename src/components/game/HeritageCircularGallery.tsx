"use client";

import React, { useState, useMemo } from 'react';
import { Lock, MapPin, Compass } from 'lucide-react';
import { CITIES_DATA } from '@/data/gameContent';
import { useGameStore } from '@/store/gameState';
import GooeyActionButton from '../ui/GooeyActionButton';
import ReactBitsCircularGallery from './ReactBitsCircularGallery';

interface CircularGalleryProps {
  onEnterRealm: (cityId: string) => void;
}

const HERO_IMAGES: Record<string, string> = {
  nalanda: "/destinations/nalanda-hero.png",
  pataliputra: "/destinations/pataliputra-hero.png",
  hampi: "/destinations/hampi-hero.png",
  varanasi: "/destinations/varanasi-hero.png",
  madurai: "/destinations/madurai-hero.png",
  konark: "/destinations/konark-hero.png",
};

export default function HeritageCircularGallery({ onEnterRealm }: CircularGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { chapterProgress, isCityUnlocked } = useGameStore();

  const galleryItems = useMemo(() => {
    return CITIES_DATA.map((city) => ({
      image: HERO_IMAGES[city.id] || city.artwork,
      text: '' // Hiding 3D text to let the DHARA UI panel be the focus
    }));
  }, []);

  const activeCity = CITIES_DATA[activeIndex];
  const isUnlocked = activeCity ? isCityUnlocked(activeCity.id) : false;
  const completedCount = activeCity ? activeCity.chapters.filter(ch => chapterProgress[ch.id]?.completed).length : 0;
  const totalChapters = activeCity ? activeCity.chapters.length : 0;

  return (
    <section className="relative w-full h-[95vh] min-h-[750px] lg:min-h-[900px] bg-charcoal-950 overflow-hidden flex flex-col items-center justify-between border-b border-white/5 py-16">
      
      {/* Background Ambient Layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft heritage texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
        {/* Cinematic depth gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-charcoal-900/40 via-charcoal-950/80 to-charcoal-950" />
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-charcoal-950 via-charcoal-950/90 to-transparent" />
      </div>

      {/* Header Overlay */}
      <div className="relative w-full text-center z-20 pointer-events-none mt-4 md:mt-8">
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gold-600 font-bold mb-3 drop-shadow-md">Explore the World</h2>
        <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif text-ivory-100 drop-shadow-lg">Heritage Destinations</h3>
      </div>

      {/* REACT BITS CIRCULAR GALLERY CANVAS */}
      <div className="absolute inset-0 top-0 left-0 w-full h-full z-10 flex items-center justify-center">
        {/* We keep it slightly padded vertically inside to let the camera breathe */}
        <div className="w-full h-[120%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ReactBitsCircularGallery
            items={galleryItems}
            bend={2.5} /* Adjusted bend to widen the stage */
            textColor="#E6DED0"
            borderRadius={0.05}
            font="bold 42px serif"
            onItemChange={(index) => setActiveIndex(index)}
          />
        </div>
      </div>

      {/* BOTTOM UI OVERLAY (DHARA SYNCED UI) */}
      <div className="relative z-30 w-full px-6 pb-8 md:pb-12 pointer-events-none flex justify-center mt-auto">
        {activeCity && (
          <div className="w-full max-w-[400px] p-6 md:p-8 rounded-2xl bg-charcoal-900/80 border border-gold-500/20 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] pointer-events-auto transition-all duration-500">
            
            {/* Header info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-500" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-ivory-300 font-bold">
                  {activeCity.region}
                </span>
              </div>
              {!isUnlocked && (
                <div className="bg-charcoal-800/80 p-2 rounded-full border border-gold-500/20 shadow-inner">
                  <Lock className="w-3.5 h-3.5 text-gold-600" />
                </div>
              )}
            </div>

            <h4 className="font-serif font-bold text-3xl md:text-4xl text-ivory-100 mb-3 tracking-wide truncate drop-shadow-md">
              {activeCity.name}
            </h4>
            
            <p className="text-xs md:text-sm text-ivory-300/90 leading-relaxed mb-6 line-clamp-2">
              {activeCity.subtitle}
            </p>

            {/* Progress */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold-500">Realm Progress</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ivory-300">{completedCount} / {totalChapters}</span>
              </div>
              <div className="flex gap-1.5 w-full">
                {[...Array(totalChapters)].map((_, i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full ${i < completedCount ? 'bg-gold-500 shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'bg-white/10'}`} />
                ))}
              </div>
            </div>

            {/* CTA */}
            {isUnlocked ? (
              <GooeyActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEnterRealm(activeCity.id);
                }}
                gooColor="bg-gold-500"
                className="w-full py-4 px-6 border text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex justify-center items-center gap-3 bg-charcoal-900/80 border-gold-500/50 text-gold-400 hover:text-charcoal-900 hover:border-gold-600 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              >
                Enter Realm <Compass className="w-4 h-4" />
              </GooeyActionButton>
            ) : (
              <button 
                className="w-full py-4 px-6 border text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex justify-center items-center gap-3 bg-charcoal-900/50 border-white/10 text-white/30 cursor-not-allowed"
              >
                Requires {activeCity.requiredStars} Stars
              </button>
            )}

          </div>
        )}
      </div>

    </section>
  );
}
