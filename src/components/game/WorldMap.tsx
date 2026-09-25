"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { CITIES_DATA, City } from "@/data/gameContent";
import { useGameStore } from "@/store/gameState";
import { useVedaStore } from "@/store/vedaStore";
import { ChevronDown, Compass, CheckCircle2, ShieldCheck, Play, ArrowRight, LibraryBig, Milestone } from "lucide-react";

// Helper for smooth scrolling to a section
const scrollToElement = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export default function WorldMap() {
  const { startEnterRealm, chapterProgress } = useGameStore();
  const { openVeda } = useVedaStore();
  const [mounted, setMounted] = useState(false);
  const [enteringCityId, setEnteringCityId] = useState<string | null>(null);

  // For scroll-linked animations
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEnterWorld = (cityId: string) => {
    setEnteringCityId(cityId);
    // Micro-transition before route
    setTimeout(() => {
      startEnterRealm(cityId);
    }, 1500);
  };

  if (!mounted) return <div className="min-h-screen bg-[#030202]" />;

  return (
    <div className="relative w-full bg-[#030202] text-white font-serif overflow-x-hidden selection:bg-gold-500/30">
      
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

      {/* GLOBAL BACKGROUND LAYER */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(80,60,40,0.4)_0%,_#030202_80%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
      </motion.div>

      {/* =========================================
          SECTION 01: WORLD INTRO
      ========================================= */}
      <section className="relative w-full h-screen flex flex-col justify-center items-center text-center z-10 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <span className="text-gold-500 tracking-[0.4em] text-sm uppercase mb-6 font-bold flex items-center gap-2">
            <Compass className="w-4 h-4" /> The Heritage Exploration Game
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-parchment-100 to-gold-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-6">
            Ancient Realms<br />of Bharat
          </h1>
          <p className="text-lg md:text-xl text-parchment-300 max-w-2xl font-light italic mb-12">
            Explore verified historical sites. Uncover forgotten stories. Become part of India&apos;s living heritage.
          </p>
          
          <button 
            onClick={() => scrollToElement("destinations-nav")}
            className="flex flex-col items-center gap-3 text-white/50 hover:text-gold-400 transition-colors cursor-pointer group"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">Begin Journey</span>
            <ChevronDown className="w-5 h-5 animate-bounce group-hover:animate-none" />
          </button>
        </motion.div>

        {/* Floating VEDA panel on hero right */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-end gap-3 pointer-events-auto"
        >
          <div className="text-right">
            <h3 className="text-gold-400 font-bold tracking-[0.2em] uppercase text-sm">VEDA</h3>
            <p className="text-xs text-parchment-400 font-sans mt-1">Your AI Heritage Guide</p>
          </div>
          <button 
            onClick={openVeda}
            className="px-6 py-3 bg-earth-900/80 backdrop-blur-md border border-gold-500/30 rounded-full text-xs uppercase tracking-widest text-parchment-100 hover:bg-gold-500 hover:text-earth-950 transition-all shadow-lg flex items-center gap-2 cursor-pointer group"
          >
            Ask • Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* =========================================
          DESTINATION NAVIGATION (STICKY)
      ========================================= */}
      <nav id="destinations-nav" className="sticky top-20 z-40 w-full bg-[#030202]/90 backdrop-blur-md border-y border-gold-500/20 py-4 px-6 mb-24 hidden md:block">
        <ul className="flex items-center justify-center gap-8 lg:gap-12 max-w-7xl mx-auto overflow-x-auto no-scrollbar">
          <li><span className="text-xs tracking-[0.3em] uppercase text-white/40 cursor-default">All Realms</span></li>
          {CITIES_DATA.map(city => (
            <li key={`nav-${city.id}`}>
              <button 
                onClick={() => scrollToElement(`realm-${city.id}`)}
                className="text-xs tracking-[0.2em] uppercase text-parchment-300 hover:text-gold-400 transition-colors whitespace-nowrap cursor-pointer"
              >
                {city.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* =========================================
          DESTINATION SECTIONS (01 to 06)
      ========================================= */}
      <div className="w-full max-w-[1600px] mx-auto px-6 flex flex-col gap-32 md:gap-48 pb-32 z-10 relative">
        {CITIES_DATA.map((city, index) => {
          const isEven = index % 2 === 0;
          const displayIndex = String(index + 1).padStart(2, '0');
          const completedCount = city.chapters.filter(ch => chapterProgress[ch.id]?.completed).length;

          return (
            <section 
              key={`realm-${city.id}`} 
              id={`realm-${city.id}`}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center group`}
            >
              {/* Text Content */}
              <div className="flex-1 w-full flex flex-col items-start text-left">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gold-500 font-mono text-xl">{displayIndex} / 06</span>
                  <div className="h-[1px] w-16 bg-gold-500/30" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-parchment-400 border border-gold-500/30 px-3 py-1 rounded-full">
                    {city.region}
                  </span>
                </div>
                
                <h2 className="text-5xl md:text-6xl font-bold tracking-widest uppercase text-white drop-shadow-md mb-4">
                  {city.name}
                </h2>
                <h3 className="text-xl md:text-2xl text-gold-300 italic font-light mb-8">
                  {city.subtitle}
                </h3>
                
                <p className="text-base text-parchment-200 leading-relaxed mb-10 max-w-lg">
                  {city.description}
                </p>

                <div className="flex gap-8 mb-10 border-l-2 border-gold-500/30 pl-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">Chapters</p>
                    <p className="text-xl font-mono text-white">{city.chapters.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">Discoveries</p>
                    <p className="text-xl font-mono text-gold-300">{completedCount} / {city.chapters.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1">Era</p>
                    <p className="text-sm font-serif text-white max-w-[120px]">{city.era}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => handleEnterWorld(city.id)}
                    className="px-8 py-4 bg-gold-500 text-earth-950 font-bold uppercase tracking-[0.2em] text-sm hover:bg-gold-400 transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                  >
                    Enter Realm <Play className="w-4 h-4 fill-current" />
                  </button>
                  <button 
                    onClick={() => handleEnterWorld(city.id)}
                    className="px-8 py-4 border border-gold-500/30 text-parchment-200 font-bold uppercase tracking-[0.2em] text-sm hover:border-gold-400 hover:text-gold-400 transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* IMAGE SLOT: Ready for future authentic photography */}
              <div className="flex-1 w-full aspect-[4/5] md:aspect-[3/2] lg:aspect-[4/5] relative group-hover:scale-[1.02] transition-transform duration-1000 ease-out">
                {/* 
                  Neutral placeholder styling. 
                  When real images are provided, simply replace this div with an <img> tag referencing the asset.
                */}
                <div className="absolute inset-0 border border-white/10 bg-[#0a0806] flex items-center justify-center overflow-hidden shadow-2xl">
                  {/* Atmospheric grain/gradient to look intentional while waiting for photo */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(40,30,20,0.3)_0%,_#0a0806_100%)]" />
                  
                  <div className="relative flex flex-col items-center gap-4 text-center px-6 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                    <LibraryBig className="w-12 h-12 text-gold-500/50" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-gold-400 mb-2">Heritage Image Slot</p>
                      <p className="text-[10px] font-sans text-parchment-400 max-w-xs uppercase tracking-widest">
                        Awaiting verified archaeological photography for {city.name}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Provenance Tag Overlay */}
                <div className="absolute top-6 left-6 z-10 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-white/70">
                    EVIDENCE: PENDING VERIFICATION
                  </span>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* =========================================
          SECTION: TRUTH LAYER
      ========================================= */}
      <section className="relative w-full py-32 bg-earth-950 border-y border-gold-500/20 z-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <ShieldCheck className="w-12 h-12 text-gold-500 mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-widest uppercase text-white mb-6">
            The Truth Layer
          </h2>
          <p className="text-xl text-parchment-300 italic mb-12">
            No Verified Source <ArrowRight className="inline w-5 h-5 mx-2 text-gold-500" /> No Historical Claim
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {[
              { tier: "Tier I", title: "Archaeological", desc: "Epigraphy, excavation reports, ASI verified data." },
              { tier: "Tier II", title: "Primary Texts", desc: "Contemporary chronicles, travelogues, edicts." },
              { tier: "Tier III", title: "Academic", desc: "Peer-reviewed historical consensus." },
              { tier: "Tier IV", title: "Cultural Memory", desc: "Oral traditions, folklore, properly contextualized." }
            ].map((t) => (
              <div key={t.tier} className="bg-[#030202] border border-white/5 p-6 rounded-sm">
                <span className="text-[10px] uppercase tracking-widest text-gold-500 block mb-2">{t.tier}</span>
                <h4 className="text-lg font-bold text-white mb-2">{t.title}</h4>
                <p className="text-xs text-parchment-400 leading-relaxed font-sans">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION: VEDA 
      ========================================= */}
      <section className="relative w-full py-48 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(212,175,55,0.05)_0%,_transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 w-full text-center md:text-left">
            <h2 className="text-5xl font-bold tracking-widest uppercase text-white mb-2">VEDA</h2>
            <h3 className="text-xl text-gold-400 tracking-[0.2em] uppercase mb-8">Your AI Heritage Guide</h3>
            <p className="text-lg text-parchment-200 leading-relaxed mb-10 max-w-lg mx-auto md:mx-0">
              Navigate the depths of Indian history with a guide grounded strictly in the Truth Layer. Ask questions, explore context, and uncover secrets hidden in the ruins.
            </p>
            <button 
              onClick={openVeda}
              className="px-8 py-4 bg-earth-900 border border-gold-500/50 text-gold-300 font-bold uppercase tracking-[0.2em] text-sm hover:bg-gold-500 hover:text-earth-950 transition-colors cursor-pointer"
            >
              Consult Veda Now
            </button>
          </div>
          <div className="flex-1 w-full flex justify-center">
             {/* Veda Abstract Visual / Placeholder */}
             <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border border-gold-500/20 flex items-center justify-center relative">
               <div className="absolute inset-4 rounded-full border border-dashed border-gold-500/30 animate-[spin_60s_linear_infinite]" />
               <div className="w-32 h-32 bg-gradient-to-tr from-gold-600 to-amber-200 rounded-full blur-2xl opacity-20 animate-pulse" />
               <img src="/veda/neutral.svg" alt="Veda" className="absolute w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]" />
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION: GAME LOOP
      ========================================= */}
      <section className="relative w-full py-32 bg-[#030202] border-t border-white/5 z-10 text-center">
        <h2 className="text-xs uppercase tracking-[0.4em] text-gold-500 mb-16">The Core Experience</h2>
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center items-center gap-4 md:gap-8 font-serif uppercase tracking-widest text-sm md:text-base">
          {["Explore", "Discover", "Interact", "Solve", "Unlock"].map((step, i, arr) => (
            <div key={step} className="flex items-center gap-4 md:gap-8">
              <span className={i === 0 ? "text-white font-bold" : "text-parchment-400"}>{step}</span>
              {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-gold-500/30" />}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
