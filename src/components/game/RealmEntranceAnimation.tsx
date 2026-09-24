"use client";

import { useState, useEffect, useCallback } from "react";
import { REALM_ENTRANCE_DATA, RealmVista } from "@/data/realmEntranceData";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Compass,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Scroll,
  Play,
  Pause,
  X,
} from "lucide-react";

interface RealmEntranceAnimationProps {
  cityId: string;
  onComplete: () => void;
  onSkip: () => void;
}

const AUTO_ADVANCE_MS = 5000;

export default function RealmEntranceAnimation({
  cityId,
  onComplete,
  onSkip,
}: RealmEntranceAnimationProps) {
  const config = REALM_ENTRANCE_DATA[cityId] || REALM_ENTRANCE_DATA.pataliputra;
  const vistas = config.vistas;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);

  const currentVista: RealmVista = vistas[activeIndex] || vistas[0];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % vistas.length);
  }, [vistas.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + vistas.length) % vistas.length);
  }, [vistas.length]);

  const handleFinish = useCallback(() => {
    setIsTransitioningOut(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onComplete]);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || isTransitioningOut) return;

    const timer = setTimeout(() => {
      if (activeIndex === vistas.length - 1) {
        // Completed cycling all 4 vistas: transition into the realm!
        handleFinish();
      } else {
        handleNext();
      }
    }, AUTO_ADVANCE_MS);

    return () => clearTimeout(timer);
  }, [activeIndex, isPlaying, isTransitioningOut, vistas.length, handleNext, handleFinish]);

  // Escape key to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSkip]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-50 bg-[#070503] text-parchment-100 flex flex-col justify-between overflow-hidden select-none"
      >
        {/* ── CINEMATIC WIDESCREEN LETTERBOX BARS (TOP & BOTTOM) ── */}

        {/* TOP BAR: Realm Identity & Skip */}
        <div className="relative z-30 w-full bg-gradient-to-b from-black via-black/95 to-transparent px-6 sm:px-12 pt-6 pb-4 border-b border-gold-500/20 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-earth-950 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Compass className="w-5 h-5 animate-[spin_60s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gold-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  ENTERING ANCIENT REALM
                </span>
                <span className="text-gold-600/70 text-xs">·</span>
                <span className="text-[10px] font-mono text-parchment-400/80 hidden sm:inline">
                  {config.era}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-parchment-100">
                {config.cityName}
              </h2>
            </div>
          </div>

          {/* Center Sanskrit Motto (Visible on Desktop) */}
          <div className="hidden lg:flex flex-col items-center">
            <span className="text-xs font-serif tracking-[0.15em] text-gold-300/90 italic font-semibold">
              {config.sanskritMotto}
            </span>
            <span className="text-[9px] font-mono text-parchment-400/70 tracking-widest uppercase">
              {config.region}
            </span>
          </div>

          {/* Right Action: Skip to City Map */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSkip}
              className="px-4 py-2 rounded-xl bg-earth-950/80 hover:bg-earth-900 border border-gold-500/30 hover:border-gold-400/60 text-parchment-300 hover:text-gold-200 text-xs font-serif tracking-widest uppercase transition-all flex items-center gap-1.5 shadow cursor-pointer"
            >
              <span>Skip Prologue</span>
              <X className="w-3.5 h-3.5 text-gold-400" />
            </button>
          </div>
        </div>

        {/* ── MAIN CINEMATIC VISTA VIEWPORT ── */}
        <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
          {/* Animated Background Vista with Ken Burns Pan/Zoom */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVista.id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={currentVista.image}
                alt={currentVista.title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center filter contrast-115 brightness-90 transition-all duration-1000"
              />

              {/* Atmospheric Vignette Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#070503_95%)] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Subtle Astrological Mandala Watermark in background */}
          <div className="absolute w-[600px] h-[600px] rounded-full border border-gold-500/10 pointer-events-none animate-[spin_180s_linear_infinite] opacity-30" />

          {/* Floating Historical Location Card Overlay (Bottom Left) */}
          <div className="absolute bottom-6 left-4 sm:left-12 max-w-xl z-20 pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`desc-${currentVista.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="bg-black/75 backdrop-blur-md border border-gold-500/40 p-5 sm:p-6 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)]"
              >
                {/* Vista Step Badge & Era */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 border border-gold-400/50 text-[10px] font-mono font-bold tracking-widest text-gold-300 uppercase">
                    VISTA 0{activeIndex + 1} / 0{vistas.length}
                  </span>
                  <span className="text-xs text-gold-500/80 font-mono">·</span>
                  <span className="text-[11px] font-mono text-gold-400/90 font-medium">
                    {currentVista.era}
                  </span>
                </div>

                {/* Monument Title */}
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-parchment-100 drop-shadow">
                  {currentVista.title}
                </h3>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm font-serif italic text-gold-300/90 mt-0.5">
                  &ldquo;{currentVista.subTitle}&rdquo;
                </p>

                {/* Historical Narrative */}
                <p className="text-xs sm:text-sm text-parchment-300/90 mt-3 leading-relaxed">
                  {currentVista.description}
                </p>

                {/* Historical Significance Pill */}
                <div className="mt-3 pt-3 border-t border-gold-500/20 flex items-start gap-2 text-[11px] font-mono text-parchment-400">
                  <Scroll className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                  <span className="leading-snug text-gold-200/80 italic">
                    {currentVista.historicalSignificance}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows for Manual Exploration */}
          <div className="absolute inset-x-4 sm:inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
            <button
              onClick={handlePrev}
              className="pointer-events-auto w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/90 border border-gold-500/30 hover:border-gold-400 text-parchment-200 hover:text-gold-300 flex items-center justify-center transition-all backdrop-blur-md shadow-lg cursor-pointer"
              title="Previous Historical Vista"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="pointer-events-auto w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/90 border border-gold-500/30 hover:border-gold-400 text-parchment-200 hover:text-gold-300 flex items-center justify-center transition-all backdrop-blur-md shadow-lg cursor-pointer"
              title="Next Historical Vista"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ── BOTTOM CINEMATIC HUD (4-VISTA ARCHIVAL FILMSTRIP & CTA) ── */}
        <div className="relative z-30 w-full bg-gradient-to-t from-black via-black/95 to-transparent px-6 sm:px-12 pt-4 pb-6 border-t border-gold-500/20 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: 4-Vista Archival Thumbnail Carousel */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-full py-1">
            {vistas.map((vista, idx) => {
              const isActive = idx === activeIndex;

              return (
                <button
                  key={vista.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`group relative flex items-center gap-2.5 p-1.5 sm:p-2 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-earth-900/90 border-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.5)] scale-105"
                      : "bg-black/50 border-stone-800 hover:border-gold-500/50 hover:bg-black/80"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-14 h-10 sm:w-16 sm:h-11 rounded-xl overflow-hidden shrink-0 border border-gold-500/30">
                    <Image
                      src={vista.image}
                      alt={vista.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                  </div>

                  {/* Title & Index */}
                  <div className="text-left pr-2 hidden sm:block">
                    <span className="text-[9px] font-mono text-gold-400/80 block font-bold">
                      LOCATION 0{idx + 1}
                    </span>
                    <span className="font-serif text-xs font-bold text-parchment-200 block truncate max-w-[120px]">
                      {vista.title}
                    </span>
                  </div>

                  {/* Animated Active Progress Line */}
                  {isActive && isPlaying && (
                    <motion.div
                      key={`progress-${activeIndex}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"
                    />
                  )}
                </button>
              );
            })}

            {/* Play / Pause Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-earth-950 border border-gold-500/30 text-parchment-400 hover:text-gold-300 transition-all cursor-pointer shrink-0"
              title={isPlaying ? "Pause Slideshow" : "Resume Auto-play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          {/* Right: Enter Realm Chapters Action CTA */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleFinish}
              disabled={isTransitioningOut}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-earth-950 font-serif font-bold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:shadow-[0_0_40px_rgba(212,175,55,0.9)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ENTER REALM CHAPTERS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
