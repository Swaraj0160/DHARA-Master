"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA } from "@/data/gameContent";
import WorldHUD from "@/components/game/WorldHUD";
import { Camera, X, Lock, Trophy, CheckCircle2, ShieldCheck, Compass, Award, Star, ChevronLeft, ChevronRight } from "lucide-react";

import { useMounted } from "@/hooks/useMounted";

type TabType = 'passport' | 'stamps' | 'achievements' | 'timeline' | 'stats';

const TABS: { id: TabType; label: string }[] = [
  { id: 'passport', label: 'My Passport' },
  { id: 'stamps', label: 'Realm Stamps' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'stats', label: 'Stats' },
];

export default function PassportPage() {
  const { 
    player, 
    chapterProgress, 
    getTotalStars, 
    isCityUnlocked, 
    getUnlockedPassportsCount,
    setProfilePhoto,
    updatePlayerName,
    badges
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<TabType>('passport');
  const [nameInput, setNameInput] = useState(player.name || "");
  const [stampPage, setStampPage] = useState(0);
  const mounted = useMounted();

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const completedRealmsCount = useMemo(() => {
    return CITIES_DATA.filter(city => 
      city.chapters.length > 0 && city.chapters.every(ch => chapterProgress[ch.id]?.completed)
    ).length;
  }, [chapterProgress]);

  const timelineEvents = useMemo(() => {
    const events = [];
    events.push({ label: "Journey Begun", date: "Initial Stamp", icon: <Compass className="w-5 h-5" /> });

    CITIES_DATA.forEach(city => {
      if (isCityUnlocked(city.id)) {
        events.push({ label: `Visa Granted: ${city.name}`, date: `Unlocked`, icon: <ShieldCheck className="w-4 h-4" /> });
      }
      let chCompleted = 0;
      city.chapters.forEach(ch => {
        if (chapterProgress[ch.id]?.completed) {
          chCompleted++;
          events.push({ label: `Discovered: ${ch.title}`, date: `Chapter Cleared`, icon: <CheckCircle2 className="w-4 h-4" /> });
        }
      });
      if (chCompleted === city.chapters.length && city.chapters.length > 0) {
        events.push({ label: `Mastered: ${city.name}`, date: `Realm Complete`, icon: <Trophy className="w-4 h-4 text-[#8c5b36]" /> });
      }
    });
    return events;
  }, [chapterProgress, isCityUnlocked]);

  const overallProgressPct = Math.min(100, (player.xp / (player.nextLevelXP || 1000)) * 100);
  
  const realmsPerPage = 6;
  const maxStampPage = Math.ceil(CITIES_DATA.length / realmsPerPage) - 1;
  const currentRealms = CITIES_DATA.slice(stampPage * realmsPerPage, (stampPage + 1) * realmsPerPage);

  if (!mounted) return null;

  return (
    <div className="h-[100dvh] w-full bg-earth-950 flex flex-col font-sans relative selection:bg-[#b07d53]/30 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a1e16] via-earth-950 to-black opacity-80 pointer-events-none" />
      
      {/* Global Navigation - FIXED POS (It has fixed top-0 internally, so we pad the main container) */}
      <div className="relative z-50 shrink-0">
        <WorldHUD />
      </div>

      {/* Main Container - Flex bounds it safely within viewport height */}
      <main className="flex-1 flex flex-col w-full relative z-10 pt-20 overflow-hidden">
        
        {/* Book Container Area */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center px-4 sm:px-8 py-4 lg:py-6">
          
          {/* Actual Passport Book bounds - carefully capped so it never forces window scroll */}
          <div className="w-full max-w-6xl h-full max-h-[720px] relative rounded-r-2xl rounded-l-md shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] bg-[#c9b398] p-1.5 sm:p-2.5 flex flex-col lg:flex-row overflow-hidden">
            
            {/* The Leather Cover Edge */}
            <div className="absolute top-0 bottom-0 left-0 w-2 sm:w-3 bg-gradient-to-r from-[#1a110a] to-[#2c1a12] border-r border-[#4a2e1b] z-20 shadow-[2px_0_10px_rgba(0,0,0,0.5)]" />
            
            {/* Left Page (Identity & Primary Info) */}
            <div className="flex-1 min-h-0 bg-[#f4e7dc] relative p-6 sm:p-8 lg:p-10 pl-8 sm:pl-10 lg:pl-12 shadow-[-10px_0_20px_rgba(0,0,0,0.1)_inset] border-r border-[#8c5b36]/20 z-10 flex flex-col overflow-y-auto custom-scrollbar">
              
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-40 bg-[url('/noise.png')] mix-blend-multiply pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {activeTab === 'passport' ? (
                  <motion.div 
                    key="identity"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col relative min-h-min"
                  >
                    <div className="text-center mb-6 shrink-0">
                      <h2 className="font-serif text-2xl sm:text-3xl text-[#2c1a12] uppercase tracking-[0.3em] font-bold">Dhara</h2>
                      <p className="font-serif text-[#8c5b36] uppercase tracking-widest text-[10px] sm:text-xs mt-1 font-bold">Heritage Passport</p>
                      <div className="w-16 h-px bg-[#8c5b36] mx-auto mt-3" />
                    </div>

                    <div className="flex flex-col items-center flex-1 justify-center shrink-0">
                      {/* Photo Upload */}
                      <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full border-[3px] border-[#8c5b36]/40 p-1 mb-6 relative group overflow-hidden bg-[#e8dcc4] shadow-inner shrink-0">
                        <div className="w-full h-full rounded-full overflow-hidden relative flex items-center justify-center">
                          {player.profilePhoto ? (
                            <img src={player.profilePhoto} className="w-full h-full object-cover mix-blend-multiply" alt="Explorer" />
                          ) : (
                            <UserIconPlaceholder />
                          )}
                          <div className="absolute inset-0 bg-[#2c1a12]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-[#f4e7dc]" />
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        </div>
                        {player.profilePhoto && (
                          <button 
                            onClick={(e) => { e.preventDefault(); setProfilePhoto(undefined); }}
                            className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-red-900/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white shadow-md z-20"
                            title="Remove Photo"
                          >
                            <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        )}
                      </div>

                      {/* Name & Title */}
                      <div className="w-full max-w-sm flex flex-col items-center mb-6 shrink-0">
                        <input 
                          value={nameInput}
                          onChange={e => setNameInput(e.target.value)}
                          onBlur={() => updatePlayerName(nameInput.trim() || "Explorer")}
                          className="w-full text-center bg-transparent border-b border-[#8c5b36]/30 hover:border-[#8c5b36] focus:border-[#8c5b36] transition-colors outline-none font-serif text-lg sm:text-xl lg:text-2xl text-[#2c1a12] font-bold pb-1 placeholder:text-[#2c1a12]/30 uppercase tracking-widest"
                          placeholder="ENTER NAME"
                        />
                        <p className="font-serif italic text-[#8c5b36] mt-2 text-[11px] sm:text-xs lg:text-sm">{player.title}</p>
                      </div>

                      {/* Level & XP */}
                      <div className="w-full grid grid-cols-2 gap-4 border-t border-b border-[#8c5b36]/20 py-4 shrink-0">
                        <div className="text-center border-r border-[#8c5b36]/20 flex flex-col justify-center">
                          <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mb-1">Level</p>
                          <p className="font-serif text-2xl sm:text-3xl text-[#2c1a12] font-bold">{player.level}</p>
                        </div>
                        <div className="text-center flex flex-col justify-center">
                          <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mb-1">Total Experience</p>
                          <p className="font-mono text-sm sm:text-base lg:text-lg text-[#2c1a12] font-bold mt-1">
                            {player.xp.toLocaleString()} <span className="text-[10px] sm:text-xs text-[#8c5b36]">XP</span>
                          </p>
                          <div className="w-[85%] mx-auto mt-2 h-1.5 bg-[#d6c4a4] rounded-full overflow-hidden">
                            <div className="h-full bg-[#8c5b36]" style={{ width: `${overallProgressPct}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`left-${activeTab}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col relative min-h-min"
                  >
                    <DynamicLeftContent 
                      activeTab={activeTab} 
                      stats={{ 
                        unlocked: getUnlockedPassportsCount(), 
                        mastered: completedRealmsCount,
                        stars: getTotalStars(),
                        level: player.level,
                        xp: player.xp,
                        overallProgressPct
                      }} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Book Spine (Desktop) */}
            <div className="hidden lg:block w-8 shrink-0 bg-gradient-to-r from-[#d6c4a4] via-[#b89f7a] to-[#d6c4a4] shadow-[inset_0_0_15px_rgba(0,0,0,0.3)] z-0" />

            {/* Right Page (Realm Stamps & Secondary Info) */}
            <div className="flex-1 min-h-0 bg-[#fdfbf7] relative p-6 sm:p-8 lg:p-10 shadow-[10px_0_20px_rgba(0,0,0,0.05)_inset] z-10 flex flex-col overflow-y-auto custom-scrollbar">
              
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-30 bg-[url('/noise.png')] mix-blend-multiply pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {(activeTab === 'passport' || activeTab === 'stamps') ? (
                  <motion.div 
                    key="stamps"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col relative min-h-min"
                  >
                    <div className="flex items-center justify-between mb-4 sm:mb-6 shrink-0">
                      <h3 className="font-serif text-[#2c1a12] text-base sm:text-lg lg:text-xl tracking-widest uppercase font-bold">Visas & Stamps</h3>
                      <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#8c5b36] opacity-50" />
                    </div>

                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 content-start shrink-0">
                      {currentRealms.map((city) => {
                        const unlocked = isCityUnlocked(city.id);
                        const completedCount = city.chapters.filter(ch => chapterProgress[ch.id]?.completed).length;
                        const isCompleted = completedCount === city.chapters.length && city.chapters.length > 0;
                        
                        return (
                          <div key={city.id} className="aspect-[3/4] relative group">
                            {unlocked ? (
                              <div className="w-full h-full p-1.5 sm:p-2 border-[1.5px] border-[#8c5b36]/30 bg-[#f4e7dc]/50 shadow-sm flex flex-col items-center justify-between rounded-sm">
                                <div className="w-full aspect-[4/3] overflow-hidden rounded-[2px] mb-1.5 sm:mb-2 border border-[#8c5b36]/20 relative">
                                  <img 
                                    src={`/destinations/${city.id}-hero.png`} 
                                    alt={city.name}
                                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isCompleted ? 'grayscale-0' : 'grayscale-[50%] sepia-[20%]'}`}
                                    onError={(e) => { e.currentTarget.src = '/passport-bg.png'; }}
                                  />
                                  {isCompleted && (
                                    <div className="absolute inset-0 ring-2 ring-inset ring-[#8c5b36]/40 pointer-events-none" />
                                  )}
                                </div>
                                <div className="text-center w-full">
                                  <h4 className="font-serif text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-[#2c1a12] line-clamp-1 leading-tight">{city.name}</h4>
                                  <p className="font-mono text-[7.5px] sm:text-[8px] text-[#8c5b36] font-bold mt-1">
                                    {completedCount} / {city.chapters.length} CH.
                                  </p>
                                </div>
                                {isCompleted && (
                                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 border-2 border-red-800/80 rounded-full flex items-center justify-center text-red-800/80 transform rotate-[15deg] bg-transparent mix-blend-multiply shadow-sm">
                                    <span className="text-[4.5px] sm:text-[5px] font-bold uppercase tracking-widest text-center leading-tight bg-[#fdfbf7]/80 px-0.5 rounded-sm backdrop-blur-[2px]">Mastered</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="w-full h-full p-2 border-[1.5px] border-dashed border-[#8c5b36]/20 bg-transparent flex flex-col items-center justify-center rounded-sm">
                                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#8c5b36]/40 mb-2" />
                                <span className="font-serif text-[8.5px] uppercase tracking-widest text-[#8c5b36]/60 font-bold text-center leading-tight">Undiscovered<br/>Realm</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {maxStampPage > 0 && (
                      <div className="mt-4 sm:mt-6 flex items-center justify-center gap-4 sm:gap-6 border-t border-[#8c5b36]/20 pt-3 shrink-0">
                        <button 
                          onClick={() => setStampPage(p => Math.max(0, p - 1))}
                          disabled={stampPage === 0}
                          className="p-1 sm:p-1.5 hover:bg-[#8c5b36]/10 rounded-full disabled:opacity-30 transition-colors text-[#2c1a12]"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <span className="font-mono text-[10px] sm:text-xs text-[#2c1a12] font-bold tracking-widest">
                          PAGE {stampPage + 1} / {maxStampPage + 1}
                        </span>
                        <button 
                          onClick={() => setStampPage(p => Math.min(maxStampPage, p + 1))}
                          disabled={stampPage === maxStampPage}
                          className="p-1 sm:p-1.5 hover:bg-[#8c5b36]/10 rounded-full disabled:opacity-30 transition-colors text-[#2c1a12]"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`right-${activeTab}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col relative min-h-min"
                  >
                    <DynamicRightContent 
                      activeTab={activeTab} 
                      badges={badges}
                      timelineEvents={timelineEvents}
                      stats={{
                        chaptersCleared: CITIES_DATA.reduce((acc, c) => acc + c.chapters.filter(ch => chapterProgress[ch.id]?.completed).length, 0),
                        totalHonors: badges.length,
                        stars: getTotalStars(),
                        unlocked: getUnlockedPassportsCount()
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* The Right Page Edge */}
            <div className="absolute top-0 bottom-0 right-0 w-2 sm:w-3 bg-gradient-to-l from-[#d6c4a4] to-transparent z-20 pointer-events-none" />
          </div>
        </div>

        {/* Footer Navigation Tabs - Now elegantly contained inside the main layout, 1 row on desktop */}
        <footer className="shrink-0 bg-charcoal-900/95 backdrop-blur-md border-t border-[#8c5b36]/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20 relative h-[72px] sm:h-[80px] flex items-center justify-center">
          <div className="w-full max-w-5xl mx-auto px-4 flex flex-nowrap items-center justify-between sm:justify-center overflow-x-auto gap-3 sm:gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setStampPage(0); }}
                className={`shrink-0 px-4 sm:px-6 py-2.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold transition-all whitespace-nowrap border ${
                  activeTab === tab.id 
                    ? 'bg-[#2c1a12] text-[#f4e7dc] border-[#8c5b36] shadow-[0_4px_15px_rgba(140,91,54,0.25)]' 
                    : 'bg-transparent text-[#d6c4a4]/60 border-transparent hover:text-[#d6c4a4] hover:border-[#8c5b36]/30 hover:bg-[#8c5b36]/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// Subcomponents for Dynamic Content Pages
// ----------------------------------------------------------------------

function DynamicLeftContent({ activeTab, stats }: { activeTab: TabType, stats: { unlocked: number, mastered: number, stars: number, level: number, xp: number, overallProgressPct: number } }) {
  if (activeTab === 'achievements') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center my-auto min-h-[300px]">
        <Award className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-[#8c5b36] mb-4 sm:mb-6 opacity-90 drop-shadow-sm" />
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold uppercase tracking-widest text-[#2c1a12] mb-3 sm:mb-4">Official Honors</h2>
        <div className="w-16 sm:w-20 lg:w-24 h-[2px] bg-[#8c5b36]/40 mx-auto mb-4 sm:mb-6" />
        <p className="text-[11px] sm:text-xs lg:text-sm font-serif italic text-[#2c1a12]/80 max-w-sm px-4">
          Imperial seals awarded for outstanding discovery, intellectual mastery, and the preservation of our living heritage.
        </p>
      </div>
    );
  }
  
  if (activeTab === 'timeline') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center my-auto min-h-[300px]">
        <Compass className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-[#8c5b36] mb-4 sm:mb-6 opacity-90 drop-shadow-sm" />
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold uppercase tracking-widest text-[#2c1a12] mb-3 sm:mb-4">Travel History</h2>
        <div className="w-16 sm:w-20 lg:w-24 h-[2px] bg-[#8c5b36]/40 mx-auto mb-4 sm:mb-6" />
        <p className="text-[11px] sm:text-xs lg:text-sm font-serif italic text-[#2c1a12]/80 max-w-sm px-4">
          A chronological ledger of your physical explorations and historic encounters across the ancient realms.
        </p>
      </div>
    );
  }
  
  if (activeTab === 'stats') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center my-auto min-h-[300px]">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold uppercase tracking-widest text-[#2c1a12] mb-6 sm:mb-8 lg:mb-10">Explorer Analytics</h2>
        <div className="w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[300px] mb-6 sm:mb-8">
          <div className="flex justify-between text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-widest text-[#2c1a12] mb-2 sm:mb-3">
            <span>Level {stats.level}</span>
            <span>{stats.xp.toLocaleString()} XP</span>
          </div>
          <div className="w-full h-2.5 sm:h-3 lg:h-4 bg-[#e8dcc4] rounded-full overflow-hidden border-2 border-[#8c5b36]/30 shadow-inner">
            <div className="h-full bg-[#8c5b36] transition-all duration-1000" style={{ width: `${stats.overallProgressPct}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 w-full">
           <div className="text-center">
             <p className="font-mono text-2xl sm:text-3xl lg:text-4xl text-[#2c1a12] font-bold">{stats.unlocked}</p>
             <p className="text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-1.5 sm:mt-2">Visas Granted</p>
           </div>
           <div className="text-center">
             <p className="font-mono text-2xl sm:text-3xl lg:text-4xl text-[#2c1a12] font-bold">{stats.mastered}</p>
             <p className="text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-1.5 sm:mt-2">Realms Mastered</p>
           </div>
        </div>
      </div>
    );
  }

  return null;
}

function DynamicRightContent({ activeTab, badges, timelineEvents, stats }: { activeTab: TabType, badges: { id: string, name: string, description?: string, icon: React.ReactNode }[], timelineEvents: { label: string, date: string, icon: React.ReactNode }[], stats: { chaptersCleared: number, totalHonors: number, stars?: number, unlocked?: number } }) {
  if (activeTab === 'achievements') {
    return (
      <div className="h-full flex flex-col pr-1 sm:pr-2">
        {badges.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#2c1a12]/60 text-center my-auto min-h-[250px]">
            <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 mb-4 opacity-30" />
            <p className="text-xs sm:text-sm lg:text-base font-serif italic">No honors recorded yet.<br/>Your journey awaits.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 pb-6 pt-2">
            {badges.map(b => (
               <div key={b.id} className="flex flex-col items-center text-center group cursor-default">
                 <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-[#f4e7dc] border-[2px] border-[#8c5b36] flex items-center justify-center shadow-sm mb-2 sm:mb-3 text-xl sm:text-2xl lg:text-3xl transition-transform group-hover:scale-110 group-hover:bg-[#fffdfa] group-hover:shadow-md group-hover:border-[#6a4224]">
                   {b.icon}
                 </div>
                 <h4 className="font-serif font-bold text-[#2c1a12] text-[9px] sm:text-[10px] lg:text-xs uppercase tracking-wider">{b.name}</h4>
                 {b.description && <p className="text-[7.5px] sm:text-[8px] lg:text-[9px] text-[#2c1a12]/70 mt-1 uppercase max-w-[140px] font-bold leading-tight">{b.description}</p>}
               </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'timeline') {
    return (
      <div className="h-full relative pl-4 sm:pl-6 pb-6 pr-2 pt-2">
        <div className="absolute left-8 sm:left-10 top-4 bottom-4 w-[2px] bg-[#8c5b36]/30" />
        <div className="flex flex-col gap-3 sm:gap-5 relative z-10">
          {timelineEvents.map((evt, i) => (
            <div key={i} className="flex gap-4 sm:gap-6 items-start">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f4e7dc] border-[2px] border-[#8c5b36] flex items-center justify-center text-[#8c5b36] shrink-0 shadow-sm mt-0.5 relative z-10 bg-white">
                {evt.icon}
              </div>
              <div className="pt-1 bg-white/40 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-[#8c5b36]/20 w-full shadow-sm backdrop-blur-[2px]">
                <h4 className="font-serif font-bold text-[#2c1a12] text-[10px] sm:text-xs lg:text-sm uppercase tracking-wider">{evt.label}</h4>
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] font-mono text-[#8c5b36] font-bold uppercase mt-1">{evt.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'stats') {
    return (
      <div className="h-full flex items-center justify-center pb-6 pt-2 my-auto min-h-[250px]">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:gap-6 w-full px-1 sm:px-4 lg:px-6">
           <div className="bg-[#f4e7dc]/40 p-3 sm:p-5 lg:p-6 rounded-xl border-[1.5px] border-[#8c5b36]/30 text-center flex flex-col items-center shadow-sm">
             <Star className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#8c5b36] mb-2 sm:mb-3 opacity-90" />
             <p className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2c1a12]">{stats.stars || 0}</p>
             <p className="text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-1.5 sm:mt-2">Stars Earned</p>
           </div>
           <div className="bg-[#f4e7dc]/40 p-3 sm:p-5 lg:p-6 rounded-xl border-[1.5px] border-[#8c5b36]/30 text-center flex flex-col items-center shadow-sm">
             <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#8c5b36] mb-2 sm:mb-3 opacity-90" />
             <p className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2c1a12]">{stats.unlocked || 0}</p>
             <p className="text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-1.5 sm:mt-2">Realm Visas</p>
           </div>
           <div className="bg-[#f4e7dc]/40 p-3 sm:p-5 lg:p-6 rounded-xl border-[1.5px] border-[#8c5b36]/30 text-center flex flex-col items-center shadow-sm">
             <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#8c5b36] mb-2 sm:mb-3 opacity-90" />
             <p className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2c1a12]">{stats.chaptersCleared || 0}</p>
             <p className="text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-1.5 sm:mt-2">Chapters Cleared</p>
           </div>
           <div className="bg-[#f4e7dc]/40 p-3 sm:p-5 lg:p-6 rounded-xl border-[1.5px] border-[#8c5b36]/30 text-center flex flex-col items-center shadow-sm">
             <Trophy className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-[#8c5b36] mb-2 sm:mb-3 opacity-90" />
             <p className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2c1a12]">{stats.totalHonors || 0}</p>
             <p className="text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-1.5 sm:mt-2">Total Honors</p>
           </div>
        </div>
      </div>
    );
  }

  return null;
}

// ----------------------------------------------------------------------
// Icon Fallback
// ----------------------------------------------------------------------
function UserIconPlaceholder() {
  return (
    <svg className="w-full h-full text-[#8c5b36]/30" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20.2C9.5 20.2 7.29 18.92 6 16.98C6.03 14.99 10 13.9 12 13.9C13.99 13.9 17.97 14.99 18 16.98C16.71 18.92 14.5 20.2 12 20.2Z" />
    </svg>
  );
}
