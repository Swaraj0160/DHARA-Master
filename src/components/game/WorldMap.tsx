"use client";

import { useState, useRef } from "react";
import { useMounted } from "@/hooks/useMounted";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA, City } from "@/data/gameContent";
import CityVerticalCard from "./CityVerticalCard";
import CityNode from "./CityNode";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Lock, X, LayoutGrid, Map as MapIcon, ChevronLeft, ChevronRight, Star, Sparkles, Compass } from "lucide-react";

export default function WorldMap() {
  const mounted = useMounted();
  const { isCityUnlocked, startEnterRealm, chapterProgress, getTotalStars } = useGameStore();
  const [lockedNotice, setLockedNotice] = useState<{ city: City; needed: number } | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const totalGlobalStars = mounted ? getTotalStars() : 0;

  const handleSelectCity = (city: City) => {
    startEnterRealm(city.id);
  };

  const handleLockedCity = (city: City) => {
    const needed = Math.max(0, city.requiredStars - totalGlobalStars);
    setLockedNotice({ city, needed });
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  // Metrics across all cities
  const unlockedCitiesCount = mounted
    ? CITIES_DATA.filter((c) => isCityUnlocked(c.id)).length
    : 1;
  const totalChaptersCount = CITIES_DATA.reduce((sum, c) => sum + c.chapters.length, 0);
  const totalCompletedChapters = mounted
    ? CITIES_DATA.reduce((sum, c) => {
        return (
          sum +
          c.chapters.filter((ch) => chapterProgress[ch.id]?.completed).length
        );
      }, 0)
    : 0;
  const maxPossibleStars = totalChaptersCount * 3;

  return (
    <div className="relative w-full min-h-screen bg-[#0d0a08] overflow-hidden select-none flex flex-col justify-between">
      {/* Background Cartographic Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(44,26,18,0.7)_0%,_#090705_80%)] pointer-events-none" />

      {/* Decorative Antique Map Coordinate Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* Rotating Astrological Mandala Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] sm:w-[950px] sm:h-[950px] rounded-full border border-gold-500/10 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full border border-dashed border-gold-400/15 animate-[spin_120s_linear_infinite]" />
        <div className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full border border-gold-500/10 animate-[spin_80s_linear_infinite_reverse]" />
      </div>

      {/* ── TOP HEADER SECTION ── */}
      <div className="relative z-20 pt-20 sm:pt-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gold-500/20">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold-400/90 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-gold-400" />
                EXPEDITION DESTINATIONS
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-parchment-100 via-gold-200 to-gold-400 drop-shadow-md">
              Ancient Realms of Bharat
            </h1>
            <p className="text-xs sm:text-sm font-serif italic text-parchment-300/80 mt-1 max-w-2xl">
              Choose an ancient realm to explore its historical chapters, solve architectural riddles, and restore sacred knowledge.
            </p>
          </div>

          {/* View Mode Switcher & Carousel Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            {/* View Switcher Tabs */}
            <div className="flex items-center p-1 rounded-2xl bg-earth-950/80 border border-gold-500/30 backdrop-blur-md shadow-lg">
              <button
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-serif tracking-wider uppercase transition-all cursor-pointer ${
                  viewMode === "cards"
                    ? "bg-gradient-to-r from-gold-500 to-gold-600 text-earth-950 font-bold shadow-md"
                    : "text-parchment-400 hover:text-gold-300"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Realm Cards</span>
              </button>

              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-serif tracking-wider uppercase transition-all cursor-pointer ${
                  viewMode === "map"
                    ? "bg-gradient-to-r from-gold-500 to-gold-600 text-earth-950 font-bold shadow-md"
                    : "text-parchment-400 hover:text-gold-300"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Atlas Map</span>
              </button>
            </div>

            {/* Carousel navigation arrows (only in cards view) */}
            {viewMode === "cards" && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={scrollLeft}
                  className="p-2 rounded-xl bg-earth-950/80 border border-gold-500/30 text-gold-400 hover:text-gold-200 hover:border-gold-400 transition-all shadow-md cursor-pointer"
                  title="Previous Realms"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollRight}
                  className="p-2 rounded-xl bg-earth-950/80 border border-gold-500/30 text-gold-400 hover:text-gold-200 hover:border-gold-400 transition-all shadow-md cursor-pointer"
                  title="Next Realms"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center my-4 overflow-hidden">
        {viewMode === "cards" ? (
          /* ── VERTICAL CARDS CAROUSEL ── */
          <div className="w-full">
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-6 overflow-x-auto snap-x snap-mandatory py-6 px-6 sm:px-12 md:px-16 scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {CITIES_DATA.map((city) => {
                const unlocked = isCityUnlocked(city.id);
                const starsEarned = city.chapters.reduce((acc, ch) => {
                  const p = chapterProgress[ch.id];
                  return acc + (p?.completed ? p.stars : 0);
                }, 0);
                const maxStars = city.chapters.length * 3;
                const completedChapters = city.chapters.filter(
                  (ch) => chapterProgress[ch.id]?.completed
                ).length;

                return (
                  <div key={city.id} className="snap-start shrink-0">
                    <CityVerticalCard
                      city={city}
                      isUnlocked={unlocked}
                      starsEarned={starsEarned}
                      maxStars={maxStars}
                      completedChapters={completedChapters}
                      totalChapters={city.chapters.length}
                      totalGlobalStars={totalGlobalStars}
                      onSelect={() => handleSelectCity(city)}
                      onLockedClick={handleLockedCity}
                    />
                  </div>
                );
              })}
            </div>

            {/* Mobile / Desktop Scroll Indicator Hint */}
            <div className="flex justify-center items-center gap-2 text-[11px] font-mono text-parchment-400/70 pt-1">
              <span>← Scroll or use arrows to view all 5 ancient realms →</span>
            </div>
          </div>
        ) : (
          /* ── HISTORICAL ERA ATLAS VIEW ── */
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
            <div className="relative w-full aspect-[16/9] min-h-[440px] sm:min-h-[560px] md:min-h-[620px] rounded-3xl overflow-hidden border-2 border-gold-500/50 shadow-[0_0_50px_rgba(0,0,0,0.9)] bg-[#1e140d]">
              {/* Authentic Historical Era Map of Ancient Bharat */}
              <Image
                src="/ancient_india_map.jpg"
                alt="Ancient Map of Bharat (Jambudvipa)"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover object-center select-none pointer-events-none filter contrast-105 brightness-95"
              />

              {/* Antique parchment vignette overlay to harmonize with game theme */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/35 pointer-events-none" />
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.85)] pointer-events-none" />

              {/* Antique Cartouche Info Badge */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-earth-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gold-500/40 text-[11px] font-mono text-gold-300 shadow-md">
                <Compass className="w-3.5 h-3.5 text-gold-400" />
                <span>प्राचीन जम्बूद्वीप · Classical Cartography</span>
              </div>

              {/* Interactive Specific Location Pins for all cities (No interlinking lines) */}
              <div className="absolute inset-0">
                {CITIES_DATA.map((city) => {
                  const unlocked = isCityUnlocked(city.id);
                  const starsEarned = city.chapters.reduce((acc, ch) => {
                    const p = chapterProgress[ch.id];
                    return acc + (p?.completed ? p.stars : 0);
                  }, 0);
                  const maxStars = city.chapters.length * 3;

                  return (
                    <CityNode
                      key={city.id}
                      city={city}
                      isUnlocked={unlocked}
                      starsEarned={starsEarned}
                      maxStars={maxStars}
                      onSelect={() => handleSelectCity(city)}
                      onLockedClick={handleLockedCity}
                    />
                  );
                })}
              </div>
            </div>

            {/* Atlas Map Subtitle & Interaction Hint */}
            <div className="flex justify-center items-center gap-2 text-[11px] font-mono text-parchment-400/80 pt-2 text-center">
              <span>Historical Cartography of Ancient Bharat · Select any realm marker to travel to its locations</span>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM STATS & PROGRESS RIBBON ── */}
      <div className="relative z-20 pb-6 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-earth-950/85 backdrop-blur-md border border-gold-500/30 rounded-2xl p-3 sm:px-6 sm:py-3 shadow-xl flex flex-wrap items-center justify-between gap-3 text-parchment-300">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-ping" />
            <span className="text-xs font-serif">
              {viewMode === "cards"
                ? "Select an unlocked realm card to view its chapter locations."
                : "Select a city node on the atlas to travel into its realms."}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono ml-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-parchment-400">Realms:</span>
              <span suppressHydrationWarning className="text-gold-300 font-bold">
                {unlockedCitiesCount} / {CITIES_DATA.length}
              </span>
            </div>

            <div className="w-px h-3.5 bg-earth-800" />

            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              <span suppressHydrationWarning className="text-gold-300 font-bold">
                {totalGlobalStars} / {maxPossibleStars}
              </span>
            </div>

            <div className="w-px h-3.5 bg-earth-800 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-parchment-400">Locations:</span>
              <span suppressHydrationWarning className="text-parchment-200 font-bold">
                {totalCompletedChapters} / {totalChaptersCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── LOCKED CITY FEEDBACK MODAL ── */}
      <AnimatePresence>
        {lockedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLockedNotice(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-earth-950 border-2 border-gold-500/60 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative text-center text-parchment-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLockedNotice(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-earth-900 text-parchment-400 hover:text-parchment-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-400 mx-auto mb-4 text-3xl">
                <Lock className="w-8 h-8 text-gold-500/80" />
              </div>

              <div className="text-[11px] font-mono uppercase tracking-widest text-gold-400 mb-1">
                Realm Sealed
              </div>
              <h3 className="font-serif text-2xl font-bold text-parchment-100 mb-2">
                {lockedNotice.city.name}
              </h3>
              <p className="text-sm font-serif italic text-parchment-300 mb-6">
                &ldquo;{lockedNotice.city.subtitle}&rdquo;
              </p>

              <div className="p-4 rounded-2xl bg-earth-900/80 border border-gold-500/30 mb-6 text-left space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-parchment-300">Required Global Stars:</span>
                  <span className="font-bold text-gold-300">{lockedNotice.city.requiredStars} ★</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-parchment-300">Your Current Stars:</span>
                  <span className="font-bold text-parchment-100">{totalGlobalStars} ★</span>
                </div>
                <div className="pt-2 border-t border-earth-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-terracotta-400 font-bold">Stars Needed to Unlock:</span>
                  <span className="font-bold text-terracotta-400">+{lockedNotice.needed} ★</span>
                </div>
              </div>

              <p className="text-xs text-parchment-400 mb-6 leading-relaxed">
                Complete chapters with high accuracy in unlocked cities to accumulate chapter stars and unlock this ancient realm.
              </p>

              <button
                onClick={() => setLockedNotice(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-earth-950 font-serif font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-md cursor-pointer"
              >
                Continue Journey
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

