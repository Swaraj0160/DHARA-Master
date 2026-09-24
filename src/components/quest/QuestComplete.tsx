"use client";

import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Trophy, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface QuestCompleteProps {
  score: number;
  onAddToBharat: () => void;
}

export default function QuestComplete({ score, onAddToBharat }: QuestCompleteProps) {
  const stats = [
    { label: "Historical Knowledge", value: 94 },
    { label: "Cultural Awareness", value: 92 },
    { label: "Problem Solving & Reasoning", value: 88 },
    { label: "Campus & Manuscript Exploration", value: 96 },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      <Card className="p-8 sm:p-12 bg-gradient-to-b from-parchment-100 via-parchment-50 to-parchment-100 border-2 border-gold-500 shadow-2xl relative overflow-hidden text-center">
        {/* Decorative Mandala */}
        <div className="absolute inset-0 opacity-5 bg-[url('/mandala.svg')] bg-center bg-no-repeat pointer-events-none" />

        {/* Golden Trophy Icon with Spring animation */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-3xl flex items-center justify-center shadow-xl mb-6 border-2 border-white/60"
        >
          <Trophy className="text-earth-950 w-12 h-12" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-1 mb-8"
        >
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta-600 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" /> Quest Completed
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-earth-900 font-bold">
            The Lost Library of Nalanda
          </h2>
          <p className="text-earth-600 font-serif italic text-lg">
            &ldquo;Center of Learning Unlocked&rdquo;
          </p>
        </motion.div>

        {/* Performance Scorecard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-parchment-200/90 rounded-2xl p-6 sm:p-8 border border-parchment-300 mb-8 shadow-inner text-left"
        >
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-parchment-300">
            <span className="text-xs font-bold tracking-widest text-earth-600 uppercase">
              Heritage Knowledge Assessment
            </span>
            <span className="text-xs font-mono font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">
              Grade: Acharya Exemplar
            </span>
          </div>

          <div className="space-y-4 mb-6">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs sm:text-sm font-medium text-earth-900 mb-1.5">
                  <span>{stat.label}</span>
                  <span className="font-mono font-bold text-earth-800">{stat.value}%</span>
                </div>
                <div className="w-full bg-parchment-300 rounded-full h-2 overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 1.2, delay: 0.7 + idx * 0.15, ease: "easeOut" }}
                    className="bg-gradient-to-r from-terracotta-500 via-gold-500 to-gold-600 h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Badge Unlocked Callout */}
          <div className="pt-4 border-t border-parchment-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-xl">
                🎖️
              </div>
              <div className="text-left">
                <div className="text-xs text-earth-500 uppercase tracking-wider font-semibold">Earned Title Badge</div>
                <div className="font-serif font-bold text-earth-900 text-lg">Nalanda Scholar</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-earth-500 uppercase tracking-wider block">Total Reward</span>
              <span className="font-serif text-2xl text-gold-700 font-bold">+{score} Heritage XP</span>
            </div>
          </div>
        </motion.div>

        {/* Discovery Unlocked Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gold-500/10 border-2 border-gold-500/40 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl p-3 bg-white rounded-xl shadow-sm border border-gold-400">🏛️</div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-terracotta-600">
                New Living Node Ready
              </div>
              <h4 className="font-serif font-bold text-xl text-earth-900">
                Nalanda Mahavihara Token
              </h4>
              <p className="text-xs text-earth-700">
                Added to your Heritage Chest. Place it on your Living India Board to start forming Sangam connections!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Return to Living India CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
        >
          <Button
            size="lg"
            onClick={onAddToBharat}
            className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-earth-950 font-serif font-bold tracking-widest text-base uppercase shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 mx-auto"
          >
            <span>ADD NALANDA TO YOUR DHARA</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </Card>
    </div>
  );
}
