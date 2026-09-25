"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA } from "@/data/gameContent";
import { Compass, Star, Trophy, User, Settings as SettingsIcon, ShieldCheck, MapPin, Mouse, BookOpen, Map } from "lucide-react";

export default function CinematicVRIntro({ onComplete }: { onComplete: () => void }) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hasPlaybackFailed, setHasPlaybackFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { player, chapterProgress } = useGameStore();

  const getTotalStars = () => {
    return Object.values(chapterProgress).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  };
  
  const discoveredCount = Object.values(chapterProgress).filter(c => c.completed).length;

  // Preload video to ensure it's in browser cache immediately
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = '/intro/intro_video.mp4';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleEnterClick = async () => {
    if (!videoRef.current) return;

    try {
      videoRef.current.currentTime = 0;
      await videoRef.current.play();
    } catch (err) {
      console.warn("Unmuted playback failed, attempting muted fallback:", err);
      try {
        if (videoRef.current) {
          videoRef.current.muted = true;
          await videoRef.current.play();
        }
      } catch (mutedErr) {
        console.error("Video playback completely failed:", mutedErr);
        setHasPlaybackFailed(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!isVideoReady && videoRef.current && videoRef.current.currentTime > 0.1) {
      setIsVideoReady(true);
    }
  };

  const handleVideoEnded = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 1000); 
  };

  // Responsive marker positions for the background
  const markers = [
    { id: 'nalanda', name: 'Nalanda', region: 'Bihar', top: '30%', left: '15%' },
    { id: 'pataliputra', name: 'Pataliputra', region: 'Bihar', top: '45%', left: '25%' },
    { id: 'varanasi', name: 'Varanasi', region: 'Uttar Pradesh', top: '35%', left: '65%' },
    { id: 'hampi', name: 'Hampi', region: 'Karnataka', top: '65%', left: '18%' },
    { id: 'madurai', name: 'Madurai', region: 'Tamil Nadu', top: '55%', left: '75%' },
    { id: 'konark', name: 'Konark', region: 'Odisha', top: '70%', left: '85%' },
  ];

  return (
    <motion.div 
      className="fixed inset-0 z-[200] bg-[#171513] overflow-hidden select-none font-sans"
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
    >
      {/* 
        LAYER 1: THE VIDEO
        Always mounted, sitting behind the interactive landing screen. Preloads silently.
      */}
      <video
        ref={videoRef}
        src="/intro/intro_video.mp4"
        className="absolute inset-0 w-full h-full object-cover object-center" 
        preload="auto"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
      />

      {/* 
        LAYER 2: CINEMATIC INTERACTIVE LANDING SCREEN
        Sits on top of the video until Enter Dhara is clicked and video time updates.
      */}
      <AnimatePresence>
        {!isVideoReady && (
          <motion.div
            key="landing-layer"
            className="absolute inset-0 z-10 flex flex-col justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Visual Background */}
            <div className="absolute inset-0 z-[-1] pointer-events-none bg-[#171513]">
              <motion.img 
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 20, ease: "easeOut" }}
                src="/home-background.png" 
                alt="Dhara Cinematic World" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#171513]/80 via-[#171513]/20 to-[#171513]/90" />
            </div>

            {/* TOP NAVIGATION BAR */}
            <motion.nav 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full px-6 py-4 flex items-center justify-between z-20 pointer-events-auto border-b border-white/5 bg-black/20 backdrop-blur-sm"
            >
              {/* LEFT: LOGO */}
              <div className="flex items-center gap-3">
                 <img src="/LOGO.png" alt="DHARA" className="h-10 lg:h-12 w-auto invert drop-shadow-md" />
                 <div className="hidden lg:flex flex-col">
                    <span className="text-white font-serif font-bold text-lg tracking-widest uppercase">Dhara</span>
                    <span className="text-[#D8CCB8] text-[9px] uppercase tracking-widest opacity-80">Where India's stories flow</span>
                 </div>
              </div>

              {/* CENTER: NAV LINKS */}
              <div className="hidden xl:flex items-center gap-8">
                 <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400 border-b-2 border-gold-400 pb-1">World</button>
                 <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8CCB8] hover:text-white transition-colors pb-1">Passport</button>
                 <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8CCB8] hover:text-white transition-colors pb-1">Quests</button>
                 <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8CCB8] hover:text-white transition-colors pb-1">Truth Layer</button>
                 <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8CCB8] hover:text-white transition-colors pb-1">Veda</button>
              </div>

              {/* RIGHT: HUD & SETTINGS */}
              <div className="flex items-center gap-3 lg:gap-4">
                 <div className="hidden md:flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 bg-black/40">
                   <Star className="w-3 h-3 text-gold-400" />
                   <div className="flex flex-col items-center leading-none">
                     <span className="text-white font-mono text-xs">{getTotalStars()}</span>
                     <span className="text-[7px] uppercase tracking-widest text-[#D8CCB8]/60">Stars</span>
                   </div>
                 </div>
                 <div className="hidden md:flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 bg-black/40">
                   <ShieldCheck className="w-3 h-3 text-gold-400" />
                   <div className="flex flex-col items-center leading-none">
                     <span className="text-white font-mono text-xs">{discoveredCount}/{CITIES_DATA.length}</span>
                     <span className="text-[7px] uppercase tracking-widest text-[#D8CCB8]/60">Passports</span>
                   </div>
                 </div>
                 <div className="hidden lg:flex items-center gap-4 border border-white/10 rounded-full px-4 py-1.5 bg-black/40">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                     <span className="text-[10px] uppercase tracking-widest text-white font-bold">Lvl {player.level}</span>
                   </div>
                   <span className="text-[9px] font-mono text-[#D8CCB8]/60">{player.xp} XP</span>
                 </div>
                 
                 <button className="w-8 h-8 rounded-full border border-white/10 bg-black/40 flex items-center justify-center text-[#D8CCB8] hover:text-white transition-colors cursor-pointer">
                   <User className="w-4 h-4" />
                 </button>
                 <button className="w-8 h-8 rounded-full border border-white/10 bg-black/40 flex items-center justify-center text-[#D8CCB8] hover:text-white transition-colors cursor-pointer">
                   <SettingsIcon className="w-4 h-4" />
                 </button>
              </div>
            </motion.nav>

            {/* DESTINATION MARKERS (Absolute relative to center) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 hidden md:block">
              <div className="relative w-full h-full max-w-[1600px] mx-auto">
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.8 }}>
                   {markers.map((marker) => (
                     <div 
                       key={marker.id} 
                       className="absolute flex items-center gap-2 group pointer-events-auto cursor-pointer"
                       style={{ top: marker.top, left: marker.left }}
                     >
                        <div className="relative flex items-center justify-center">
                          <div className="absolute w-8 h-8 bg-gold-500/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                          <MapPin className="w-5 h-5 text-gold-400 group-hover:text-white transition-colors relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                        </div>
                        <div className="flex flex-col drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-70 group-hover:opacity-100 transition-opacity translate-x-0 group-hover:translate-x-1 duration-300">
                          <span className="text-white text-[11px] font-bold uppercase tracking-widest leading-none">{marker.name}</span>
                          <span className="text-[#D8CCB8] text-[8px] uppercase tracking-widest mt-1">{marker.region}</span>
                        </div>
                     </div>
                   ))}
                 </motion.div>
              </div>
            </div>

            {/* CENTRAL HERO TEXT & CTA */}
            <div className="flex-1 flex flex-col items-center justify-center z-20 px-6 mt-16 pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className="text-center"
              >
                <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-serif font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-[#F4F0E7] to-[#D8CCB8] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] leading-[1.1] mb-2">
                  Ancient Realms<br />
                  <span className="text-4xl md:text-6xl lg:text-7xl font-light italic text-gold-400 block tracking-[0.15em] mt-2">of Bharat</span>
                </h1>
                
                <div className="flex items-center justify-center gap-4 my-8 opacity-80">
                  <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-gold-500/50" />
                  <Compass className="w-4 h-4 text-gold-400" />
                  <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-gold-500/50" />
                </div>

                <p className="text-sm md:text-base lg:text-lg text-[#F5EFE4] max-w-xl mx-auto font-light leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-12">
                  Explore real places. Uncover forgotten stories.<br />
                  Be a part of India's living heritage.
                </p>

                {/* THE CTA */}
                <div className="pointer-events-auto flex flex-col items-center">
                  <button
                    onClick={handleEnterClick}
                    className="group relative px-12 py-4 rounded-full border border-gold-500/40 bg-black/60 backdrop-blur-md shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] hover:border-gold-400 hover:bg-gold-600/10 transition-all cursor-pointer overflow-hidden flex items-center justify-center gap-4"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.2)_0%,_transparent_70%)] transition-opacity duration-500" />
                    <Compass className="w-5 h-5 text-gold-400 group-hover:rotate-90 transition-transform duration-700 relative z-10" />
                    <span className="relative z-10 text-[#F5EFE4] font-bold text-sm tracking-[0.4em] uppercase">
                      Enter Dhara
                    </span>
                    <span className="relative z-10 text-gold-400 group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  {hasPlaybackFailed && (
                    <div className="mt-6 text-red-400 text-xs font-mono tracking-widest text-center bg-black/80 backdrop-blur px-6 py-2 rounded-full border border-red-500/30">
                      Autoplay restricted. Please click to play.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* BOTTOM GAME HUD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="w-full border-t border-white/5 bg-black/30 backdrop-blur-md z-20 pointer-events-auto"
            >
               <div className="max-w-[1800px] mx-auto px-6 py-4 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 lg:gap-8">
                  
                  {/* Left Stats */}
                  <div className="flex items-center gap-8 lg:gap-16">
                     <div className="flex items-center gap-3 group cursor-pointer">
                        <Map className="w-6 h-6 text-[#D8CCB8] group-hover:text-gold-400 transition-colors opacity-70" />
                        <div className="flex flex-col">
                           <span className="text-white font-serif font-bold text-sm lg:text-base leading-none">{CITIES_DATA.length}</span>
                           <span className="text-[9px] uppercase tracking-widest text-[#D8CCB8]/60 mt-1">Realms</span>
                        </div>
                     </div>
                     <div className="hidden sm:flex items-center gap-3 group cursor-pointer">
                        <Trophy className="w-6 h-6 text-[#D8CCB8] group-hover:text-gold-400 transition-colors opacity-70" />
                        <div className="flex flex-col">
                           <span className="text-white font-serif font-bold text-sm lg:text-base leading-none">50+</span>
                           <span className="text-[9px] uppercase tracking-widest text-[#D8CCB8]/60 mt-1">Discoveries</span>
                        </div>
                     </div>
                  </div>

                  {/* Scroll Hint */}
                  <div className="flex-1 flex flex-col items-center justify-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                     <Mouse className="w-4 h-4 text-white mb-1 animate-bounce" />
                     <span className="text-[8px] uppercase tracking-[0.3em] text-[#D8CCB8]">Click Enter to Explore</span>
                  </div>

                  {/* Right Stats */}
                  <div className="flex items-center gap-8 lg:gap-16 justify-end">
                     <div className="hidden sm:flex items-center gap-3 group cursor-pointer">
                        <BookOpen className="w-6 h-6 text-[#D8CCB8] group-hover:text-gold-400 transition-colors opacity-70" />
                        <div className="flex flex-col text-right">
                           <span className="text-white font-serif font-bold text-sm lg:text-base leading-none">25+</span>
                           <span className="text-[9px] uppercase tracking-widest text-[#D8CCB8]/60 mt-1">Quests</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 group cursor-pointer">
                        <ShieldCheck className="w-6 h-6 text-gold-400 group-hover:text-white transition-colors opacity-70" />
                        <div className="flex flex-col text-right">
                           <span className="text-white font-serif font-bold text-sm lg:text-base leading-none">India's</span>
                           <span className="text-[9px] uppercase tracking-widest text-gold-400 mt-1">Living Heritage</span>
                        </div>
                     </div>
                  </div>

               </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
