"use client";

import React, { useState, useEffect } from 'react';
import ReactBitsFlyingPosters from './ReactBitsFlyingPosters';
import { useVedaStore } from '@/store/vedaStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { City, Chapter } from '@/data/gameContent';
import GooeyActionButton from '../ui/GooeyActionButton';

interface Scene {
  id: string;
  image: string;
  title: string;
  fact: string;
  evidence: string;
  truthClassification: 'VERIFIED' | 'QUALIFIED' | 'RECONSTRUCTED' | 'FICTION';
}

const LEARNING_DATA: Record<string, Scene[]> = {
  nalanda: [
    { id: 'nalanda-1', image: '/destinations/nalanda-hero.png', title: 'The Great Mahavihara', fact: 'Nalanda was one of the first residential universities in the world, accommodating over 10,000 students and 2,000 teachers.', evidence: 'Excavated monastic cells and accounts by Xuanzang (7th Century CE).', truthClassification: 'VERIFIED' },
    { id: 'nalanda-2', image: '/destinations/nalanda-detail.png', title: 'Dharmaganja Library', fact: 'The library complex consisted of three massive multi-story buildings: Ratnasagara, Ratnodadhi, and Ratnaranjaka.', evidence: 'Tibetan historical records (Pag Sam Jon Zang).', truthClassification: 'QUALIFIED' },
    { id: 'nalanda-3', image: '/destinations/nalanda-hero.png', title: 'Monastic Architecture', fact: 'The campus featured red brick construction with advanced drainage systems and large meditation courtyards.', evidence: 'ASI Excavation Reports (1915-1937, 1974-1982).', truthClassification: 'VERIFIED' },
    { id: 'nalanda-4', image: '/destinations/nalanda-detail.png', title: 'Global Scholars', fact: 'Scholars traveled from Korea, Japan, China, Tibet, Indonesia, and Persia to study logic, medicine, grammar, and Buddhist philosophy.', evidence: 'I-Tsing travelogues.', truthClassification: 'VERIFIED' },
  ],
  pataliputra: [
    { id: 'pat-1', image: '/destinations/pataliputra-hero.png', title: 'Imperial Capital', fact: 'Pataliputra was the fortified capital of the Maurya Empire, one of the largest cities in the ancient world.', evidence: 'Megasthenes\' Indica and Arthashastra.', truthClassification: 'VERIFIED' },
    { id: 'pat-2', image: '/destinations/pataliputra-detail.png', title: 'Wooden Palisade', fact: 'The city was surrounded by a massive wooden palisade with 64 gates and 570 towers.', evidence: 'Bulandibagh excavations finding wooden remnants.', truthClassification: 'VERIFIED' },
    { id: 'pat-3', image: '/destinations/pataliputra-hero.png', title: 'The 80-Pillared Hall', fact: 'A massive assembly hall modeled on Achaemenid architecture existed in Kumhrar.', evidence: 'Spooner excavations (1912).', truthClassification: 'QUALIFIED' },
    { id: 'pat-4', image: '/destinations/pataliputra-detail.png', title: 'Strategic Location', fact: 'Positioned at the confluence of the Ganga, Son, and Punpun rivers, offering immense trade and military advantages.', evidence: 'Geographical continuity and ancient texts.', truthClassification: 'VERIFIED' },
  ],
  hampi: [
    { id: 'ham-1', image: '/destinations/hampi-hero.png', title: 'Vijayanagara', fact: 'Hampi was the imperial capital of the Vijayanagara Empire, described as the second-largest medieval-era city after Beijing.', evidence: 'Accounts of Abdur Razzaq and Domingo Paes.', truthClassification: 'VERIFIED' },
    { id: 'ham-2', image: '/destinations/hampi-detail.png', title: 'Bazaar Streets', fact: 'Wide chariot streets lined with pillared pavilions functioned as international markets trading diamonds, pearls, and horses.', evidence: 'Archaeological remains of Hampi Bazaar.', truthClassification: 'VERIFIED' },
    { id: 'ham-3', image: '/destinations/hampi-hero.png', title: 'Hydraulic Systems', fact: 'Advanced aqueducts and tanks (like Pushkarini) managed water across the arid rocky landscape.', evidence: 'Extant stone aqueducts in the Royal Enclosure.', truthClassification: 'VERIFIED' },
    { id: 'ham-4', image: '/destinations/hampi-detail.png', title: 'Musical Pillars', fact: 'The Vittala Temple contains stone pillars that emit musical notes when struck.', evidence: 'Standing structure, acoustic studies.', truthClassification: 'VERIFIED' },
  ],
  varanasi: [
    { id: 'var-1', image: '/destinations/varanasi-hero.png', title: 'The Living City', fact: 'Varanasi is one of the oldest continuously inhabited cities in the world, central to Hindu, Buddhist, and Jain traditions.', evidence: 'Radiocarbon dating from Rajghat excavations (800 BCE).', truthClassification: 'VERIFIED' },
    { id: 'var-2', image: '/destinations/varanasi-detail.png', title: 'The Riverfront Ghats', fact: 'The crescent-shaped riverfront features over 80 ghats built by Maratha, Rajput, and regional rulers.', evidence: 'Extant architecture.', truthClassification: 'VERIFIED' },
    { id: 'var-3', image: '/destinations/varanasi-hero.png', title: 'Sarnath Connection', fact: 'Just outside the city lies Sarnath, where the Buddha gave his first sermon.', evidence: 'Dhamek Stupa and Ashokan Pillar.', truthClassification: 'VERIFIED' },
    { id: 'var-4', image: '/destinations/varanasi-detail.png', title: 'Textile Heritage', fact: 'The city has been a legendary center for silk weaving (Banarasi sarees) since ancient times.', evidence: 'Jataka tales mentioning Kasi fabrics.', truthClassification: 'QUALIFIED' },
  ],
  madurai: [
    { id: 'mad-1', image: '/destinations/madurai-hero.png', title: 'The Lotus City', fact: 'Madurai was designed in the shape of a lotus, centered around the Meenakshi Amman Temple.', evidence: 'Silappatikaram descriptions and urban plan.', truthClassification: 'QUALIFIED' },
    { id: 'mad-2', image: '/destinations/madurai-detail.png', title: 'Sangam Academies', fact: 'The city was the seat of the mythical Tamil Sangams (poetic academies) supported by Pandya Kings.', evidence: 'Sangam literature (e.g., Kalithogai, Paripadal).', truthClassification: 'QUALIFIED' },
    { id: 'mad-3', image: '/destinations/madurai-hero.png', title: 'Gopuram Architecture', fact: 'The temple complex features 14 towering gateways covered in thousands of painted stucco figures.', evidence: 'Extant architecture.', truthClassification: 'VERIFIED' },
    { id: 'mad-4', image: '/destinations/madurai-detail.png', title: 'Trade Center', fact: 'Madurai had extensive trade links with Rome and Greece, exporting spices, pearls, and cotton.', evidence: 'Roman coins found in the region and Ptolemy\'s accounts.', truthClassification: 'VERIFIED' },
  ],
  konark: [
    { id: 'kon-1', image: '/destinations/konark-hero.png', title: 'The Black Pagoda', fact: 'The Sun Temple was designed as a massive cosmic chariot of the Sun God Surya with 24 wheels and 7 horses.', evidence: 'Standing monument (13th Century CE).', truthClassification: 'VERIFIED' },
    { id: 'kon-2', image: '/destinations/konark-detail.png', title: 'Time-Keeping Wheels', fact: 'The wheels function as precise sundials, calculating time to the exact minute based on shadow length.', evidence: 'Practical demonstration on the stone wheels.', truthClassification: 'VERIFIED' },
    { id: 'kon-3', image: '/destinations/konark-hero.png', title: 'Iron Beams', fact: 'Massive forge-welded iron beams were used to support the heavy stone ceilings.', evidence: 'Rusted iron beams lying in the temple precinct.', truthClassification: 'VERIFIED' },
    { id: 'kon-4', image: '/destinations/konark-detail.png', title: 'Lodestone Legend', fact: 'Legend claims a giant lodestone at the top caused shipwrecks by disrupting compasses.', evidence: 'Portuguese maritime folklore.', truthClassification: 'FICTION' },
  ],
};

interface HeritageLearningProps {
  cityId: string;
  chapterId: string;
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
    
    // Have Veda narrate the fact when scene changes
    popWithDialogue(`Regarding ${activeScene.title}: ${activeScene.fact} (Classified as ${activeScene.truthClassification})`);
  }, [activeScene, popWithDialogue]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-charcoal-950 z-[100] flex flex-col overflow-hidden text-ivory-100">
      
      {/* BACKGROUND WEBGL FLYING POSTERS */}
      <div className="absolute inset-0 z-0">
        <ReactBitsFlyingPosters 
          items={scenes.map(s => s.image)}
          onItemChange={setActiveIndex}
          distortion={3}
          cameraFov={50}
          cameraZ={15}
          scrollEase={0.05}
        />
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/80 to-transparent w-full md:w-2/3 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* OVERLAY CONTENT */}
      <div className="relative z-10 flex-1 flex flex-col pointer-events-none p-6 md:p-16 w-full max-w-4xl mx-auto h-full justify-center">
        
        <div className="mb-4">
          <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-gold-600 mb-2">
            Archive Discovery {activeIndex + 1} / {scenes.length}
          </h4>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-4xl md:text-6xl font-serif text-ivory-100 drop-shadow-lg leading-tight">
                {activeScene.title}
              </h2>
              
              <div className="p-6 md:p-8 bg-charcoal-900/60 backdrop-blur-xl border border-gold-500/20 rounded-2xl shadow-2xl">
                <p className="text-lg md:text-xl text-ivory-200 leading-relaxed font-serif mb-6">
                  {activeScene.fact}
                </p>
                
                <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-gold-500/70 font-bold block mb-1">Truth Classification</span>
                      <span className={`text-xs uppercase tracking-wider font-bold ${
                        activeScene.truthClassification === 'VERIFIED' ? 'text-green-400' :
                        activeScene.truthClassification === 'QUALIFIED' ? 'text-yellow-400' :
                        activeScene.truthClassification === 'FICTION' ? 'text-red-400' :
                        'text-blue-400'
                      }`}>
                        {activeScene.truthClassification}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 mt-2">
                    <div className="w-5 flex justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-ivory-300/50 mt-1.5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-ivory-300/50 font-bold block mb-1">Source / Evidence</span>
                      <span className="text-sm text-ivory-300 leading-snug block">
                        {activeScene.evidence}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-12 right-12 flex flex-col items-end gap-2 pointer-events-auto">
          <span className="text-[10px] uppercase tracking-[0.2em] text-ivory-300/60 font-bold">Scroll or drag to navigate</span>
          
          {isLast && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4"
            >
              <GooeyActionButton
                onClick={onSequenceComplete}
                gooColor="bg-gold-500"
                className="px-8 py-4 bg-gold-600 text-charcoal-900 font-bold uppercase tracking-[0.2em] text-xs hover:bg-gold-500 transition-colors flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(212,175,55,0.3)] rounded-xl"
              >
                Unlock <ArrowRight className="w-4 h-4" />
              </GooeyActionButton>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
