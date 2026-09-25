"use client";

import { useMounted } from "@/hooks/useMounted";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA, City } from "@/data/gameContent";
import CityVerticalCard from "./CityVerticalCard";

export default function WorldMap() {
  const mounted = useMounted();
  const { startEnterRealm, chapterProgress, getTotalStars, ambientEffectsEnabled } = useGameStore();

  const totalGlobalStars = mounted ? getTotalStars() : 0;

  const handleSelectCity = (city: City) => {
    startEnterRealm(city.id);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0d0a08] overflow-hidden select-none flex flex-col justify-start">
      {/* Background Cartographic Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(44,26,18,0.7)_0%,_#090705_80%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* Rotating Astrological Mandala Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] sm:w-[950px] sm:h-[950px] rounded-full border border-gold-500/10 pointer-events-none flex items-center justify-center">
        <div className={`w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full border border-dashed border-gold-400/15 ${ambientEffectsEnabled ? "animate-[spin_120s_linear_infinite]" : ""}`} />
        <div className={`absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full border border-gold-500/10 ${ambientEffectsEnabled ? "animate-[spin_80s_linear_infinite_reverse]" : ""}`} />
      </div>

      {/* ── TOP HEADER SECTION ── */}
      <div className="relative z-20 pt-16 px-6 max-w-7xl mx-auto w-full text-center">
        <div className="flex flex-col items-center justify-center gap-2 pb-8 border-b border-gold-500/20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-200 to-gold-500 drop-shadow-xl uppercase">
            DHARA
          </h1>
          <h2 className="text-xl sm:text-2xl font-serif font-light tracking-wider text-parchment-200 mt-2">
            Ancient Realms of Bharat
          </h2>
          <p className="text-sm font-serif italic text-parchment-300/80 mt-2 max-w-2xl">
            Choose a heritage destination to explore its chapters, solve historical riddles, and restore sacred knowledge.
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center py-10 overflow-y-auto">
        <div className="w-full max-w-[1600px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 justify-items-center">
            {CITIES_DATA.map((city) => {
              // ALL CITIES UNLOCKED for the homepage phase
              const unlocked = true; 
              
              const starsEarned = city.chapters.reduce((acc, ch) => {
                const p = chapterProgress[ch.id];
                return acc + (p?.completed ? p.stars : 0);
              }, 0);
              const maxStars = city.chapters.length * 3;
              const completedChapters = city.chapters.filter(
                (ch) => chapterProgress[ch.id]?.completed
              ).length;

              return (
                <div key={city.id} className="w-full flex justify-center transform transition-transform hover:scale-[1.02]">
                  <CityVerticalCard
                    city={city}
                    isUnlocked={unlocked}
                    starsEarned={starsEarned}
                    maxStars={maxStars}
                    completedChapters={completedChapters}
                    totalChapters={city.chapters.length}
                    totalGlobalStars={totalGlobalStars}
                    onSelect={() => handleSelectCity(city)}
                    onLockedClick={() => {}} // Not needed as all are unlocked
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

