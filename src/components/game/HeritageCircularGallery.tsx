"use client";

import React, { useState, useMemo } from 'react';
import { Lock, MapPin, Compass, Star } from 'lucide-react';
import { CITIES_DATA } from '@/data/gameContent';
import { useGameStore } from '@/store/gameState';
import GooeyActionButton from '../ui/GooeyActionButton';
import ReactBitsCircularGallery from './ReactBitsCircularGallery';
import { motion, AnimatePresence } from 'framer-motion';

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

// Realm-specific ambient color palettes — evoke each city's character
const REALM_AMBIENCE: Record<string, { from: string; via: string; accent: string }> = {
  pataliputra: { from: '#2a1a0e', via: '#3b2216', accent: '#d4af37' },
  hampi:       { from: '#1a0f08', via: '#2d1b0e', accent: '#c25934' },
  varanasi:    { from: '#0e1a2a', via: '#162236', accent: '#7eafd4' },
  madurai:     { from: '#1a0a14', via: '#2a1020', accent: '#d46f49' },
  konark:      { from: '#1a150a', via: '#2a2010', accent: '#e4c23f' },
  nalanda:     { from: '#0a1a10', via: '#102418', accent: '#4d9b6e' },
};

export default function HeritageCircularGallery({ onEnterRealm }: CircularGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { chapterProgress, isCityUnlocked } = useGameStore();

  const galleryItems = useMemo(() => {
    return CITIES_DATA.map((city) => ({
      image: HERO_IMAGES[city.id] || city.artwork,
      text: ''
    }));
  }, []);

  const activeCity = CITIES_DATA[activeIndex];
  const isUnlocked = activeCity ? isCityUnlocked(activeCity.id) : false;
  const completedCount = activeCity ? activeCity.chapters.filter(ch => chapterProgress[ch.id]?.completed).length : 0;
  const totalChapters = activeCity ? activeCity.chapters.length : 0;
  const totalStarsInRealm = activeCity
    ? activeCity.chapters.reduce((acc, ch) => acc + (chapterProgress[ch.id]?.stars || 0), 0)
    : 0;
  const maxStarsInRealm = totalChapters * 3;

  const ambience = activeCity ? (REALM_AMBIENCE[activeCity.id] || REALM_AMBIENCE.pataliputra) : REALM_AMBIENCE.pataliputra;

  return (
    <section className="relative w-full h-[95vh] min-h-[750px] lg:min-h-[900px] overflow-hidden flex flex-col items-center justify-between border-b border-white/5 py-16">

      {/* Ambient background — shifts per realm */}
      <motion.div
        key={activeCity?.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${ambience.via} 0%, ${ambience.from} 70%)`,
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-charcoal-950 via-charcoal-950/90 to-transparent" />
      </div>

      {/* Header */}
      <div className="relative w-full text-center z-20 pointer-events-none mt-4 md:mt-8">
        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-3 drop-shadow-md"
          style={{ color: ambience.accent }}>
          Explore the World
        </h2>
        <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif text-ivory-100 drop-shadow-lg">Heritage Destinations</h3>
      </div>

      {/* OGL Circular Gallery canvas */}
      <div className="absolute inset-0 top-0 left-0 w-full h-full z-10 flex items-center justify-center">
        <div className="w-full h-[120%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ReactBitsCircularGallery
            items={galleryItems}
            bend={2.5}
            textColor="#E6DED0"
            borderRadius={0.05}
            font="bold 42px serif"
            onItemChange={(index) => setActiveIndex(index)}
          />
        </div>
      </div>

      {/* Bottom info panel — animates per realm */}
      <div className="relative z-30 w-full px-6 pb-8 md:pb-12 pointer-events-none flex justify-center mt-auto">
        <AnimatePresence mode="wait">
          {activeCity && (
            <motion.div
              key={activeCity.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full max-w-[420px] p-6 md:p-8 bg-charcoal-900/80 border backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] pointer-events-auto"
              style={{ borderColor: `${ambience.accent}33` }}
            >
              {/* Header info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: ambience.accent }} />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-ivory-300 font-bold">
                    {activeCity.region}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Stars earned */}
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3"
                        style={{
                          color: ambience.accent,
                          fill: i < Math.floor(totalStarsInRealm / totalChapters) ? ambience.accent : 'transparent',
                          opacity: i < Math.floor(totalStarsInRealm / totalChapters) ? 1 : 0.3,
                        }}
                      />
                    ))}
                  </div>
                  {!isUnlocked && (
                    <div className="p-2 rounded-full border" style={{ borderColor: `${ambience.accent}40` }}>
                      <Lock className="w-3.5 h-3.5" style={{ color: ambience.accent }} />
                    </div>
                  )}
                </div>
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
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: ambience.accent }}>
                    Realm Progress
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ivory-300">
                    {completedCount} / {totalChapters}
                  </span>
                </div>
                <div className="flex gap-1.5 w-full">
                  {[...Array(totalChapters)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all duration-500"
                      style={{
                        background: i < completedCount ? ambience.accent : 'rgba(255,255,255,0.1)',
                        boxShadow: i < completedCount ? `0 0 6px ${ambience.accent}80` : 'none',
                      }}
                    />
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
                  className="w-full py-4 px-6 border text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex justify-center items-center gap-3 bg-charcoal-900/80 text-gold-400 hover:text-charcoal-900 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                  style={{ borderColor: `${ambience.accent}50` } as React.CSSProperties}
                >
                  Enter Realm <Compass className="w-4 h-4" />
                </GooeyActionButton>
              ) : (
                <button
                  className="w-full py-4 px-6 border text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex justify-center items-center gap-3 bg-charcoal-900/50 text-white/30 cursor-not-allowed"
                  style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  Requires {activeCity.requiredStars} Stars
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

