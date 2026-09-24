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
    <nav className="bg-earth-950 border-b border-gold-500/40 sticky top-0 z-50 shadow-md text-parchment-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" onClick={handleReturnToWorld} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-earth-900 border border-gold-500/40 flex items-center justify-center text-gold-400 group-hover:border-gold-400 transition-colors shadow">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-wider text-parchment-100">
              DHARA
            </span>
            <span className="text-[9px] font-serif italic text-gold-400/80 -mt-1 hidden sm:block">
              Where India&apos;s stories flow
            </span>
          </div>
        </Link>

        {/* Primary Adventure Game Links */}
        <div className="flex items-center gap-6 text-xs font-serif font-bold uppercase tracking-wider text-parchment-300">
          <Link
            href="/"
            onClick={handleReturnToWorld}
            className="hover:text-gold-400 transition-colors"
          >
            World Map
          </Link>
          <Link href="/profile" className="hover:text-gold-400 transition-colors">
            Profile
          </Link>
          <Link href="/settings" className="hover:text-gold-400 transition-colors">
            Settings
          </Link>
        </div>

        {/* Player State Chip */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-earth-900/90 border border-gold-500/30 text-gold-300">
            <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
            <span suppressHydrationWarning className="text-[11px] font-mono font-bold text-gold-300">
              {totalStars} ★
            </span>
          </div>

          <Link href="/profile">
            <div className="flex items-center gap-2 bg-earth-900/90 border border-gold-500/30 px-3 py-1 rounded-full hover:border-gold-400 transition-all cursor-pointer">
              <Trophy className="w-3.5 h-3.5 text-gold-400" />
              <span suppressHydrationWarning className="text-[11px] font-mono font-bold text-gold-300">
                Lvl {level}
              </span>
              <span suppressHydrationWarning className="text-[11px] font-mono text-parchment-300 hidden sm:inline">
                · {player.xp} XP
              </span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
