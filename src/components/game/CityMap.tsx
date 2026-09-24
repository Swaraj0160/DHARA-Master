"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA, Chapter } from "@/data/gameContent";
import ChapterNode from "./ChapterNode";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Lock, X, Trophy, Sparkles } from "lucide-react";
import Image from "next/image";

interface CityMapProps {
  cityId: string;
}

export default function CityMap({ cityId }: CityMapProps) {
  const { enterCity, enterChapter, chapterProgress, getChapterState, startEnterRealm } = useGameStore();
  const [lockedNotice, setLockedNotice] = useState<Chapter | null>(null);

  const city = CITIES_DATA.find((c) => c.id === cityId);

  if (!city) {
    return (
      <div className="min-h-screen bg-earth-950 flex flex-col items-center justify-center text-parchment-100 p-6 text-center">
        <p className="font-serif text-xl mb-4">Ancient City not found in archives.</p>
        <button
          onClick={() => enterCity(null)}
          className="px-6 py-2.5 rounded-xl bg-gold-500 text-earth-950 font-serif font-bold text-xs uppercase tracking-wider"
        >
          Return to World Map
        </button>
      </div>
    );
  }

  // Calculate city statistics
  const totalChapters = city.chapters.length;
  const completedChaptersCount = city.chapters.filter(
    (ch) => chapterProgress[ch.id]?.completed
  ).length;
  const starsEarnedInCity = city.chapters.reduce(
    (acc, ch) => acc + (chapterProgress[ch.id]?.completed ? chapterProgress[ch.id]?.stars || 0 : 0),
    0
  );
  const maxPossibleStars = totalChapters * 3;
  const isCityFullyCompleted = completedChaptersCount === totalChapters;

  const handleSelectChapter = (chapter: Chapter) => {
    enterChapter(chapter.id);
  };

  const handleLockedChapter = (chapter: Chapter) => {
    setLockedNotice(chapter);
  };

  return (
    <div className="relative w-full h-screen bg-[#070504] overflow-hidden select-none">
      {/* ── RICH ANCIENT SANCTUARY BACKGROUND (NOT A MAP) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="/ancient_temple_bg.jpg"
          alt="Ancient Realm Sanctuary"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 filter contrast-125 brightness-75 scale-105 transition-transform duration-1000"
        />
        {/* Warm golden-terracotta glow & radial atmospheric shadow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(60,32,16,0.5)_0%,_#070504_85%)] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070504] via-transparent to-[#070504]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070504]/80 via-transparent to-[#070504]/80" />
      </div>

      {/* Subtle sacred geometry & ancient constellation watermark */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* City Header Navigation Bar */}
      <div className="absolute top-20 inset-x-0 z-30 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        
        {/* Left: Return to World & City Name */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => enterCity(null)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-earth-950/80 border border-gold-500/40 text-parchment-200 hover:text-gold-300 hover:border-gold-400 text-xs font-serif font-bold uppercase tracking-wider transition-all backdrop-blur-md shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gold-400" />
            <span>World Map</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-parchment-100">
                {city.name}
              </span>
              <span className="text-xs">{city.artwork}</span>
            </div>
            <p className="text-[10px] font-mono text-gold-400/80 hidden sm:block">
              {city.era} · {city.region}
            </p>
          </div>
        </div>

        {/* Right: Prologue Replay & City Star Progress */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => startEnterRealm(city.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-earth-950/85 border border-gold-500/30 hover:border-gold-400 text-gold-300 hover:text-gold-200 text-xs font-serif tracking-wider uppercase transition-all backdrop-blur-md shadow-md cursor-pointer"
            title="View Historical Vistas & Prologue"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Prologue Vistas</span>
          </button>

          <div className="flex items-center gap-2 bg-earth-950/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-gold-500/30 shadow-md">
            <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
            <div className="text-xs font-mono text-gold-300 font-bold">
              {starsEarnedInCity} / {maxPossibleStars} Stars
            </div>
            <div className="w-px h-3.5 bg-earth-800 mx-1" />
            <div className="text-xs font-mono text-parchment-300">
              {completedChaptersCount} / {totalChapters} Locations
            </div>
          </div>
        </div>
      </div>

      {/* Interconnecting Sequential Adventure Path (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="unlockedPath" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.85)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0.45)" />
          </linearGradient>
          <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {city.chapters.map((ch, idx) => {
          if (idx === city.chapters.length - 1) return null;
          const nextCh = city.chapters[idx + 1];
          const currProgress = getChapterState(ch.id);

          const isPathCompleted = currProgress.completed;
          const isPathActive = !currProgress.completed && currProgress.status === "unlocked";

          return (
            <g key={`path-${ch.id}-${nextCh.id}`}>
              {/* Outer soft ambient halo */}
              {(isPathCompleted || isPathActive) && (
                <line
                  x1={`${ch.coordinates.x}%`}
                  y1={`${ch.coordinates.y}%`}
                  x2={`${nextCh.coordinates.x}%`}
                  y2={`${nextCh.coordinates.y}%`}
                  stroke="rgba(212, 175, 55, 0.3)"
                  strokeWidth="6"
                  filter="url(#pathGlow)"
                />
              )}
              <line
                x1={`${ch.coordinates.x}%`}
                y1={`${ch.coordinates.y}%`}
                x2={`${nextCh.coordinates.x}%`}
                y2={`${nextCh.coordinates.y}%`}
                stroke={
                  isPathCompleted
                    ? "url(#unlockedPath)"
                    : isPathActive
                    ? "rgba(212, 175, 55, 0.6)"
                    : "rgba(120, 100, 80, 0.2)"
                }
                strokeWidth={isPathCompleted ? "3.5" : "2"}
                strokeDasharray={isPathCompleted ? undefined : "6 6"}
              />
            </g>
          );
        })}
      </svg>

      {/* Chapter Nodes Container */}
      <div className="absolute inset-0 pt-28 pb-16 px-4">
        {city.chapters.map((chapter, idx) => {
          const progress = getChapterState(chapter.id);
          const prevChapter = idx > 0 ? city.chapters[idx - 1] : null;
          const isCurrent =
            progress.status === "unlocked" &&
            !progress.completed &&
            (!prevChapter || getChapterState(prevChapter.id).completed);

          return (
            <ChapterNode
              key={chapter.id}
              chapter={chapter}
              progress={progress}
              isCurrent={isCurrent}
              onSelect={() => handleSelectChapter(chapter)}
              onLockedClick={handleLockedChapter}
            />
          );
        })}
      </div>

      {/* City Fully Conquered Celebration Banner */}
      {isCityFullyCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none z-30 px-4"
        >
          <div className="bg-gradient-to-r from-earth-950 via-earth-900 to-earth-950 border-2 border-gold-400/80 px-6 py-2.5 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.5)] flex items-center gap-3 text-gold-300 pointer-events-auto backdrop-blur-md">
            <Trophy className="w-5 h-5 text-gold-400" />
            <div>
              <span className="font-serif font-bold text-xs uppercase tracking-wider">
                Realm Mastered: {city.name}
              </span>
              <span className="text-[10px] font-mono text-parchment-300 block">
                All 5 chapters explored · {starsEarnedInCity} Stars earned
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Locked Chapter Feedback Modal */}
      <AnimatePresence>
        {lockedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
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
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-earth-900 text-parchment-400 hover:text-parchment-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-400 mx-auto mb-4">
                <Lock className="w-7 h-7 text-gold-500/80" />
              </div>

              <div className="text-[10px] font-mono uppercase tracking-widest text-gold-400 mb-1">
                Sequential Location Locked
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-parchment-100 mb-2">
                {lockedNotice.title}
              </h3>
              <p className="text-sm font-serif italic text-parchment-300 mb-4">
                &ldquo;{lockedNotice.locationName}&rdquo;
              </p>

              <div className="p-4 rounded-2xl bg-earth-900/80 border border-gold-500/30 mb-6 text-left text-xs space-y-2 text-parchment-300">
                <p>
                  Chapters in <strong>{city.name}</strong> follow an ancient sequential journey.
                </p>
                <p className="text-gold-300 font-semibold">
                  Complete Chapter {lockedNotice.chapterNumber - 1} to unlock this location!
                </p>
              </div>

              <button
                onClick={() => setLockedNotice(null)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-earth-950 font-serif font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-md"
              >
                Understood
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
