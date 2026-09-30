"use client";

import { useMounted } from "@/hooks/useMounted";
import Link from "next/link";
import { Compass, Trophy, Star } from "lucide-react";
import { useGameStore } from "@/store/gameState";

export default function Navigation() {
  const mounted = useMounted();
  const { player, getTotalStars, enterCity, enterChapter } = useGameStore();

  const totalStars = mounted ? getTotalStars() : 0;
  const level = mounted ? player.level : 1;

  const handleReturnToWorld = () => {
    enterChapter(null);
    enterCity(null);
  };

  return (
    <nav className="bg-earth-950/95 backdrop-blur-xl border-b border-gold-500/30 sticky top-0 z-50 shadow-lg text-parchment-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between relative">
        {/* Brand Logo */}
        <Link href="/" onClick={handleReturnToWorld} className="flex items-center gap-3.5 group shrink-0 z-10">
          <img
            src="/logos/logo-gold.png"
            alt="DHARA Logo"
            className="h-11 md:h-12 w-auto object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col border-l border-gold-600/30 pl-3.5">
            <span className="font-serif text-xl md:text-2xl font-bold tracking-[0.2em] text-parchment-100 uppercase leading-none group-hover:text-gold-400 transition-colors">
              DHARA
            </span>
            <span className="text-[10px] md:text-xs font-serif italic text-gold-400/90 tracking-wide mt-1 leading-none hidden sm:block">
              Where India&apos;s stories flow
            </span>
          </div>
        </Link>

        {/* Primary Adventure Game Links (Centered) */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10 text-xs md:text-sm font-serif font-bold uppercase tracking-[0.22em] text-[#D8CCB8] absolute left-1/2 -translate-x-1/2">
          <Link
            href="/"
            onClick={handleReturnToWorld}
            className="hover:text-gold-400 transition-colors py-1"
          >
            World Map
          </Link>
          <Link href="/quest" className="hover:text-gold-400 transition-colors py-1">
            Quests
          </Link>
          <Link href="/truth-layer" className="hover:text-gold-400 transition-colors py-1">
            Truth Layer
          </Link>
          <Link href="/profile" className="hover:text-gold-400 transition-colors py-1">
            Profile
          </Link>
          <Link href="/settings" className="hover:text-gold-400 transition-colors py-1">
            Settings
          </Link>
        </div>

        {/* Player State Chip */}
        <div className="flex items-center gap-3 shrink-0 z-10 ml-auto">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-earth-900/90 border border-gold-500/30 text-gold-300 shadow-sm">
            <Star className="w-4.5 h-4.5 fill-gold-400 text-gold-400" />
            <span suppressHydrationWarning className="text-sm sm:text-base font-mono font-bold text-gold-400 leading-none">
              {totalStars} ★
            </span>
          </div>

          <Link href="/profile">
            <div className="flex items-center gap-2 bg-earth-900/90 border border-gold-500/30 px-3.5 py-2 rounded-xl hover:border-gold-400 transition-all cursor-pointer shadow-sm">
              <Trophy className="w-4 h-4 text-gold-400" />
              <span suppressHydrationWarning className="text-xs sm:text-sm font-serif font-bold text-gold-400">
                Lvl {level}
              </span>
              <span suppressHydrationWarning className="text-xs font-mono text-[#D8CCB8] hidden sm:inline">
                · {player.xp} XP
              </span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
