"use client";

import { useState, useMemo } from "react";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA, City } from "@/data/gameContent";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShieldCheck, Lock, Award, Compass, Camera, CheckCircle2, Trophy, User } from "lucide-react";
import Image from "next/image";

interface PassportModalProps {
  onClose: () => void;
}

type TabType = 'passport' | 'stamps' | 'achievements' | 'timeline' | 'stats';

const TABS: { id: TabType; label: string }[] = [
  { id: 'passport', label: 'My Passport' },
  { id: 'stamps', label: 'Realm Stamps' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'stats', label: 'Stats' },
];

export default function PassportModal({ onClose }: PassportModalProps) {
  const { 
    player, 
    chapterProgress, 
    getTotalStars, 
    isCityUnlocked, 
    getUnlockedPassportsCount,
    setProfilePhoto,
    badges
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<TabType>('passport');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const timelineEvents = useMemo(() => {
    const events = [];
    events.push({ label: "Journey Begun", date: "Initial Stamp", icon: <Compass className="w-4 h-4" /> });

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
        events.push({ label: `Mastered: ${city.name}`, date: `Realm Complete`, icon: <Trophy className="w-4 h-4 text-gold-600" /> });
      }
    });
    return events;
  }, [chapterProgress, isCityUnlocked]);

  const renderCityStamp = (city: City) => {
    const unlocked = isCityUnlocked(city.id);
    const completedCount = city.chapters.filter(ch => chapterProgress[ch.id]?.completed).length;
    const total = city.chapters.length;
    const isCompleted = completedCount === total && total > 0;

    return (
      <div key={city.id} className="flex flex-col items-center text-center p-2 sm:p-3">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-2 sm:mb-3 relative overflow-hidden transition-all duration-500 shadow-md border-[3px] ${unlocked ? (isCompleted ? 'border-gold-500 scale-105' : 'border-[#8c5b36]') : 'border-[#4a2e1b]/20 bg-[#e8dcc4]/30'}`}>
           {unlocked ? (
             <img src={`/destinations/${city.id}-hero.png`} className="w-full h-full object-cover mix-blend-multiply opacity-90" alt={city.name} />
           ) : (
             <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#4a2e1b]/30" />
           )}
           {isCompleted && <div className="absolute inset-0 border-[3px] border-gold-300 rounded-full" />}
        </div>
        <h3 className={`font-serif font-bold uppercase tracking-wider text-[9px] sm:text-[10px] mb-1 ${unlocked ? 'text-[#2c1a12]' : 'text-[#4a2e1b]/40'}`}>{city.name}</h3>
        {unlocked ? (
          <p className="text-[7px] sm:text-[8px] font-mono uppercase text-[#8c5b36] tracking-widest">{completedCount}/{total} Ch</p>
        ) : (
          <p className="text-[7px] sm:text-[8px] font-mono uppercase text-[#4a2e1b]/40 tracking-widest">Locked</p>
        )}
      </div>
    );
  };

  const renderLeftPage = () => {
    switch (activeTab) {
      case 'passport':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <ShieldCheck className="w-16 h-16 sm:w-20 sm:h-20 text-[#8c5b36] mb-4 drop-shadow-md" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold uppercase tracking-widest text-[#4a2e1b] mb-2">Dhara</h1>
            <h2 className="text-sm sm:text-lg lg:text-xl font-serif tracking-widest text-[#684227] uppercase mb-6 sm:mb-8 border-b border-[#8c5b36]/30 pb-4">Heritage Passport</h2>
            <p className="text-[10px] sm:text-xs lg:text-sm font-serif italic text-[#4a2e1b]">&quot;Where India&apos;s Heritage Flows&quot;</p>
          </div>
        );
      case 'stamps':
        const half = Math.ceil(CITIES_DATA.length / 2);
        return (
          <div className="h-full flex flex-col pt-4 px-2 sm:px-4">
            <h2 className="text-lg sm:text-xl font-serif font-bold uppercase tracking-widest text-[#8c5b36] mb-4 sm:mb-6 text-center border-b border-[#8c5b36]/20 pb-4">Realm Visas</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 overflow-y-auto custom-scrollbar">
              {CITIES_DATA.slice(0, half).map(renderCityStamp)}
            </div>
          </div>
        );
      case 'achievements':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <Award className="w-12 h-12 sm:w-16 sm:h-16 text-[#8c5b36] mb-4" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-widest text-[#4a2e1b] mb-4">Official Honors</h2>
            <p className="text-[10px] sm:text-xs font-serif text-[#684227] leading-relaxed">
              Imperial seals awarded for outstanding discovery, intellectual mastery, and the preservation of Bharata&apos;s living heritage.
            </p>
            <div className="mt-8 px-6 py-3 bg-[#e8dcc4]/40 border border-[#8c5b36]/20 rounded-lg">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#8c5b36] mb-1">Total Honors Earned</p>
              <p className="text-xl sm:text-2xl font-mono text-[#2c1a12]">{badges.length}</p>
            </div>
          </div>
        );
      case 'timeline':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <Compass className="w-12 h-12 sm:w-16 sm:h-16 text-[#8c5b36] mb-4" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-widest text-[#4a2e1b] mb-4">Travel History</h2>
            <p className="text-[10px] sm:text-xs font-serif text-[#684227] leading-relaxed">
              A chronological ledger of your journey across the ancient realms.
            </p>
          </div>
        );
      case 'stats':
        return (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-widest text-[#4a2e1b] mb-8">Explorer Analytics</h2>
            <div className="w-full max-w-[200px] sm:max-w-xs">
              <div className="flex justify-between text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#8c5b36] mb-2">
                <span>Level {player.level}</span>
                <span>{player.xp} / {player.nextLevelXP} XP</span>
              </div>
              <div className="w-full h-2 sm:h-3 bg-[#e8dcc4] rounded-full overflow-hidden shadow-inner border border-[#8c5b36]/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (player.xp / player.nextLevelXP) * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#b07d53] to-[#8c5b36]" 
                />
              </div>
            </div>
          </div>
        );
    }
  };

  const renderRightPage = () => {
    switch (activeTab) {
      case 'passport':
        return (
          <div className="h-full flex flex-col justify-center px-2 sm:px-4">
            <div className="flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 flex flex-col items-center">
                <div className="relative group w-full h-full rounded-lg border-2 border-dashed border-[#8c5b36]/50 flex items-center justify-center overflow-hidden bg-[#e2c5ab]/30 cursor-pointer">
                  {player.profilePhoto ? (
                    <img src={player.profilePhoto} className="w-full h-full object-cover" alt="Explorer" />
                  ) : (
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-[#8c5b36]/50" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white mb-1" />
                    <span className="text-[7px] sm:text-[8px] uppercase text-white font-bold tracking-widest">Update</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                {player.profilePhoto && (
                  <button 
                    onClick={() => setProfilePhoto(undefined)}
                    className="mt-2 text-[8px] uppercase tracking-widest text-red-700/70 hover:text-red-700 transition-colors font-bold"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[#8c5b36] mb-1">Explorer Name</p>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold uppercase tracking-wider mb-2 sm:mb-3 text-[#2c1a12] border-b border-[#8c5b36]/20 pb-2">{player.name}</h3>
                <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[#8c5b36] mb-1">Official Title</p>
                <h4 className="text-sm sm:text-md lg:text-lg font-serif italic text-[#4a2e1b]">{player.title}</h4>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-[#e8dcc4]/40 rounded-lg border border-[#8c5b36]/10">
                <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.2em] text-[#8c5b36] mb-1">Level</p>
                <p className="text-md sm:text-lg font-mono text-[#2c1a12]">{player.level}</p>
              </div>
              <div className="p-2 sm:p-3 bg-[#e8dcc4]/40 rounded-lg border border-[#8c5b36]/10">
                <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.2em] text-[#8c5b36] mb-1">Total XP</p>
                <p className="text-md sm:text-lg font-mono text-[#2c1a12]">{player.xp}</p>
              </div>
              <div className="p-2 sm:p-3 bg-[#e8dcc4]/40 rounded-lg border border-[#8c5b36]/10">
                <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.2em] text-[#8c5b36] mb-1">Stars</p>
                <p className="text-md sm:text-lg font-mono flex items-center gap-1 text-[#2c1a12]">
                  <Star className="w-3 h-3 fill-current text-[#b87a47]" /> {getTotalStars()}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-[#e8dcc4]/40 rounded-lg border border-[#8c5b36]/10">
                <p className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.2em] text-[#8c5b36] mb-1">Explored</p>
                <p className="text-md sm:text-lg font-mono text-[#2c1a12]">{getUnlockedPassportsCount()} <span className="text-xs">/ {CITIES_DATA.length}</span></p>
              </div>
            </div>
            <p className="text-center font-serif italic text-[#4a2e1b]/80 border-t border-[#8c5b36]/20 pt-4 sm:pt-6 text-[10px] sm:text-xs">&quot;Collect stories, not just stamps.&quot;</p>
          </div>
        );
      case 'stamps':
        const half = Math.ceil(CITIES_DATA.length / 2);
        return (
          <div className="h-full flex flex-col pt-4 px-2 sm:px-4">
            <h2 className="text-lg sm:text-xl font-serif font-bold uppercase tracking-widest text-[#8c5b36] mb-4 sm:mb-6 text-center border-b border-[#8c5b36]/20 pb-4 opacity-0 md:opacity-100 hidden md:block">Realm Visas (Cont)</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 overflow-y-auto custom-scrollbar">
              {CITIES_DATA.slice(half).map(renderCityStamp)}
            </div>
          </div>
        );
      case 'achievements':
        return (
          <div className="h-full flex flex-col pt-4 px-2 sm:px-4">
            {badges.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-[#8c5b36]/50 text-xs sm:text-sm font-serif italic text-center">
                No honors recorded yet.<br/>Your journey awaits.
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 overflow-y-auto custom-scrollbar">
                {badges.map(b => (
                   <div key={b.id} className="flex flex-col items-center text-center p-2 sm:p-3">
                     <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#fcf9f2] border-[2px] border-gold-600 flex items-center justify-center shadow-md mb-2 text-lg sm:text-xl drop-shadow-sm transition-transform hover:scale-110">
                       {b.icon}
                     </div>
                     <h4 className="font-serif font-bold text-[#2c1a12] text-[8px] sm:text-[9px] uppercase tracking-wider">{b.name}</h4>
                   </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'timeline':
        return (
          <div className="h-full overflow-y-auto custom-scrollbar relative px-2 sm:px-4 py-4">
            <div className="absolute left-6 sm:left-8 top-4 bottom-4 w-px bg-[#8c5b36]/20" />
            <div className="flex flex-col gap-4 sm:gap-6 relative z-10">
              {timelineEvents.map((evt, i) => (
                <div key={i} className="flex gap-3 sm:gap-4 items-start">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#fcf9f2] border-[2px] border-[#8c5b36] flex items-center justify-center text-[#8c5b36] shrink-0 shadow-sm mt-0.5">
                    {evt.icon}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#2c1a12] text-[10px] sm:text-xs uppercase tracking-wider">{evt.label}</h4>
                    <p className="text-[8px] sm:text-[9px] font-mono text-[#684227] uppercase mt-0.5">{evt.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'stats':
        const completedChapters = CITIES_DATA.reduce((acc, c) => acc + c.chapters.filter(ch => chapterProgress[ch.id]?.completed).length, 0);
        return (
          <div className="h-full flex items-center justify-center px-2 sm:px-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm">
               <div className="bg-[#e8dcc4]/40 p-3 sm:p-4 rounded-xl border border-[#8c5b36]/20 text-center flex flex-col items-center">
                 <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#8c5b36] mb-1 sm:mb-2" />
                 <p className="text-xl sm:text-2xl font-serif font-bold text-[#2c1a12]">{getTotalStars()}</p>
                 <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#8c5b36] font-bold mt-1">Stars</p>
               </div>
               <div className="bg-[#e8dcc4]/40 p-3 sm:p-4 rounded-xl border border-[#8c5b36]/20 text-center flex flex-col items-center">
                 <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#8c5b36] mb-1 sm:mb-2" />
                 <p className="text-xl sm:text-2xl font-serif font-bold text-[#2c1a12]">{getUnlockedPassportsCount()}</p>
                 <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#8c5b36] font-bold mt-1">Visas</p>
               </div>
               <div className="bg-[#e8dcc4]/40 p-3 sm:p-4 rounded-xl border border-[#8c5b36]/20 text-center flex flex-col items-center">
                 <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#8c5b36] mb-1 sm:mb-2" />
                 <p className="text-xl sm:text-2xl font-serif font-bold text-[#2c1a12]">{completedChapters}</p>
                 <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#8c5b36] font-bold mt-1">Chapters</p>
               </div>
               <div className="bg-[#e8dcc4]/40 p-3 sm:p-4 rounded-xl border border-[#8c5b36]/20 text-center flex flex-col items-center">
                 <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#8c5b36] mb-1 sm:mb-2" />
                 <p className="text-xl sm:text-2xl font-serif font-bold text-[#2c1a12]">{badges.length}</p>
                 <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#8c5b36] font-bold mt-1">Honors</p>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-8 overflow-hidden font-sans">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-8 sm:right-8 z-[60] w-10 h-10 rounded-full bg-earth-950/80 border border-gold-500/40 text-gold-400 hover:text-white hover:bg-gold-600/30 flex items-center justify-center transition-all backdrop-blur-md"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="w-full max-w-6xl h-full max-h-[900px] flex flex-col relative animate-in fade-in zoom-in-95 duration-500">
        
        {/* Navigation Tabs (Top) */}
        <div className="flex justify-center gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-none px-4 shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-t-xl sm:rounded-t-2xl text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold transition-all whitespace-nowrap border-x border-t ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-b from-[#b07d53] to-[#8c5b36] text-white border-[#b07d53] shadow-[0_-5px_20px_rgba(138,91,54,0.3)]' 
                  : 'bg-earth-900/80 text-parchment-300/60 border-earth-700/30 hover:bg-earth-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Passport Central Background & Layout */}
        <div className="flex-1 w-full relative rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-gold-500/10">
          {/* Physical Background Image */}
          <div className="absolute inset-0 pointer-events-none">
            <Image 
              src="/Passport_Background.png" 
              alt="Passport Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Interactive Pages Overlay */}
          {/* On desktop, two equal columns mimicking the open book pages. On mobile, flex-col. */}
          <div className="absolute inset-0 z-10 flex flex-col md:flex-row py-4 sm:py-8 lg:py-16 px-4 sm:px-12 md:px-16 lg:px-24 gap-4 md:gap-12 lg:gap-24">
             
             <AnimatePresence mode="wait">
               {/* LEFT PAGE */}
               <motion.div 
                 key={`left-${activeTab}`}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.4, ease: "easeOut" }}
                 className="flex-1 bg-[#fdfbf7]/90 backdrop-blur-[2px] rounded-xl sm:rounded-2xl overflow-hidden shadow-[inset_0_0_40px_rgba(138,91,54,0.1)] border border-[#8c5b36]/20 relative"
               >
                 {renderLeftPage()}
               </motion.div>

               {/* RIGHT PAGE */}
               <motion.div 
                 key={`right-${activeTab}`}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                 className="flex-1 bg-[#fdfbf7]/90 backdrop-blur-[2px] rounded-xl sm:rounded-2xl overflow-hidden shadow-[inset_0_0_40px_rgba(138,91,54,0.1)] border border-[#8c5b36]/20 relative"
               >
                 {renderRightPage()}
               </motion.div>
             </AnimatePresence>
             
          </div>
        </div>
      </div>
    </div>
  );
}
