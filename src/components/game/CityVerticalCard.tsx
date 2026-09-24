"use client";

import { City } from "@/data/gameContent";
import { motion } from "framer-motion";
import { Lock, Star, ArrowRight, Compass, CheckCircle2 } from "lucide-react";

interface CityVerticalCardProps {
  city: City;
  isUnlocked: boolean;
  starsEarned: number;
  maxStars: number;
  completedChapters: number;
  totalChapters: number;
  totalGlobalStars: number;
  onSelect: () => void;
  onLockedClick: (city: City) => void;
}

// Visual and cultural themes for each ancient realm
const CITY_THEMES: Record<
  string,
  {
    themeGradient: string;
    glowColor: string;
    borderAccent: string;
    tagline: string;
    badgeBg: string;
    accentColor: string;
  }
> = {
  pataliputra: {
    themeGradient: "from-emerald-950/80 via-earth-950/95 to-earth-950",
    glowColor: "rgba(16, 185, 129, 0.25)",
    borderAccent: "border-emerald-500/30 group-hover:border-emerald-400/70",
    tagline: "Seat of Imperial Assemblies",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    accentColor: "text-emerald-400",
  },
  hampi: {
    themeGradient: "from-amber-950/80 via-earth-950/95 to-earth-950",
    glowColor: "rgba(245, 158, 11, 0.25)",
    borderAccent: "border-amber-500/30 group-hover:border-amber-400/70",
    tagline: "The City of Victory",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    accentColor: "text-amber-400",
  },
  varanasi: {
    themeGradient: "from-orange-950/85 via-earth-950/95 to-earth-950",
    glowColor: "rgba(234, 88, 12, 0.3)",
    borderAccent: "border-gold-500/40 group-hover:border-gold-400/80",
    tagline: "The Eternal City of Light",
    badgeBg: "bg-gold-500/20 text-gold-300 border-gold-500/40",
    accentColor: "text-gold-400",
  },
  konark: {
    themeGradient: "from-yellow-950/80 via-earth-950/95 to-earth-950",
    glowColor: "rgba(234, 179, 8, 0.25)",
    borderAccent: "border-yellow-500/30 group-hover:border-yellow-400/70",
    tagline: "Chariot of the Sun God",
    badgeBg: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    accentColor: "text-yellow-400",
  },
  madurai: {
    themeGradient: "from-indigo-950/85 via-earth-950/95 to-earth-950",
    glowColor: "rgba(99, 102, 241, 0.25)",
    borderAccent: "border-indigo-500/30 group-hover:border-indigo-400/70",
    tagline: "Pandyan Sangam Capital",
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    accentColor: "text-indigo-400",
  },
};

export default function CityVerticalCard({
  city,
  isUnlocked,
  starsEarned,
  maxStars,
  completedChapters,
  totalChapters,
  totalGlobalStars,
  onSelect,
  onLockedClick,
}: CityVerticalCardProps) {
  const theme = CITY_THEMES[city.id] || {
    themeGradient: "from-earth-900/80 via-earth-950/95 to-earth-950",
    glowColor: "rgba(212, 175, 55, 0.2)",
    borderAccent: "border-gold-500/30 group-hover:border-gold-400/60",
    tagline: city.subtitle,
    badgeBg: "bg-gold-500/20 text-gold-300 border-gold-500/40",
    accentColor: "text-gold-400",
  };

  const isCompleted = starsEarned > 0 && starsEarned === maxStars;
  const neededStars = Math.max(0, city.requiredStars - totalGlobalStars);
  const completionPercent = maxStars > 0 ? Math.round((starsEarned / maxStars) * 100) : 0;

  const handleClick = () => {
    if (isUnlocked) {
      onSelect();
    } else {
      onLockedClick(city);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleClick}
      className={`group relative w-[290px] sm:w-[320px] md:w-[330px] h-[560px] sm:h-[590px] shrink-0 rounded-3xl p-6 flex flex-col justify-between cursor-pointer select-none overflow-hidden transition-all duration-300 shadow-2xl backdrop-blur-xl border ${
        isUnlocked
          ? `bg-gradient-to-b ${theme.themeGradient} ${theme.borderAccent} shadow-[0_15px_40px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_50px_${theme.glowColor}]`
          : "bg-gradient-to-b from-stone-950/90 via-[#100c0a] to-[#0a0706] border-stone-800/80 opacity-80 hover:opacity-100 hover:border-gold-500/40"
      }`}
    >
      {/* Ambient background glow & radial highlight */}
      <div
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 opacity-20 group-hover:opacity-40"
        style={{ backgroundColor: theme.glowColor }}
      />

      {/* Decorative Traditional Corner Accents */}
      <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-gold-500/40 rounded-tl pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-gold-500/40 rounded-tr pointer-events-none" />
      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-gold-500/40 rounded-bl pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-gold-500/40 rounded-br pointer-events-none" />

      {/* ── CARD TOP BAR ── */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono tracking-widest uppercase text-parchment-400/80 px-2.5 py-1 rounded-full bg-black/40 border border-white/5">
          {city.era}
        </span>

        {isUnlocked ? (
          isCompleted ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-gold-400" />
              <span>COMPLETED</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>UNLOCKED</span>
            </span>
          )
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider bg-stone-900/90 text-gold-400 border border-gold-500/30 shadow">
            <Lock className="w-3 h-3 text-gold-500" />
            <span>{city.requiredStars}★ NEEDED</span>
          </span>
        )}
      </div>

      {/* ── CARD CENTERPIECE (Artwork, Emblem, Titles) ── */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto">
        {/* Emblem Avatar Container */}
        <div className="relative mb-5">
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-5xl sm:text-6xl relative transition-transform duration-500 group-hover:scale-105 border ${
              isUnlocked
                ? "bg-gradient-to-br from-black/80 via-earth-900/90 to-earth-950 border-gold-500/50 shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:border-gold-400"
                : "bg-stone-900/90 border-stone-700/60 shadow-lg text-stone-500"
            }`}
          >
            {isUnlocked ? (
              <>
                <span className="drop-shadow-lg">{city.artwork}</span>
                {/* Radial shimmer ring */}
                <div className="absolute inset-0 rounded-3xl border border-gold-400/20 animate-pulse pointer-events-none" />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-stone-400">
                <Lock className="w-10 h-10 text-stone-500 mb-1" />
                <span className="text-[9px] font-mono tracking-widest text-stone-500 uppercase">Sealed</span>
              </div>
            )}
          </div>

          {/* Quick Star Counter Badge on Emblem */}
          {isUnlocked && (
            <div className="absolute -bottom-2.5 inset-x-0 flex justify-center">
              <div className="px-3 py-0.5 rounded-full bg-earth-950 border border-gold-500/60 text-gold-300 text-[10px] font-mono flex items-center gap-1 shadow-md">
                <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                <span>{starsEarned} / {maxStars}</span>
              </div>
            </div>
          )}
        </div>

        {/* City Name Display */}
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-parchment-100 group-hover:text-gold-200 transition-colors uppercase">
          {city.name}
        </h3>

        {/* Region & Cultural Subtitle */}
        <p className="text-xs font-serif italic text-gold-300/90 mt-1 max-w-[260px] line-clamp-1">
          &ldquo;{city.subtitle}&rdquo;
        </p>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-mono text-parchment-400/90">
          <Compass className="w-3 h-3 text-gold-400" />
          <span>{city.region}</span>
        </div>

        {/* Lore Excerpt */}
        <p className="text-[12px] font-sans text-parchment-300/80 line-clamp-3 mt-3 px-2 leading-relaxed">
          {city.description}
        </p>
      </div>

      {/* ── CARD BOTTOM (Progress & Action CTA) ── */}
      <div className="relative z-10 flex flex-col gap-3 pt-3 border-t border-white/5">
        {/* Progress Metrics Bar (Unlocked) */}
        {isUnlocked ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-parchment-400">Chapters Completed</span>
              <span className="text-gold-300 font-bold">
                {completedChapters} / {totalChapters}
              </span>
            </div>
            {/* Multi-step chapter dots / bar */}
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-1">
            <p className="text-[11px] font-mono text-stone-400">
              Need <span className="text-gold-300 font-bold">{neededStars} more ★</span> to unlock this realm
            </p>
          </div>
        )}

        {/* Primary Action Button */}
        {isUnlocked ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-earth-950 font-serif font-bold text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(212,175,55,0.4)] group-hover:shadow-[0_0_35px_rgba(212,175,55,0.7)] group-hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ENTER REALM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLockedClick(city);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-stone-900/90 border border-stone-700/80 text-stone-400 hover:text-gold-300 hover:border-gold-500/50 font-serif text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-gold-500/80" />
            <span>SEALED REALM</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
