"use client";

import { useMounted } from "@/hooks/useMounted";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA } from "@/data/gameContent";
import Link from "next/link";
import { ArrowLeft, User, Trophy, Star, MapPin, Award, CheckCircle, ShieldCheck, Settings, Camera, Compass } from "lucide-react";
import WorldHUD from "@/components/game/WorldHUD";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const mounted = useMounted();
  const { player, chapterProgress, getTotalStars, isCityUnlocked, badges, setProfilePhoto } = useGameStore();

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

  const totalStars = mounted ? getTotalStars() : 0;
  const level = mounted ? player.level : 1;
  const xp = mounted ? player.xp : 0;
  const name = mounted ? player.name : "Scholar of Bharat";
  const title = mounted ? player.title : "Novice Historian";
  const photo = mounted ? player.profilePhoto : undefined;
  const progressPct = mounted ? Math.min(100, (xp / (player.nextLevelXP || 1000)) * 100) : 0;

  // Completed chapters
  const completedChaptersCount = mounted ? Object.values(chapterProgress).filter((c) => c.completed).length : 0;
  const totalChapters = CITIES_DATA.reduce((acc, city) => acc + city.chapters.length, 0);
  const citiesUnlockedCount = mounted ? CITIES_DATA.filter((city) => isCityUnlocked(city.id)).length : 1;

  if (!mounted) return null;

  return (
    <div className="h-[100dvh] w-full bg-earth-950 flex flex-col font-sans relative selection:bg-gold-500/30 overflow-hidden text-parchment-100">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-earth-900 via-earth-950 to-black opacity-90 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-multiply pointer-events-none" />
      
      {/* Global Navigation */}
      <div className="relative z-50 shrink-0">
        <WorldHUD />
      </div>

      <main className="flex-1 flex flex-col w-full relative z-10 pt-20 overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 h-full max-h-[850px]">
            
            {/* Left Column - Identity Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/3 flex flex-col gap-6"
            >
              <div className="bg-earth-900/80 border border-gold-500/30 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-[url('/mandala.svg')] bg-center bg-no-repeat opacity-5 pointer-events-none" />
                
                {/* Avatar */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-gold-500/50 p-1.5 mb-6 group bg-earth-950">
                  <div className="w-full h-full rounded-full overflow-hidden bg-earth-900 flex items-center justify-center relative">
                    {photo ? (
                      <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-gold-500/40" />
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-8 h-8 text-parchment-100" />
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  {/* Decorative rim */}
                  <div className="absolute -inset-2 border border-gold-500/20 rounded-full pointer-events-none animate-[spin_60s_linear_infinite]" />
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl text-parchment-100 font-bold uppercase tracking-wider mb-1 z-10">
                  {name}
                </h1>
                <p className="font-mono text-xs text-gold-400 uppercase tracking-[0.2em] mb-6 z-10">
                  {title}
                </p>

                <div className="w-full bg-earth-950/60 rounded-xl p-4 border border-gold-500/10 z-10">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-gold-500/80 mb-2 font-bold">
                    <span>Level {level}</span>
                    <span>{xp.toLocaleString()} XP</span>
                  </div>
                  <div className="w-full h-2 bg-earth-900 rounded-full overflow-hidden border border-gold-500/20">
                    <div className="h-full bg-gold-500 transition-all duration-1000" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="bg-earth-900/40 border border-gold-500/20 rounded-xl p-4 flex flex-col gap-2 backdrop-blur-sm">
                <Link href="/passport" className="flex items-center justify-between p-3 rounded-lg hover:bg-earth-800/50 border border-transparent hover:border-gold-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-earth-950 transition-colors">
                      <BookOpenIcon className="w-4 h-4" />
                    </div>
                    <span className="font-serif text-sm uppercase tracking-widest font-bold text-parchment-200">Heritage Passport</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gold-500/50 rotate-180" />
                </Link>
                <Link href="/quest" className="flex items-center justify-between p-3 rounded-lg hover:bg-earth-800/50 border border-transparent hover:border-gold-500/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-earth-950 transition-colors">
                      <Compass className="w-4 h-4" />
                    </div>
                    <span className="font-serif text-sm uppercase tracking-widest font-bold text-parchment-200">Expeditions</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gold-500/50 rotate-180" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column - Stats & Achievements */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-2/3 flex flex-col gap-6 overflow-hidden"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 shrink-0">
                <div className="bg-earth-900/60 border border-gold-500/20 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:bg-earth-900/80 transition-colors">
                  <Star className="w-6 h-6 text-gold-400 mb-2" />
                  <div className="font-serif text-2xl font-bold text-parchment-100">{totalStars}</div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-gold-500/70 mt-1">Stars Earned</div>
                </div>
                <div className="bg-earth-900/60 border border-gold-500/20 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:bg-earth-900/80 transition-colors">
                  <MapPin className="w-6 h-6 text-gold-400 mb-2" />
                  <div className="font-serif text-2xl font-bold text-parchment-100">{citiesUnlockedCount}</div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-gold-500/70 mt-1">Realms Explored</div>
                </div>
                <div className="bg-earth-900/60 border border-gold-500/20 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:bg-earth-900/80 transition-colors">
                  <CheckCircle className="w-6 h-6 text-gold-400 mb-2" />
                  <div className="font-serif text-2xl font-bold text-parchment-100">{completedChaptersCount}</div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-gold-500/70 mt-1">Chapters Cleared</div>
                </div>
                <div className="bg-earth-900/60 border border-gold-500/20 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:bg-earth-900/80 transition-colors">
                  <Award className="w-6 h-6 text-gold-400 mb-2" />
                  <div className="font-serif text-2xl font-bold text-parchment-100">{badges.length}</div>
                  <div className="text-[9px] font-mono uppercase tracking-widest text-gold-500/70 mt-1">Honors Won</div>
                </div>
              </div>

              {/* Achievements Section */}
              <div className="bg-earth-900/60 border border-gold-500/20 rounded-2xl p-6 sm:p-8 flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex items-center justify-between mb-6 shrink-0 border-b border-gold-500/10 pb-4">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl text-parchment-100 uppercase tracking-widest font-bold">Official Honors</h2>
                    <p className="font-mono text-[10px] text-gold-500/60 uppercase tracking-widest mt-1">Earned via Heritage Exploration</p>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-gold-500/30" />
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {badges.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-10">
                      <Trophy className="w-12 h-12 text-gold-400 mb-4 opacity-50" />
                      <p className="font-serif text-lg italic text-parchment-300">No honors earned yet.</p>
                      <p className="text-xs text-gold-500 mt-2">Complete expeditions to earn badges.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {badges.map(b => (
                        <div key={b.id} className="p-4 rounded-xl border border-gold-500/20 bg-earth-950/50 flex gap-4 items-center group hover:border-gold-500/40 transition-colors">
                          <div className="w-12 h-12 rounded-full border border-gold-500/30 bg-earth-900 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:bg-gold-500/10 transition-all shadow-inner">
                            {b.icon}
                          </div>
                          <div>
                            <h4 className="font-serif text-sm font-bold text-parchment-100 uppercase tracking-wider">{b.name}</h4>
                            {b.description && (
                              <p className="text-[10px] text-parchment-400/80 mt-1 leading-tight line-clamp-2">{b.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
}
