"use client";

import { Chapter } from "@/data/gameContent";
import { ChapterProgress } from "@/store/gameState";
import { motion } from "framer-motion";
import { Lock, Star, Play, Check, Sparkles } from "lucide-react";
import Image from "next/image";

interface ChapterNodeProps {
  chapter: Chapter;
  progress: ChapterProgress;
  isCurrent: boolean;
  onSelect: () => void;
  onLockedClick: (chapter: Chapter) => void;
}

// Curated authentic cultural photographs representing each chapter location
const CHAPTER_PHOTOS: Record<string, string> = {
  // Pataliputra (Mauryan & Gupta Era, 4th BCE - 5th CE)
  "pataliputra-ch1": "/chapter_torana.jpg",
  "pataliputra-ch2": "/pataliputra_ch2.jpg",
  "pataliputra-ch3": "/pataliputra_ch3.jpg",
  "pataliputra-ch4": "/pataliputra_ch4.jpg",
  "pataliputra-ch5": "/pataliputra_ch5.jpg",

  // Hampi (Vijayanagara Empire, 14th - 16th Century CE)
  "hampi-ch1": "/hampi_ch1.jpg",
  "hampi-ch2": "/hampi_ch2.jpg",
  "hampi-ch3": "/hampi_ch3.jpg",
  "hampi-ch4": "/hampi_ch4.jpg",
  "hampi-ch5": "/hampi_ch5.jpg",

  // Varanasi, Madurai, Konark: these previously pointed at Unsplash stock
  // photos matched to the wrong subject entirely (confirmed by direct
  // inspection: a beach VW van, a starry-night sailboat, a saree fashion
  // shoot, a limestone karst island, an alpine mountain range — none
  // depicting the claimed site). Rather than swap in other unverified stock
  // photos, all fall back to the local conceptual-illustration placeholder
  // until real, verified site photography is sourced (see DHARA_MASTER.md).
  // Varanasi
  "varanasi-ch1": "/ancient_temple_bg.jpg",
  "varanasi-ch2": "/ancient_temple_bg.jpg",
  "varanasi-ch3": "/ancient_temple_bg.jpg",
  "varanasi-ch4": "/ancient_temple_bg.jpg",
  "varanasi-ch5": "/ancient_temple_bg.jpg",

  // Madurai
  "madurai-ch1": "/ancient_temple_bg.jpg",
  "madurai-ch2": "/ancient_temple_bg.jpg",
  "madurai-ch3": "/ancient_temple_bg.jpg",
  "madurai-ch4": "/ancient_temple_bg.jpg",
  "madurai-ch5": "/ancient_temple_bg.jpg",

  // Konark
  "konark-ch1": "/ancient_temple_bg.jpg",
  "konark-ch2": "/ancient_temple_bg.jpg",
  "konark-ch3": "/ancient_temple_bg.jpg",
  "konark-ch4": "/ancient_temple_bg.jpg",
  "konark-ch5": "/ancient_temple_bg.jpg",
};

export default function ChapterNode({
  chapter,
  progress,
  isCurrent,
  onSelect,
  onLockedClick,
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
      style={{
        left: `${chapter.coordinates.x}%`,
        top: `${chapter.coordinates.y}%`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer select-none group"
      // Constant light popping animation for current ongoing chapter
      animate={
        isOngoing
          ? {
            scale: [1, 1.08, 0.99, 1.05, 1],
            y: [0, -6, 1, -3, 0],
            transition: {
              repeat: Infinity,
              duration: 2.2,
              ease: "easeInOut",
            },
          }
          : { scale: 1, y: 0 }
      }
      whileHover={{ scale: isLocked ? 1.02 : 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center">
        {/* ── SMALL PHOTO ABOVE CHAPTER NUMBER (ONLY IF UNLOCKED / NO IMAGE IF LOCKED) ── */}
        {!isLocked && photoUrl ? (
          <div className="relative mb-2 flex flex-col items-center">
            {/* Thumbnail Frame */}
            <div
              className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-2xl overflow-hidden border-2 shadow-xl transition-all duration-300 ${isCompleted
                ? "border-gold-400/80 shadow-xl"
                : isOngoing
                  ? "border-gold-300 shadow-xl"
                  : "border-gold-500/40"
                }`}
            >
              <Image
                src={photoUrl}
                alt={chapter.locationName}
                fill
                sizes="100px"
                className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
              {/* Soft overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

              {/* Ongoing Chapter Sparkle Badge */}
              {isOngoing && (
                <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-gold-500/90 text-earth-950 text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-0.5 shadow">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>NEXT</span>
                </div>
              )}

              {/* Completed Check Badge on Photo */}
              {isCompleted && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Glowing ripple aura for ongoing chapter */}
            {isOngoing && (
              <>
                <div className="absolute -inset-1.5 rounded-2xl border-2 border-gold-400 animate-ping opacity-35 pointer-events-none" />
                <div className="absolute -inset-1 rounded-2xl border border-gold-300 shadow-xl animate-pulse pointer-events-none" />
              </>
            )}
          </div>
        ) : isLocked ? (
          /* ── LOCKED CHAPTER: NO IMAGE SHOWN, ONLY LOCK ICON ── */
          <div className="relative mb-2">
            <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-2xl bg-stone-950/95 border-2 border-stone-800 text-stone-500 flex flex-col items-center justify-center shadow-xl opacity-80 group-hover:opacity-100 group-hover:border-stone-600 transition-all">
              <Lock className="w-6 h-6 text-stone-500 mb-0.5" />
              <span className="text-[8px] font-mono uppercase tracking-widest text-stone-500 font-bold">
                LOCKED
              </span>
            </div>
          </div>
        ) : null}

        {/* ── CHAPTER NUMBER & STATUS PILL (UNDER PHOTO) ── */}
        <div className="relative flex flex-col items-center">
          <div
            className={`px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border transition-all ${isCompleted
              ? "bg-earth-950/95 border-gold-400 text-gold-300 shadow-xl"
              : isOngoing
                ? "bg-gradient-to-r from-gold-500 to-gold-600 text-earth-950 font-bold border-gold-300 shadow-xl"
                : !isLocked
                  ? "bg-earth-900/90 border-gold-500/40 text-gold-300"
                  : "bg-stone-900/90 border-stone-700 text-stone-500"
              }`}
          >
            {isOngoing && <Play className="w-3 h-3 fill-earth-950 text-earth-950" />}
            <span className="font-serif text-xs font-bold uppercase tracking-wider">
              Chapter {chapter.chapterNumber}
            </span>
          </div>

          {/* Stars Earned pill for completed chapters */}
          {isCompleted && (
            <div className="mt-1 px-2.5 py-0.5 rounded-full bg-earth-950/90 border border-gold-500/50 shadow flex items-center gap-0.5 whitespace-nowrap">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-2.5 h-2.5 ${starIdx <= starsEarned
                    ? "fill-gold-400 text-gold-400"
                    : "text-earth-700 fill-earth-900"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── CHAPTER LOCATION NAME BANNER ── */}
        <div
          className={`mt-2 px-3 py-1 rounded-xl text-center backdrop-blur-md shadow-lg border transition-all max-w-[160px] sm:max-w-[200px] ${isCompleted
            ? "bg-earth-950/90 border-gold-500/40 text-parchment-200"
            : isOngoing
              ? "bg-earth-950/95 border-gold-400 text-gold-300 shadow-xl"
              : !isLocked
                ? "bg-earth-950/90 border-gold-500/30 text-parchment-300"
                : "bg-stone-950/85 border-stone-800 text-stone-500"
            }`}
        >
          <div className="font-serif text-[11px] sm:text-xs font-bold tracking-wide truncate">
            {isLocked ? "Uncharted Location" : chapter.locationName}
          </div>
          <div className="text-[9px] font-mono text-parchment-400/80 truncate">
            {isLocked ? "Complete previous chapters" : chapter.title}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

