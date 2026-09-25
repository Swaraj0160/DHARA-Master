"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { CITIES_DATA, City } from "@/data/gameContent";
import { useGameStore } from "@/store/gameState";
import { useVedaStore } from "@/store/vedaStore";
import { Compass, Play, ArrowRight, ShieldCheck, Star, Trophy, Award, ChevronRight, ChevronLeft, MapPin } from "lucide-react";
import Link from "next/link";

const getImagesForCity = (id: string) => {
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
      className="group relative flex flex-col text-left overflow-hidden border border-[#201D18]/10 hover:border-gold-600/50 transition-colors duration-500 bg-[#29251F] w-[85vw] md:w-[45vw] lg:w-[28vw] aspect-[3/4] cursor-pointer shrink-0 snap-center shadow-2xl"
    >
       <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#171513]">
         <motion.img 
           initial={{ scale: 1 }}
           whileHover={{ scale: 1.05 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           src={images.hero} alt={city.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/40 to-transparent opacity-90" />
       </div>
       
       <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full justify-end transform transition-transform duration-500 group-hover:-translate-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400 mb-2">{city.region}</span>
          <h3 className="text-3xl sm:text-4xl font-serif font-bold tracking-widest uppercase text-[#F5EFE4] mb-2 drop-shadow-md">{city.name}</h3>
          <span className="text-[10px] uppercase tracking-widest text-[#D8CCB8] mb-4 font-mono border border-[#D8CCB8]/20 px-2 py-1 inline-block w-max backdrop-blur-sm bg-black/20">{city.era}</span>
          
          <p className="text-xs sm:text-sm text-[#D8CCB8] mb-6 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500">{city.description}</p>
          
          <div className="flex items-center justify-between border-t border-[#D8CCB8]/20 pt-5 mt-auto">
             <div className="flex flex-col gap-1">
               <span className="text-[9px] uppercase tracking-[0.2em] text-[#D8CCB8]/60">Discoveries</span>
               <span className="text-xs font-mono text-gold-400">{progress} <span className="text-[#D8CCB8]/40">/ {city.chapters.length}</span></span>
             </div>
             <div className="w-10 h-10 rounded-full border border-gold-500/30 flex items-center justify-center group-hover:bg-gold-600 transition-colors bg-[#171513]/50 backdrop-blur-md">
               <ArrowRight className="w-4 h-4 text-gold-400 group-hover:text-[#171513] transition-colors" />
             </div>
          </div>
       </div>
    </motion.button>
  );
}

export default function WorldMap() {
  const { startEnterRealm, chapterProgress, getTotalStars, player } = useGameStore();
  const { openVeda } = useVedaStore();
  const [mounted, setMounted] = useState(false);
  const [enteringCityId, setEnteringCityId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => setMounted(true), []);

  const handleEnterWorld = (cityId: string) => {
    setEnteringCityId(cityId);
    setTimeout(() => startEnterRealm(cityId), 1500);
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth * 0.5;
      carouselRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#F4F0E7]" />;

  const discoveredCount = CITIES_DATA.filter(c => c.chapters.some(ch => chapterProgress[ch.id]?.completed)).length;

  return (
    <div className="relative w-full bg-[#F4F0E7] text-[#201D18] font-sans overflow-x-hidden selection:bg-gold-600/30">
      
      {/* ENTERING TRANSITION OVERLAY */}
      <AnimatePresence>
        {enteringCityId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-[#171513] flex items-center justify-center"
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
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden pt-20 bg-[#171513] text-[#F5EFE4]">
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ y: backgroundY }}
        >
          {/* Using a subtle map-like dark background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(40,35,30,0.6)_0%,_#171513_80%)] mix-blend-normal" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 max-w-5xl mx-auto flex flex-col items-center mt-12"
        >
          <span className="text-gold-500 tracking-[0.4em] text-xs sm:text-sm uppercase mb-8 font-bold flex items-center gap-3">
            <Compass className="w-4 h-4" /> The Heritage Exploration Game
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-[#EAE3D5] to-gold-600 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] mb-8 leading-none">
            Ancient<br />Realms<br />
            <span className="text-3xl md:text-5xl lg:text-7xl font-light italic text-gold-400 mt-4 block">of Bharat</span>
          </h1>
          <p className="text-base md:text-xl text-[#D8CCB8] max-w-2xl font-light leading-relaxed mb-16">
            Explore real places. Uncover forgotten stories. Be a part of India's living heritage.
          </p>

          {/* Interactive Hero Map Markers */}
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
             {CITIES_DATA.map(city => (
               <button 
                 key={`marker-${city.id}`}
                 onClick={() => scrollToElement(`realm-${city.id}`)}
                 className="flex items-center gap-2 px-4 py-2 border border-[#D8CCB8]/20 rounded-full bg-[#211E1A]/80 backdrop-blur-md hover:bg-gold-600 hover:text-[#171513] transition-all group shadow-lg cursor-pointer"
               >
                 <MapPin className="w-3 h-3 text-gold-500 group-hover:text-[#171513]" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">{city.name}</span>
               </button>
             ))}
          </div>
        </motion.div>
      </section>

      {/* =========================================
          02 REALM NAVIGATION
      ========================================= */}
      <div id="destinations-nav" className="sticky top-0 z-40 w-full bg-[#EAE3D5]/90 backdrop-blur-xl border-b border-[#201D18]/10 py-4 px-6 shadow-sm">
        <ul className="flex items-center justify-start md:justify-center gap-6 lg:gap-10 max-w-7xl mx-auto overflow-x-auto no-scrollbar">
          <li><span className="text-[10px] md:text-xs tracking-[0.2em] uppercase whitespace-nowrap px-4 py-2 text-[#201D18]/50 font-bold">Realms</span></li>
          {CITIES_DATA.map(city => (
            <li key={`nav-${city.id}`}>
              <button 
                onClick={() => scrollToElement(`realm-${city.id}`)}
                className="text-[10px] md:text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-colors px-4 py-2 text-[#201D18] hover:text-gold-600 font-bold cursor-pointer"
              >
                {city.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* =========================================
          03 REALM HORIZONTAL EXPLORER
      ========================================= */}
      <section className="relative z-10 w-full bg-[#F4F0E7] py-24 md:py-32 overflow-hidden border-b border-[#D8CCB8]">
        <div className="max-w-[1800px] mx-auto px-6 mb-8 flex justify-between items-end">
          <div>
             <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-gold-600 mb-2">Explore the World</h2>
             <h3 className="text-3xl md:text-4xl font-serif text-[#201D18]">Heritage Destinations</h3>
          </div>
          <div className="hidden md:flex gap-4">
             <button onClick={() => scrollCarousel('left')} className="w-12 h-12 rounded-full border border-[#201D18]/20 flex items-center justify-center hover:bg-[#201D18] hover:text-[#F4F0E7] transition-colors cursor-pointer">
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button onClick={() => scrollCarousel('right')} className="w-12 h-12 rounded-full border border-[#201D18]/20 flex items-center justify-center hover:bg-[#201D18] hover:text-[#F4F0E7] transition-colors cursor-pointer">
               <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
        
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-6 md:gap-8 px-6 pb-12 snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CITIES_DATA.map(city => {
            const completedCount = city.chapters.filter(ch => chapterProgress[ch.id]?.completed).length;
            return <DestinationCard key={`card-${city.id}`} city={city} progress={completedCount} onClick={() => scrollToElement(`realm-${city.id}`)} />;
          })}
          {/* Spacer to allow last card to scroll to center on large screens */}
          <div className="w-[10vw] shrink-0 pointer-events-none" />
        </div>
      </section>

      {/* =========================================
          04 DESTINATION EDITORIAL SECTIONS
      ========================================= */}
      <div className="w-full bg-[#EAE3D5] relative z-10 pt-24 pb-32">
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
              <div className="w-full lg:w-[40%] flex flex-col px-8 lg:px-20 py-16 order-2 lg:order-none bg-[#F4F0E7]/50 lg:bg-transparent">
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-gold-600 font-serif text-3xl font-light">{displayIndex} <span className="text-[#201D18]/30 text-xl">/ 06</span></span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-[#201D18]/10 to-transparent" />
                </div>
                
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold-600 mb-4">{city.region}</span>
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-widest uppercase text-[#201D18] mb-6 leading-tight">
                  {city.name}
                </h2>
                
                <p className="text-lg md:text-xl text-[#29251F] italic font-light mb-12 border-l border-gold-600/30 pl-6 py-2 leading-relaxed">
                  “{city.subtitle}”
                </p>

                <div className="grid grid-cols-2 gap-8 mb-12">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#201D18]/50 mb-2">Historical Era</p>
                    <p className="text-sm font-mono text-[#201D18]">{city.era}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#201D18]/50 mb-2">Progress</p>
                    <p className="text-sm font-mono text-[#201D18]">{completedCount} <span className="text-[#201D18]/40">/ {city.chapters.length} Chapters</span></p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#201D18]/50 mb-2">Category</p>
                    <p className="text-sm font-mono text-[#201D18]">Heritage Site</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button 
                    onClick={() => handleEnterWorld(city.id)}
                    className="px-8 py-5 bg-[#201D18] text-[#F5EFE4] font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold-600 hover:text-[#171513] transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-[0_4px_20px_rgba(32,29,24,0.1)] hover:shadow-[0_4px_30px_rgba(32,29,24,0.2)]"
                  >
                    Enter Realm <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              {/* CINEMATIC IMAGE SLOT (60%) */}
              <div className="w-full lg:w-[60%] aspect-[4/3] lg:aspect-[16/10] relative order-1 lg:order-none overflow-hidden bg-[#171513]">
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
                <div className="absolute top-6 left-6 z-10 bg-[#EAE3D5]/90 backdrop-blur-md border border-[#201D18]/10 px-4 py-2 shadow-xl">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-[#201D18] flex items-center gap-2">
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
      <section className="relative w-full py-32 bg-[#211E1A] text-[#F5EFE4] z-10 overflow-hidden">
        {/* Subtle noise/texture overlay for dark section */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-gold-500 mb-6 font-bold">Player Progression</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold tracking-widest uppercase text-white mb-8">
              Heritage Passport
            </h3>
            <p className="text-base text-[#D8CCB8] leading-relaxed mb-12 max-w-md">
              Every discovery, every solved mystery, and every truth uncovered is recorded here. Earn stars to unlock advanced realms and elevate your scholar rank.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-[#171513] border border-white/5 p-6 flex flex-col gap-2">
                <Star className="w-6 h-6 text-gold-400 mb-2" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D8CCB8]/60">Total Stars</span>
                <span className="text-2xl font-mono text-gold-400">{getTotalStars()}</span>
              </div>
              <div className="bg-[#171513] border border-white/5 p-6 flex flex-col gap-2">
                <Trophy className="w-6 h-6 text-gold-400 mb-2" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D8CCB8]/60">Scholar Level</span>
                <span className="text-2xl font-mono text-white">{player.level}</span>
              </div>
              <div className="bg-[#171513] border border-white/5 p-6 flex flex-col gap-2">
                <Compass className="w-6 h-6 text-gold-400 mb-2" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D8CCB8]/60">Worlds Discovered</span>
                <span className="text-2xl font-mono text-white">{discoveredCount} <span className="text-[#D8CCB8]/40 text-sm">/ {CITIES_DATA.length}</span></span>
              </div>
              <div className="bg-[#171513] border border-white/5 p-6 flex flex-col gap-2">
                <Award className="w-6 h-6 text-gold-400 mb-2" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#D8CCB8]/60">Player Title</span>
                <span className="text-sm font-serif italic text-gold-400">{player.title}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-md aspect-[3/4] bg-[#F4F0E7] border border-[#201D18]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative p-8 flex flex-col items-center text-center">
               <div className="absolute inset-2 border border-dashed border-[#201D18]/20 pointer-events-none" />
               <img src="/LOGO.png" alt="DHARA" className="w-16 h-auto opacity-30 mb-12 invert" />
               <h4 className="text-2xl font-serif text-[#201D18] uppercase tracking-widest mb-4 font-bold">Official Passport</h4>
               <p className="text-xs text-[#201D18]/60 font-bold uppercase tracking-widest mb-8 border-b border-[#201D18]/10 pb-4">Government of Bharat</p>
               
               <div className="flex flex-wrap justify-center gap-4 mt-auto">
                 {/* Visual Stamps */}
                 {CITIES_DATA.slice(0,4).map((city, i) => (
                   <div key={i} className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transform ${i%2===0 ? '-rotate-12' : 'rotate-6'} ${city.chapters?.[0] && chapterProgress[city.chapters[0].id]?.completed ? 'border-red-800/80 text-red-800/80' : 'border-[#201D18]/10 text-[#201D18]/10'}`}>
                     <span className="text-[8px] font-bold uppercase tracking-tighter">{city.name}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          06 VEDA 
      ========================================= */}
      <section className="relative w-full py-32 bg-[#F4F0E7] border-y border-[#D8CCB8] z-10 overflow-hidden text-[#201D18]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(212,175,55,0.05)_0%,_transparent_50%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 w-full text-center md:text-left order-2 md:order-1">
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-widest uppercase text-[#201D18] mb-4">VEDA</h2>
            <h3 className="text-lg md:text-xl text-gold-600 font-bold tracking-[0.3em] uppercase mb-8">Your AI Heritage Guide</h3>
            <div className="flex gap-6 mb-8 justify-center md:justify-start">
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#201D18]">Ask.</span>
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#201D18]">Explore.</span>
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#201D18]">Learn.</span>
            </div>
            <p className="text-base md:text-lg text-[#29251F] leading-relaxed mb-10 max-w-lg mx-auto md:mx-0">
              Navigate the depths of Indian history with an AI companion grounded strictly in verified archaeological data. If you are stuck on a riddle, VEDA holds the key.
            </p>
            <button 
              onClick={openVeda}
              className="px-10 py-5 bg-[#201D18] text-[#F5EFE4] font-bold uppercase tracking-[0.2em] text-sm hover:bg-gold-600 hover:text-[#171513] transition-colors cursor-pointer shadow-lg"
            >
              Consult Veda Now
            </button>
          </div>
          <div className="flex-1 w-full flex justify-center order-1 md:order-2">
             <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border border-gold-600/20 flex items-center justify-center relative bg-[#EAE3D5]/50 backdrop-blur-sm shadow-xl">
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
      <section className="relative w-full py-32 bg-[#EAE3D5] text-[#201D18] z-10 border-b border-[#D8CCB8]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <ShieldCheck className="w-12 h-12 text-gold-600 mx-auto mb-8" />
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-gold-600 mb-6 font-bold">Authenticity Engine</h2>
          <h3 className="text-3xl md:text-5xl font-serif font-bold tracking-widest uppercase mb-6">
            The Truth Layer
          </h3>
          <p className="text-lg text-[#201D18]/80 italic mb-16 border border-[#201D18]/10 inline-block px-8 py-3 rounded-full bg-[#F4F0E7] shadow-sm">
            NO VERIFIED SOURCE <ArrowRight className="inline w-4 h-4 mx-2 text-gold-600" /> NO HISTORICAL CLAIM
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            {[
              { tier: "VERIFIED HISTORICAL FACT", desc: "Epigraphy, excavation reports, ASI verified data, carbon dating." },
              { tier: "SOURCE-QUALIFIED INFO", desc: "Contemporary chronicles, travelogues, edicts, royal inscriptions." },
              { tier: "EVIDENCE-BASED RECONSTRUCTION", desc: "Architectural models based strictly on ruined foundations." },
              { tier: "GAMEPLAY FICTION", desc: "Character names, interactive dialogue, and puzzle mechanisms." }
            ].map((t) => (
              <div key={t.tier} className="bg-[#F4F0E7] border border-[#201D18]/10 p-8 flex flex-col justify-between hover:border-gold-600/50 transition-colors shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-gold-600 block mb-4 border-b border-[#201D18]/10 pb-4 font-bold">{t.tier}</span>
                <p className="text-xs text-[#201D18]/70 leading-relaxed font-sans">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          08 FOOTER
      ========================================= */}
      <footer className="w-full bg-[#171513] text-[#F5EFE4] pt-24 pb-12 border-t-4 border-gold-600 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <img src="/LOGO.png" alt="DHARA" className="h-10 w-auto mb-6 object-contain" />
            <p className="text-xs text-[#D8CCB8] leading-relaxed max-w-xs font-serif italic">
              Where India's Heritage Flows.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
             <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold-500 mb-2">Explore</h4>
             <button onClick={() => scrollToElement("destinations-nav")} className="text-left text-sm text-[#D8CCB8] hover:text-white transition-colors cursor-pointer w-fit">World</button>
             <Link href="/profile" className="text-sm text-[#D8CCB8] hover:text-white transition-colors">Passport</Link>
             <Link href="/profile" className="text-sm text-[#D8CCB8] hover:text-white transition-colors">Quests</Link>
          </div>
          
          <div className="flex flex-col gap-4">
             <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold-500 mb-2">Systems</h4>
             <button onClick={() => scrollToElement("destinations-nav")} className="text-left text-sm text-[#D8CCB8] hover:text-white transition-colors cursor-pointer w-fit">Truth Layer</button>
             <button onClick={openVeda} className="text-left text-sm text-[#D8CCB8] hover:text-white transition-colors cursor-pointer w-fit">VEDA AI</button>
          </div>

          <div className="flex flex-col gap-4">
             <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold-500 mb-2">Information</h4>
             <span className="text-sm text-[#D8CCB8] cursor-pointer hover:text-white transition-colors">About DHARA</span>
             <span className="text-sm text-[#D8CCB8] cursor-pointer hover:text-white transition-colors">Historical Integrity</span>
             <span className="text-sm text-[#D8CCB8] cursor-pointer hover:text-white transition-colors">Accessibility</span>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-[#D8CCB8]/50 uppercase tracking-widest">
            © {new Date().getFullYear()} Government of Bharat - Heritage Project
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] text-[#D8CCB8]/50 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="text-[10px] text-[#D8CCB8]/50 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Terms of Use</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
