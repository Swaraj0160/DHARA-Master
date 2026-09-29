"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShieldCheck, Database, CheckCircle } from 'lucide-react';
import { useVedaStore } from '@/store/vedaStore';
import { LEARNING_DATA } from '@/data/learningData';
import Image from 'next/image';

interface HeritageLearningProps {
  cityId: string;
  onSequenceComplete: () => void;
}

export default function HeritageLearningSequence({ cityId, onSequenceComplete }: HeritageLearningProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { popWithDialogue } = useVedaStore();

  const scenes = LEARNING_DATA[cityId] || LEARNING_DATA['pataliputra'];
  const activeScene = scenes[activeIndex];
  const isLast = activeIndex === scenes.length - 1;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!activeScene) return;
    popWithDialogue(`Examine this evidence: ${activeScene.fact}`);
  }, [activeIndex, activeScene, popWithDialogue]);

  if (!mounted || !activeScene) return null;

  return (
    <div className="w-full min-h-full bg-earth-950 flex flex-col p-4 md:p-8 overflow-y-auto">
      {/* Header/Progress */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between mb-6 md:mb-10 mt-16 md:mt-0 shrink-0">
        <h2 className="text-gold-500 font-serif font-bold tracking-widest uppercase text-xs md:text-sm">
          Archive Discovery
        </h2>
        <div className="flex gap-2">
          {scenes.map((scene, i) => (
            <div 
              key={scene.id} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= activeIndex ? 'bg-gold-500 w-6 md:w-8' : 'bg-charcoal-700 w-3 md:w-4'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-12 items-center lg:items-stretch pb-10">
        
        {/* Left: Large Evidence Image */}
        <div className="w-full lg:w-1/2 min-h-[300px] lg:min-h-0 flex-1 relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image 
                src={activeScene.image} 
                alt={activeScene.title} 
                fill 
                className="object-cover transition-transform duration-10000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Info Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-6 bg-charcoal-900/60 p-6 md:p-8 rounded-2xl border border-charcoal-700/50 backdrop-blur-md shadow-xl"
            >
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-parchment-100 leading-tight">
                {activeScene.title}
              </h3>
              
              <p className="text-base md:text-lg text-parchment-300 font-serif leading-relaxed">
                {activeScene.fact}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-charcoal-700/50">
                <div className="bg-earth-950/80 p-4 rounded-xl border border-gold-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-gold-500" />
                    <span className="text-[10px] uppercase tracking-widest text-gold-500 font-bold">
                      Truth Layer
                    </span>
                  </div>
                  <span className={`text-xs md:text-sm uppercase tracking-wider font-bold ${
                    activeScene.truthClassification === 'VERIFIED' ? 'text-green-400' :
                    activeScene.truthClassification === 'QUALIFIED' ? 'text-blue-400' :
                    activeScene.truthClassification === 'FICTION' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {activeScene.truthClassification}
                  </span>
                </div>

                <div className="bg-earth-950/80 p-4 rounded-xl border border-gold-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-gold-500" />
                    <span className="text-[10px] uppercase tracking-widest text-gold-500 font-bold">
                      Source Context
                    </span>
                  </div>
                  <span className="text-xs md:text-sm text-parchment-200 font-medium leading-snug block">
                    {activeScene.evidence}
                  </span>
                </div>
              </div>

              {/* Action Area */}
              <div className="mt-2 flex justify-end">
                {isLast ? (
                  <button
                    onClick={onSequenceComplete}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-earth-950 font-serif font-bold uppercase tracking-widest text-xs md:text-sm hover:from-gold-400 hover:to-gold-500 transition-all rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 focus:ring-4 focus:ring-gold-500/50 outline-none"
                  >
                    Acknowledge Findings <CheckCircle className="w-4 md:w-5 h-4 md:h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveIndex(prev => prev + 1)}
                    className="w-full sm:w-auto px-8 py-4 bg-charcoal-800 text-parchment-200 font-serif font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-charcoal-700 border border-charcoal-600 transition-all rounded-xl flex items-center justify-center gap-2 focus:ring-4 focus:ring-charcoal-500/50 outline-none"
                  >
                    Next Evidence <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
