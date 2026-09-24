"use client";

import { useState } from "react";
import { useMounted } from "@/hooks/useMounted";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA } from "@/data/gameContent";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Star, Trophy, User, Settings as SettingsIcon, Award, ShieldCheck } from "lucide-react";
import Link from "next/link";
import PassportModal from "./PassportModal";

export default function WorldHUD() {
  const mounted = useMounted();
  const [showPassport, setShowPassport] = useState(false);
  const {
    player,
    getTotalStars,
    enterCity,
    enterChapter,
    currentCityId,
    levelUpNotification,
    dismissLevelUp,
    getUnlockedPassportsCount,
  } = useGameStore();

  const totalStars = mounted ? getTotalStars() : 0;
  const unlockedPassportsCount = mounted ? getUnlockedPassportsCount() : 0;
  const xp = mounted ? player.xp : 0;
  const level = mounted ? player.level : 1;
  const title = mounted ? player.title : "Seeker of Bharat";

  // Progress to next 1000 XP boundary
  const xpInCurrentLevel = xp % 1000;
  const xpToNextLevel = 1000 - xpInCurrentLevel;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / 1000) * 100));

  const handleReturnToWorld = () => {
    enterChapter(null);
    enterCity(null);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 pointer-events-none">
      {/* Background gradient bar */}
      <div className="h-20 bg-gradient-to-b from-black/90 via-black/60 to-transparent flex items-center justify-between px-4 sm:px-8">
        
        {/* Brand & World Title */}
        <div className="flex items-center gap-3 sm:gap-6 pointer-events-auto">
          <button
            onClick={handleReturnToWorld}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus-visible:outline-none"
            title="Return to World Map"
          >
            <div className="w-10 h-10 rounded-2xl bg-earth-900/90 border border-gold-500/40 flex items-center justify-center text-gold-400 group-hover:border-gold-400 transition-all shadow-md group-hover:scale-105">
              <Compass className="w-5 h-5 animate-[spin_60s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-200 to-gold-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  DHARA
                </span>
                <span className="hidden md:inline-block text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                  World
                </span>
              </div>
              <p className="text-[10px] font-serif italic text-parchment-300/80 hidden sm:block">
                Where India&apos;s stories flow
              </p>
            </div>
          </button>
        </div>

        {/* Player Status Center / Right */}
        <div className="flex items-center gap-2 sm:gap-3.5 pointer-events-auto">
          
          {/* Global Stars Currency */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-earth-950/80 border border-gold-500/40 text-gold-300 shadow-md backdrop-blur-md">
            <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
            <div className="flex items-baseline gap-1">
              <span suppressHydrationWarning className="font-mono text-sm sm:text-base font-bold text-gold-300">
                {totalStars}
              </span>
              <span className="text-[10px] font-serif uppercase tracking-wider text-parchment-400 hidden sm:inline">
                Stars
              </span>
            </div>
          </div>

          {/* Heritage Passports Section (Right beside Star Counter) */}
          <button
            onClick={() => setShowPassport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-earth-950/80 border border-gold-500/40 hover:border-gold-400 text-gold-300 shadow-md backdrop-blur-md transition-all group cursor-pointer hover:bg-earth-900/90 active:scale-95"
            title="Dhara Heritage Passports"
          >
            <ShieldCheck className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
            <div className="flex items-baseline gap-1">
              <span suppressHydrationWarning className="font-mono text-sm sm:text-base font-bold text-gold-300">
                {unlockedPassportsCount}
              </span>
              <span className="text-[10px] font-serif uppercase tracking-wider text-parchment-400">
                / {CITIES_DATA.length}
              </span>
              <span className="text-[10px] font-serif uppercase tracking-wider text-parchment-400 hidden md:inline">
                Passports
              </span>
            </div>
          </button>

          {/* Level & XP Gauge */}
          <div className="flex flex-col bg-earth-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-gold-500/30 shadow-md min-w-[130px] sm:min-w-[170px]">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-parchment-300">
              <span suppressHydrationWarning className="text-gold-400 font-serif font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3 text-gold-400" />
                Lvl {level}
              </span>
              <span suppressHydrationWarning className="text-parchment-300 font-mono">
                {xp} XP
              </span>
            </div>
            {/* Progress bar to next 1000 XP */}
            <div className="w-full bg-earth-900 rounded-full h-1.5 mt-1 overflow-hidden border border-gold-500/20">
              <div
                className="bg-gradient-to-r from-gold-500 to-gold-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono text-parchment-400/80 mt-0.5 hidden sm:flex">
              <span suppressHydrationWarning>{title}</span>
              <span suppressHydrationWarning>{xpToNextLevel} XP to Lvl {level + 1}</span>
            </div>
          </div>

          {/* Nav Controls: World, Profile, Settings */}
          <div className="flex items-center gap-1.5">
            {currentCityId && (
              <button
                onClick={handleReturnToWorld}
                className="px-3 py-1.5 rounded-xl border border-gold-500/30 bg-earth-950/80 text-parchment-200 hover:bg-gold-500 hover:text-earth-950 text-xs font-serif font-bold uppercase tracking-wider transition-all backdrop-blur-md shadow cursor-pointer"
              >
                World
              </button>
            )}

            <Link href="/profile">
              <button
                className="p-2 rounded-xl border border-gold-500/30 bg-earth-950/80 text-parchment-300 hover:text-gold-300 hover:border-gold-400 transition-all backdrop-blur-md shadow cursor-pointer"
                title="Scholar Profile"
              >
                <User className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/settings">
              <button
                className="p-2 rounded-xl border border-gold-500/30 bg-earth-950/80 text-parchment-300 hover:text-gold-300 hover:border-gold-400 transition-all backdrop-blur-md shadow cursor-pointer"
                title="Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Level Up Celebration Banner */}
      <AnimatePresence>
        {levelUpNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-earth-950 via-earth-900 to-earth-950 border-2 border-gold-400 px-6 sm:px-8 py-3.5 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.7)] pointer-events-auto flex items-center gap-4 sm:gap-6 backdrop-blur-md"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-500 text-earth-950 flex items-center justify-center font-serif text-2xl font-bold shadow-lg">
              {levelUpNotification.newLevel}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold-400 flex items-center gap-1.5">
                <Award className="w-3 h-3 text-gold-400" />
                Level Up Achieved!
              </div>
              <div className="font-serif text-lg sm:text-xl font-bold text-parchment-100">
                {levelUpNotification.title}
              </div>
            </div>
            <button
              onClick={dismissLevelUp}
              className="px-4 py-1.5 bg-gold-500 text-earth-950 rounded-xl font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow transition-all cursor-pointer"
            >
              Claim Honor
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heritage Passport Modal */}
      <AnimatePresence>
        {showPassport && (
          <div className="pointer-events-auto">
            <PassportModal onClose={() => setShowPassport(false)} />
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
