"use client";

import { useState, useMemo } from "react";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA } from "@/data/gameContent";
import { X, Lock, Camera, Award, Compass, CheckCircle2, Trophy, ShieldCheck, Star } from "lucide-react";

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
    className={`absolute flex items-center justify-center ${className}`}
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
    <AbsoluteSlot x={x} y={y} w={w} h={h} className="bg-[#f0e4cf]/95 backdrop-blur-[6px] rounded-sm shadow-inner z-30 animate-in fade-in duration-500 flex flex-col p-8">
      <div className="w-full h-full border-[1.5px] border-[#8c5b36]/30 rounded p-6 overflow-y-auto custom-scrollbar relative flex flex-col">
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
  
  const LBounds = { x: 130, y: 80, w: 610, h: 840 };
  const RBounds = { x: 790, y: 80, w: 610, h: 840 };

  const stampSlots = [
    { x: 825, y: 235, w: 175, h: 220 },
    { x: 1025, y: 235, w: 175, h: 220 },
    { x: 1225, y: 235, w: 175, h: 220 },
    { x: 825, y: 480, w: 175, h: 220 },
    { x: 1025, y: 480, w: 175, h: 220 },
    { x: 1225, y: 480, w: 175, h: 220 },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-6 font-sans">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-[110] w-10 h-10 rounded-full bg-earth-950/80 border border-gold-500/40 text-gold-400 hover:text-white hover:bg-gold-600/30 flex items-center justify-center transition-all"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main Container - Ensures exact 1536/1024 aspect ratio */}
      <div className="flex-1 w-full flex items-center justify-center overflow-auto custom-scrollbar">
        <div 
          className="relative shrink-0 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          style={{ width: 'min(1200px, 95vw)', aspectRatio: '1536/1024', minWidth: '800px' }}
        >
          {/* Physical Background Image */}
          <img 
            src="/New_Passport.png" 
            alt="Dhara Heritage Passport"
            className="absolute inset-0 w-full h-full object-cover rounded-md pointer-events-none"
          />

          {/* ----------------------------------------------------------------- */}
          {/* NATIVE LEFT PAGE - IDENTITY (Hidden if left overlay is active) */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'passport' && (
            <>
              {/* Photo Circle */}
              <AbsoluteSlot x={155} y={280} w={230} h={230} className="rounded-full group z-10">
                <div className="relative w-full h-full rounded-full overflow-hidden cursor-pointer flex items-center justify-center">
                  {player.profilePhoto ? (
                    <img src={player.profilePhoto} className="w-full h-full object-cover mix-blend-multiply opacity-90" alt="Explorer" />
                  ) : (
                    <div className="w-full h-full bg-transparent" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white/80" />
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                {player.profilePhoto && (
                  <button 
                    onClick={() => setProfilePhoto(undefined)}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-900 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white shadow-md z-20"
                    title="Remove Photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </AbsoluteSlot>

              {/* Explorer Name */}
              <AbsoluteSlot x={420} y={325} w={300} h={50} className="z-10">
                <input 
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onBlur={() => updatePlayerName(nameInput.trim() || "Explorer")}
                  className="w-full h-full bg-transparent text-center font-serif text-[clamp(14px,2vw,24px)] font-bold text-[#4a2e1b] outline-none placeholder:text-[#4a2e1b]/40 focus:bg-white/20 rounded transition-colors"
                  placeholder="ENTER NAME"
                />
              </AbsoluteSlot>

              {/* Official Title */}
              <AbsoluteSlot x={420} y={415} w={300} h={50} className="z-10">
                <div className="w-full h-full flex items-center justify-center text-center font-serif text-[clamp(12px,1.5vw,18px)] text-[#684227] italic opacity-80">
                  {player.title}
                </div>
              </AbsoluteSlot>

              {/* Level Circle */}
              <AbsoluteSlot x={220} y={540} w={60} h={60} className="z-10">
                <div className="font-serif font-bold text-[clamp(16px,2vw,28px)] text-[#4a2e1b] opacity-80">{player.level}</div>
              </AbsoluteSlot>

              {/* Total XP */}
              <AbsoluteSlot x={365} y={545} w={365} h={40} className="z-10">
                <div className="font-mono text-[clamp(14px,1.5vw,22px)] text-[#4a2e1b] tracking-widest opacity-80">
                  {player.xp.toLocaleString()} <span className="text-xs opacity-50">/ {player.nextLevelXP?.toLocaleString()}</span>
                </div>
              </AbsoluteSlot>

              {/* Stars Earned */}
              <AbsoluteSlot x={225} y={625} w={100} h={35} className="z-10">
                <div className="font-mono text-[clamp(12px,1.5vw,20px)] text-[#4a2e1b] font-bold opacity-80">{getTotalStars()}</div>
              </AbsoluteSlot>

              {/* Realms Completed */}
              <AbsoluteSlot x={420} y={625} w={100} h={35} className="z-10">
                <div className="font-mono text-[clamp(12px,1.5vw,20px)] text-[#4a2e1b] font-bold opacity-80">{completedRealmsCount}</div>
              </AbsoluteSlot>

              {/* Places Explored */}
              <AbsoluteSlot x={625} y={625} w={100} h={35} className="z-10">
                <div className="font-mono text-[clamp(12px,1.5vw,20px)] text-[#4a2e1b] font-bold opacity-80">{getUnlockedPassportsCount()}</div>
              </AbsoluteSlot>
            </>
          )}


          {/* ----------------------------------------------------------------- */}
          {/* NATIVE RIGHT PAGE - STAMPS (Hidden if right overlay is active) */}
          {/* ----------------------------------------------------------------- */}
          {(activeTab === 'passport' || activeTab === 'stamps') && (
            <>
              {CITIES_DATA.slice(0, 6).map((city, i) => {
                const unlocked = isCityUnlocked(city.id);
                const completedCount = city.chapters.filter(ch => chapterProgress[ch.id]?.completed).length;
                const isCompleted = completedCount === city.chapters.length && city.chapters.length > 0;
                const slot = stampSlots[i];
                if (!slot) return null;

                return (
                  <AbsoluteSlot key={city.id} x={slot.x} y={slot.y} w={slot.w} h={slot.h} className="flex flex-col relative group z-10">
                    {unlocked ? (
                      <div className="absolute top-[8%] left-[8%] right-[8%] bottom-[20%] overflow-hidden opacity-85 mix-blend-multiply transition-opacity group-hover:opacity-100 rounded-sm">
                        <img src={`/destinations/${city.id}-hero.png`} className={`w-full h-full object-cover ${isCompleted ? 'grayscale-0' : 'grayscale'}`} alt={city.name} />
                      </div>
                    ) : (
                      <div className="absolute top-[8%] left-[8%] right-[8%] bottom-[20%] flex items-center justify-center opacity-30">
                        <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-[#4a2e1b]" />
                      </div>
                    )}
                    
                    {/* Text box at bottom */}
                    <div className="absolute bottom-[2%] left-[5%] right-[5%] h-[15%] flex flex-col items-center justify-center">
                      <span className={`font-serif text-[clamp(6px,0.8vw,12px)] font-bold uppercase tracking-wider text-center leading-none ${unlocked ? 'text-[#2c1a12]' : 'text-[#2c1a12]/40'}`}>
                        {city.name}
                      </span>
                      {unlocked && <span className="font-mono text-[clamp(5px,0.6vw,9px)] text-[#684227] mt-0.5">{completedCount}/{city.chapters.length}</span>}
                    </div>

                    {/* Completed Stamp Overlay */}
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 border-2 border-red-700/60 rounded-full flex items-center justify-center text-red-700/60 transform rotate-12 bg-transparent mix-blend-multiply z-20 shadow-sm animate-pulse">
                        <span className="text-[clamp(4px,0.5vw,8px)] font-bold uppercase tracking-widest">Cleared</span>
                      </div>
                    )}
                  </AbsoluteSlot>
                );
              })}

              {/* Overall Progress Bar */}
              <AbsoluteSlot x={950} y={775} w={450} h={30} className="z-10">
                <div className="w-full h-[60%] bg-transparent flex items-center px-[1%] overflow-hidden rounded-sm">
                  <div className="h-full bg-gradient-to-r from-[#b07d53]/80 to-[#8c5b36]/80 mix-blend-multiply rounded-sm transition-all duration-1000 ease-out" style={{ width: `${overallProgressPct}%` }} />
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
               <div className="h-full flex flex-col items-center justify-center text-center text-[#4a2e1b]">
                 <ShieldCheck className="w-16 h-16 text-[#8c5b36] mb-6 opacity-80" />
                 <h2 className="text-3xl font-serif font-bold uppercase tracking-widest mb-4">Realm Visas</h2>
                 <div className="w-24 h-[1px] bg-[#8c5b36]/30 mx-auto mb-6" />
                 <p className="text-sm font-serif italic opacity-80 max-w-sm">
                   A complete collection of your physical explorations across the ancient realms of Bharata.
                 </p>
                 <div className="mt-8 flex gap-8">
                   <div className="text-center">
                     <p className="font-mono text-2xl font-bold">{getUnlockedPassportsCount()}</p>
                     <p className="text-[10px] uppercase tracking-widest opacity-60">Unlocked</p>
                   </div>
                   <div className="text-center">
                     <p className="font-mono text-2xl font-bold">{completedRealmsCount}</p>
                     <p className="text-[10px] uppercase tracking-widest opacity-60">Mastered</p>
                   </div>
                 </div>
               </div>
            )}

            {activeTab === 'achievements' && (
               <div className="h-full flex flex-col items-center justify-center text-center text-[#4a2e1b]">
                 <Award className="w-16 h-16 text-[#8c5b36] mb-6 opacity-80" />
                 <h2 className="text-3xl font-serif font-bold uppercase tracking-widest mb-4">Official Honors</h2>
                 <div className="w-24 h-[1px] bg-[#8c5b36]/30 mx-auto mb-6" />
                 <p className="text-sm font-serif italic opacity-80 max-w-sm">
                   Imperial seals awarded for outstanding discovery, intellectual mastery, and the preservation of our living heritage.
                 </p>
               </div>
            )}

            {activeTab === 'timeline' && (
               <div className="h-full flex flex-col items-center justify-center text-center text-[#4a2e1b]">
                 <Compass className="w-16 h-16 text-[#8c5b36] mb-6 opacity-80" />
                 <h2 className="text-3xl font-serif font-bold uppercase tracking-widest mb-4">Travel History</h2>
                 <div className="w-24 h-[1px] bg-[#8c5b36]/30 mx-auto mb-6" />
                 <p className="text-sm font-serif italic opacity-80 max-w-sm">
                   A chronological ledger of your journey.
                 </p>
               </div>
            )}

            {activeTab === 'stats' && (
               <div className="h-full flex flex-col items-center justify-center text-center text-[#4a2e1b]">
                 <h2 className="text-3xl font-serif font-bold uppercase tracking-widest mb-8">Explorer Analytics</h2>
                 <div className="w-full max-w-[250px]">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#8c5b36] mb-2">
                     <span>Level {player.level}</span>
                     <span>{player.xp.toLocaleString()} XP</span>
                   </div>
                   <div className="w-full h-3 bg-[#e8dcc4] rounded-full overflow-hidden border border-[#8c5b36]/20">
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
                  <div className="flex-1 flex items-center justify-center text-[#8c5b36]/60 text-sm font-serif italic text-center">
                    No honors recorded yet.<br/>Your journey awaits.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                    {badges.map(b => (
                       <div key={b.id} className="flex flex-col items-center text-center group">
                         <div className="w-16 h-16 rounded-full bg-[#f4e7dc] border-[2px] border-[#8c5b36] flex items-center justify-center shadow-md mb-3 text-2xl transition-transform group-hover:scale-110 group-hover:border-gold-600 group-hover:bg-[#fdfbf7]">
                           {b.icon}
                         </div>
                         <h4 className="font-serif font-bold text-[#2c1a12] text-[10px] uppercase tracking-wider">{b.name}</h4>
                         {b.description && <p className="text-[8px] text-[#4a2e1b]/70 mt-1 uppercase max-w-[120px]">{b.description}</p>}
                       </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="h-full relative pl-6 pb-8">
                <div className="absolute left-10 top-2 bottom-2 w-[2px] bg-[#8c5b36]/20" />
                <div className="flex flex-col gap-6 relative z-10">
                  {timelineEvents.map((evt, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="w-9 h-9 rounded-full bg-[#f4e7dc] border-[2px] border-[#8c5b36] flex items-center justify-center text-[#8c5b36] shrink-0 shadow-sm mt-0.5 relative z-10">
                        {evt.icon}
                      </div>
                      <div className="pt-1 bg-[#fdfbf7]/40 px-4 py-2 rounded-lg border border-[#8c5b36]/10 w-full">
                        <h4 className="font-serif font-bold text-[#2c1a12] text-sm uppercase tracking-wider">{evt.label}</h4>
                        <p className="text-[10px] font-mono text-[#8c5b36] uppercase mt-0.5">{evt.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="h-full flex items-center justify-center pb-8">
                <div className="grid grid-cols-2 gap-6 w-full px-8">
                   <div className="bg-[#fcf9f2]/60 p-6 rounded-xl border border-[#8c5b36]/20 text-center flex flex-col items-center">
                     <Star className="w-8 h-8 text-[#8c5b36] mb-3 opacity-80" />
                     <p className="text-4xl font-serif font-bold text-[#2c1a12]">{getTotalStars()}</p>
                     <p className="text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-2">Stars Earned</p>
                   </div>
                   <div className="bg-[#fcf9f2]/60 p-6 rounded-xl border border-[#8c5b36]/20 text-center flex flex-col items-center">
                     <ShieldCheck className="w-8 h-8 text-[#8c5b36] mb-3 opacity-80" />
                     <p className="text-4xl font-serif font-bold text-[#2c1a12]">{getUnlockedPassportsCount()}</p>
                     <p className="text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-2">Realm Visas</p>
                   </div>
                   <div className="bg-[#fcf9f2]/60 p-6 rounded-xl border border-[#8c5b36]/20 text-center flex flex-col items-center">
                     <CheckCircle2 className="w-8 h-8 text-[#8c5b36] mb-3 opacity-80" />
                     <p className="text-4xl font-serif font-bold text-[#2c1a12]">
                       {CITIES_DATA.reduce((acc, c) => acc + c.chapters.filter(ch => chapterProgress[ch.id]?.completed).length, 0)}
                     </p>
                     <p className="text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-2">Chapters Cleared</p>
                   </div>
                   <div className="bg-[#fcf9f2]/60 p-6 rounded-xl border border-[#8c5b36]/20 text-center flex flex-col items-center">
                     <Trophy className="w-8 h-8 text-[#8c5b36] mb-3 opacity-80" />
                     <p className="text-4xl font-serif font-bold text-[#2c1a12]">{badges.length}</p>
                     <p className="text-[10px] uppercase tracking-widest text-[#8c5b36] font-bold mt-2">Total Honors</p>
                   </div>
                </div>
              </div>
            )}
          </ParchmentOverlay>

        </div>
      </div>

      {/* Navigation Tabs (Bottom, Floating) */}
      <div className="shrink-0 mt-4 sm:mt-6 flex flex-wrap justify-center gap-2 sm:gap-4 z-[110]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-[9px] sm:text-[11px] uppercase tracking-[0.2em] font-bold transition-all whitespace-nowrap border ${
              activeTab === tab.id 
                ? 'bg-gradient-to-b from-[#b07d53] to-[#8c5b36] text-white border-[#b07d53] shadow-[0_4px_15px_rgba(138,91,54,0.4)]' 
                : 'bg-earth-900/90 text-parchment-300/70 border-earth-700/50 hover:bg-earth-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
