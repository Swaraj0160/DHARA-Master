"use client";

import { useState } from "react";
import { useMounted } from "@/hooks/useMounted";
import { useGameStore } from "@/store/gameState";
import { useVedaStore } from "@/store/vedaStore";
import { CITIES_DATA } from "@/data/gameContent";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Star, Trophy, User, Settings as SettingsIcon, Award, ShieldCheck, ArrowLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import PassportModal from "./PassportModal";

export default function WorldHUD() {
  const mounted = useMounted();
  const router = useRouter();
  const pathname = usePathname();
  const [showPassport, setShowPassport] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  const { openVeda } = useVedaStore();

  const totalStars = mounted ? getTotalStars() : 0;
  const unlockedPassportsCount = mounted ? getUnlockedPassportsCount() : 0;
  const xp = mounted ? player.xp : 0;
  const level = mounted ? player.level : 1;
  const title = mounted ? player.title : "Seeker of Bharat";

  const xpInCurrentLevel = xp % 1000;
  const xpToNextLevel = 1000 - xpInCurrentLevel;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / 1000) * 100));

  const handleReturnToWorld = () => {
    enterChapter(null);
    enterCity(null);
    if (pathname !== "/") {
      router.push("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentCityId) {
       handleReturnToWorld();
    } else {
       router.back();
    }
  };

  const isHome = pathname === "/" && !currentCityId;

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      <div className="h-20 bg-charcoal-900/90 backdrop-blur-md border-b border-gold-600/10 flex items-center justify-between px-4 sm:px-6 shadow-sm">
        
        {/* LEFT: Brand & Back Control */}
        <div className="flex items-center gap-4 pointer-events-auto shrink-0 w-[20%]">
          {!isHome && (
            <button 
              onClick={handleBack}
              className="px-3 py-1.5 rounded-full border border-gold-500/20 text-[#D8CCB8] hover:text-white hover:border-gold-500 flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors shadow-sm bg-charcoal-800"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
          )}

          <button
            onClick={handleReturnToWorld}
            className="flex items-center gap-3 group text-left cursor-pointer focus-visible:outline-none"
            title="Return to World Map"
          >
            <div className="flex items-center justify-center transition-all group-hover:scale-105">
              <img src="/LOGO.png" alt="DHARA Logo" className="h-8 md:h-10 w-auto object-contain drop-shadow-sm invert opacity-90 group-hover:opacity-100" />
            </div>
            <div className="hidden lg:block border-l border-gold-600/20 pl-3">
              <p className="text-[10px] font-serif italic text-[#D8CCB8]/80 leading-tight">
                Where India&apos;s<br/>Heritage Flows
              </p>
            </div>
          </button>
        </div>

        {/* CENTER: Main Navigation */}
        <nav className="hidden xl:flex items-center gap-8 pointer-events-auto flex-1 justify-center">
           <button onClick={handleReturnToWorld} className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D8CCB8] hover:text-gold-500 transition-colors">World</button>
           <button onClick={() => setShowPassport(true)} className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D8CCB8] hover:text-gold-500 transition-colors">Passport</button>
           <Link href="/profile" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D8CCB8] hover:text-gold-500 transition-colors">Quests</Link>
           <button onClick={handleReturnToWorld} className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D8CCB8] hover:text-gold-500 transition-colors">Truth Layer</button>
           <button onClick={openVeda} className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#D8CCB8] hover:text-gold-500 transition-colors">VEDA</button>
        </nav>

        {/* RIGHT: Player Status */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto justify-end shrink-0 w-auto xl:w-[35%]">
          
          {/* Global Stars Currency */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-charcoal-800 border border-gold-500/20 text-gold-400 shadow-sm hidden md:flex">
            <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
            <div className="flex items-baseline gap-1">
              <span suppressHydrationWarning className="font-mono text-sm sm:text-base font-bold text-gold-500">
                {totalStars}
              </span>
            </div>
          </div>

          {/* Heritage Passports Section */}
          <button
            onClick={() => setShowPassport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-charcoal-800 border border-gold-500/20 hover:border-gold-500 text-gold-400 shadow-sm transition-all group cursor-pointer active:scale-95 hidden md:flex"
            title="Dhara Heritage Passports"
          >
            <ShieldCheck className="w-4 h-4 text-gold-500 group-hover:scale-110 transition-transform" />
            <div className="flex items-baseline gap-1">
              <span suppressHydrationWarning className="font-mono text-sm sm:text-base font-bold text-gold-500">
                {unlockedPassportsCount}
              </span>
              <span className="text-[10px] font-serif uppercase tracking-wider text-[#D8CCB8]">
                / {CITIES_DATA.length}
              </span>
            </div>
          </button>

          {/* Level & XP Gauge */}
          <div className="flex flex-col bg-charcoal-800 px-3 py-1.5 rounded-2xl border border-gold-500/20 shadow-sm min-w-[120px]">
            <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-[#D8CCB8]">
              <span suppressHydrationWarning className="text-gold-500 font-serif font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3 text-gold-500" />
                Lvl {level}
              </span>
              <span suppressHydrationWarning className="text-[#D8CCB8] font-mono">
                {xp} XP
              </span>
            </div>
            <div className="w-full bg-charcoal-900 rounded-full h-1 mt-1 overflow-hidden">
              <div
                className="bg-gradient-to-r from-gold-600 to-gold-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Nav Controls: Profile, Settings, Mobile Menu */}
          <div className="flex items-center gap-1 ml-1">
            <Link href="/profile" className="hidden sm:block">
              <button
                className="p-2 rounded-full border border-gold-500/20 bg-charcoal-800 text-[#D8CCB8] hover:text-white hover:border-gold-500 transition-all shadow-sm cursor-pointer"
                title="Scholar Profile"
              >
                <User className="w-4 h-4" />
              </button>
            </Link>

            <Link href="/settings" className="hidden sm:block">
              <button
                className="p-2 rounded-full border border-gold-500/20 bg-charcoal-800 text-[#D8CCB8] hover:text-white hover:border-gold-500 transition-all shadow-sm cursor-pointer"
                title="Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2 ml-2 rounded-full border border-gold-500/20 bg-charcoal-800 text-[#D8CCB8] hover:text-white transition-colors cursor-pointer"
            >
               <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-charcoal-900 flex flex-col items-center justify-center pointer-events-auto"
          >
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-[#D8CCB8] hover:text-white transition-colors"
            >
               <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col gap-8 text-center">
               <button onClick={() => { setMobileMenuOpen(false); handleReturnToWorld(); }} className="text-2xl font-serif uppercase tracking-widest text-gold-500 hover:text-white transition-colors">World</button>
               <button onClick={() => { setMobileMenuOpen(false); setShowPassport(true); }} className="text-2xl font-serif uppercase tracking-widest text-[#D8CCB8] hover:text-white transition-colors">Passport</button>
               <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif uppercase tracking-widest text-[#D8CCB8] hover:text-white transition-colors">Quests</Link>
               <button onClick={() => { setMobileMenuOpen(false); handleReturnToWorld(); }} className="text-2xl font-serif uppercase tracking-widest text-[#D8CCB8] hover:text-white transition-colors">Truth Layer</button>
               <button onClick={() => { setMobileMenuOpen(false); openVeda(); }} className="text-2xl font-serif uppercase tracking-widest text-[#D8CCB8] hover:text-white transition-colors">VEDA</button>
               <div className="h-px w-16 bg-white/10 mx-auto my-4" />
               <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-lg font-sans uppercase tracking-widest text-[#D8CCB8]/60 hover:text-white transition-colors">Profile</Link>
               <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="text-lg font-sans uppercase tracking-widest text-[#D8CCB8]/60 hover:text-white transition-colors">Settings</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Celebration Banner */}
      <AnimatePresence>
        {levelUpNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-[#211E1A] to-[#171513] border-2 border-gold-500 px-6 sm:px-8 py-3.5 rounded-3xl shadow-xl pointer-events-auto flex items-center gap-4 sm:gap-6 backdrop-blur-md"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-500 text-[#171513] flex items-center justify-center font-serif text-2xl font-bold shadow-lg">
              {levelUpNotification.newLevel}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold-500 flex items-center gap-1.5">
                <Award className="w-3 h-3 text-gold-500" />
                Level Up Achieved!
              </div>
              <div className="font-serif text-lg sm:text-xl font-bold text-[#F5EFE4]">
                {levelUpNotification.title}
              </div>
            </div>
            <button
              onClick={dismissLevelUp}
              className="px-4 py-1.5 bg-gold-500 text-[#171513] rounded-xl font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow transition-all cursor-pointer"
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


