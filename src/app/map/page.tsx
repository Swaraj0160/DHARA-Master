"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/Button";
import { MapPin, X, Lock, Play, Compass, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface AtlasLocation {
  id: string;
  name: string;
  period: string;
  category: string;
  desc: string;
  x: number;
  y: number;
  playable: boolean;
  questLink?: string;
}

export default function HeritageAtlas() {
  const [selectedLoc, setSelectedLoc] = useState<AtlasLocation | null>(null);

  // Reference archaeological sites with exact coordinates mapped across India
  const locations = [
    {
      id: "nalanda",
      name: "Nalanda Mahavihara",
      period: "5th - 12th Century CE",
      category: "Ancient University",
      desc: "One of the greatest residential centers of learning in the ancient world, sheltering 10,000 students and scholars from across Asia with a vast manuscript library.",
      x: 63,
      y: 41,
      playable: true,
      questLink: "/quest/nalanda",
    },
    {
      id: "ajanta",
      name: "Ajanta Cave Sanctuaries",
      period: "2nd Century BCE - 6th Century CE",
      category: "Rock-Cut Buddhist Art",
      desc: "Ancient Buddhist cave monuments carved into basalt cliffs, celebrated globally for exquisite frescoes, tempera murals, and expressive Jataka iconography.",
      x: 35,
      y: 56,
      playable: false,
    },
    {
      id: "hampi",
      name: "Hampi (Vijayanagara)",
      period: "14th - 16th Century CE",
      category: "Imperial Capital",
      desc: "The monumental ruins of the Vijayanagara Empire situated along the Tungabhadra river, showcasing monolithic stone temples, chariot shrines, and aqueducts.",
      x: 38,
      y: 73,
      playable: false,
    },
    {
      id: "dholavira",
      name: "Dholavira",
      period: "3000 - 1500 BCE",
      category: "Indus Valley Civilization",
      desc: "A sprawling Harappan metropolis in the Rann of Kutch featuring an unparalleled hydraulic network of stone stepwells, interconnected storm drains, and fortified citadels.",
      x: 18,
      y: 47,
      playable: false,
    },
    {
      id: "konark",
      name: "Konark Sun Temple",
      period: "13th Century CE",
      category: "Kalinga Architecture",
      desc: "Conceived as a colossal chariot for the sun god Surya with 24 intricately carved stone wheels functioning as precise astronomical sundials.",
      x: 65,
      y: 58,
      playable: false,
    },
    {
      id: "sanchi",
      name: "Sanchi Stupa Complex",
      period: "3rd Century BCE - 12th Century CE",
      category: "Buddhist Architecture",
      desc: "Commissioned by Emperor Ashoka, the Great Stupa is framed by four monumental stone gateways (toranas) carved with historic scenes and floral motifs.",
      x: 42,
      y: 47,
      playable: false,
    },
    {
      id: "chola_ports",
      name: "Poompuhar (Kaveripattinam)",
      period: "10th - 12th Century CE",
      category: "Chola Maritime Trade",
      desc: "The primary oceanic emporium of the Chola Empire, orchestrating trans-oceanic spice convoys across the Bay of Bengal to the Srivijaya kingdom.",
      x: 46,
      y: 82,
      playable: false,
    },
  ];

  return (
    <div className="min-h-screen bg-parchment-200 flex flex-col selection:bg-gold-500/30">
      <Navigation />

      {/* Distinction Header Banner */}
      <div className="bg-earth-900 border-b border-gold-500/30 px-4 py-3 text-parchment-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-gold-400" />
            <span className="font-serif font-bold text-parchment-100">HERITAGE ATLAS:</span>
            <span>Reference Archaeological & Factual Geographical Archive.</span>
          </div>
          <Link href="/" className="text-gold-400 hover:text-gold-300 underline font-serif font-bold flex items-center gap-1">
            <span>To play your evolving map, open DHARA</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-106px)] overflow-hidden relative">
        {/* Map Canvas Area */}
        <div className="flex-1 relative bg-gradient-to-b from-[#e3e9ea] to-[#d4dedf] overflow-hidden border-r border-parchment-300">
          <div className="absolute inset-0 bg-[radial-gradient(#8c5b36_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

          <div className="absolute top-6 left-6 z-10 bg-parchment-100/90 p-4 rounded-2xl backdrop-blur-md border border-parchment-300 shadow-md">
            <h1 className="font-serif text-2xl font-bold text-earth-900 mb-0.5">
              Archaeological Survey of India
            </h1>
            <p className="text-earth-600 text-xs uppercase tracking-widest font-semibold">
              Heritage Reference Coordinates
            </p>
          </div>

          <div className="relative w-full h-full flex items-center justify-center p-6 sm:p-12">
            {/* Styled India Geographic Representation Container */}
            <div className="relative w-full max-w-2xl h-full max-h-[640px] flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full max-h-full drop-shadow-[0_15px_30px_rgba(44,26,18,0.15)] stroke-earth-800/30 stroke-[0.35] fill-parchment-100"
              >
                {/* Simplified geographic subcontinent polygon */}
                <path d="M 38 10 L 48 8 L 54 14 L 62 20 L 75 22 L 85 24 L 90 28 L 84 34 L 75 33 L 70 38 L 65 48 L 56 65 L 48 85 L 46 88 L 44 85 L 36 68 L 28 55 L 18 45 L 12 40 L 14 32 L 20 25 L 30 18 Z" />
                {/* Major rivers representation */}
                <path d="M 32 15 Q 45 28 64 42" stroke="#8c5b36" strokeWidth="0.3" strokeDasharray="1,1" fill="none" />
                <path d="M 28 45 Q 40 50 62 55" stroke="#8c5b36" strokeWidth="0.3" strokeDasharray="1,1" fill="none" />
              </svg>

              {/* Site Markers */}
              {locations.map((loc) => {
                const isSelected = selectedLoc?.id === loc.id;
                return (
                  <motion.button
                    key={loc.id}
                    onClick={() => setSelectedLoc(loc)}
                    whileHover={{ scale: 1.25 }}
                    className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center transition-all z-20 shadow-md ${
                      isSelected
                        ? "bg-gold-500 text-earth-950 ring-4 ring-gold-400/50 scale-125"
                        : loc.playable
                        ? "bg-gold-500 text-earth-950 animate-pulse border-2 border-white"
                        : "bg-earth-900 text-parchment-200 border border-gold-500/40 hover:bg-gold-500 hover:text-earth-950"
                    }`}
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                    aria-label={loc.name}
                  >
                    <MapPin size={16} />
                    <div className="absolute top-full mt-1 bg-earth-950/90 text-parchment-100 text-[10px] font-serif font-bold px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100">
                      {loc.name}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Site Detail Side Panel */}
        <AnimatePresence>
          {selectedLoc && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute inset-y-0 right-0 w-full md:w-[420px] bg-parchment-100 shadow-2xl z-30 flex flex-col border-l-2 border-gold-500/40 text-earth-900 overflow-y-auto"
            >
              <div className="bg-earth-950 p-6 text-parchment-100 relative border-b-2 border-gold-500">
                <button
                  onClick={() => setSelectedLoc(null)}
                  className="absolute top-4 right-4 text-parchment-400 hover:text-white p-1 rounded-full"
                >
                  <X size={20} />
                </button>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400 block mb-1">
                  {selectedLoc.category}
                </span>
                <h2 className="font-serif text-3xl font-bold">{selectedLoc.name}</h2>
                <div className="text-xs text-parchment-300 font-mono mt-1">
                  Chronology: {selectedLoc.period}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 mb-2">
                    Historical Assessment
                  </h4>
                  <p className="text-sm text-earth-800 leading-relaxed font-medium bg-parchment-200/90 p-4 rounded-2xl border border-parchment-300">
                    {selectedLoc.desc}
                  </p>
                </div>

                <div className="space-y-3">
                  {selectedLoc.playable && selectedLoc.questLink ? (
                    <Link href={selectedLoc.questLink} className="block">
                      <Button
                        size="lg"
                        className="w-full font-serif font-bold uppercase tracking-wider text-xs py-4 bg-gold-500 text-earth-950 hover:bg-gold-600 shadow-md flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" fill="currentColor" />
                        <span>Launch Simulation Expedition</span>
                      </Button>
                    </Link>
                  ) : (
                    <div className="p-4 bg-stone-200/80 rounded-2xl border border-stone-300 text-center text-xs text-stone-700">
                      <Lock className="w-4 h-4 mx-auto mb-1 text-stone-500" />
                      <span>Module under historical documentation for future hackathon chapters.</span>
                    </div>
                  )}

                  <Link href="/" className="block">
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full font-serif font-bold uppercase tracking-wider text-xs py-3 border-parchment-300 text-earth-800 hover:bg-parchment-200"
                    >
                      View on Your DHARA Board
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
