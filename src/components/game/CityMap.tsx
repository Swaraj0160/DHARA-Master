"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA, Chapter } from "@/data/gameContent";
import ChapterNode from "./ChapterNode";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Lock, X, Trophy, Sparkles, Database, Play } from "lucide-react";
import Image from "next/image";
import FlyingPosters from "./FlyingPosters";

interface CityMapProps {
  cityId: string;
}

export default function CityMap({ cityId }: CityMapProps) {
  const { enterCity, enterChapter, chapterProgress, getChapterState, startEnterRealm } = useGameStore();
  const [lockedNotice, setLockedNotice] = useState<Chapter | null>(null);
  const [showPosters, setShowPosters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const city = CITIES_DATA.find((c) => c.id === cityId);

  if (!city) {
    return (
      <div className="min-h-screen bg-earth-950 flex flex-col items-center justify-center text-parchment-100 p-6 text-center">
        <p className="font-serif text-xl mb-4">Ancient City not found in archives.</p>
        <button onClick={() => enterCity(null)} className="px-6 py-2.5 rounded-xl bg-gold-500 text-earth-950 font-serif font-bold text-xs uppercase tracking-wider">
          Return to World Map
        </button>
      </div>
    );
  }

  const totalChapters = city.chapters.length;
  const completedChaptersCount = city.chapters.filter((ch) => chapterProgress[ch.id]?.completed).length;
  const starsEarnedInCity = city.chapters.reduce((acc, ch) => acc + (chapterProgress[ch.id]?.completed ? chapterProgress[ch.id]?.stars || 0 : 0), 0);
  const maxPossibleStars = totalChapters * 3;
  const isCityFullyCompleted = completedChaptersCount === totalChapters;

  const handleSelectChapter = (chapter: Chapter) => enterChapter(chapter.id);
  const handleLockedChapter = (chapter: Chapter) => setLockedNotice(chapter);

  // Clean, ordered, mathematically bounded downward sequence
  const getResponsiveCoordinates = (idx: number) => {
    if (isMobile) {
      // Mobile: Centered vertical sequence
      const yPos = 240 + (idx * 240);
      return { x: "50%", y: yPos, cssY: `${yPos}px` };
    } else {
      // Desktop: Winding sequence on the right side of the screen
      // Starts safely below the header and stays clear of the Explore panel.
      const isEven = idx % 2 === 0;
      const yPos = 250 + (idx * 260);
      return { 
        x: isEven ? "45%" : "75%", 
        y: yPos,
        cssY: `${yPos}px`
      };
    }
  };

  const activePathCoordinates = city.chapters.map((_, idx) => getResponsiveCoordinates(idx));
  
  // Dynamically calculate exact required height to prevent any clipping at the bottom
  const mobileHeight = Math.max(800, 300 + (totalChapters * 240));
  const desktopHeight = Math.max(
    typeof window !== 'undefined' ? window.innerHeight : 900,
    350 + (totalChapters * 260)
  );

  return (
    <div className="relative w-full h-[100dvh] bg-[#070504] overflow-hidden select-none font-sans">
      
      {/* ── BACKGROUND LAYER (Fixed relative to viewport) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="/chapter_background.png" 
          alt="Atmospheric Realm Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-85 transition-transform duration-1000"
          onError={(e) => { (e.target as HTMLImageElement).src = "/ancient_temple_bg.jpg"; }}
        />
        {/* Subtle, restrained overlay to ensure text readability without hiding the art */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070504]/70 via-[#070504]/10 to-[#070504]/70" />
      </div>

      {/* ── HEADER NAVIGATION (Fixed top UI) ── */}
      <div className="absolute top-16 sm:top-20 inset-x-0 z-50 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button onClick={() => enterCity(null)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-earth-950/90 border border-gold-500/40 text-parchment-200 hover:text-gold-300 hover:border-gold-400 text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider transition-all backdrop-blur-md shadow-md">
            <ArrowLeft className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">World Map</span>
          </button>
          <button onClick={() => setShowPosters(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-charcoal-900/90 border border-gold-500/40 text-gold-400 hover:text-gold-300 hover:bg-gold-600/10 text-[10px] sm:text-xs font-serif font-bold uppercase tracking-wider transition-all backdrop-blur-md shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Archives</span>
          </button>
          <div className="hidden md:block ml-2">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-parchment-100 drop-shadow-md">{city.name}</span>
            </div>
            <p className="text-[10px] font-mono text-gold-400/90 drop-shadow-md">{city.era} &bull; {city.region}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          <button onClick={() => startEnterRealm(city.id)} className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-earth-950/90 border border-gold-500/30 hover:border-gold-400 text-gold-300 hover:text-gold-200 text-[10px] sm:text-xs font-serif tracking-wider uppercase transition-all backdrop-blur-md shadow-md">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold-400" />
            <span className="hidden md:inline">Prologue Vistas</span>
          </button>
          <div className="flex items-center gap-2 bg-earth-950/90 backdrop-blur-md px-3 sm:px-4 py-2 rounded-2xl border border-gold-500/30 shadow-md">
            <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <div className="text-[10px] sm:text-xs font-mono text-gold-300 font-bold">{starsEarnedInCity} / {maxPossibleStars}</div>
            <div className="w-px h-3.5 bg-earth-800 mx-0.5 sm:mx-1" />
            <div className="text-[10px] sm:text-xs font-mono text-parchment-300">{completedChaptersCount} / {totalChapters}</div>
          </div>
        </div>
      </div>

      {/* ── EXPLORE PANEL (Fixed overlay so it stays visible while levels scroll beneath it) ── */}
      {mounted && (
        <div className={`z-40 bg-[#110C0A]/95 backdrop-blur-md border border-gold-500/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden transition-all duration-700
          ${isMobile 
            ? "fixed top-28 left-4 right-4 h-24 flex-row items-center" 
            : "fixed top-[140px] left-8 w-64 lg:w-72"}`}>
          <div 
            className={`relative cursor-pointer group overflow-hidden ${isMobile ? "w-32 h-full shrink-0" : "w-full aspect-[16/9] shrink-0"}`}
            onClick={() => startEnterRealm(city.id)}
          >
            <Image 
              src={`/destinations/${city.id}-detail.png`} alt={city.name} fill 
              className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
              onError={(e) => { (e.target as HTMLImageElement).src = "/chapter_background.png"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#110C0A] via-transparent to-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-gold-400/80 bg-[#110C0A]/60 flex items-center justify-center text-gold-400 group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-earth-950 group-hover:border-transparent transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <Play className="w-3 h-3 sm:w-5 sm:h-5 ml-0.5 sm:ml-1 fill-current" />
              </div>
            </div>
          </div>
          
          <div className={`relative flex flex-col justify-center border-gold-500/10 ${isMobile ? "p-3 border-l" : "p-5 border-t"}`}>
            <div className="flex items-center justify-between mb-1 sm:mb-2 cursor-pointer group" onClick={() => startEnterRealm(city.id)}>
              <h3 className="font-serif text-sm sm:text-base text-parchment-100 font-bold tracking-wide group-hover:text-gold-400 transition-colors">
                Explore {city.name}
              </h3>
              {!isMobile && <ArrowLeft className="w-4 h-4 text-gold-400 rotate-180 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
            </div>
            <p className="text-[10px] sm:text-[11px] font-serif italic text-parchment-300/90 leading-tight">
              {city.description}
            </p>
          </div>
        </div>
      )}

      {/* ── SCROLLABLE CAMPAIGN MAP CONTAINER ── */}
      <div className="absolute inset-0 scroll-smooth overflow-y-auto overflow-x-hidden">
        <div 
          className="relative w-full" 
          style={{ height: isMobile ? `${mobileHeight}px` : `${desktopHeight}px` }}
        >

          {/* SVG Progression Path Layer */}
          {mounted && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <linearGradient id="unlockedPath" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(212, 175, 55, 0.9)" />
                  <stop offset="100%" stopColor="rgba(212, 175, 55, 0.5)" />
                </linearGradient>
              </defs>
              {city.chapters.map((ch, idx) => {
                if (idx === city.chapters.length - 1) return null;
                const nextProgress = getChapterState(city.chapters[idx + 1].id);
                const currProgress = getChapterState(ch.id);
                
                const isPathCompleted = currProgress.completed;
                const isPathActive = !currProgress.completed && currProgress.status === "unlocked";
                
                const p1 = activePathCoordinates[idx];
                const p2 = activePathCoordinates[idx + 1];

                return (
                  <g key={`path-${idx}`}>
                    {(isPathCompleted || isPathActive) && (
                      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(212, 175, 55, 0.2)" strokeWidth="8" strokeLinecap="round" />
                    )}
                    <line
                      x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                      stroke={isPathCompleted ? "url(#unlockedPath)" : isPathActive ? "rgba(212, 175, 55, 0.8)" : "rgba(120, 100, 80, 0.35)"}
                      strokeWidth={isPathCompleted ? "4" : isPathActive ? "3" : "2"}
                      strokeDasharray={isPathCompleted ? undefined : isPathActive ? "8 6" : "4 8"}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
            </svg>
          )}

          {/* Chapter Nodes */}
          {mounted && city.chapters.map((chapter, idx) => {
            const progress = getChapterState(chapter.id);
            const prevChapter = idx > 0 ? city.chapters[idx - 1] : null;
            const isCurrent = progress.status === "unlocked" && !progress.completed && (!prevChapter || getChapterState(prevChapter.id).completed);
            const coords = activePathCoordinates[idx];

            return (
              <ChapterNode
                key={chapter.id}
                chapter={chapter}
                progress={progress}
                isCurrent={isCurrent}
                onSelect={() => handleSelectChapter(chapter)}
                onLockedClick={handleLockedChapter}
                x={coords.x}
                y={coords.cssY}
              />
            );
          })}

        </div>
      </div>

      {/* Realm Mastered Banner */}
      {isCityFullyCompleted && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none z-50 px-4">
          <div className="bg-gradient-to-r from-earth-950 via-earth-900 to-earth-950 border-2 border-gold-400/80 px-6 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 text-gold-300 pointer-events-auto backdrop-blur-md">
            <Trophy className="w-5 h-5 text-gold-400" />
            <div>
              <span className="font-serif font-bold text-xs uppercase tracking-wider">Realm Mastered: {city.name}</span>
              <span className="text-[10px] font-mono text-parchment-300 block">All levels explored A {starsEarnedInCity} Stars</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Locked Feedback Modal */}
      <AnimatePresence>
        {lockedNotice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLockedNotice(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-earth-950 border-2 border-gold-500/60 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative text-center text-parchment-100" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setLockedNotice(null)} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-earth-900 text-parchment-400 hover:text-parchment-100 transition-all"><X className="w-5 h-5" /></button>
              <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-400 mx-auto mb-4"><Lock className="w-7 h-7 text-gold-500/80" /></div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-gold-400 mb-1">Level Locked</div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-parchment-100 mb-2">{lockedNotice.title}</h3>
              <p className="text-sm font-serif italic text-parchment-300 mb-4">&ldquo;{lockedNotice.locationName}&rdquo;</p>
              <div className="p-4 rounded-2xl bg-earth-900/80 border border-gold-500/30 mb-6 text-left text-xs space-y-2 text-parchment-300">
                <p>Levels in <strong>{city.name}</strong> follow an ancient sequential journey.</p>
                <p className="text-gold-300 font-semibold">Complete Level {lockedNotice.chapterNumber - 1} to unlock this location!</p>
              </div>
              <button onClick={() => setLockedNotice(null)} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-earth-950 font-serif font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-md">Understood</button>
            </motion.div>
          </motion.div>
        )}
        {showPosters && <FlyingPosters city={city} onClose={() => setShowPosters(false)} />}
      </AnimatePresence>
    </div>
  );
}
