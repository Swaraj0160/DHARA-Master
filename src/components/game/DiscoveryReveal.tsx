"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, ArrowRight } from "lucide-react";
import { ItemRarity } from "@/store/gameState";
import TruthBadge, { type TruthLevel } from "@/components/ui/TruthBadge";

interface DiscoveryRevealProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  category?: string;
  rarity?: ItemRarity;
  icon: string | React.ReactNode;
  description: string;
  historicalContext?: string;
  /** Heritage Truth Layer classification for the historicalContext shown below. Omit only for pure gameplay-fiction discoveries with no historical claim. */
  truthLevel?: TruthLevel;
  rewards?: {
    xp?: number;
    dna?: { trait: string; value: number }[];
    badge?: string;
  };
  tags?: string[];
  ctaLabel?: string;
  onConfirm: () => void;
}

export default function DiscoveryReveal({
  isOpen,
  title,
  subtitle,
  category,
  rarity = "Rare",
  icon,
  description,
  historicalContext,
  truthLevel,
  rewards,
  tags = [],
  ctaLabel = "ADD TO YOUR DHARA",
  onConfirm,
}: DiscoveryRevealProps) {
  if (!isOpen) return null;

  const rarityMap: Record<ItemRarity, string> = {
    Common: "from-stone-400 to-stone-600 border-stone-400 text-stone-200",
    Rare: "from-blue-500 to-indigo-700 border-blue-400 text-blue-200",
    Epic: "from-purple-500 to-indigo-800 border-purple-400 text-purple-200",
    Legendary: "from-gold-400 to-gold-600 border-gold-400 text-gold-200",
  };
  const rarityColor = rarityMap[rarity] || rarityMap.Rare;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        {/* Subtle spinning background mandala */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[600px] h-[600px] bg-[url('/mandala.svg')] bg-contain bg-no-repeat bg-center animate-[spin_60s_linear_infinite]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="relative max-w-xl w-full bg-gradient-to-b from-earth-900 via-earth-850 to-earth-950 border border-gold-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 text-center text-parchment-100 overflow-hidden my-auto"
        >
          {/* Top Tag & Rarity */}
          <div className="flex items-center justify-between mb-4 text-xs">
            <span className="text-gold-400/90 font-serif tracking-[0.25em] uppercase flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" /> New Discovery {category && `· ${category}`}
            </span>
            <span
              className={`px-3 py-1 rounded-full border text-[11px] font-bold tracking-widest uppercase bg-gradient-to-r ${rarityColor}`}
            >
              {rarity}
            </span>
          </div>

          {/* Reveal Icon Silhouette into glow */}
          <div className="relative my-6 flex justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-gold-500/15 via-earth-800 to-earth-900 border border-gold-500/50 shadow-lg flex items-center justify-center text-5xl sm:text-6xl relative group"
            >
              <span className="relative z-10">{icon}</span>
            </motion.div>
          </div>

          {/* Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 font-bold tracking-wide mb-1.5">
              {title}
            </h2>
            <p className="text-gold-300/80 font-serif italic text-base sm:text-lg mb-4">
              &ldquo;{subtitle}&rdquo;
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-parchment-200/90 text-sm leading-relaxed mb-5 max-w-lg mx-auto font-sans"
          >
            {description}
          </motion.p>

          {/* Historical Context Badge / Notice */}
          {historicalContext && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="p-3 bg-earth-950/60 rounded-xl border border-gold-500/20 text-left text-xs mb-5 space-y-1"
            >
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <div className="text-[10px] font-bold tracking-widest text-gold-400 uppercase flex items-center gap-1">
                  <span>Historical Context</span>
                </div>
                {truthLevel && <TruthBadge level={truthLevel} />}
              </div>
              <p className="text-parchment-300/80 leading-relaxed">{historicalContext}</p>
            </motion.div>
          )}

          {/* Rewards Panel */}
          {rewards && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 }}
              className="p-3.5 bg-gold-500/10 rounded-2xl border border-gold-500/30 mb-6 flex items-center justify-around flex-wrap gap-2 text-xs"
            >
              {rewards.xp !== undefined && (
                <div className="flex items-center gap-1.5 text-gold-300 font-bold font-serif text-sm sm:text-base">
                  <Trophy className="w-4 h-4 text-gold-400" />
                  <span>+{rewards.xp} Heritage XP</span>
                </div>
              )}
              {rewards.dna &&
                rewards.dna.map((d, i) => (
                  <div key={i} className="text-parchment-200 font-medium">
                    <span className="text-gold-400 font-bold">+{d.value}</span>{" "}
                    <span className="capitalize">{d.trait}</span>
                  </div>
                ))}
              {rewards.badge && (
                <div className="text-gold-300 bg-gold-600/20 px-2.5 py-1 rounded-full border border-gold-500/40 text-[11px] font-bold">
                  🎖️ {rewards.badge}
                </div>
              )}
            </motion.div>
          )}

          {/* Knowledge Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-earth-800/80 text-gold-300/90 px-2.5 py-1 rounded-lg border border-gold-500/20 text-[11px] tracking-wider uppercase font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            onClick={onConfirm}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-earth-950 font-serif font-bold tracking-widest text-sm uppercase shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
