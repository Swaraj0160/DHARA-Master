"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Gamepad2, ArrowLeft } from "lucide-react";
import Ashtapada from "@/components/games/Ashtapada";
import { motion, AnimatePresence } from "framer-motion";

export default function GamesHub() {
  const [playing, setPlaying] = useState<string | null>(null);

  const games = [
    {
      id: "ashtapada",
      name: "Ashtapada",
      origin: "Ancient India (Vedic / Mauryan)",
      period: "Pre-6th Century BCE",
      desc: "The venerated predecessor to chess (Chaturanga), played on an uncheckered 8x8 grid with cowrie shells and outer-to-inner spiral race dynamics.",
      playable: true,
      rewardTag: "+150 XP · +15 Strategy DNA",
    },
    {
      id: "pachisi",
      name: "Chaupar / Pachisi",
      origin: "Medieval India",
      period: "Medieval (16th Century CE)",
      desc: "The cross-and-circle strategic racing game played with cowrie shells, famously played on giant marble palace courtyards by Mughal Emperor Akbar with live attendants.",
      playable: false,
      rewardTag: "Coming in Module 2",
    },
    {
      id: "gilli",
      name: "Gilli-Danda & Moksha Patam",
      origin: "Indian Subcontinent",
      period: "Ancient (2nd Century BCE)",
      desc: "Precursor to snakes & ladders conceived by Saint Gyandev as an ethical progression metaphor illustrating karmic ascension and moral detours.",
      playable: false,
      rewardTag: "Coming in Module 2",
    },
  ];

  return (
    <div className="min-h-screen bg-parchment-200 flex flex-col selection:bg-gold-500/30">
      <Navigation />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 sm:py-14">
        <div className="text-center mb-12 space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-terracotta-600 flex items-center justify-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-gold-600" /> Traditional Game Lab
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl sm:text-5xl text-earth-900 font-bold drop-shadow-sm"
          >
            Play Ancient India
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-base sm:text-lg text-earth-700 max-w-2xl mx-auto leading-relaxed font-sans"
          >
            &ldquo;Don&apos;t just learn India. Play it.&rdquo; Experience digital restorations of classical Indian board games that influenced global ludology.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {playing === "ashtapada" ? (
            <motion.div
              key="game-board"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="space-y-6"
            >
              <button
                onClick={() => setPlaying(null)}
                className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-earth-700 hover:text-earth-950 bg-parchment-100 hover:bg-parchment-300 px-4 py-2 rounded-xl border border-parchment-300 shadow-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Games Lab</span>
              </button>

              <Ashtapada />
            </motion.div>
          ) : (
            <motion.div
              key="games-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {games.map((game, idx) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full flex flex-col bg-parchment-100 border-2 border-parchment-300 hover:border-gold-500 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="h-44 bg-earth-950 relative flex items-center justify-center border-b-2 border-gold-500/40">
                      <div className="absolute inset-0 bg-[url('/mandala.svg')] opacity-10 bg-center bg-no-repeat pointer-events-none" />
                      <div className="w-16 h-16 rounded-2xl bg-earth-900 border border-gold-500/30 flex items-center justify-center text-3xl shadow-lg">
                        {game.id === "ashtapada" ? "🎲" : game.id === "pachisi" ? "⚔️" : "🪜"}
                      </div>
                      <span className="absolute top-4 right-4 bg-earth-900/90 text-parchment-200 text-[10px] font-mono px-3 py-1 rounded-full border border-earth-700">
                        {game.period}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between text-earth-900">
                      <div>
                        <h3 className="font-serif text-2xl font-bold mb-1">{game.name}</h3>
                        <div className="text-[11px] font-bold text-terracotta-600 uppercase tracking-wider mb-3">
                          {game.origin}
                        </div>
                        <p className="text-xs text-earth-700 leading-relaxed font-medium mb-4">
                          {game.desc}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-parchment-300 space-y-3">
                        <span className="text-[10px] font-mono text-gold-800 font-bold block bg-gold-500/15 py-1 px-2.5 rounded-lg border border-gold-500/30 text-center">
                          {game.rewardTag}
                        </span>

                        {game.playable ? (
                          <Button
                            size="md"
                            onClick={() => setPlaying(game.id)}
                            className="w-full font-serif font-bold uppercase tracking-wider text-xs py-3.5 bg-gold-500 text-earth-950 hover:bg-gold-600 shadow-md"
                          >
                            Play Bharat Adaptation
                          </Button>
                        ) : (
                          <Button
                            size="md"
                            disabled
                            variant="secondary"
                            className="w-full font-serif text-xs uppercase tracking-wider py-3.5 opacity-60"
                          >
                            Preservation in Progress
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
