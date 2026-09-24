"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { GitBranch, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameState";

interface CulturalDecisionProps {
  onComplete: (choiceKey: string, pts: number) => void;
}

export default function CulturalDecision({ onComplete }: CulturalDecisionProps) {
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const { recordChoice } = useGameStore();

  const options = [
    {
      id: "astronomy",
      title: "Aryabhata's Astronomical & Mathematical Treatises",
      subtitle: "Focus on Spherical Astronomy & Trigonometry",
      icon: "🔭",
      desc: "Prioritize the copying and distribution of the Aryabhatiya and planetary revolution models.",
      dnaEffects: "+25 Mathematics · +15 History",
      influence: "Scientific Knowledge Nexus",
      historicalNote: "Nalanda scholars calculated planetary orbits, eclipses, and trigonometric sine tables (Jya), which subsequently spread westward along trade routes to Baghdad and Samarkand."
    },
    {
      id: "arts",
      title: "Bharata Muni's Natyashastra & Aesthetics",
      subtitle: "Focus on Classical Arts, Iconography & Drama",
      icon: "🎭",
      desc: "Prioritize the preservation of rasa theory, temple acoustics, mudra choreography, and dramatic poetry.",
      dnaEffects: "+25 Arts · +15 Architecture",
      influence: "Aesthetic & Architectural Heritage",
      historicalNote: "The Natyashastra established the comprehensive canon for Indian temple sculpture, classical music, and expressive theater, shaping art styles throughout Southeast Asia."
    },
    {
      id: "medicine",
      title: "Sushruta & Charaka Ayurvedic Compendiums",
      subtitle: "Focus on Surgical Techniques & Herbal Medicine",
      icon: "🌿",
      desc: "Prioritize the transmission of ancient surgical instruments, rhinoplasty protocols, and pharmacology.",
      dnaEffects: "+20 Science · +20 Geography",
      influence: "Integrative Health Heritage",
      historicalNote: "Monks and international physicians at Nalanda translated Sushruta's surgical treatises into Tibetan, Arabic, and Chinese, making Nalanda a sanctuary for healing sciences."
    }
  ];

  const handleChoose = (id: string) => {
    setSelectedDecision(id);
    recordChoice("nalanda_curriculum", id);
  };

  const selectedData = options.find((o) => o.id === selectedDecision);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Simulation Disclaimer Banner */}
      <div className="bg-amber-500/10 border-l-4 border-amber-600 p-4 rounded-r-xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-earth-900 leading-relaxed">
          <strong>Gameplay Simulation Notice:</strong> This dilemma is an interactive historical roleplay scenario designed to illustrate how scholarly priorities guided knowledge transmission. Historically, Nalanda&apos;s Dharmaganja preserved all these disciplines simultaneously.
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className="text-xs font-bold tracking-widest text-terracotta-600 uppercase flex items-center justify-center gap-1.5">
          <GitBranch className="w-4 h-4 text-gold-600" /> Phase 05 · Cultural Synthesis
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-earth-900 font-bold">
          The Scribe&apos;s Seasonal Mandate
        </h2>
        <p className="text-earth-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          The monsoon season approaches, and the monastery must dispatch an urgent scholarly emissary caravan with copied treatises. Which intellectual pillar will you commission your copyists to transcribe first?
        </p>
      </div>

      {/* Decision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isSelected = selectedDecision === opt.id;
          return (
            <motion.div
              key={opt.id}
              whileHover={{ y: -4 }}
              onClick={() => handleChoose(opt.id)}
              className={`cursor-pointer rounded-2xl p-6 border-2 flex flex-col justify-between transition-all duration-200 bg-parchment-100 shadow-sm ${
                isSelected
                  ? "border-gold-500 ring-2 ring-gold-400/40 bg-gold-50/60 shadow-lg"
                  : "border-parchment-300 hover:border-gold-400"
              }`}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-parchment-200/90 border border-parchment-300 flex items-center justify-center text-3xl mb-4 shadow-inner">
                  {opt.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-earth-900 leading-snug mb-1">
                  {opt.title}
                </h3>
                <span className="text-[11px] font-semibold text-terracotta-600 tracking-wider uppercase block mb-3">
                  {opt.subtitle}
                </span>
                <p className="text-xs text-earth-700 leading-relaxed mb-4">
                  {opt.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-parchment-200 text-xs">
                <span className="font-bold text-gold-700 block mb-1">DNA Impact:</span>
                <span className="text-[11px] text-earth-800 font-medium bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20 inline-block">
                  {opt.dnaEffects}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Consequence Drawer */}
      {selectedData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-parchment-100 border-2 border-gold-500/60 rounded-2xl shadow-xl space-y-4"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-600" />
            <h4 className="font-serif text-xl font-bold text-earth-900">
              Consequence of Your Decision: {selectedData.influence}
            </h4>
          </div>

          <div className="p-4 bg-earth-900 text-parchment-100 rounded-xl text-xs sm:text-sm leading-relaxed border border-gold-500/30">
            <strong className="text-gold-400 block mb-1">Historical Context:</strong>
            {selectedData.historicalNote}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-xs font-bold text-earth-700 font-mono">
              Reward: +200 Heritage XP · Heritage DNA Evolved
            </span>
            <Button
              size="md"
              onClick={() => onComplete(selectedData.id, 200)}
              className="bg-gold-500 text-earth-950 hover:bg-gold-600 font-serif font-bold uppercase tracking-wider text-xs px-8 py-3.5 shadow-md flex items-center gap-2"
            >
              <span>Confirm & Proceed to Final Synthesis</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
