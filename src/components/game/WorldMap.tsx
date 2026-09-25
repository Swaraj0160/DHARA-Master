"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { CITIES_DATA, City } from "@/data/gameContent";
import { useGameStore } from "@/store/gameState";
import { useVedaStore } from "@/store/vedaStore";
import { Compass, Play, ArrowRight, ShieldCheck, Star, Trophy, Award } from "lucide-react";

// Image mapping based on existing assets
const getImagesForCity = (id: string) => {
  const hasDetail = ["nalanda", "pataliputra"].includes(id);
  return {
    hero: `/destinations/${id}-hero.png`,
    detail: hasDetail ? `/destinations/${id}-detail.png` : undefined
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
    <button 
      onClick={() => {
        scrollToElement(`realm-${city.id}`);
      }}
      className="group relative flex flex-col text-left overflow-hidden border border-white/10 hover:border-gold-500/50 transition-all duration-500 bg-[#080605] w-full aspect-[3/4] cursor-pointer"
    >
       <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#030202]">
         <img src={images.hero} alt={city.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-100" />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
       </div>
       
       <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full justify-end">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400 mb-2">{city.region}</span>
          <h3 className="text-3xl sm:text-4xl font-serif font-bold tracking-widest uppercase text-white mb-2 drop-shadow-md">{city.name}</h3>
          <span className="text-[10px] uppercase tracking-widest text-parchment-300 mb-4 font-mono border border-white/20 px-2 py-1 inline-block w-max">{city.era}</span>
          
          <p className="text-xs sm:text-sm text-parchment-400 mb-6 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-500">{city.description}</p>
          
          <div className="flex items-center justify-between border-t border-white/20 pt-5 mt-auto">
             <div className="flex flex-col gap-1">
               <span className="text-[9px] uppercase tracking-[0.2em] text-white/40">Discoveries</span>
               <span className="text-xs font-mono text-gold-300">{progress} <span className="text-white/40">/ {city.chapters.length}</span></span>
             </div>
             <div className="w-10 h-10 rounded-full border border-gold-500/30 flex items-center justify-center group-hover:bg-gold-500 transition-colors">
               <ArrowRight className="w-4 h-4 text-gold-500 group-hover:text-black transition-colors" />
             </div>
          </div>
       </div>
    </button>
  );
}

export default function WorldMap() {
  const { startEnterRealm, chapterProgress, getTotalStars, player } = useGameStore();
  const { openVeda } = useVedaStore();
  const [mounted, setMounted] = useState(false);
  const [enteringCityId, setEnteringCityId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => setMounted(true), []);

  const handleEnterWorld = (cityId: string) => {
    setEnteringCityId(cityId);
    setTimeout(() => startEnterRealm(cityId), 1500);
  };

  if (!mounted) return <div className="min-h-screen bg-[#050403]" />;

  const discoveredCount = CITIES_DATA.filter(c => c.chapters.some(ch => chapterProgress[ch.id]?.completed)).length;

  return (
    <div className="relative w-full bg-[#050403] text-white font-sans overflow-x-hidden selection:bg-gold-500/30">
      
      {/* ENTERING TRANSITION OVERLAY */}
      <AnimatePresence>
        {enteringCityId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 border-t-2 border-l-2 border-gold-400 rounded-full animate-spin"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
          HERO: ANCIENT REALMS OF BHARAT
      ========================================= */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden pt-20">
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(40,30,20,0.6)_0%,_#050403_80%)] mix-blend-screen" />
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
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-parchment-100 to-gold-400 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] mb-8 leading-none">
            Ancient<br />Realms<br />
            <span className="text-3xl md:text-5xl lg:text-7xl font-light italic text-gold-300 mt-4 block">of Bharat</span>
          </h1>
          <p className="text-base md:text-xl text-parchment-300 max-w-2xl font-light leading-relaxed mb-16">
            Explore real places. Uncover forgotten stories. Be a part of India's living heritage.
          </p>
        </motion.div>
      </section>

      {/* =========================================
          REALM FILTER
      ========================================= */}
      <div className="sticky top-0 z-40 w-full bg-[#050403]/90 backdrop-blur-xl border-y border-white/10 py-4 px-6 shadow-2xl">
        <ul className="flex items-center justify-start md:justify-center gap-6 lg:gap-10 max-w-7xl mx-auto overflow-x-auto no-scrollbar">
          <li>
            <button 
              onClick={() => setActiveFilter("all")}
              className={`text-[10px] md:text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 px-4 py-2 rounded-full border cursor-pointer ${activeFilter === "all" ? 'border-gold-500 bg-gold-500/10 text-gold-400' : 'border-transparent text-white/50 hover:text-white'}`}
            >
              All Realms
            </button>
          </li>
          {CITIES_DATA.map(city => (
            <li key={`filter-${city.id}`}>
              <button 
                onClick={() => {
                  setActiveFilter(city.id);
                  scrollToElement(`realm-${city.id}`);
                }}
                className={`text-[10px] md:text-xs tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 px-4 py-2 rounded-full border cursor-pointer ${activeFilter === city.id ? 'border-gold-500 bg-gold-500/10 text-gold-400' : 'border-transparent text-white/50 hover:text-white'}`}
              >
                {city.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* =========================================
          DESTINATION CARDS GRID
      ========================================= */}
      <section className="relative z-10 w-full max-w-[1800px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {CITIES_DATA.filter(c => activeFilter === "all" || c.id === activeFilter).map(city => {
            const completedCount = city.chapters.filter(ch => chapterProgress[ch.id]?.completed).length;
            return <DestinationCard key={`card-${city.id}`} city={city} progress={completedCount} onClick={() => scrollToElement(`realm-${city.id}`)} />;
          })}
        </div>
      </section>

      {/* =========================================
          DESTINATION EDITORIAL SECTIONS
      ========================================= */}
      <div className="w-full bg-[#080605] border-t border-white/5 relative z-10 pt-24 pb-32">
        {CITIES_DATA.filter(c => activeFilter === "all" || c.id === activeFilter).map((city, index) => {
          const isEven = index % 2 === 0;
          const displayIndex = String(index + 1).padStart(2, '0');
          const completedCount = city.chapters.filter(ch => chapterProgress[ch.id]?.completed).length;
          const images = getImagesForCity(city.id);

          return (
            <section 
              key={`realm-${city.id}`} 
              id={`realm-${city.id}`}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center max-w-[1800px] mx-auto mb-32 lg:mb-48 group`}
            >
              {/* TEXT CONTENT (40%) */}
              <div className="w-full lg:w-[40%] flex flex-col px-8 lg:px-20 py-16 order-2 lg:order-none">
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-gold-500 font-serif text-3xl font-light">{displayIndex} <span className="text-white/20 text-xl">/ 06</span></span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-gold-500/30 to-transparent" />
                </div>
                
                <span className="text-xs uppercase tracking-[0.4em] text-gold-400 mb-4">{city.region}</span>
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-widest uppercase text-white mb-6 leading-tight">
                  {city.name}
                </h2>
                
                <p className="text-lg md:text-xl text-parchment-200 italic font-light mb-12 border-l border-gold-500/30 pl-6 py-2 leading-relaxed">
                  “{city.subtitle}”
                </p>

                <div className="grid grid-cols-2 gap-8 mb-12">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2">Historical Era</p>
                    <p className="text-sm font-mono text-parchment-100">{city.era}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2">Progress</p>
                    <p className="text-sm font-mono text-gold-300">{completedCount} <span className="text-white/40">/ {city.chapters.length} Chapters</span></p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2">Category</p>
                    <p className="text-sm font-mono text-parchment-100">UNESCO World Heritage</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button 
                    onClick={() => handleEnterWorld(city.id)}
                    className="px-8 py-5 bg-gold-500 text-earth-950 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold-400 transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-[0_4px_20px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.4)]"
                  >
                    Enter Realm <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              {/* CINEMATIC IMAGE SLOT (60%) */}
              <div className="w-full lg:w-[60%] aspect-[4/3] lg:aspect-[16/10] relative order-1 lg:order-none overflow-hidden">
                <img 
                  src={images.hero} 
                  alt={`${city.name} Hero`} 
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080605] via-transparent to-transparent lg:hidden" />
                <div className={`absolute inset-0 bg-gradient-to-${isEven ? 'r' : 'l'} from-[#080605] via-[#080605]/20 to-transparent hidden lg:block`} />
                
                {images.detail && (
                  <div className={`absolute bottom-12 ${isEven ? 'right-12' : 'left-12'} w-1/3 aspect-[3/4] border-4 border-[#080605] shadow-2xl overflow-hidden hidden md:block`}>
                     <img src={images.detail} alt={`${city.name} Detail`} className="w-full h-full object-cover" />
                  </div>
                )}
                
                {/* Provenance Tag */}
                <div className="absolute top-6 left-6 z-10 bg-[#080605]/90 backdrop-blur-md border border-white/10 px-4 py-2 shadow-xl">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-white/80 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> REAL PHOTOGRAPH
                  </span>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* =========================================
          SECTION: HERITAGE PASSPORT
      ========================================= */}
      <section className="relative w-full py-32 bg-[#050403] border-t border-white/5 z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-gold-500 mb-6 font-bold">Player Progression</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold tracking-widest uppercase text-white mb-8">
              Heritage Passport
            </h3>
            <p className="text-base text-parchment-300 leading-relaxed mb-12 max-w-md">
              Every discovery, every solved mystery, and every truth uncovered is recorded here. Earn stars to unlock advanced realms and elevate your scholar rank.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-[#080605] border border-white/5 p-6 flex flex-col gap-2">
                <Star className="w-6 h-6 text-gold-400 mb-2" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Total Stars</span>
                <span className="text-2xl font-mono text-gold-300">{getTotalStars()}</span>
              </div>
              <div className="bg-[#080605] border border-white/5 p-6 flex flex-col gap-2">
                <Trophy className="w-6 h-6 text-gold-400 mb-2" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Scholar Level</span>
                <span className="text-2xl font-mono text-white">{player.level}</span>
              </div>
              <div className="bg-[#080605] border border-white/5 p-6 flex flex-col gap-2">
                <Compass className="w-6 h-6 text-gold-400 mb-2" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Worlds Discovered</span>
                <span className="text-2xl font-mono text-white">{discoveredCount} <span className="text-white/30 text-sm">/ {CITIES_DATA.length}</span></span>
              </div>
              <div className="bg-[#080605] border border-white/5 p-6 flex flex-col gap-2">
                <Award className="w-6 h-6 text-gold-400 mb-2" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Player Title</span>
                <span className="text-sm font-serif italic text-gold-300">{player.title}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-md aspect-[3/4] bg-[#0a0806] border border-gold-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative p-8 flex flex-col items-center text-center">
               <div className="absolute inset-2 border border-dashed border-white/5 pointer-events-none" />
               <img src="/LOGO.png" alt="DHARA" className="w-16 h-auto opacity-50 mb-12" />
               <h4 className="text-2xl font-serif text-white uppercase tracking-widest mb-4">Official Passport</h4>
               <p className="text-xs text-parchment-400 uppercase tracking-widest mb-8 border-b border-white/10 pb-4">Government of Bharat</p>
               
               <div className="flex flex-wrap justify-center gap-4 mt-auto">
                 {/* Visual Stamps */}
                 {CITIES_DATA.slice(0,4).map((city, i) => (
                   <div key={i} className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transform ${i%2===0 ? '-rotate-12' : 'rotate-6'} ${city.chapters?.[0] && chapterProgress[city.chapters[0].id]?.completed ? 'border-red-900/50 text-red-900/50' : 'border-white/5 text-white/5'}`}>
                     <span className="text-[8px] font-bold uppercase tracking-tighter">{city.name}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION: VEDA 
      ========================================= */}
      <section className="relative w-full py-32 bg-[#080605] border-t border-white/5 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(212,175,55,0.08)_0%,_transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 w-full text-center md:text-left order-2 md:order-1">
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-widest uppercase text-white mb-4">VEDA</h2>
            <h3 className="text-lg md:text-xl text-gold-400 tracking-[0.3em] uppercase mb-8">Your AI Heritage Guide</h3>
            <div className="flex gap-6 mb-8 justify-center md:justify-start">
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Ask.</span>
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Explore.</span>
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-white">Learn.</span>
            </div>
            <p className="text-base md:text-lg text-parchment-300 leading-relaxed mb-10 max-w-lg mx-auto md:mx-0">
              Navigate the depths of Indian history with an AI companion grounded strictly in verified archaeological data. If you are stuck on a riddle, VEDA holds the key.
            </p>
            <button 
              onClick={openVeda}
              className="px-10 py-5 bg-[#030202] border border-gold-500/50 text-gold-300 font-bold uppercase tracking-[0.2em] text-sm hover:bg-gold-500 hover:text-earth-950 transition-colors cursor-pointer shadow-lg"
            >
              Consult Veda Now
            </button>
          </div>
          <div className="flex-1 w-full flex justify-center order-1 md:order-2">
             <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border border-gold-500/20 flex items-center justify-center relative bg-black/50 backdrop-blur-sm">
               <div className="absolute inset-4 rounded-full border border-dashed border-gold-500/30 animate-[spin_60s_linear_infinite]" />
               <div className="w-48 h-48 bg-gradient-to-tr from-gold-900 to-amber-600 rounded-full blur-3xl opacity-20 animate-pulse" />
               <img src="/veda/neutral.svg" alt="Veda AI" className="absolute w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]" />
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION: TRUTH LAYER
      ========================================= */}
      <section className="relative w-full py-32 bg-[#050403] border-t border-white/5 z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <ShieldCheck className="w-12 h-12 text-gold-500 mx-auto mb-8" />
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-gold-500 mb-6 font-bold">Authenticity Engine</h2>
          <h3 className="text-3xl md:text-5xl font-serif font-bold tracking-widest uppercase text-white mb-6">
            The Truth Layer
          </h3>
          <p className="text-lg text-parchment-300 italic mb-16 border border-white/10 inline-block px-8 py-3 rounded-full bg-white/5">
            NO VERIFIED SOURCE <ArrowRight className="inline w-4 h-4 mx-2 text-gold-500" /> NO HISTORICAL CLAIM
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            {[
              { tier: "VERIFIED HISTORICAL FACT", desc: "Epigraphy, excavation reports, ASI verified data, carbon dating." },
              { tier: "SOURCE-QUALIFIED INFO", desc: "Contemporary chronicles, travelogues, edicts, royal inscriptions." },
              { tier: "EVIDENCE-BASED RECONSTRUCTION", desc: "Architectural models based strictly on ruined foundations." },
              { tier: "GAMEPLAY FICTION", desc: "Character names, interactive dialogue, and puzzle mechanisms." }
            ].map((t) => (
              <div key={t.tier} className="bg-[#080605] border border-white/5 p-8 flex flex-col justify-between hover:border-gold-500/30 transition-colors">
                <span className="text-[10px] uppercase tracking-widest text-gold-500 block mb-4 border-b border-white/10 pb-4 font-bold">{t.tier}</span>
                <p className="text-xs text-parchment-400 leading-relaxed font-sans">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION: GAME LOOP
      ========================================= */}
      <section className="relative w-full py-32 bg-[#080605] border-t border-white/5 z-10 text-center">
        <h2 className="text-[10px] uppercase tracking-[0.5em] text-gold-500 mb-16 font-bold">How DHARA Works</h2>
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center items-center gap-6 md:gap-12 font-serif uppercase tracking-[0.2em] text-sm md:text-xl">
          {["Explore", "Discover", "Interact", "Solve", "Choose", "Unlock", "Connect"].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-6 md:gap-12 group">
              <span className="text-parchment-400 hover:text-white transition-colors cursor-default">{step}</span>
              {i < arr.length - 1 && <ArrowRight className="w-5 h-5 text-gold-500/30 group-hover:text-gold-500 transition-colors" />}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          FINAL EXPLORE CALL
      ========================================= */}
      <section className="relative w-full py-48 bg-[#030202] text-center flex flex-col justify-center items-center z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.15)_0%,_#030202_70%)] pointer-events-none" />
        <h2 className="text-4xl md:text-7xl font-serif font-bold tracking-widest uppercase text-white mb-12 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-10">
          Ready to Enter?
        </h2>
        <button 
          onClick={() => scrollToElement("destinations-nav")}
          className="relative z-10 px-12 py-6 bg-gold-500 text-earth-950 font-bold uppercase tracking-[0.3em] text-sm hover:bg-gold-400 transition-colors cursor-pointer shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)]"
        >
          Select Your Realm
        </button>
      </section>

    </div>
  );
}
