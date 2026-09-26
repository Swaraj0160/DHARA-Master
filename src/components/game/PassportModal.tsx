"use client";

import { useState, useMemo } from "react";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA } from "@/data/gameContent";
import { X, Lock, Camera, Award, Compass, CheckCircle2, Trophy, ShieldCheck, Star, ChevronLeft, ChevronRight } from "lucide-react";
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

const pxToPct = (px: number, isWidth = true) => `${(px / (isWidth ? 1536 : 1024)) * 100}%`;

const AbsoluteSlot = ({ x, y, w, h, children, className = "", style = {} }: {
  x: number; y: number; w: number; h: number; children?: React.ReactNode; className?: string; style?: React.CSSProperties;
}) => (
  <div 
    className={`absolute flex items-center justify-center pointer-events-auto ${className}`}
    style={{
      left: pxToPct(x, true),
      top: pxToPct(y, false),
      width: pxToPct(w, true),
      height: pxToPct(h, false),
      ...style
    }}
  >
    {children}
  </div>
);

const ParchmentOverlay = ({ x, y, w, h, children, isVisible }: {
  x: number; y: number; w: number; h: number; children?: React.ReactNode; isVisible?: boolean;
}) => {
  if (!isVisible) return null;
  return (
    <AbsoluteSlot x={x} y={y} w={w} h={h} className="bg-[#f0e4cf]/95 backdrop-blur-[4px] rounded-sm z-30 animate-in fade-in duration-300 flex flex-col p-4 sm:p-8 border-[1.5px] border-[#8c5b36]/30 shadow-[inset_0_0_30px_rgba(140,91,54,0.1)]">
      <div className="w-full h-full border border-[#8c5b36]/20 rounded p-4 sm:p-6 overflow-y-auto custom-scrollbar relative flex flex-col">
        {children}
      </div>
    </AbsoluteSlot>
  );
};

export default function PassportModal({ onClose }: PassportModalProps) {
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
  
  const maxStampPage = Math.ceil(CITIES_DATA.length / 6) - 1;
  const currentRealms = CITIES_DATA.slice(stampPage * 6, (stampPage + 1) * 6);

  const LBounds = { x: 140, y: 120, w: 590, h: 760 };
  const RBounds = { x: 800, y: 120, w: 600, h: 760 };

  const stampSlots = [
    { x: 825, y: 235, w: 175, h: 220 },
    { x: 1025, y: 235, w: 175, h: 220 },
    { x: 1225, y: 235, w: 175, h: 220 },
    { x: 825, y: 480, w: 175, h: 220 },
    { x: 1025, y: 480, w: 175, h: 220 },
    { x: 1225, y: 480, w: 175, h: 220 },
  ];

  return (
    <div className="fixed top-20 bottom-0 left-0 right-0 z-40 bg-[#120e0a]/90 backdrop-blur-md flex flex-col pointer-events-auto">
      
      {/* Header / Close Row */}
      <div className="w-full flex justify-end p-4 shrink-0 h-[60px]">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-earth-950/90 border border-gold-500/40 text-gold-400 hover:text-white hover:bg-gold-600/50 flex items-center justify-center transition-all shadow-lg"
          title="Close Passport"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Passport Book Area */}
      <div className="flex-1 w-full flex items-center justify-center min-h-0 overflow-hidden px-2 sm:px-6 pb-2">
        <div className="relative inline-flex items-center justify-center shadow-[0_0_80px_rgba(0,0,0,0.9)] rounded-md">
          {/* Background Image - Defines the container dimensions dynamically! */}
          <img 
            src="/New_Passport.png"
            className="max-w-full max-h-[calc(100vh-220px)] object-contain block rounded-md pointer-events-none"
            style={{ aspectRatio: '1536 / 1024' }}
            alt="Dhara Heritage Passport"
          />
          
          {/* Overlay Container matching exactly the dimensions of the image */}
          <div className="absolute inset-0 z-10 pointer-events-none">

            {/* ----------------------------------------------------------------- */}
            {/* NATIVE LEFT PAGE - IDENTITY (Hidden if left overlay is active) */}
            {/* ----------------------------------------------------------------- */}
            {activeTab === 'passport' && (
              <>
                {/* Photo Circle */}
                <AbsoluteSlot x={155} y={280} w={230} h={230} className="rounded-full group z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)]">
                  <div className="relative w-full h-full rounded-full overflow-hidden cursor-pointer flex items-center justify-center">
                    {player.profilePhoto ? (
                      <img src={player.profilePhoto} className="w-full h-full object-cover mix-blend-multiply opacity-90" alt="Explorer" />
                    ) : (
                      <div className="w-full h-full bg-transparent" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white/90 drop-shadow-md" />
                    </div>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  {player.profilePhoto && (
                    <button 
                      onClick={() => setProfilePhoto(undefined)}
                      className="absolute -top-1 -right-1 w-7 h-7 bg-red-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white shadow-md z-20"
                      title="Remove Photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </AbsoluteSlot>

                {/* Explorer Name */}
                <AbsoluteSlot x={430} y={328} w={270} h={42} className="z-10">
                  <input 
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onBlur={() => updatePlayerName(nameInput.trim() || "Explorer")}
                    className="w-full h-full bg-transparent text-center font-serif text-[clamp(14px,1.8vw,22px)] font-bold text-[#2c1a12] outline-none placeholder:text-[#2c1a12]/50 focus:bg-[#f4e7dc]/40 rounded transition-colors"
                    placeholder="ENTER NAME"
                  />
                </AbsoluteSlot>

                {/* Official Title */}
                <AbsoluteSlot x={430} y={418} w={270} h={42} className="z-10">
                  <div className="w-full h-full flex items-center justify-center text-center font-serif text-[clamp(12px,1.5vw,18px)] text-[#2c1a12] italic opacity-90">
                    {player.title}
                  </div>
                </AbsoluteSlot>

                {/* Level Circle */}
                <AbsoluteSlot x={220} y={540} w={60} h={60} className="z-10">
                  <div className="font-serif font-bold text-[clamp(20px,2.5vw,32px)] text-[#2c1a12] drop-shadow-sm">{player.level}</div>
                </AbsoluteSlot>

                {/* Total XP */}
                <AbsoluteSlot x={350} y={545} w={380} h={40} className="z-10">
                  <div className="font-mono text-[clamp(14px,1.8vw,20px)] text-[#2c1a12] font-bold tracking-widest flex items-center justify-center w-full">
                    {player.xp.toLocaleString()} <span className="text-[#2c1a12] font-bold ml-1 sm:ml-2">/ {player.nextLevelXP?.toLocaleString() || 1000}</span>
                  </div>
                </AbsoluteSlot>

                {/* Stars Earned */}
                <AbsoluteSlot x={210} y={625} w={120} h={35} className="z-10">
                  <div className="font-mono text-[clamp(14px,1.8vw,22px)] text-[#2c1a12] font-bold">{getTotalStars()}</div>
                </AbsoluteSlot>

                {/* Realms Completed */}
                <AbsoluteSlot x={410} y={625} w={120} h={35} className="z-10">
                  <div className="font-mono text-[clamp(14px,1.8vw,22px)] text-[#2c1a12] font-bold">{completedRealmsCount}</div>
                </AbsoluteSlot>

                {/* Places Explored */}
                <AbsoluteSlot x={610} y={625} w={120} h={35} className="z-10">
                  <div className="font-mono text-[clamp(14px,1.8vw,22px)] text-[#2c1a12] font-bold">{getUnlockedPassportsCount()}</div>
                </AbsoluteSlot>
              </>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* NATIVE RIGHT PAGE - STAMPS (Hidden if right overlay is active) */}
            {/* ----------------------------------------------------------------- */}
            {(activeTab === 'passport' || activeTab === 'stamps') && (
              <>
                {currentRealms.map((city, i) => {
                  const unlocked = isCityUnlocked(city.id);
                  const completedCount = city.chapters.filter(ch => chapterProgress[ch.id]?.completed).length;
                  const isCompleted = completedCount === city.chapters.length && city.chapters.length > 0;
                  const slot = stampSlots[i];
                  if (!slot) return null;

                  return (
                    <AbsoluteSlot key={city.id} x={slot.x} y={slot.y} w={slot.w} h={slot.h} className="flex flex-col relative group z-10">
                      {unlocked ? (
                        <div className="absolute top-[8%] left-[8%] right-[8%] bottom-[22%] overflow-hidden opacity-90 mix-blend-multiply transition-opacity group-hover:opacity-100 rounded-sm bg-[#d6c4a4]/20 border border-[#8c5b36]/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]">
                          <img src={`/destinations/${city.id}-hero.png`} className={`w-full h-full object-cover ${isCompleted ? 'grayscale-0' : 'grayscale brightness-90 sepia-[.3]'}`} alt={city.name} />
                        </div>
                      ) : (
                        <div className="absolute top-[8%] left-[8%] right-[8%] bottom-[22%] flex flex-col items-center justify-center opacity-40 bg-[#d6c4a4]/10 rounded-sm border border-[#4a2e1b]/20">
                          <Lock className="w-5 h-5 sm:w-8 sm:h-8 text-[#4a2e1b] mb-1 sm:mb-2" />
                          <span className="text-[6px] sm:text-[8px] uppercase tracking-widest text-[#4a2e1b] font-bold">Locked</span>
                        </div>
                      )}
                      
                      {/* Text box at bottom */}
                      <div className="absolute bottom-[2%] left-[2%] right-[2%] h-[18%] flex flex-col items-center justify-center bg-transparent px-1 pointer-events-none">
                        <span className={`font-serif text-[clamp(7px,1vw,14px)] font-bold uppercase tracking-wider text-center leading-tight ${unlocked ? 'text-[#2c1a12]' : 'text-[#2c1a12]/50'}`}>
                          {city.name}
                        </span>
                        {unlocked && <span className="font-mono text-[clamp(6px,0.8vw,11px)] text-[#4a2e1b] font-bold mt-0.5">{completedCount}/{city.chapters.length} Chapters</span>}
                      </div>

                      {/* Completed Stamp Overlay */}
                      {isCompleted && (
                        <div className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 w-10 h-10 sm:w-16 sm:h-16 border-[3px] border-red-700/80 rounded-full flex items-center justify-center text-red-700/80 transform rotate-[15deg] bg-transparent mix-blend-multiply z-20 shadow-sm animate-pulse pointer-events-none">
                          <span className="text-[clamp(5px,0.7vw,10px)] font-bold uppercase tracking-widest text-center leading-tight bg-white/40 px-1 rounded-sm backdrop-blur-sm">Mastered</span>
                        </div>
                      )}
                    </AbsoluteSlot>
                  );
                })}

                {/* Pagination Controls */}
                {maxStampPage > 0 && (
                  <AbsoluteSlot x={1030} y={710} w={170} h={40} className="z-20">
                    <div className="flex items-center justify-center gap-4 text-[#2c1a12]">
                      <button 
                        onClick={() => setStampPage(p => Math.max(0, p - 1))}
                        disabled={stampPage === 0}
                        className="p-1 hover:bg-[#8c5b36]/20 rounded-full disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      <span className="font-mono text-[clamp(10px,1vw,14px)] font-bold">{stampPage + 1} / {maxStampPage + 1}</span>
                      <button 
                        onClick={() => setStampPage(p => Math.min(maxStampPage, p + 1))}
                        disabled={stampPage === maxStampPage}
                        className="p-1 hover:bg-[#8c5b36]/20 rounded-full disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </div>
                  </AbsoluteSlot>
                )}

                {/* Overall Progress Bar */}
                <AbsoluteSlot x={960} y={777} w={430} h={26} className="z-10">
                  <div className="w-full h-full bg-transparent flex items-center overflow-hidden rounded-sm px-1">
                    <div className="h-[70%] bg-gradient-to-r from-[#8c5b36] to-[#4a2e1b] mix-blend-multiply rounded-sm transition-all duration-1000 ease-out" style={{ width: `${overallProgressPct}%` }} />
                  </div>
                </AbsoluteSlot>
              </>
            )}

            {/* ----------------------------------------------------------------- */}
            {/* OVERLAYS - Erase printed background for dynamic tabs                */}
            {/* ----------------------------------------------------------------- */}

            {/* Left Overlay - Used when tab is Stamps, Achievements, Timeline, Stats */}
            <ParchmentOverlay {...LBounds} isVisible={activeTab !== 'passport'}>
              {activeTab === 'stamps' && (
                 <div className="h-full flex flex-col items-center justify-center text-center text-[#2c1a12]">
                   <ShieldCheck className="w-16 h-16 text-[#8c5b36] mb-6 opacity-90 drop-shadow-sm" />
                   <h2 className="text-3xl font-serif font-bold uppercase tracking-widest mb-4">Realm Visas</h2>
                   <div className="w-24 h-[2px] bg-[#8c5b36]/40 mx-auto mb-6" />
                   <p className="text-sm font-serif italic opacity-90 max-w-sm">
                     A complete collection of your physical explorations across the ancient realms of Bharata.
                   </p>
                   <div className="mt-10 flex gap-10">
                     <div className="text-center">
                       <p className="font-mono text-3xl font-bold">{getUnlockedPassportsCount()}</p>
                       <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold mt-1">Unlocked</p>
                     </div>
                     <div className="text-center">
                       <p className="font-mono text-3xl font-bold">{completedRealmsCount}</p>
                       <p className="text-[10px] uppercase tracking-widest opacity-70 font-bold mt-1">Mastered</p>
                     </div>
                   </div>
                 </div>
              )}

              {activeTab === 'achievements' && (
                 <div className="h-full flex flex-col items-center justify-center text-center text-[#2c1a12]">
                   <Award className="w-16 h-16 text-[#8c5b36] mb-6 opacity-90 drop-shadow-sm" />
                   <h2 className="text-3xl font-serif font-bold uppercase tracking-widest mb-4">Official Honors</h2>
                   <div className="w-24 h-[2px] bg-[#8c5b36]/40 mx-auto mb-6" />
                   <p className="text-sm font-serif italic opacity-90 max-w-sm">
                     Imperial seals awarded for outstanding discovery, intellectual mastery, and the preservation of our living heritage.
                   </p>
                 </div>
              )}

              {activeTab === 'timeline' && (
                 <div className="h-full flex flex-col items-center justify-center text-center text-[#2c1a12]">
                   <Compass className="w-16 h-16 text-[#8c5b36] mb-6 opacity-90 drop-shadow-sm" />
                   <h2 className="text-3xl font-serif font-bold uppercase tracking-widest mb-4">Travel History</h2>
                   <div className="w-24 h-[2px] bg-[#8c5b36]/40 mx-auto mb-6" />
                   <p className="text-sm font-serif italic opacity-90 max-w-sm">
                     A chronological ledger of your journey.
                   </p>
                 </div>
              )}

              {activeTab === 'stats' && (
                 <div className="h-full flex flex-col items-center justify-center text-center text-[#2c1a12]">
                   <h2 className="text-3xl font-serif font-bold uppercase tracking-widest mb-10">Explorer Analytics</h2>
                   <div className="w-full max-w-[300px]">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#2c1a12] mb-3">
                       <span>Level {player.level}</span>
                       <span>{player.xp.toLocaleString()} XP</span>
                     </div>
                     <div className="w-full h-4 bg-[#e8dcc4] rounded-full overflow-hidden border-2 border-[#8c5b36]/30 shadow-inner">
                       <div className="h-full bg-gradient-to-r from-[#b07d53] to-[#8c5b36]" style={{ width: `${overallProgressPct}%` }} />
                     </div>
                   </div>
                 </div>
              )}
            </ParchmentOverlay>

            {/* Right Overlay - Used when tab is Passport, Achievements, Timeline, Stats */}
            <ParchmentOverlay {...RBounds} isVisible={activeTab !== 'stamps' && activeTab !== 'passport'}>
              {activeTab === 'achievements' && (
                <div className="h-full flex flex-col">
                  {badges.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-[#2c1a12]/60 text-sm font-serif italic text-center">
                      No honors recorded yet.<br/>Your journey awaits.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                      {badges.map(b => (
                         <div key={b.id} className="flex flex-col items-center text-center group cursor-pointer">
                           <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f4e7dc] border-[2px] border-[#8c5b36] flex items-center justify-center shadow-md mb-3 text-3xl transition-transform group-hover:scale-110 group-hover:border-gold-600 group-hover:bg-[#fdfbf7] group-hover:shadow-lg">
                             {b.icon}
                           </div>
                           <h4 className="font-serif font-bold text-[#2c1a12] text-xs uppercase tracking-wider">{b.name}</h4>
                           {b.description && <p className="text-[9px] text-[#2c1a12]/70 mt-1 uppercase max-w-[140px] font-bold">{b.description}</p>}
                         </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="h-full relative pl-6 pb-8">
                  <div className="absolute left-10 top-2 bottom-2 w-[2px] bg-[#8c5b36]/30" />
                  <div className="flex flex-col gap-6 relative z-10">
                    {timelineEvents.map((evt, i) => (
                      <div key={i} className="flex gap-6 items-start">
                        <div className="w-9 h-9 rounded-full bg-[#f4e7dc] border-[2px] border-[#8c5b36] flex items-center justify-center text-[#8c5b36] shrink-0 shadow-sm mt-0.5 relative z-10">
                          {evt.icon}
                        </div>
                        <div className="pt-1 bg-[#fdfbf7]/50 px-4 py-2 rounded-lg border border-[#8c5b36]/20 w-full shadow-sm">
                          <h4 className="font-serif font-bold text-[#2c1a12] text-sm uppercase tracking-wider">{evt.label}</h4>
                          <p className="text-[10px] font-mono text-[#8c5b36] font-bold uppercase mt-1">{evt.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="h-full flex items-center justify-center pb-8">
                  <div className="grid grid-cols-2 gap-6 w-full px-8">
                     <div className="bg-[#fcf9f2]/70 p-6 rounded-xl border-[1.5px] border-[#8c5b36]/30 text-center flex flex-col items-center shadow-sm">
                       <Star className="w-8 h-8 text-[#8c5b36] mb-3 opacity-90 drop-shadow-sm" />
                       <p className="text-4xl font-serif font-bold text-[#2c1a12]">{getTotalStars()}</p>
                       <p className="text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-2">Stars Earned</p>
                     </div>
                     <div className="bg-[#fcf9f2]/70 p-6 rounded-xl border-[1.5px] border-[#8c5b36]/30 text-center flex flex-col items-center shadow-sm">
                       <ShieldCheck className="w-8 h-8 text-[#8c5b36] mb-3 opacity-90 drop-shadow-sm" />
                       <p className="text-4xl font-serif font-bold text-[#2c1a12]">{getUnlockedPassportsCount()}</p>
                       <p className="text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-2">Realm Visas</p>
                     </div>
                     <div className="bg-[#fcf9f2]/70 p-6 rounded-xl border-[1.5px] border-[#8c5b36]/30 text-center flex flex-col items-center shadow-sm">
                       <CheckCircle2 className="w-8 h-8 text-[#8c5b36] mb-3 opacity-90 drop-shadow-sm" />
                       <p className="text-4xl font-serif font-bold text-[#2c1a12]">
                         {CITIES_DATA.reduce((acc, c) => acc + c.chapters.filter(ch => chapterProgress[ch.id]?.completed).length, 0)}
                       </p>
                       <p className="text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-2">Chapters Cleared</p>
                     </div>
                     <div className="bg-[#fcf9f2]/70 p-6 rounded-xl border-[1.5px] border-[#8c5b36]/30 text-center flex flex-col items-center shadow-sm">
                       <Trophy className="w-8 h-8 text-[#8c5b36] mb-3 opacity-90 drop-shadow-sm" />
                       <p className="text-4xl font-serif font-bold text-[#2c1a12]">{badges.length}</p>
                       <p className="text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-2">Total Honors</p>
                     </div>
                  </div>
                </div>
              )}
            </ParchmentOverlay>
          </div>
        </div>
      </div>

      {/* Tabs Area (Footer) */}
      <div className="shrink-0 h-[80px] sm:h-[100px] flex items-center justify-center gap-2 sm:gap-4 w-full bg-gradient-to-t from-black/80 to-transparent">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setStampPage(0); }}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-[9px] sm:text-[11px] uppercase tracking-[0.2em] font-bold transition-all whitespace-nowrap border cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-gradient-to-b from-[#b07d53] to-[#8c5b36] text-white border-[#b07d53] shadow-[0_4px_15px_rgba(138,91,54,0.4)]' 
                : 'bg-earth-900/95 text-parchment-300/80 border-earth-700/60 hover:bg-earth-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
