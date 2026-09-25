"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CITIES_DATA, City } from "@/data/gameContent";
import { useGameStore } from "@/store/gameState";

// Geographical percentages for the constellation
const VISUAL_COORDS: Record<string, { x: number; y: number }> = {
  "varanasi": { x: 42, y: 35 },
  "pataliputra": { x: 55, y: 28 },
  "nalanda": { x: 65, y: 38 },
  "konark": { x: 70, y: 58 },
  "hampi": { x: 35, y: 68 },
  "madurai": { x: 42, y: 88 },
};

// Travel route connecting the dots
const ROUTE_PATH = "M 42 35 L 55 28 L 65 38 L 70 58 L 35 68 L 42 88";

export default function WorldMap() {
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  const [enteringCityId, setEnteringCityId] = useState<string | null>(null);
  const { startEnterRealm, chapterProgress, getTotalStars } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const totalGlobalStars = mounted ? getTotalStars() : 0;
  const discoveredCount = mounted ? CITIES_DATA.filter(c => c.chapters.some(ch => chapterProgress[ch.id]?.completed)).length : 0;

  const handleCityClick = (city: City) => {
    setEnteringCityId(city.id);
    // Cinematic micro-transition into the world
    setTimeout(() => {
      startEnterRealm(city.id);
    }, 1500);
  };

  // Mouse Parallax for the dark canvas
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    if (enteringCityId) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth) * 2 - 1,
      y: (clientY / innerHeight) * 2 - 1,
    });
  };

  return (
    <div 
      className="relative w-full min-h-screen bg-[#030202] overflow-hidden select-none font-serif text-white flex flex-col"
      onMouseMove={handleMouseMove}
    >
      {/* ── 1. CINEMATIC BACKGROUND IMAGE ── */}
      {/* Defaults to a dark moody radial gradient when idle */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(40,30,20,0.8)_0%,_#030202_80%)]" />

      <AnimatePresence>
        {hoveredCity && (
          <motion.div
            key={hoveredCity.id}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ 
              opacity: enteringCityId === hoveredCity.id ? 1 : 0.4, 
              scale: enteringCityId === hoveredCity.id ? 1.15 : 1 + (mousePos.x * 0.02)
            }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <img 
              src={`/destinations/${hoveredCity.id}.jpg`} 
              alt={hoveredCity.name}
              className="w-full h-full object-cover object-center"
            />
            {/* Vignette to blend the edges into the dark canvas */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#030202_100%)] mix-blend-multiply" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. GEOGRAPHICAL CONSTELLATION ── */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none"
        animate={{
          x: mousePos.x * -15,
          y: mousePos.y * -15,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        {/* Travel Routes */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-15">
          <motion.path
            d={ROUTE_PATH}
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.2"
            strokeDasharray="1 1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </svg>

        {/* Nodes */}
        {CITIES_DATA.map((city) => {
          const coords = VISUAL_COORDS[city.id] || { x: 50, y: 50 };
          const isHovered = hoveredCity?.id === city.id;
          const isEntering = enteringCityId === city.id;
          const isDimmed = (hoveredCity && !isHovered) || (enteringCityId && !isEntering);

          return (
            <div
              key={city.id}
              className={`absolute flex flex-col items-center justify-center transition-all duration-700 pointer-events-auto cursor-crosshair
                ${isDimmed ? 'opacity-20 blur-[2px] scale-90' : 'opacity-100 scale-100'}
                ${isEntering ? 'opacity-0 scale-150 blur-xl' : ''}
              `}
              style={{ left: `${coords.x}%`, top: `${coords.y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => !enteringCityId && setHoveredCity(city)}
              onMouseLeave={() => !enteringCityId && setHoveredCity(null)}
              onClick={() => !enteringCityId && handleCityClick(city)}
            >
              {/* Glowing Point */}
              <div className="relative group p-4">
                {isHovered && (
                  <motion.div 
                    layoutId="active-node-ring"
                    className="absolute inset-0 rounded-full border border-gold-400/50 animate-[spin_4s_linear_infinite]"
                  />
                )}
                <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${isHovered ? 'bg-gold-300 shadow-[0_0_20px_#d4af37]' : 'bg-gold-600/50 shadow-[0_0_10px_rgba(212,175,55,0.3)]'}`} />
              </div>
              
              {/* Always visible minimal label */}
              <span className={`text-[10px] tracking-[0.3em] uppercase mt-2 transition-colors ${isHovered ? 'text-gold-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-white/40'}`}>
                {city.name}
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* ── 3. HUD: TOP NAV ── */}
      <motion.div 
        className="relative z-20 flex justify-between items-start p-8 w-full pointer-events-none"
        animate={{ opacity: enteringCityId ? 0 : 1 }}
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-[0.4em] text-gold-500 uppercase">DHARA</h1>
          <span className="text-xs tracking-widest text-parchment-300/60 uppercase">Ancient Realms of Bharat</span>
        </div>

        {/* Minimal Passport Indicator */}
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="text-[10px] tracking-[0.3em] text-white/50 uppercase">Heritage Passport</span>
          <span className="text-sm tracking-widest text-gold-300">{discoveredCount} / {CITIES_DATA.length} Worlds Discovered</span>
          <span className="text-xs tracking-widest text-white/30 mt-2">Total Stars: {totalGlobalStars}</span>
        </div>
      </motion.div>

      {/* ── 4. HUD: DESTINATION INFO (BOTTOM LEFT) ── */}
      <AnimatePresence>
        {hoveredCity && !enteringCityId && (
          <motion.div
            key={`info-${hoveredCity.id}`}
            className="absolute bottom-12 left-12 z-20 max-w-lg pointer-events-none"
            initial={{ opacity: 0, x: -20, filter: "blur(5px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -10, filter: "blur(5px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Authenticity Tag */}
            <div className="inline-block px-3 py-1 mb-4 border border-white/20 bg-black/40 backdrop-blur-md rounded-sm">
              <span className="text-[9px] tracking-[0.3em] text-white/70 uppercase">
                PHOTOGRAPH • AI RECONSTRUCTION
              </span>
            </div>

            <h2 className="text-6xl font-bold tracking-widest text-white mb-2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] uppercase">
              {hoveredCity.name}
            </h2>
            
            <div className="flex items-center gap-4 text-sm tracking-widest text-gold-300 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-6">
              <span>{hoveredCity.region}</span>
              <span className="w-1 h-1 rounded-full bg-gold-500/50" />
              <span>{hoveredCity.era}</span>
            </div>

            <p className="text-base leading-relaxed text-parchment-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-md border-l border-gold-500/30 pl-4">
              {hoveredCity.description}
            </p>

            <div className="mt-8 flex gap-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Chapters</span>
                <span className="text-lg tracking-widest text-white">{hoveredCity.chapters.length}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Required Stars</span>
                <span className="text-lg tracking-widest text-white">
                  {hoveredCity.requiredStars === 0 ? "UNLOCKED" : hoveredCity.requiredStars}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 5. HUD: BOTTOM RIGHT VEDA HINT ── */}
      <motion.div 
        className="absolute bottom-12 right-12 z-20 flex items-center gap-3 pointer-events-none opacity-50"
        animate={{ opacity: enteringCityId ? 0 : 0.5 }}
      >
        <span className="text-[9px] tracking-[0.3em] text-white uppercase">Veda • Your Guide</span>
        <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}
