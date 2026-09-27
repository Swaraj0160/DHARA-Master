"use client";

import { Chapter } from "@/data/gameContent";
import { ChapterProgress } from "@/store/gameState";
import { motion } from "framer-motion";
import { Lock, Star, Play, Sparkles } from "lucide-react";
import Image from "next/image";

interface ChapterNodeProps {
  chapter: Chapter;
  progress: ChapterProgress;
  isCurrent: boolean;
  onSelect: () => void;
  onLockedClick: (chapter: Chapter) => void;
  x: number | string;
  y: number | string;
}

const CHAPTER_PHOTOS: Record<string, string> = {
  "pataliputra-ch1": "/chapter_torana.jpg",
  "pataliputra-ch2": "/pataliputra_ch2.jpg",
  "pataliputra-ch3": "/pataliputra_ch3.jpg",
  "pataliputra-ch4": "/pataliputra_ch4.jpg",
  "pataliputra-ch5": "/pataliputra_ch5.jpg",
  "hampi-ch1": "/hampi_ch1.jpg",
  "hampi-ch2": "/hampi_ch2.jpg",
  "hampi-ch3": "/hampi_ch3.jpg",
  "hampi-ch4": "/hampi_ch4.jpg",
  "hampi-ch5": "/hampi_ch5.jpg",
};

export default function ChapterNode({
  chapter,
  progress,
  isCurrent,
  onSelect,
  onLockedClick,
  x,
  y
}: ChapterNodeProps) {
  const isLocked = progress.status === "locked";
  const isCompleted = progress.completed;
  const isOngoing = isCurrent && !isCompleted && !isLocked;
  const starsEarned = progress.stars || 0;

  const photoUrl = CHAPTER_PHOTOS[chapter.id] || "/ancient_temple_bg.jpg";

  const handleClick = () => {
    if (isLocked) {
      onLockedClick(chapter);
    } else {
      onSelect();
    }
  };

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer select-none group"
      style={{ left: typeof x === 'number' ? `${x}%` : x, top: typeof y === 'number' ? `${y}%` : y }}
      animate={
        isOngoing
          ? {
            scale: [1, 1.05, 1],
            y: [0, -4, 0],
            transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
          }
          : { scale: 1, y: 0 }
      }
      whileHover={!isLocked ? { scale: 1.05, zIndex: 30 } : {}}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center">
        
        {/* THUMBNAIL (ASPECT VIDEO FOR CINEMATIC GAME LEVEL FEEL) */}
        {!isLocked ? (
          <div className="relative flex flex-col items-center mb-2">
            <div
              className={`relative shrink-0 w-28 sm:w-36 md:w-40 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                isCompleted
                  ? "border-gold-500/80 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  : isOngoing
                    ? "border-gold-300 shadow-[0_0_25px_rgba(212,175,55,0.6)]"
                    : "border-gold-500/40 shadow-xl"
                }`}
            >
              <Image
                src={photoUrl}
                alt={chapter.locationName}
                fill
                sizes="(max-width: 768px) 112px, 160px"
                className={`object-cover object-center transition-transform duration-700 ${!isLocked ? 'group-hover:scale-110' : ''}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

              {/* Sparkle Badge */}
              {isOngoing && (
                <div className="absolute top-1 right-1 px-2 py-0.5 rounded-full bg-gold-500 text-earth-950 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-2.5 h-2.5" /> NEXT
                </div>
              )}
            </div>

            {/* Glowing ring for active */}
            {isOngoing && (
              <>
                <div className="absolute -inset-1.5 rounded-xl border-2 border-gold-400 animate-ping opacity-35 pointer-events-none" />
                <div className="absolute -inset-1 rounded-xl border border-gold-300 shadow-xl animate-pulse pointer-events-none" />
              </>
            )}
          </div>
        ) : (
          <div className="relative mb-2">
            <div className="w-28 sm:w-36 md:w-40 aspect-video rounded-xl bg-stone-950/95 border-2 border-stone-800 text-stone-500 flex flex-col items-center justify-center shadow-xl opacity-80 group-hover:opacity-100 group-hover:border-stone-600 transition-all">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-stone-500 mb-1" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 font-bold">
                LOCKED
              </span>
            </div>
          </div>
        )}

        {/* INFO PILL & TITLE */}
        <div className="relative flex flex-col items-center">
          <div
            className={`px-3 py-1 mb-2 rounded-full flex items-center gap-1.5 shadow-lg border transition-all ${
              isCompleted
                ? "bg-earth-950/95 border-gold-400 text-gold-300"
                : isOngoing
                  ? "bg-gradient-to-r from-gold-500 to-gold-600 text-earth-950 font-bold border-gold-300 shadow-xl"
                  : !isLocked
                    ? "bg-earth-900/90 border-gold-500/40 text-gold-300"
                    : "bg-stone-900/90 border-stone-700 text-stone-500"
              }`}
          >
            {isOngoing && <Play className="w-3 h-3 fill-earth-950 text-earth-950" />}
            <span className="font-serif text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              Level {chapter.chapterNumber}
            </span>
          </div>

          {isCompleted && (
            <div className="mb-2 px-2.5 py-0.5 rounded-full bg-earth-950/90 border border-gold-500/50 shadow flex items-center gap-0.5">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-2.5 h-2.5 ${starIdx <= starsEarned ? "fill-gold-400 text-gold-400" : "text-earth-700 fill-earth-900"}`}
                />
              ))}
            </div>
          )}

          <div
            className={`px-3 py-2 rounded-xl text-center backdrop-blur-md shadow-lg border transition-all w-[140px] sm:w-[180px] md:w-[220px] ${
              isCompleted
                ? "bg-earth-950/90 border-gold-500/40 text-parchment-200 group-hover:border-gold-400/80"
                : isOngoing
                  ? "bg-earth-950/95 border-gold-400 text-gold-300 shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  : !isLocked
                    ? "bg-earth-950/90 border-gold-500/30 text-parchment-300 group-hover:border-gold-500/60"
                    : "bg-stone-950/85 border-stone-800 text-stone-500"
              }`}
          >
            <div className="font-serif text-[11px] sm:text-xs md:text-[13px] font-bold tracking-wide leading-tight line-clamp-2 mb-0.5">
              {isLocked ? "Uncharted Location" : chapter.locationName}
            </div>
            <div className="text-[9px] sm:text-[10px] font-mono text-parchment-400/80 leading-tight line-clamp-2">
              {isLocked ? "Complete previous levels" : chapter.title}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
