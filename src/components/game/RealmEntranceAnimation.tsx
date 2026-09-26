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
import { useVedaStore } from "@/store/vedaStore";
import { REALM_ENTRANCE_DIALOGUES } from "@/data/vedaDialogues";

interface RealmEntranceAnimationProps {
  cityId: string;
  onComplete: () => void;
  onSkip: () => void;
}

const AUTO_ADVANCE_MS = 5000;

// Realm-specific accent colors for the arrival screen
const REALM_ACCENT: Record<string, string> = {
  pataliputra: '#d4af37',
  hampi:       '#c25934',
  varanasi:    '#4d8fc4',
  madurai:     '#9b4d8c',
  konark:      '#e4c23f',
  nalanda:     '#4d9b6e',
};

export default function RealmEntranceAnimation({
  cityId,
  onComplete,
  onSkip,
}: RealmEntranceAnimationProps) {
  const config = REALM_ENTRANCE_DATA[cityId] || REALM_ENTRANCE_DATA.pataliputra;
  const vistas = config.vistas;
  const accent = REALM_ACCENT[cityId] || '#d4af37';

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);

  // Arrival moment state — shown after vistas complete, before CityMap
  const [showArrival, setShowArrival] = useState(false);
  const [vedaText, setVedaText] = useState('');

  const { popWithDialogue } = useVedaStore();

  const currentVista: RealmVista = vistas[activeIndex] || vistas[0];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % vistas.length);
  }, [vistas.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + vistas.length) % vistas.length);
  }, [vistas.length]);

  // Show arrival moment, then hand off to CityMap
  const triggerArrival = useCallback(() => {
    const dialogue = REALM_ENTRANCE_DIALOGUES[cityId] || {
      text: `Welcome to the realm of ${config.cityName}! Examine the ancient monuments and sacred architecture. Your heritage journey begins now.`,
      emotion: 'Excited',
    };
    setVedaText(dialogue.text);
    setShowArrival(true);
    // After 3.5s, complete into realm
    setTimeout(() => {
      popWithDialogue(dialogue.text, dialogue.emotion);
      setIsTransitioningOut(true);
      setTimeout(() => onComplete(), 700);
    }, 3500);
  }, [cityId, config.cityName, onComplete, popWithDialogue]);

  const handleFinish = useCallback(() => {
    if (isTransitioningOut) return;
    triggerArrival();
  }, [isTransitioningOut, triggerArrival]);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying || isTransitioningOut || showArrival) return;
    const timer = setTimeout(() => {
      if (activeIndex === vistas.length - 1) {
        triggerArrival();
      } else {
        handleNext();
      }
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, isPlaying, isTransitioningOut, showArrival, vistas.length, handleNext, triggerArrival]);

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSkip();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip, handleNext, handlePrev]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioningOut ? 0 : 1 }}
        transition={{ duration: 0.7 }}
        className="fixed inset-0 z-50 bg-[#070503] text-parchment-100 flex flex-col justify-between overflow-hidden select-none"
      >
        {/* ── ARRIVAL MOMENT OVERLAY ── */}
        <AnimatePresence>
          {showArrival && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[60] flex flex-col items-center justify-center"
              style={{ background: `radial-gradient(ellipse at center, ${accent}18 0%, #070503 70%)` }}
            >
              {/* Realm name large */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="text-center px-6 max-w-2xl"
              >
                <p className="text-[10px] font-mono uppercase tracking-[0.5em] mb-4" style={{ color: accent }}>
                  You have arrived
                </p>
                <h1
                  className="text-6xl sm:text-8xl md:text-9xl font-serif font-black tracking-widest uppercase leading-none mb-6"
                  style={{ color: accent, textShadow: `0 0 80px ${accent}40` }}
                >
                  {config.cityName}
                </h1>
                <p className="text-sm sm:text-base font-serif italic text-white/60 leading-relaxed mb-8 max-w-lg mx-auto">
                  {config.historicalPreamble}
                </p>

                {/* VEDA welcome bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="inline-flex items-start gap-3 text-left bg-black/50 backdrop-blur-md border px-5 py-4 max-w-md"
                  style={{ borderColor: `${accent}30` }}
                >
                  <img src="/veda/neutral.svg" alt="Veda" className="w-10 h-10 shrink-0 mt-0.5 opacity-90" />
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: accent }}>
                      VEDA · Heritage Guide
                    </p>
                    <p className="text-xs font-serif leading-relaxed text-white/80">{vedaText}</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP BAR */}
        <div className="relative z-30 w-full bg-gradient-to-b from-black via-black/95 to-transparent px-5 sm:px-10 pt-5 pb-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold"
              style={{ background: `${accent}20`, border: `1px solid ${accent}50`, color: accent }}
            >
              <Compass className="w-4 h-4 animate-[spin_60s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono tracking-[0.35em] uppercase font-bold flex items-center gap-1" style={{ color: accent }}>
                  <Sparkles className="w-3 h-3" />
                  Entering Ancient Realm
                </span>
                <span className="text-[9px] font-mono text-white/30 hidden sm:inline">· {config.era}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold tracking-wider text-white/90">
                {config.cityName}
              </h2>
            </div>
          </div>

          {/* Sanskrit motto — desktop */}
          <div className="hidden lg:flex flex-col items-center">
            <span className="text-[11px] font-serif italic tracking-[0.12em]" style={{ color: `${accent}cc` }}>
              {config.sanskritMotto}
            </span>
            <span className="text-[8px] font-mono tracking-widest uppercase text-white/30 mt-0.5">
              {config.region}
            </span>
          </div>

          <button
            onClick={onSkip}
            className="px-4 py-2 border text-white/50 hover:text-white text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          >
            Skip <X className="w-3 h-3" />
          </button>
        </div>

        {/* MAIN VISTA VIEWPORT */}
        <div className="relative flex-1 w-full overflow-hidden">
          {/* Background image with Ken Burns */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVista.id}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={currentVista.image}
                alt={currentVista.title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center brightness-75 contrast-110"
              />
              {/* Layered vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/60 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_#070503_92%)] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50 pointer-events-none" />

              {/* Subtle realm accent color tint */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 80%, ${accent}12 0%, transparent 60%)` }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Spinning mandala watermark */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full border pointer-events-none animate-[spin_180s_linear_infinite] opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ borderColor: `${accent}30` }}
          />

          {/* Description card — bottom left */}
          <div className="absolute bottom-6 left-4 sm:left-10 max-w-lg z-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={`desc-${currentVista.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="bg-black/75 backdrop-blur-md border p-5 sm:p-6"
                style={{ borderColor: `${accent}30` }}
              >
                {/* Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase border"
                    style={{ color: accent, borderColor: `${accent}40`, background: `${accent}12` }}
                  >
                    Vista {String(activeIndex + 1).padStart(2,'0')} / {String(vistas.length).padStart(2,'0')}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">{currentVista.era}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white mb-1">
                  {currentVista.title}
                </h3>
                <p className="text-xs sm:text-sm font-serif italic mb-3" style={{ color: `${accent}cc` }}>
                  &ldquo;{currentVista.subTitle}&rdquo;
                </p>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed mb-4">
                  {currentVista.description}
                </p>
                <div className="flex items-start gap-2 pt-3 border-t" style={{ borderColor: `${accent}20` }}>
                  <Scroll className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accent }} />
                  <span className="text-[11px] font-mono italic leading-snug" style={{ color: `${accent}cc` }}>
                    {currentVista.historicalSignificance}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <div className="absolute inset-x-3 sm:inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
            <button
              onClick={handlePrev}
              className="pointer-events-auto w-10 h-10 border text-white/60 hover:text-white flex items-center justify-center transition-all backdrop-blur-md"
              style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="pointer-events-auto w-10 h-10 border text-white/60 hover:text-white flex items-center justify-center transition-all backdrop-blur-md"
              style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)' }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BOTTOM HUD */}
        <div className="relative z-30 w-full bg-gradient-to-t from-black via-black/95 to-transparent px-5 sm:px-10 pt-4 pb-5 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Filmstrip thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 shrink-0">
            {vistas.map((vista, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={vista.id}
                  onClick={() => { setActiveIndex(idx); setIsPlaying(false); }}
                  className="group relative flex items-center gap-2.5 p-1.5 transition-all duration-300 cursor-pointer shrink-0"
                  style={{
                    border: `1px solid ${isActive ? accent : 'rgba(255,255,255,0.08)'}`,
                    background: isActive ? `${accent}18` : 'rgba(0,0,0,0.4)',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <div className="relative w-14 h-10 overflow-hidden shrink-0">
                    <Image src={vista.image} alt={vista.title} fill sizes="60px" className="object-cover" />
                    <div className="absolute inset-0 transition-colors" style={{ background: isActive ? 'transparent' : 'rgba(0,0,0,0.3)' }} />
                  </div>
                  <div className="text-left pr-2 hidden sm:block">
                    <span className="text-[8px] font-mono font-bold block uppercase tracking-widest" style={{ color: accent, opacity: 0.7 }}>
                      SITE {String(idx + 1).padStart(2,'0')}
                    </span>
                    <span className="font-serif text-xs font-bold text-white/80 block truncate max-w-[110px]">
                      {vista.title}
                    </span>
                  </div>
                  {isActive && isPlaying && (
                    <motion.div
                      key={`prog-${idx}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ background: accent }}
                    />
                  )}
                </button>
              );
            })}
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="p-2 border text-white/40 hover:text-white transition-all shrink-0"
              style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)' }}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          {/* Enter CTA */}
          <button
            onClick={handleFinish}
            disabled={isTransitioningOut}
            className="w-full sm:w-auto px-8 py-3.5 font-serif font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            style={{
              background: accent,
              color: '#0a0807',
              boxShadow: `0 0 30px ${accent}40`,
            }}
          >
            Enter Realm Chapters
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
