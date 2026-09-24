"use client";

import { useState } from "react";
import { City } from "@/data/gameContent";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Star, Compass, ArrowRight } from "lucide-react";

interface CityNodeProps {
  city: City;
  isUnlocked: boolean;
  starsEarned: number;
  maxStars: number;
  onSelect: () => void;
  onLockedClick: (city: City) => void;
}

export default function CityNode({
  city,
  isUnlocked,
  starsEarned,
  maxStars,
  onSelect,
  onLockedClick,
}: CityNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = starsEarned > 0 && starsEarned === maxStars;

  const handleClick = () => {
    if (isUnlocked) {
      onSelect();
    } else {
      onLockedClick(city);
    }
  };

  return (
    <div
      style={{
        left: `${city.coordinates.x}%`,
        top: `${city.coordinates.y}%`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── GROUND BEACON ON THE MAP COORDINATE ── */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 pointer-events-none">
        {/* Radiating pulsating sonar ring */}
        {isUnlocked && (
          <div className="w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-gold-400/80 animate-ping opacity-60" />
        )}
        {/* Precise pinpoint dot */}
        <div
          className={`w-3.5 h-3.5 rounded-full -ml-[7px] -mt-[7px] border-2 shadow-lg ${
            isUnlocked
              ? "bg-gold-400 border-earth-950 shadow-[0_0_12px_rgba(212,175,55,0.9)]"
              : "bg-stone-600 border-stone-900"
          }`}
        />
      </div>

      {/* ── MAIN INTERACTIVE PIN BADGE ── */}
      <motion.div
        whileHover={{ scale: 1.08, y: -4 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        onClick={handleClick}
        className="flex flex-col items-center cursor-pointer relative"
      >
        {/* Antique Seal Badge with Arrow Pointer */}
        <div className="relative flex flex-col items-center">
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl relative transition-all duration-300 border-2 shadow-2xl ${
              isUnlocked
                ? "bg-gradient-to-tr from-earth-950 via-[#26150d] to-earth-900 border-gold-400 text-parchment-100 shadow-[0_0_20px_rgba(212,175,55,0.5)] group-hover:border-gold-300 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.85)]"
                : "bg-stone-950/90 border-stone-700/80 text-stone-500 opacity-75 group-hover:opacity-100"
            }`}
          >
            {isUnlocked ? (
              <span className="drop-shadow-md">{city.artwork}</span>
            ) : (
              <Lock className="w-5 h-5 text-stone-400" />
            )}

            {/* Quick Star Counter Laurel on Pin */}
            {isUnlocked && (
              <div
                className={`absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-earth-950 border shadow-md flex items-center gap-0.5 text-[9px] font-mono ${
                  isCompleted ? "border-gold-300 text-gold-200" : "border-gold-500/60 text-gold-300"
                }`}
              >
                <Star className="w-2.5 h-2.5 fill-gold-400 text-gold-400" />
                <span>
                  {starsEarned}/{maxStars}
                </span>
              </div>
            )}

            {!isUnlocked && (
              <div className="absolute -bottom-2 px-1.5 py-0.2 rounded-full bg-stone-900 border border-stone-600 text-[8px] font-mono text-stone-300 flex items-center gap-0.5 shadow">
                <Lock className="w-2 h-2 text-gold-500" />
                <span>{city.requiredStars}★</span>
              </div>
            )}
          </div>

          {/* Pointer Triangle Arrow pointing down to the map location */}
          <div
            className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-[1px] ${
              isUnlocked ? "border-t-gold-400" : "border-t-stone-700"
            }`}
          />
        </div>

        {/* Location Title Ribbon */}
        <div
          className={`mt-1 px-2.5 py-0.5 rounded-xl text-center transition-all backdrop-blur-md shadow-lg border ${
            isUnlocked
              ? "bg-earth-950/90 border-gold-500/50 group-hover:border-gold-400 group-hover:bg-earth-900/95 text-parchment-100"
              : "bg-stone-950/85 border-stone-700/60 text-stone-400"
          }`}
        >
          <div className="font-serif text-[11px] sm:text-xs font-bold tracking-wider uppercase whitespace-nowrap">
            {city.name}
          </div>
        </div>

        {/* ── EXPANDED HISTORICAL DOSSIER TOOLTIP ON HOVER ── */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-2xl bg-earth-950/95 border-2 border-gold-500/70 shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-xl z-50 text-left pointer-events-none"
            >
              <div className="flex items-center justify-between gap-1 mb-1 border-b border-gold-500/20 pb-1.5">
                <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase">
                  {city.era}
                </span>
                <span
                  className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                    isUnlocked
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-stone-800 text-stone-400 border border-stone-700"
                  }`}
                >
                  {isUnlocked ? "Available" : `${city.requiredStars}★ Required`}
                </span>
              </div>

              <h4 className="font-serif text-sm font-bold text-parchment-100 uppercase">
                {city.name}
              </h4>
              <p className="text-[11px] font-serif italic text-gold-300/90 leading-tight mb-2">
                &ldquo;{city.subtitle}&rdquo;
              </p>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-parchment-400 mb-2">
                <Compass className="w-3 h-3 text-gold-400 shrink-0" />
                <span className="truncate">{city.region}</span>
              </div>

              <p className="text-[10px] text-parchment-300/80 line-clamp-2 leading-relaxed">
                {city.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gold-400">
                <span>{isUnlocked ? "Click to enter realm" : "Accumulate stars to unlock"}</span>
                {isUnlocked && <ArrowRight className="w-3 h-3 text-gold-400" />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

