"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShieldCheck, Database, CheckCircle } from 'lucide-react';
import { useVedaStore } from '@/store/vedaStore';
import { LEARNING_DATA } from '@/data/learningData';
import ReactBitsFlyingPosters from './ReactBitsFlyingPosters';
import GooeyActionButton from '../ui/GooeyActionButton';

interface HeritageLearningProps {
  cityId: string;
  chapterId?: string;
  onSequenceComplete: () => void;
}

export default function HeritageLearningSequence({ cityId, chapterId, onSequenceComplete }: HeritageLearningProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { popWithDialogue } = useVedaStore();

  const scenes = LEARNING_DATA[cityId] || LEARNING_DATA['nalanda'];
  const activeScene = scenes[activeIndex];
  const isLast = activeIndex === scenes.length - 1;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!activeScene) return;

    // Have Veda narrate the fact when scene changes natively in the background wrapper
    popWithDialogue(`Notice this evidence, seeker! ${activeScene.fact}`);
  }, [activeIndex, activeScene, popWithDialogue]);

  if (!mounted || !activeScene) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-charcoal-950 z-[100] flex flex-col overflow-hidden text-ivory-100">

      {/* BACKGROUND WEBGL FLYING POSTERS */}
      <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
        <ReactBitsFlyingPosters
          items={scenes.map(s => s.image)}
          onItemChange={() => {}} // Disabled automatic scrolling from inside to strictly sync with button
          distortion={3}
          cameraFov={50}
          cameraZ={15}
          scrollEase={0.05}
        />
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/90 md:via-charcoal-950/70 to-transparent w-full md:w-2/3 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_50%,_rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      </div>

      {/* OVERLAY CONTENT */}
      <div className="relative z-10 flex-1 flex flex-col pointer-events-none p-6 md:p-16 w-full max-w-5xl mx-auto h-full justify-center">

        <div className="mb-4">
          <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-gold-600 mb-2 drop-shadow-md">
            Archive Discovery {activeIndex + 1} / {scenes.length}
          </h4>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene.id}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-ivory-100 drop-shadow-xl leading-tight tracking-wide">
                {activeScene.title}
              </h2>

              <div className="p-6 md:p-10 bg-charcoal-900/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
                {/* Subtle sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                <p className="text-lg md:text-xl text-ivory-100 leading-relaxed font-serif mb-8 max-w-2xl relative z-10">
                  {activeScene.fact}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-white/10 relative z-10">
                  <div className="flex-1 flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                    <ShieldCheck className="w-6 h-6 text-gold-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-gold-500/80 font-bold block mb-1">Truth Classification</span>
                      <span className={`text-xs uppercase tracking-wider font-bold ${
                        activeScene.truthClassification === 'VERIFIED' ? 'text-green-400' :
                        activeScene.truthClassification === 'QUALIFIED' ? 'text-blue-400' :
                        activeScene.truthClassification === 'FICTION' ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {activeScene.truthClassification}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                    <Database className="w-6 h-6 text-gold-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-ivory-300/60 font-bold block mb-1">Source / Evidence</span>
                      <span className="text-xs text-ivory-200 leading-snug block font-medium">
                        {activeScene.evidence}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation & Reward Focus */}
        <div className="absolute bottom-10 right-10 flex flex-col items-end gap-3 pointer-events-auto">
          {isLast ? (
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="mt-4"
             >
               <GooeyActionButton
                 onClick={onSequenceComplete}
                 gooColor="bg-gold-500"
                 className="px-10 py-5 bg-gold-500 text-charcoal-900 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold-400 transition-colors flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(212,175,55,0.4)] rounded-full"
               >
                 Acknowledge Findings <CheckCircle className="w-4 h-4" />
               </GooeyActionButton>
             </motion.div>
          ) : (
             <button
               onClick={() => setActiveIndex(prev => prev + 1)}
               className="px-8 py-4 bg-charcoal-800 text-ivory-100 font-bold uppercase tracking-widest text-[10px] hover:bg-charcoal-700 transition-colors flex items-center gap-2 rounded-full border border-white/10 shadow-lg"
             >
               Examine Next Evidence
               <ChevronRight className="w-4 h-4" />
             </button>
          )}
        </div>

      </div>
    </div>
  );
}
