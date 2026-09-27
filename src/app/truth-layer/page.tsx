"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WorldHUD from "@/components/game/WorldHUD";
import { ShieldCheck, BookOpen, Search, Sparkles, X, ChevronRight, CheckCircle2, History } from "lucide-react";

type TruthLevel = 'verified' | 'source-qualified' | 'reconstruction' | 'fiction';

interface TruthCategory {
  id: TruthLevel;
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  examples: string[];
}

const TRUTH_CATEGORIES: TruthCategory[] = [
  {
    id: 'verified',
    title: 'Verified Historical Fact',
    shortDesc: 'Undisputed historical consensus supported by direct primary evidence.',
    icon: <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: 'border-emerald-600/50 text-emerald-500 bg-emerald-950/20',
    description: 'This information is universally accepted by the archaeological and historical community. It relies on direct, irrefutable primary evidence such as intact inscriptions, foundational carbon dating, and cross-referenced contemporary records.',
    examples: [
      'The geographic location of Nalanda Mahavihara.',
      'The foundational dates of the Vijayanagara Empire.',
      'The existence and edicts of Emperor Ashoka.'
    ]
  },
  {
    id: 'source-qualified',
    title: 'Source-Qualified Information',
    shortDesc: 'Information derived from primary texts or specific historical accounts.',
    icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: 'border-blue-600/50 text-blue-400 bg-blue-950/20',
    description: 'Information that is explicitly documented in primary historical texts (such as Xuanzang\'s travelogues or court chronicles), but may reflect the bias, perspective, or limited knowledge of the original author.',
    examples: [
      'Xuanzang\'s description of Nalanda\'s towering libraries.',
      'Court chronicles describing the exact wealth of a treasury.',
      'Dynastic claims of divine lineage.'
    ]
  },
  {
    id: 'reconstruction',
    title: 'Evidence-Based Reconstruction',
    shortDesc: 'Scholarly extrapolation to fill gaps in the archaeological record.',
    icon: <Search className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: 'border-amber-600/50 text-amber-500 bg-amber-950/20',
    description: 'When physical structures are destroyed or records are lost, we rely on evidence-based reconstruction. This involves using contemporary architectural norms, surviving foundations, and textual descriptions to recreate how a site likely appeared.',
    examples: [
      'The complete 3D architectural recreation of the Dharmaganja library.',
      'The original paint colors on temple sculptures.',
      'The specific layout of temporary siege camps.'
    ]
  },
  {
    id: 'fiction',
    title: 'Gameplay Fiction',
    shortDesc: 'Creative additions made strictly for interactive gameplay.',
    icon: <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: 'border-purple-600/50 text-purple-400 bg-purple-950/20',
    description: 'Elements introduced solely to make the interactive experience functional, engaging, or accessible. These are strictly separated from educational content to protect historical integrity.',
    examples: [
      'The VEDA AI guide character.',
      'The "Heritage Passport" and XP progression system.',
      'Time-travel narrative devices and portals.'
    ]
  }
];

export default function TruthLayerPage() {
  const [selectedCategory, setSelectedCategory] = useState<TruthLevel | null>(null);

  return (
    <div className="h-[100dvh] w-full bg-earth-950 flex flex-col font-sans relative selection:bg-[#b07d53]/30 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-earth-900 via-earth-950 to-black opacity-90 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-multiply pointer-events-none" />
      
      {/* Global Navigation */}
      <div className="relative z-50 shrink-0">
        <WorldHUD />
      </div>

      <main className="flex-1 flex flex-col w-full relative z-10 pt-20 overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar w-full">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex flex-col min-h-full">
            
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 sm:mb-16 mt-4 shrink-0"
            >
              <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-full bg-earth-900/50 border border-[#8c5b36]/30 mb-6 shadow-[0_0_30px_rgba(140,91,54,0.15)]">
                <History className="w-8 h-8 sm:w-10 sm:h-10 text-[#8c5b36]" />
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl text-[#f4e7dc] uppercase tracking-[0.2em] font-bold mb-4">
                The Heritage Truth Layer
              </h1>
              <p className="font-serif text-sm sm:text-base text-[#d6c4a4] max-w-2xl mx-auto leading-relaxed">
                DHARA is built upon a foundation of rigorous historical integrity. We separate verifiable facts from gameplay fiction, ensuring you always know the evidentiary basis of what you discover.
              </p>
              
              <div className="mt-8 inline-block px-6 py-3 border-y border-[#8c5b36]/40 bg-[#8c5b36]/5">
                <p className="font-mono text-xs sm:text-sm tracking-[0.3em] text-[#8c5b36] uppercase font-bold">
                  No Verified Source &rarr; No Historical Claim
                </p>
              </div>
            </motion.div>

            {/* Classifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12 shrink-0">
              {TRUTH_CATEGORIES.map((category, idx) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative p-5 sm:p-6 lg:p-8 rounded-xl border-[1.5px] cursor-pointer transition-all duration-300 group overflow-hidden ${
                    selectedCategory === category.id 
                      ? `${category.color} ring-2 ring-offset-2 ring-offset-earth-950 scale-[1.02] z-10` 
                      : 'border-[#8c5b36]/20 bg-earth-900/40 hover:bg-earth-900/70 hover:border-[#8c5b36]/50'
                  }`}
                >
                  <div className={`absolute top-0 right-0 p-4 transition-transform duration-300 ${
                    selectedCategory === category.id ? 'opacity-100 scale-110' : 'opacity-40 group-hover:scale-110 group-hover:opacity-60'
                  }`}>
                    {category.icon}
                  </div>
                  
                  <div className="relative z-10 pr-12">
                    <h3 className={`font-serif text-lg sm:text-xl font-bold tracking-wider mb-2 ${
                      selectedCategory === category.id ? 'text-inherit' : 'text-[#f4e7dc]'
                    }`}>
                      {category.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      selectedCategory === category.id ? 'text-inherit opacity-90' : 'text-[#d6c4a4]/70'
                    }`}>
                      {category.shortDesc}
                    </p>
                    
                    <div className="mt-4 flex items-center text-[10px] sm:text-xs font-mono uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore Evidence</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Expanded Detail View */}
            <AnimatePresence mode="wait">
              {selectedCategory && (
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden shrink-0 mb-8"
                >
                  {TRUTH_CATEGORIES.map(category => category.id === selectedCategory && (
                    <div key="content" className={`p-6 sm:p-8 rounded-xl border ${category.color} bg-opacity-10 backdrop-blur-sm relative`}>
                      <button 
                        onClick={() => setSelectedCategory(null)}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/20 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      
                      <h4 className="font-serif text-xl sm:text-2xl font-bold mb-4 tracking-wide">{category.title}</h4>
                      <p className="text-sm sm:text-base leading-relaxed mb-6 opacity-90 max-w-3xl">
                        {category.description}
                      </p>
                      
                      <div className="bg-black/20 rounded-lg p-5">
                        <h5 className="font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold mb-4 opacity-70">
                          Examples in DHARA
                        </h5>
                        <ul className="space-y-3">
                          {category.examples.map((example, i) => (
                            <li key={i} className="flex items-start">
                              <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 shrink-0 opacity-80" />
                              <span className="text-xs sm:text-sm opacity-90 font-serif italic">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </main>
    </div>
  );
}
