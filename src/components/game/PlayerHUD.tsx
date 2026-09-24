"use client";

import { useGameStore } from "@/store/gameState";
import { motion, AnimatePresence } from "framer-motion";
import { Box, User, X, Award } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function PlayerHUD() {
  const { player, inventory, heritageDNA, levelUpNotification, dismissLevelUp, badges } = useGameStore();
  const [openTab, setOpenTab] = useState<"inventory" | "dna" | null>(null);

  // Dynamic Heritage DNA identity based on top traits
  const getDNAProfile = () => {
    const traits = Object.entries(heritageDNA).sort((a, b) => b[1] - a[1]);
    const top1 = traits[0]?.[0] || "history";
    const top2 = traits[1]?.[0] || "strategy";

    if (top1 === "mathematics" && top2 === "history") return "Astronomer & Historian";
    if (top1 === "architecture" && top2 === "arts") return "Monumental Architect & Artist";
    if (top1 === "strategy" && top2 === "geography") return "Trade Strategist & Explorer";
    if (top1 === "history" && top2 === "architecture") return "Civilizational Chronicler";
    if (top1 === "mathematics" && top2 === "strategy") return "Tactical Polymath";
    return "Cultural Explorer";
  };

  const xpProgressPercent = Math.min(
    100,
    Math.round((player.xp / Math.max(1, player.nextLevelXP)) * 100)
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Top Bar HUD */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/85 via-black/50 to-transparent flex justify-between items-start px-4 sm:px-8 py-5">
        {/* Brand & Level Progress */}
        <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto">
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-gold-200 to-gold-500 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              DHA<span className="text-gold-400">RA</span>
            </span>
          </Link>

          {/* Player Level & XP Indicator */}
          <div className="hidden md:flex flex-col bg-earth-950/70 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-gold-500/30 shadow-lg min-w-[170px]">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-parchment-300">
              <span className="text-gold-400 font-serif font-bold">Lvl {player.level}</span>
              <span>{player.xp} / {player.nextLevelXP} XP</span>
            </div>
            <div className="w-full bg-earth-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-gradient-to-r from-gold-500 to-gold-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Nav Controls */}
        <div className="flex gap-2 sm:gap-3 pointer-events-auto">
          <Link href="/dashboard">
            <button className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border backdrop-blur-md bg-earth-950/70 text-parchment-200 border-gold-500/30 hover:bg-gold-500 hover:text-earth-950 transition-all text-xs font-serif font-bold tracking-wider uppercase shadow-md">
              <span>Journey</span>
            </button>
          </Link>

          <button
            onClick={() => setOpenTab(openTab === "inventory" ? null : "inventory")}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border backdrop-blur-md transition-all text-xs font-serif font-bold tracking-wider uppercase shadow-md ${
              openTab === "inventory"
                ? "bg-gold-500 text-earth-950 border-gold-400"
                : "bg-earth-950/70 text-parchment-200 border-gold-500/30 hover:bg-earth-800"
            }`}
          >
            <Box size={16} />
            <span>Chest</span>
            {inventory.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-gold-500/30 text-gold-200 text-[10px] rounded-full border border-gold-500/40">
                {inventory.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setOpenTab(openTab === "dna" ? null : "dna")}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border backdrop-blur-md transition-all text-xs font-serif font-bold tracking-wider uppercase shadow-md ${
              openTab === "dna"
                ? "bg-gold-500 text-earth-950 border-gold-400"
                : "bg-earth-950/70 text-parchment-200 border-gold-500/30 hover:bg-earth-800"
            }`}
          >
            <User size={16} />
            <span>DNA Profile</span>
          </button>
        </div>
      </div>

      {/* Level Up Notification Modal Banner */}
      <AnimatePresence>
        {levelUpNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="absolute top-28 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-earth-950 via-earth-900 to-earth-950 border-2 border-gold-400 px-8 py-4 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.7)] pointer-events-auto flex items-center gap-6"
          >
            <div className="w-12 h-12 rounded-full bg-gold-500 text-earth-950 flex items-center justify-center font-serif text-2xl font-bold shadow-lg">
              {levelUpNotification.newLevel}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold-400">
                Level Up Achieved!
              </div>
              <div className="font-serif text-xl font-bold text-parchment-100">
                Title: {levelUpNotification.title}
              </div>
            </div>
            <button
              onClick={dismissLevelUp}
              className="px-4 py-1.5 bg-gold-500 text-earth-950 rounded-xl font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110"
            >
              Claim Honor
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-out Panels */}
      <AnimatePresence>
        {/* Heritage Chest Drawer */}
        {openTab === "inventory" && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute top-24 bottom-6 right-4 sm:right-8 w-full max-w-md bg-parchment-100 border-2 border-gold-500/40 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.7)] p-6 pointer-events-auto flex flex-col text-earth-900 z-50"
          >
            <div className="flex items-center justify-between border-b-2 border-parchment-300 pb-4 mb-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
                  <Box className="text-gold-600 w-7 h-7" /> My Heritage Chest
                </h2>
                <div className="text-[11px] text-earth-500 font-mono mt-0.5">
                  Artifacts & Tokens ({inventory.length})
                </div>
              </div>
              <button
                onClick={() => setOpenTab(null)}
                className="p-1 rounded-full text-earth-500 hover:text-earth-900"
              >
                <X size={22} />
              </button>
            </div>

            {/* Disclaimer on Rarity */}
            <div className="bg-amber-500/10 border border-amber-600/30 rounded-xl p-2.5 text-[11px] text-earth-800 leading-snug mb-4">
              <span className="font-bold text-amber-900">Note:</span> Rarity designations (Common, Rare, Legendary) reflect in-game progression tiers and never imply any historical hierarchy.
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    item.isPlaced
                      ? "bg-parchment-200/80 border-parchment-300 opacity-75"
                      : "bg-white border-gold-500/40 shadow-sm hover:border-gold-500 hover:shadow"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl p-2.5 bg-parchment-100 rounded-xl border border-parchment-300 shrink-0">
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif font-bold text-base text-earth-900 leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold-500/15 text-gold-800 border border-gold-500/30">
                          {item.rarity}
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider mt-1">
                        {item.era} · {item.category}
                      </div>
                      <p className="text-xs text-earth-700 mt-2 leading-relaxed font-medium">
                        {item.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-parchment-200 text-xs">
                        <span className="text-earth-500 text-[11px] italic font-serif">
                          Source: {item.source}
                        </span>
                        {item.isPlaced ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded-md border border-green-200">
                            Constructed on Board
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700 bg-gold-50 px-2 py-0.5 rounded-md border border-gold-300">
                            Ready to Place
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {inventory.length === 0 && (
                <div className="p-8 text-center text-earth-600 font-medium bg-parchment-200/60 rounded-2xl border-2 border-dashed border-parchment-300">
                  Your Heritage Chest is waiting for its first discovery. Complete the Nalanda expedition to recover classical tokens.
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Heritage DNA Drawer */}
        {openTab === "dna" && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute top-24 bottom-6 right-4 sm:right-8 w-full max-w-md bg-earth-950 border-2 border-gold-500/60 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.85)] p-6 pointer-events-auto flex flex-col text-parchment-100 z-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/mandala.svg')] opacity-5 pointer-events-none" />

            <div className="flex items-center justify-between border-b border-earth-800 pb-4 mb-4 relative z-10">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
                  <User className="text-gold-400 w-7 h-7" /> Heritage DNA
                </h2>
                <div className="text-[11px] text-parchment-300 font-mono mt-0.5">
                  Civilizational Identity Matrix
                </div>
              </div>
              <button
                onClick={() => setOpenTab(null)}
                className="p-1 rounded-full text-parchment-400 hover:text-white"
              >
                <X size={22} />
              </button>
            </div>

            {/* Dynamic Archetype Banner */}
            <div className="text-center p-4 rounded-2xl bg-gradient-to-r from-earth-900 via-earth-850 to-earth-900 border border-gold-500/30 mb-5 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400 block mb-1">
                Dynamic Profile Archetype
              </span>
              <div className="font-serif text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 font-bold">
                &ldquo;{getDNAProfile()}&rdquo;
              </div>
              <p className="text-xs text-parchment-300/80 mt-1 italic font-serif">
                &ldquo;Your journey is shaping your Heritage DNA. This is the India you are building.&rdquo;
              </p>
            </div>

            {/* DNA Trait Bars (Clamped strictly to 0-100) */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-1 relative z-10">
              {Object.entries(heritageDNA).map(([trait, value]) => {
                const clamped = Math.max(0, Math.min(100, value));
                return (
                  <div key={trait}>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-parchment-300 mb-1.5">
                      <span className="capitalize">{trait}</span>
                      <span className="text-gold-400 font-mono">{clamped}%</span>
                    </div>
                    <div className="w-full bg-earth-900 rounded-full h-2 overflow-hidden border border-earth-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${clamped}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 h-full rounded-full"
                      />
                    </div>
                  </div>
                );
              })}

              {/* Badges Section */}
              <div className="pt-4 border-t border-earth-800">
                <div className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Earned Heritage Badges ({badges.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {badges.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-1.5 bg-earth-900 px-3 py-1 rounded-xl border border-gold-500/30 text-xs text-parchment-200"
                    >
                      <span>{b.icon}</span>
                      <span className="font-serif font-bold">{b.name}</span>
                    </div>
                  ))}
                  {badges.length === 0 && (
                    <span className="text-xs text-parchment-400 italic">
                      No badges earned yet. Complete quests to unlock.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
