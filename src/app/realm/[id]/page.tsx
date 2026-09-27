"use client";

import { use, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useRouter, notFound } from "next/navigation";
import Image from "next/image";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA } from "@/data/gameContent";
import WorldHUD from "@/components/game/WorldHUD";
import { ArrowLeft, PlayCircle, MapPin, Milestone, History, ChevronDown } from "lucide-react";

import { useMounted } from "@/hooks/useMounted";

const VIDEO_MAP: Record<string, string> = {
  nalanda: '/videos/Nalanda_ruins_aerial_view_1080p_20260927142303.mp4',
  hampi: '/videos/Granite_boulder_on_Hampi_ridge_20260927141444.mp4',
  konark: '/videos/Camera_panning_stone_chariot_wheel_20260927141500.mp4',
  varanasi: '/videos/Ganges_riverfront_ghats_at_sunset_20260927142809.mp4',
  madurai: '/videos/Temple_towers_revealing_at_twilight_20260927142517.mp4',
  pataliputra: '/videos/PatliputraNew.mp4', 
};

const getImagesForCity = (id: string) => {
  return {
    hero: `/destinations/${id}.jpg`,
    detail: `/destinations/${id}-detail.png`
  };
};

function RealmDetailInner({ id }: { id: string }) {
  const router = useRouter();
  const city = CITIES_DATA.find(c => c.id === id);
  const { chapterProgress, startEnterRealm } = useGameStore();

  const [entering, setEntering] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Perfectly sized dimensions to prevent ANY clipping under the title inside 100dvh
  const startWidth = isMobile ? "85vw" : "40vw";
  const startHeight = isMobile ? "25vh" : "35vh";
  const endWidth = "95vw";
  const endHeight = isMobile ? "55vh" : "65vh";

  const videoWidth = useTransform(smoothProgress, [0, 1], [startWidth, endWidth]);
  const videoHeight = useTransform(smoothProgress, [0, 1], [startHeight, endHeight]);
  const videoRadius = useTransform(smoothProgress, [0, 1], ["24px", "16px"]);

  if (!city) return null;

  const images = getImagesForCity(city.id);
  const progress = city.chapters.filter(ch => chapterProgress[ch.id]?.completed).length;
  const videoUrl = VIDEO_MAP[city.id];

  const handleEnterRealm = () => {
    setEntering(true);
    setTimeout(() => {
      startEnterRealm(city.id);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen text-charcoal-900 font-sans selection:bg-gold-600/30 overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND LAYER */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#110f0d]">
        <Image 
          src={images.hero} 
          alt={`${city.name} global background`} 
          fill 
          className="object-cover opacity-60 mix-blend-screen"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
      </div>

      {/* GLOBAL NAVIGATION */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <WorldHUD />
        </div>
      </div>

      <AnimatePresence>
        {entering && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-charcoal-950 flex flex-col items-center justify-center text-ivory-100"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 border-t-2 border-l-2 border-gold-500 rounded-full animate-spin mb-6"
            />
            <div className="font-serif uppercase tracking-[0.3em] text-sm text-gold-400 font-bold">
              Translating to {city.era}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================
          SECTION 1: HERO (SCROLL EXPANSION WITH NO CLIPPING)
      ==================================================== */}
      <div ref={heroRef} className="relative w-full h-[150vh]">
        <div className="sticky top-0 w-full h-[100dvh] flex flex-col items-center justify-start pt-20 md:pt-28 px-4 overflow-hidden">
          
          <button 
            onClick={() => router.push("/")}
            className="absolute top-24 left-6 lg:left-12 flex items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-ivory-100/70 hover:text-gold-400 transition-colors group z-40"
            aria-label="Back to Map"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Map
          </button>

          {/* Heading & Subtitle */}
          <div className="flex flex-col items-center text-center z-20 mt-4 mb-6 md:mb-8 max-w-4xl shrink-0">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-bold tracking-widest text-ivory-100 uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-tight mb-2 md:mb-3">
              {city.name}
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-mono uppercase tracking-[0.25em] text-gold-400 mb-2 md:mb-4 drop-shadow-md">
              {city.region}, India
            </p>
            <p className="hidden md:block text-sm md:text-lg font-serif italic text-ivory-200 drop-shadow-md px-4">
              The ancient seat of empires and scholarship
            </p>
          </div>

          {/* Cinematic Video Expansion Container */}
          <motion.div
            style={{ 
              width: videoWidth, 
              height: videoHeight, 
              borderRadius: videoRadius 
            }}
            className="relative z-30 bg-charcoal-900 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-ivory-100/10 shrink-0"
          >
            {(!isVideoLoaded || isVideoError) && (
              <Image 
                src={images.detail} 
                alt={`${city.name} detailed view`} 
                fill 
                className={`object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
                priority
              />
            )}
            
            {videoUrl && !isVideoError && (
              <video 
                src={videoUrl} 
                poster={images.detail}
                autoPlay muted loop playsInline
                preload="metadata"
                onCanPlay={() => setIsVideoLoaded(true)}
                onError={() => setIsVideoError(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
            
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </motion.div>

          <div className="absolute bottom-6 flex flex-col items-center gap-2 text-ivory-100/50">
            <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Explore</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </div>

        </div>
      </div>

      {/* ====================================================
          SECTION 2: REALM INFORMATION
      ==================================================== */}
      <div className="relative z-40 w-full bg-[#F5EFE4]/95 backdrop-blur-md flex flex-col items-center py-16 md:py-24 px-6 md:px-12 border-t border-[#D8CCB8]/60 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
          
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-charcoal-900 uppercase tracking-widest mb-6">
            {city.name}
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#8c5b36] font-bold mb-10">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-600" /> {city.region}, India
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#D8CCB8]" />
            <span className="flex items-center gap-2">
              <History className="w-4 h-4 text-gold-600" /> {city.era}
            </span>
          </div>
          
          <p className="text-lg md:text-xl text-[#5a5145] font-serif italic leading-relaxed mb-12 max-w-3xl">
            {city.description}
          </p>

          <div className="bg-[#EAE3D5] border border-[#D8CCB8] px-6 md:px-8 py-4 rounded-full flex items-center justify-center gap-4 shadow-sm mb-12">
            <Milestone className="w-5 h-5 text-gold-600" />
            <span className="font-mono text-xs md:text-sm font-bold text-charcoal-900 tracking-wider">
              {progress} / {city.chapters.length} Chapters Explored
            </span>
          </div>

          <button 
            onClick={handleEnterRealm}
            className="group relative overflow-hidden bg-charcoal-900 text-ivory-100 font-mono text-sm uppercase tracking-[0.3em] font-bold py-5 px-12 md:py-6 md:px-16 flex items-center justify-center gap-4 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-gold-600/30 rounded-none"
            aria-label={`Enter ${city.name}`}
          >
            <div className="absolute inset-0 bg-gold-600 transform translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            <span className="relative z-10 flex items-center gap-4 group-hover:text-charcoal-900 transition-colors duration-500">
              Enter Realm <PlayCircle className="w-5 h-5 md:w-6 md:h-6" />
            </span>
          </button>

        </div>
      </div>

    </div>
  );
}

export default function RealmDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const mounted = useMounted();

  const city = CITIES_DATA.find(c => c.id === params.id);
  if (!city) {
    notFound();
  }

  if (!mounted) return null;

  return <RealmDetailInner id={params.id} />;
}
