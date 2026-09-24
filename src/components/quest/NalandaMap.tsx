"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MapPin, Compass, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface CampusLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  tag: string;
  desc: string;
}

export default function NalandaMap({ onComplete }: { onComplete: () => void }) {
  const [visited, setVisited] = useState<string[]>([]);
  const [activeLocation, setActiveLocation] = useState<CampusLocation | null>(null);

  const locations: CampusLocation[] = [
    {
      id: "gate",
      name: "The Grand Entrance & Dwarapala Post",
      x: 18,
      y: 72,
      tag: "Security & Screening",
      desc: "Guarded rigorously by scholar gatekeepers (Dwarapalas). Records by Chinese traveler Xuanzang noted that only 2 or 3 out of 10 applicants passed the oral admissions examination here."
    },
    {
      id: "library",
      name: "Dharmaganja (The Mountain of Truth)",
      x: 72,
      y: 28,
      tag: "Manuscript Archive",
      desc: "The monumental 3-building library complex (Ratnasagara, Ratnodadhi, Ratnaranjaka) rising up to nine storeys, housing hundreds of thousands of hand-copied palm-leaf manuscripts."
    },
    {
      id: "lecture",
      name: "Central Debate & Lecture Hall",
      x: 48,
      y: 48,
      tag: "Epistemology",
      desc: "One of over a hundred lecture halls where Buddhist, Vedic, Jain, and secular masters held open daily debates on logic (Nyaya-Pramana), linguistics, and cosmography."
    },
    {
      id: "quarters",
      name: "Monastic Scholar Quarters (Vihara)",
      x: 25,
      y: 30,
      tag: "Living Spaces",
      desc: "Two-tiered residential brick cells with built-in stone reading beds, niches for oil lamps, and internal water drainage systems accommodating 10,000 residents."
    },
    {
      id: "courtyard",
      name: "Astronomical Courtyard (Sarai Mound)",
      x: 75,
      y: 68,
      tag: "Observatory",
      desc: "Open terrace with stone sundials and celestial viewing towers used by ancient astronomers to chart lunar mansions and planetary conjunctions."
    },
  ];

  const handleVisit = (loc: CampusLocation) => {
    setActiveLocation(loc);
    if (!visited.includes(loc.id)) {
      setVisited((prev) => [...prev, loc.id]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto items-stretch">
      {/* Visual Ancient Nalanda Campus Canvas */}
      <div className="flex-1 bg-gradient-to-br from-earth-950 via-earth-900 to-earth-950 rounded-3xl relative overflow-hidden border-2 border-gold-500/50 shadow-[0_10px_40px_rgba(0,0,0,0.6)] min-h-[420px] p-4 flex flex-col justify-between">
        {/* Cartographic grid texture */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/mandala.svg')] bg-center bg-no-repeat opacity-5 pointer-events-none" />

        {/* Campus Header */}
        <div className="relative z-10 flex justify-between items-start">
          <div className="bg-earth-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-gold-500/30">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400 block">7th Century CE Map</span>
            <span className="font-serif text-lg text-parchment-100 font-bold">Nalanda Mahavihara Layout</span>
          </div>
          <div className="text-xs text-parchment-300 font-mono bg-black/50 px-3 py-1.5 rounded-lg border border-white/10">
            Explored: {visited.length} / {locations.length}
          </div>
        </div>

        {/* Hotspots */}
        <div className="absolute inset-0 m-6">
          {locations.map((loc) => {
            const isExplored = visited.includes(loc.id);
            const isSelected = activeLocation?.id === loc.id;
            return (
              <div
                key={loc.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              >
                <button
                  onClick={() => handleVisit(loc)}
                  className={`relative group rounded-full p-2.5 transition-all duration-300 ${
                    isSelected
                      ? "bg-gold-500 text-earth-950 scale-125 shadow-[0_0_25px_rgba(212,175,55,1)] ring-4 ring-gold-400/40"
                      : isExplored
                      ? "bg-gold-600/80 text-parchment-100 scale-105 shadow-md border border-gold-400"
                      : "bg-earth-800/90 text-gold-400 hover:scale-110 border border-gold-500/40 shadow-sm"
                  }`}
                  aria-label={loc.name}
                >
                  <MapPin className="w-5 h-5" />
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/90 text-[10px] font-medium text-parchment-200 px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gold-500/30">
                    {loc.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="relative z-10 bg-earth-900/80 backdrop-blur-sm p-3 rounded-2xl border border-gold-500/20 text-xs text-parchment-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-gold-400" />
            <span>Select campus hotspots to survey the archaeological layout.</span>
          </span>
          <span className="text-[11px] text-gold-400/80 font-mono">Min. 3 hotspots required</span>
        </div>
      </div>

      {/* Campus Info & Progress Panel */}
      <div className="w-full lg:w-[380px] flex flex-col justify-between">
        <Card className="p-6 bg-parchment-100 border-2 border-gold-500/40 shadow-xl flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold tracking-widest text-terracotta-600 uppercase">Phase 02 · Exploration</span>
              <span className="text-earth-500 font-mono">{visited.length}/3 to advance</span>
            </div>

            <h3 className="font-serif text-2xl text-earth-900 font-bold mb-2">
              {activeLocation ? activeLocation.name : "Survey the Mahavihara"}
            </h3>

            {activeLocation ? (
              <motion.div
                key={activeLocation.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 my-4"
              >
                <div className="inline-block px-2.5 py-1 bg-gold-500/15 border border-gold-500/30 rounded-md text-[11px] font-bold text-earth-800 uppercase tracking-wider">
                  Sector: {activeLocation.tag}
                </div>
                <p className="text-earth-800 text-sm leading-relaxed font-medium bg-parchment-200/80 p-4 rounded-xl border border-parchment-300">
                  {activeLocation.desc}
                </p>
              </motion.div>
            ) : (
              <p className="text-earth-700 text-sm leading-relaxed my-6 bg-parchment-200/60 p-4 rounded-xl border border-parchment-300">
                Click on the glowing hotspots across the historical campus map to inspect the major architectural sectors of Nalanda before approaching the scholar test.
              </p>
            )}

            {/* Checklist */}
            <div className="space-y-1.5 my-4">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className={`flex items-center gap-2 text-xs py-1 px-2 rounded-lg transition-colors ${
                    visited.includes(loc.id)
                      ? "text-earth-900 font-semibold bg-gold-500/15"
                      : "text-earth-500"
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      visited.includes(loc.id) ? "text-green-600" : "text-earth-300"
                    }`}
                  />
                  <span>{loc.name}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            disabled={visited.length < 3}
            onClick={onComplete}
            className="w-full py-4 text-base font-serif tracking-wider uppercase mt-4 shadow-md"
          >
            {visited.length < 3
              ? `Explore ${3 - visited.length} More Hotspots`
              : "Approach the Scholar"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
