"use client";

import { useMounted } from "@/hooks/useMounted";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA } from "@/data/gameContent";
import Link from "next/link";
import { ArrowLeft, User, Trophy, Star, MapPin, Award, CheckCircle } from "lucide-react";
import WorldHUD from "@/components/game/WorldHUD";

export default function ProfilePage() {
  const mounted = useMounted();
  const { player, chapterProgress, getTotalStars, isCityUnlocked } = useGameStore();

  const totalStars = mounted ? getTotalStars() : 0;
  const level = mounted ? player.level : 1;
  const xp = mounted ? player.xp : 0;
  const name = mounted ? player.name : "Scholar of Bharat";
  const title = mounted ? player.title : "Novice Historian";

  // Completed chapters
  const completedChapters = mounted ? Object.values(chapterProgress).filter((c) => c.completed) : [];
  const citiesUnlockedCount = mounted ? CITIES_DATA.filter((city) => isCityUnlocked(city.id)).length : 1;

  return (
    <div className="min-h-screen bg-earth-950 text-parchment-100 flex flex-col justify-between selection:bg-gold-500/40 relative pt-24 pb-12 px-4 sm:px-6">
      <WorldHUD />

      <div className="max-w-2xl mx-auto w-full my-auto">
        <div className="p-6 sm:p-10 rounded-3xl bg-earth-900/90 border-2 border-gold-500/50 shadow-2xl relative overflow-hidden">
          {/* Background watermark */}
          <div className="absolute inset-0 opacity-5 bg-[url('/mandala.svg')] bg-center bg-no-repeat pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-earth-800 pb-5 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-earth-950 via-earth-900 to-earth-850 border-2 border-gold-400 flex items-center justify-center text-gold-400 shadow-md">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h1 suppressHydrationWarning className="font-serif text-2xl sm:text-3xl font-bold text-parchment-100">
                  {name}
                </h1>
                <p suppressHydrationWarning className="text-xs font-mono text-gold-400 uppercase tracking-widest">
                  {title}
                </p>
              </div>
            </div>

            <Link href="/">
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-earth-950/80 border border-gold-500/30 text-parchment-300 hover:text-gold-300 hover:border-gold-400 text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer">
                <ArrowLeft className="w-4 h-4 text-gold-400" />
                <span>World</span>
              </button>
            </Link>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-8">
            <div className="p-4 rounded-2xl bg-earth-950/80 border border-gold-500/25">
              <div className="text-[10px] font-mono uppercase text-parchment-400 tracking-wider mb-1 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-gold-400" />
                Player Level
              </div>
              <div suppressHydrationWarning className="font-serif text-2xl font-bold text-gold-300">
                Level {level}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-earth-950/80 border border-gold-500/25">
              <div className="text-[10px] font-mono uppercase text-parchment-400 tracking-wider mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-gold-400" />
                Total XP
              </div>
              <div suppressHydrationWarning className="font-serif text-2xl font-bold text-parchment-100">
                {xp} XP
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-earth-950/80 border border-gold-500/25">
              <div className="text-[10px] font-mono uppercase text-parchment-400 tracking-wider mb-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                Global Stars
              </div>
              <div suppressHydrationWarning className="font-serif text-2xl font-bold text-gold-400">
                {totalStars} ★
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-earth-950/80 border border-gold-500/25">
              <div className="text-[10px] font-mono uppercase text-parchment-400 tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                Cities Unlocked
              </div>
              <div suppressHydrationWarning className="font-serif text-2xl font-bold text-parchment-100">
                {citiesUnlockedCount} / {CITIES_DATA.length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-earth-950/80 border border-gold-500/25 sm:col-span-2">
              <div className="text-[10px] font-mono uppercase text-parchment-400 tracking-wider mb-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-gold-400" />
                Completed Chapters
              </div>
              <div className="font-serif text-2xl font-bold text-parchment-100">
                {completedChapters.length} / {CITIES_DATA.length * 5} Locations
              </div>
            </div>
          </div>

          <p className="text-xs text-parchment-400 text-center leading-relaxed">
            Travel through ancient cities, solve puzzle trials, and gather chapter stars to open new realms across India.
          </p>
        </div>
      </div>
    </div>
  );
}
