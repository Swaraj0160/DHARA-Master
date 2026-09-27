"use client";
import { useRouter } from 'next/navigation';

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
    hero: `/destinations/${id}.jpg`,
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
  const router = useRouter();
  // eslint-disable-next-line
  useEffect(() => setMounted(true), []);

  const handleEnterWorld = (cityId: string) => {
    router.push(`/realm/${cityId}`);
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
          
          <p className="text-sm md:text-lg text-[#5a5145] max-w-xl font-normal leading-relaxed mb-12 drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">
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


    </div>
  );
}



