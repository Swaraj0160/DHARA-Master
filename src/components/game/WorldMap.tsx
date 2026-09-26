"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { CITIES_DATA, City } from "@/data/gameContent";
import { useGameStore } from "@/store/gameState";
import { useVedaStore } from "@/store/vedaStore";
import { Compass, Play, ArrowRight, ShieldCheck, Star, Trophy, Award, ChevronRight, ChevronLeft, MapPin, User } from "lucide-react";
import Link from "next/link";
import HeritageCircularGallery from "./HeritageCircularGallery";
import HeritageJourneyTicket from "./HeritageJourneyTicket";

export const getImagesForCity = (id: string) => {
  return {
    hero: `/destinations/${id}-hero.png`,
    detail: `/destinations/${id}-detail.png`
  };
};

const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

function DestinationCard({ city, progress, onClick }: { city: City, progress: number, onClick: () => void }) {
  const images = getImagesForCity(city.id);
  
  return (
    <motion.button 
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => scrollToElement(`realm-${city.id}`)}
      className="group relative flex flex-col text-left overflow-hidden border border-[#201D18]/10 hover:border-gold-600/50 transition-colors duration-500 bg-charcoal-700 w-[85vw] md:w-[45vw] lg:w-[28vw] aspect-[3/4] cursor-pointer shrink-0 snap-center shadow-2xl"
    >
       <div className="absolute inset-0 w-full h-full overflow-hidden bg-charcoal-900">
         <motion.img 
           initial={{ scale: 1 }}
           whileHover={{ scale: 1.05 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           src={images.hero} alt={city.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/40 to-transparent opacity-90" />
       </div>
       
       <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full justify-end transform transition-transform duration-500 group-hover:-translate-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400 mb-2">{city.region}</span>
          <h3 className="text-3xl sm:text-4xl font-serif font-bold tracking-widest uppercase text-ivory-100 mb-2 drop-shadow-md">{city.name}</h3>
          <span className="text-[10px] uppercase tracking-widest text-ivory-300 mb-4 font-mono border border-[#D8CCB8]/20 px-2 py-1 inline-block w-max backdrop-blur-sm bg-black/20">{city.era}</span>
          
          <p className="text-xs sm:text-sm text-ivory-300 mb-6 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500">{city.description}</p>
          
          <div className="flex items-center justify-between border-t border-[#D8CCB8]/20 pt-5 mt-auto">
             <div className="flex flex-col gap-1">
               <span className="text-[9px] uppercase tracking-[0.2em] text-ivory-300/60">Discoveries</span>
               <span className="text-xs font-mono text-gold-400">{progress} <span className="text-ivory-300/40">/ {city.chapters.length}</span></span>
             </div>
             <div className="w-10 h-10 rounded-full border border-gold-500/30 flex items-center justify-center group-hover:bg-gold-600 transition-colors bg-charcoal-900/50 backdrop-blur-md">
               <ArrowRight className="w-4 h-4 text-gold-400 group-hover:text-charcoal-900 transition-colors" />
             </div>
          </div>
       </div>
    </motion.button>
  );
}

export default function WorldMap() {
  const { startEnterRealm, chapterProgress, getTotalStars, player, addXP } = useGameStore();
  const { openVeda } = useVedaStore();
  const [mounted, setMounted] = useState(false);
  const [enteringCityId, setEnteringCityId] = useState<string | null>(null);
  const [ticketCityId, setTicketCityId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // eslint-disable-next-line
  useEffect(() => setMounted(true), []);

  const handleEnterWorld = (cityId: string) => {
    const city = CITIES_DATA.find(c => c.id === cityId);
    if (!city) return;
    const firstChapterId = city.chapters[0].id;
    const isCh1Completed = chapterProgress[firstChapterId]?.completed;

    if (isCh1Completed) {
      // Ticket permanently skipped, enter directly
      setEnteringCityId(cityId);
      setTimeout(() => startEnterRealm(cityId), 1500);
    } else {
      // Show journey ticket
      setTicketCityId(cityId);
    }
  };

  const handleTicketAccept = () => {
    if (ticketCityId) {
      setEnteringCityId(ticketCityId);
      setTimeout(() => startEnterRealm(ticketCityId), 1500);
      setTicketCityId(null);
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth * 0.5;
      carouselRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  if (!mounted) return <div className="min-h-screen bg-ivory-100" />;

  const discoveredCount = CITIES_DATA.filter(c => c.chapters.some(ch => chapterProgress[ch.id]?.completed)).length;

  return (
    <div className="relative w-full bg-ivory-100 text-charcoal-800 font-sans overflow-x-hidden selection:bg-gold-600/30">
      
      {/* ENTERING TRANSITION OVERLAY */}
      <AnimatePresence>
        {ticketCityId && (
          <HeritageJourneyTicket 
            cityId={ticketCityId} 
            onAccept={handleTicketAccept} 
            onCancel={() => setTicketCityId(null)} 
          />
        )}
        {enteringCityId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-charcoal-900 flex items-center justify-center"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 border-t-2 border-l-2 border-gold-500 rounded-full animate-spin"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
          01 HERO / WORLD INTRO
      ========================================= */}
      <section className="relative w-full min-h-[100vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden pt-20 bg-charcoal-900 text-ivory-100">
        
        {/* CINEMATIC BACKGROUND IMAGE */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-[url('/home-background.png')] bg-cover bg-center bg-no-repeat" />
          {/* Subtle gradient overlay to ensure text readability while keeping the image visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#171513]/80 via-[#171513]/40 to-[#F4F0E7]" />
        </motion.div>

        {/* SUBTLE GAME HUD OVERLAYS */}
        <div className="absolute top-24 left-8 text-left hidden lg:block z-10 pointer-events-none opacity-60">
           <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-gold-400 mb-1">Chapter 01</p>
           <p className="text-[10px] font-sans uppercase tracking-widest text-ivory-300">Bharat · Heritage World</p>
        </div>
        <div className="absolute top-24 right-8 text-right hidden lg:block z-10 pointer-events-none opacity-60">
           <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-gold-400 mb-1">Discoveries: {discoveredCount}</p>
           <p className="text-[10px] font-sans uppercase tracking-widest text-ivory-300">XP: {player.xp}</p>
        </div>
        <div className="absolute bottom-32 left-8 hidden lg:block z-10 pointer-events-none opacity-30">
           <div className="w-[1px] h-32 bg-gold-600/50 mb-2 relative"><div className="absolute top-0 left-[-2px] w-[5px] h-[5px] bg-gold-400 rounded-full" /></div>
           <p className="text-[8px] font-mono tracking-widest text-gold-500">25.61° N, 85.14° E</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 max-w-5xl mx-auto flex flex-col items-center mt-12"
        >
          <span className="text-gold-500 tracking-[0.4em] text-xs sm:text-sm uppercase mb-6 font-bold flex items-center gap-3">
            <Compass className="w-4 h-4" /> The Heritage Exploration Game
          </span>
          
          <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-serif font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-[#EAE3D5] to-[#D8CCB8] drop-shadow-2xl mb-8 leading-[0.9]">
            Ancient<br />Realms<br />
            <span className="text-3xl md:text-5xl lg:text-7xl font-light italic text-gold-400/90 mt-2 block tracking-wider">of Bharat</span>
          </h1>
          
          <p className="text-sm md:text-lg text-ivory-300 max-w-xl font-light leading-relaxed mb-12 drop-shadow-md">
            Explore real places.<br />
            Uncover forgotten stories.<br />
            Be a part of India&apos;s living heritage.
          </p>

          <button 
            onClick={() => scrollToElement("destinations-nav")}
            className="px-8 py-4 bg-gold-600 text-charcoal-900 font-bold uppercase tracking-[0.3em] text-xs hover:bg-[#F5EFE4] transition-colors shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] cursor-pointer"
          >
            Explore Dhara
          </button>
        </motion.div>
      </section>

      {/* =========================================
          02 & 03 HERITAGE CIRCULAR GALLERY
      ========================================= */}
      <div id="destinations-nav">
        <HeritageCircularGallery onEnterRealm={handleEnterWorld} />
      </div>

      {/* =========================================
          04 DESTINATION EDITORIAL SECTIONS
      ========================================= */}
      <div className="w-full bg-ivory-200 relative z-10 pt-24 pb-32">
        {CITIES_DATA.map((city, index) => {
          const isEven = index % 2 === 0;
          const displayIndex = String(index + 1).padStart(2, '0');
          const completedCount = city.chapters.filter(ch => chapterProgress[ch.id]?.completed).length;
          const images = getImagesForCity(city.id);

          return (
            <section 
              key={`realm-${city.id}`} 
              id={`realm-${city.id}`}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center max-w-[1800px] mx-auto ${index === CITIES_DATA.length - 1 ? 'mb-0' : 'mb-32 lg:mb-48'} group`}
            >
              {/* TEXT CONTENT (40%) */}
              <div className="w-full lg:w-[40%] flex flex-col px-8 lg:px-20 py-16 order-2 lg:order-none bg-ivory-100/50 lg:bg-transparent">
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-gold-600 font-serif text-3xl font-light">{displayIndex} <span className="text-charcoal-800/30 text-xl">/ 06</span></span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-[#201D18]/10 to-transparent" />
                </div>
                
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold-600 mb-4">{city.region}</span>
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-widest uppercase text-charcoal-800 mb-6 leading-tight">
                  {city.name}
                </h2>
                
                <p className="text-lg md:text-xl text-[#29251F] italic font-light mb-12 border-l border-gold-600/30 pl-6 py-2 leading-relaxed">
                  “{city.subtitle}”
                </p>

                <div className="grid grid-cols-2 gap-8 mb-12">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-charcoal-800/50 mb-2">Historical Era</p>
                    <p className="text-sm font-mono text-charcoal-800">{city.era}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-charcoal-800/50 mb-2">Progress</p>
                    <p className="text-sm font-mono text-charcoal-800">{completedCount} <span className="text-charcoal-800/40">/ {city.chapters.length} Chapters</span></p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-charcoal-800/50 mb-2">Category</p>
                    <p className="text-sm font-mono text-charcoal-800">Heritage Site</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button 
                    onClick={() => handleEnterWorld(city.id)}
                    className="px-8 py-5 bg-charcoal-800 text-ivory-100 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold-600 hover:text-charcoal-900 transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-[0_4px_20px_rgba(32,29,24,0.1)] hover:shadow-[0_4px_30px_rgba(32,29,24,0.2)]"
                  >
                    Enter Realm <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              {/* CINEMATIC IMAGE SLOT (60%) */}
              <div className="w-full lg:w-[60%] aspect-[4/3] lg:aspect-[16/10] relative order-1 lg:order-none overflow-hidden bg-charcoal-900">
                <img 
                  src={images.hero} 
                  alt={`${city.name} Hero`} 
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                />
                
                {images.detail && (
                  <div className={`absolute bottom-12 ${isEven ? 'right-12' : 'left-12'} w-1/3 aspect-[3/4] border-8 border-[#F4F0E7] shadow-2xl overflow-hidden hidden md:block`}>
                     <img src={images.detail} alt={`${city.name} Detail`} className="w-full h-full object-cover" />
                  </div>
                )}
                
                {/* Provenance Tag */}
                <div className="absolute top-6 left-6 z-10 bg-ivory-200/90 backdrop-blur-md border border-[#201D18]/10 px-4 py-2 shadow-xl">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-charcoal-800 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> EVIDENCE-BASED RECONSTRUCTION
                  </span>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* =========================================
          05 HERITAGE PASSPORT
      ========================================= */}
      <section className="relative w-full py-32 bg-charcoal-900 text-ivory-100 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-gold-500 mb-6 font-bold flex items-center gap-2"><Trophy className="w-3 h-3"/> Player Progression</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-widest uppercase text-white mb-8 leading-tight">
              Heritage<br />Passport
            </h3>
            <p className="text-base text-ivory-300 leading-relaxed mb-12 max-w-md">
              Every discovery, every solved mystery, and every truth uncovered is recorded here. Earn stars to unlock advanced realms and elevate your scholar rank.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-charcoal-800 border border-white/5 p-5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-ivory-300/50 block mb-2">Total Stars</span>
                <span className="text-3xl font-serif text-gold-400">{getTotalStars()}</span>
              </div>
              <div className="bg-charcoal-800 border border-white/5 p-5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-ivory-300/50 block mb-2">Scholar Level</span>
                <span className="text-3xl font-serif text-white">{player.level}</span>
              </div>
              <div className="bg-charcoal-800 border border-white/5 p-5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-ivory-300/50 block mb-2">Worlds Discovered</span>
                <span className="text-3xl font-serif text-white">{discoveredCount}</span>
              </div>
              <div className="bg-charcoal-800 border border-white/5 p-5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-ivory-300/50 block mb-2">Player Title</span>
                <span className="text-sm font-serif italic text-gold-400">{player.title}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex justify-center lg:justify-end relative">
            {/* The Passport Visual */}
            <div className="w-full max-w-[600px] aspect-[4/3] sm:aspect-[3/2] relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-md border border-[#F4F0E7]/10 group">
               <img src="/passport-asset.png" alt="Passport Base" className="absolute inset-0 w-full h-full object-cover" />
               
               {/* Passport Overlay Content */}
               <div className="absolute inset-0 flex">
                  {/* Left Page: Player ID */}
                  <div className="w-1/2 h-full relative p-6 sm:p-10 flex flex-col items-center text-center border-r border-[#171513]/10">
                     <div className="w-full flex justify-between items-start mb-6">
                       <img src="/LOGO.png" className="h-6 opacity-40 invert" alt="Logo" />
                       <span className="text-[8px] font-mono tracking-widest text-charcoal-900/40">IND-HRT-0{player.level}</span>
                     </div>
                     
                     <div className="relative w-24 h-32 sm:w-32 sm:h-40 border-2 border-[#171513]/20 p-1 mb-4 bg-ivory-100/50 overflow-hidden cursor-pointer">
                        {player.profilePhoto ? (
                          <img src={player.profilePhoto} alt="Player" className="w-full h-full object-cover object-top grayscale contrast-125 sepia-[.3]" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                            <User className="w-10 h-10 text-charcoal-900 mb-2" />
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          title="Change Photo"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                useGameStore.getState().setProfilePhoto(ev.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                     </div>
                     
                     <div className="flex gap-2">
                       <button className="text-[8px] uppercase tracking-widest font-bold text-charcoal-900/60 hover:text-charcoal-900 transition-colors pointer-events-none group-hover:pointer-events-auto">Upload Photo</button>
                       {player.profilePhoto && (
                         <button 
                           onClick={() => useGameStore.getState().setProfilePhoto(undefined)}
                           className="text-[8px] uppercase tracking-widest font-bold text-red-800/60 hover:text-red-800 transition-colors pointer-events-none group-hover:pointer-events-auto"
                         >
                           Remove
                         </button>
                       )}
                     </div>

                     <div className="mt-auto w-full text-left border-t border-[#171513]/10 pt-4">
                        <p className="text-[7px] uppercase tracking-widest text-charcoal-900/40 mb-1">Scholar Name</p>
                        <p className="text-sm font-serif font-bold text-charcoal-900 uppercase">{player.name}</p>
                     </div>
                  </div>

                  {/* Right Page: Stamps */}
                  <div className="w-1/2 h-full relative p-6 sm:p-10 flex flex-col">
                     <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-charcoal-900/40 border-b border-[#171513]/10 pb-4 mb-6 text-center">
                       Visas & Stamps
                     </p>
                     <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-2">
                       {CITIES_DATA.map((city, i) => {
                         const hasVisited = city.chapters?.[0] && chapterProgress[city.chapters[0].id]?.completed;
                         if (!hasVisited) return null;
                         return (
                           <div key={i} className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center transform ${i%2===0 ? '-rotate-12' : 'rotate-6'} border-[#8B0000]/60 text-[#8B0000]/80 shadow-sm mix-blend-multiply bg-[#8B0000]/5`}>
                             <div className="text-center">
                               <span className="block text-[6px] sm:text-[7px] font-bold uppercase tracking-widest opacity-80">{city.region}</span>
                               <span className="block text-[10px] sm:text-xs font-serif font-bold uppercase">{city.name}</span>
                               <span className="block text-[5px] sm:text-[6px] font-mono mt-1 opacity-70">VERIFIED</span>
                             </div>
                           </div>
                         );
                       })}
                       {discoveredCount === 0 && (
                         <div className="w-full h-full flex items-center justify-center mt-10">
                           <p className="text-xs font-serif italic text-charcoal-900/30 text-center">Your journey is just beginning.<br/>No stamps recorded.</p>
                         </div>
                       )}
                     </div>
                  </div>
               </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* =========================================
          06 VEDA 
      ========================================= */}
      <section className="relative w-full py-32 bg-ivory-100 border-y border-[#D8CCB8] z-10 overflow-hidden text-charcoal-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(212,175,55,0.05)_0%,_transparent_50%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 w-full text-center md:text-left order-2 md:order-1">
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-widest uppercase text-charcoal-800 mb-4">VEDA</h2>
            <h3 className="text-lg md:text-xl text-gold-600 font-bold tracking-[0.3em] uppercase mb-8">Your AI Heritage Guide</h3>
            <div className="flex gap-6 mb-8 justify-center md:justify-start">
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-800">Ask.</span>
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-800">Explore.</span>
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-800">Learn.</span>
            </div>
            <p className="text-base md:text-lg text-[#29251F] leading-relaxed mb-10 max-w-lg mx-auto md:mx-0">
              Navigate the depths of Indian history with an AI companion grounded strictly in verified archaeological data. If you are stuck on a riddle, VEDA holds the key.
            </p>
            <button 
              onClick={openVeda}
              className="px-10 py-5 bg-charcoal-800 text-ivory-100 font-bold uppercase tracking-[0.2em] text-sm hover:bg-gold-600 hover:text-charcoal-900 transition-colors cursor-pointer shadow-lg"
            >
              Consult Veda Now
            </button>
          </div>
          <div className="flex-1 w-full flex justify-center order-1 md:order-2">
             <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border border-gold-600/20 flex items-center justify-center relative bg-ivory-200/50 backdrop-blur-sm shadow-xl">
               <div className="absolute inset-4 rounded-full border border-dashed border-gold-600/30 animate-[spin_60s_linear_infinite]" />
               <div className="w-48 h-48 bg-gradient-to-tr from-gold-400 to-[#EAE3D5] rounded-full blur-3xl opacity-30 animate-pulse" />
               <img src="/veda/neutral.svg" alt="Veda AI" className="absolute w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]" />
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          07 TRUTH LAYER
      ========================================= */}
      <section className="relative w-full py-32 bg-charcoal-900 text-ivory-100 z-10 border-b border-[#29251F]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
             <ShieldCheck className="w-12 h-12 text-ivory-300 mx-auto mb-6 opacity-80" />
             <h2 className="text-[10px] uppercase tracking-[0.5em] text-ivory-300 mb-4 font-mono">Authenticity Engine</h2>
             <h3 className="text-4xl md:text-5xl font-serif font-bold tracking-widest uppercase mb-8 text-white">
               The Truth Layer
             </h3>
             <div className="inline-flex items-center gap-4 border border-red-900/30 bg-red-950/20 px-8 py-4">
               <span className="text-sm md:text-base font-mono tracking-widest text-red-400 uppercase">No Verified Source</span>
               <ArrowRight className="w-5 h-5 text-red-500/50" />
               <span className="text-sm md:text-base font-mono tracking-widest text-red-400 uppercase">No Historical Claim</span>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
             {[
               { id: '01', title: 'VERIFIED HISTORICAL FACT', desc: 'Epigraphy, excavation reports, ASI verified data, carbon dating.', status: 'VERIFIED', icon: 'bg-green-600' },
               { id: '02', title: 'SOURCE-QUALIFIED INFO', desc: 'Contemporary chronicles, travelogues, edicts, royal inscriptions.', status: 'QUALIFIED', icon: 'bg-blue-500' },
               { id: '03', title: 'EVIDENCE-BASED RECONSTRUCTION', desc: 'Architectural models based strictly on ruined foundations.', status: 'RECONSTRUCTED', icon: 'bg-yellow-500' },
               { id: '04', title: 'GAMEPLAY FICTION', desc: 'Character names, interactive dialogue, and puzzle mechanisms.', status: 'FICTION', icon: 'bg-[#D8CCB8]' }
             ].map((tier) => (
               <div key={tier.id} className="group relative border border-white/10 bg-charcoal-800 overflow-hidden hover:border-gold-500/50 transition-colors cursor-pointer flex flex-col h-full">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-gold-500/50 transition-colors" />
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-8">
                       <span className="text-xl font-serif text-white/20 group-hover:text-gold-500/40 transition-colors">{tier.id}</span>
                       <div className={`w-2 h-2 rounded-full ${tier.icon} animate-pulse shadow-[0_0_10px_currentColor]`} />
                     </div>
                     <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-4 leading-relaxed group-hover:text-gold-400 transition-colors">{tier.title}</h4>
                     <p className="text-[10px] text-ivory-300/60 uppercase tracking-widest font-mono mb-8 leading-relaxed flex-1">
                       {tier.desc}
                     </p>
                     <div className="mt-auto border-t border-white/10 pt-4 flex justify-between items-center overflow-hidden">
                       <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/40">Status</span>
                       <span className="text-[9px] uppercase tracking-widest font-mono text-white/80 transform translate-y-8 group-hover:translate-y-0 transition-transform">{tier.status}</span>
                     </div>
                  </div>
                  {/* Scanline Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/10 to-transparent opacity-0 group-hover:opacity-100 -translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite]" />
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* =========================================
          08 FOOTER
      ========================================= */}
      <footer className="w-full bg-charcoal-900 text-ivory-100 pt-24 pb-12 border-t-4 border-gold-600 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <img src="/LOGO.png" alt="DHARA" className="h-10 w-auto mb-6 object-contain" />
            <p className="text-xs text-ivory-300 leading-relaxed max-w-xs font-serif italic">
              Where India&apos;s Heritage Flows.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
             <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold-500 mb-2">Explore</h4>
             <button onClick={() => scrollToElement("destinations-nav")} className="text-left text-sm text-ivory-300 hover:text-white transition-colors cursor-pointer w-fit">World</button>
             <Link href="/profile" className="text-sm text-ivory-300 hover:text-white transition-colors">Passport</Link>
             <Link href="/profile" className="text-sm text-ivory-300 hover:text-white transition-colors">Quests</Link>
          </div>
          
          <div className="flex flex-col gap-4">
             <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold-500 mb-2">Systems</h4>
             <button onClick={() => scrollToElement("destinations-nav")} className="text-left text-sm text-ivory-300 hover:text-white transition-colors cursor-pointer w-fit">Truth Layer</button>
             <button onClick={openVeda} className="text-left text-sm text-ivory-300 hover:text-white transition-colors cursor-pointer w-fit">VEDA AI</button>
          </div>

          <div className="flex flex-col gap-4">
             <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold-500 mb-2">Information</h4>
             <span className="text-sm text-ivory-300 cursor-pointer hover:text-white transition-colors">About DHARA</span>
             <span className="text-sm text-ivory-300 cursor-pointer hover:text-white transition-colors">Historical Integrity</span>
             <span className="text-sm text-ivory-300 cursor-pointer hover:text-white transition-colors">Accessibility</span>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-ivory-300/50 uppercase tracking-widest">
            © {new Date().getFullYear()} Government of Bharat - Heritage Project
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] text-ivory-300/50 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="text-[10px] text-ivory-300/50 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Terms of Use</span>
          </div>
        </div>
      </footer>

    </div>
  );
}



