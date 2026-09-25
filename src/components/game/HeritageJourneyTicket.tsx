"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useDragControls, PanInfo } from 'framer-motion';
import { CITIES_DATA } from '@/data/gameContent';
import { MapPin, X, Fingerprint, QrCode } from 'lucide-react';

interface HeritageJourneyTicketProps {
  cityId: string;
  onAccept: () => void;
  onCancel: () => void;
}

export default function HeritageJourneyTicket({ cityId, onAccept, onCancel }: HeritageJourneyTicketProps) {
  const city = CITIES_DATA.find(c => c.id === cityId);
  const controls = useAnimation();
  const dragControls = useDragControls();
  const [isTorn, setIsTorn] = useState(false);
  const [ticketNo] = useState(() => Math.floor(Date.now() / 1000).toString().slice(-6));
  
  if (!city) return null;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If dragged right past 100px threshold
    if (info.offset.x > 100) {
      setIsTorn(true);
      controls.start({
        x: 400,
        y: 100,
        rotate: 45,
        opacity: 0,
        transition: { duration: 0.8, ease: "easeInOut" }
      }).then(() => {
        onAccept();
      });
    } else {
      // Snap back if not torn enough
      controls.start({ x: 0, y: 0, rotate: 0 });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal-900/90 backdrop-blur-md px-4"
    >
      <button 
        onClick={onCancel}
        className="absolute top-8 right-8 text-ivory-300 hover:text-white transition-colors"
      >
        <X className="w-8 h-8" />
      </button>

      {/* TICKET WRAPPER */}
      <motion.div 
        initial={{ y: 50, scale: 0.9, rotateX: 20 }}
        animate={{ y: 0, scale: 1, rotateX: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative flex flex-col md:flex-row w-full max-w-[800px] h-auto md:h-[350px] shadow-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] perspective-1000 select-none"
      >
        
        {/* MAIN BODY (LEFT) */}
        <div className="relative flex-1 bg-ivory-100 rounded-t-3xl md:rounded-t-none md:rounded-l-3xl overflow-hidden shadow-inner flex flex-col border border-[#D8CCB8]">
          {/* Subtle Texture */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
          
          {/* Faded Background Art */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-2/3 bg-cover bg-left opacity-[0.15] mix-blend-multiply filter grayscale pointer-events-none"
            style={{ backgroundImage: `url(${city.artwork})` }}
          />
          
          <div className="relative p-6 md:p-8 flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h5 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-charcoal-800/60 mb-1 font-mono">
                  DHARA HERITAGE JOURNEY
                </h5>
                <h4 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-gold-600 font-serif">
                  Dhara Heritage Project
                </h4>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase font-mono tracking-widest text-charcoal-800/40">Ticket No.</span>
                <span className="block text-sm font-mono tracking-widest text-charcoal-800 font-bold">
                  {city.id.toUpperCase()}-{ticketNo}
                </span>
              </div>
            </div>

            {/* Title / Details */}
            <div className="my-6 md:my-0">
              <h2 className="text-4xl md:text-6xl font-serif font-black text-charcoal-900 tracking-tight leading-none mb-2">
                {city.name}
              </h2>
              <p className="text-sm md:text-base font-serif text-charcoal-800/80 italic mb-4 max-w-md">
                {city.subtitle}
              </p>
              
              <div className="flex gap-6 mt-4 border-t border-[#D8CCB8] pt-4 w-fit">
                <div>
                  <span className="block text-[8px] md:text-[10px] uppercase font-mono tracking-widest text-charcoal-800/50 mb-1">Era</span>
                  <span className="block text-xs md:text-sm font-bold uppercase tracking-widest text-charcoal-800">{city.era}</span>
                </div>
                <div>
                  <span className="block text-[8px] md:text-[10px] uppercase font-mono tracking-widest text-charcoal-800/50 mb-1">Region</span>
                  <span className="block text-xs md:text-sm font-bold uppercase tracking-widest text-charcoal-800">{city.region}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PERFORATION (DESKTOP / MOBILE) */}
        <div className="relative w-full h-[20px] md:w-[20px] md:h-full bg-ivory-100 flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 flex flex-row md:flex-col items-center justify-between pointer-events-none">
             {[...Array(20)].map((_, i) => (
               <div key={i} className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-charcoal-900 shadow-inner opacity-40" />
             ))}
           </div>
           {/* Dashed Cut Line */}
           <div className="w-full h-[1px] md:w-[1px] md:h-full border-t-2 md:border-t-0 md:border-l-2 border-dashed border-charcoal-800/30" />
        </div>

        {/* TEAR STUB (RIGHT / BOTTOM) */}
        <motion.div 
          drag={isTorn ? false : "x"} // Only drag on X for desktop right now (or handle y for mobile if needed, but let's stick to X for simplicity as a universal "swipe right to tear")
          dragControls={dragControls}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={{ right: 1, left: 0, top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          animate={controls}
          className="relative w-full md:w-[250px] bg-gold-600 rounded-b-3xl md:rounded-b-none md:rounded-r-3xl overflow-hidden shadow-inner cursor-grab active:cursor-grabbing flex flex-col border border-gold-500 z-10 hover:bg-gold-500 transition-colors"
        >
           {/* Subtle Texture */}
           <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
           
           <div className="p-6 md:p-8 flex flex-row md:flex-col items-center md:items-start justify-between h-full w-full pointer-events-none">
             
             <div className="hidden md:flex flex-col gap-2">
               <QrCode className="w-16 h-16 text-charcoal-900 opacity-60" />
               <span className="text-[8px] font-mono font-bold tracking-[0.3em] uppercase text-charcoal-900/60">ADMIT ONE</span>
             </div>

             <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left md:mt-auto">
               <Fingerprint className="w-8 h-8 text-charcoal-900 opacity-80 mb-2 md:hidden" />
               <h3 className="text-xl md:text-2xl font-serif font-black text-charcoal-900 leading-none uppercase tracking-tight w-full">
                 Tear To Enter
               </h3>
               <span className="text-[10px] md:text-xs font-mono font-bold tracking-widest text-charcoal-900/60 mt-2 uppercase w-full">
                 &rarr; Swipe &rarr;
               </span>
             </div>
             
           </div>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
