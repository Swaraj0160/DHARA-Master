"use client";

import { useGameStore } from "@/store/gameState";
import { CITIES_DATA } from "@/data/gameContent";
import { Play } from "lucide-react";
import { getImagesForCity } from "./WorldMap";

interface RealmIntroProps {
  cityId: string;
  onEnter: () => void;
}

export default function RealmIntro({ cityId, onEnter }: RealmIntroProps) {
  const { chapterProgress } = useGameStore();
  const city = CITIES_DATA.find((c) => c.id === cityId);
  
  if (!city) return null;

  const completedCount = city.chapters.filter(ch => chapterProgress[ch.id]?.completed).length;
  const images = getImagesForCity(city.id);
  const displayIndex = String(CITIES_DATA.findIndex(c => c.id === cityId) + 1).padStart(2, '0');

  return (
    <div className="w-full min-h-screen bg-ivory-200 relative z-10 flex flex-col justify-center">
      <section className="flex flex-col lg:flex-row items-center max-w-[1800px] mx-auto group">
        {/* TEXT CONTENT (40%) */}
        <div className="w-full lg:w-[40%] flex flex-col px-8 lg:px-20 py-16 bg-ivory-100/50 lg:bg-transparent">
          <div className="flex items-center gap-6 mb-8">
            <span className="text-gold-600 font-serif text-3xl font-light">{displayIndex} <span className="text-charcoal-800/30 text-xl">/ 06</span></span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#201D18]/10 to-transparent" />
          </div>
          
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-gold-600 mb-4">{city.region}</span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-widest uppercase text-charcoal-800 mb-6 leading-tight">
            {city.name}
          </h2>
          
          <p className="text-lg md:text-xl text-[#29251F] italic font-light mb-12 border-l border-gold-600/30 pl-6 py-2 leading-relaxed">
            &quot;{city.subtitle}&quot;
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
              onClick={onEnter}
              className="px-8 py-5 bg-charcoal-800 text-ivory-100 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold-600 hover:text-charcoal-900 transition-colors flex items-center justify-center gap-3 cursor-pointer shadow-[0_4px_20px_rgba(32,29,24,0.1)] hover:shadow-[0_4px_30px_rgba(32,29,24,0.2)]"
            >
              Enter Realm <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* CINEMATIC IMAGE SLOT (60%) */}
        <div className="w-full lg:w-[60%] aspect-[4/3] lg:aspect-[16/10] lg:h-screen relative overflow-hidden bg-charcoal-900">
          <img 
            src={images.hero} 
            alt={`${city.name} Hero`} 
            className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
          />
          
          {images.detail && (
            <div className={`absolute bottom-12 right-12 w-1/3 aspect-[3/4] border-8 border-[#F4F0E7] shadow-2xl overflow-hidden hidden md:block`}>
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
    </div>
  );
}
