"use client";

import { motion } from "framer-motion";
import { Star, ArrowRight, CheckCircle2 } from "lucide-react";

interface ChapterCompleteModalProps {
  chapterTitle: string;
  locationName: string;
  correctAnswers: number;
  totalQuestions: number;
  starsEarned: number;
  newStarsEarned: number;
  xpEarned: number;
  nextChapterUnlocked: string | null;
  onContinue: () => void;
}

export default function ChapterCompleteModal({
  chapterTitle,
  locationName,
  correctAnswers,
  totalQuestions,
  starsEarned,
  newStarsEarned,
  xpEarned,
  nextChapterUnlocked,
  onContinue,
}: ChapterCompleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-earth-950 border-2 border-gold-400 p-6 sm:p-10 rounded-3xl max-w-lg w-full shadow-[0_0_60px_rgba(212,175,55,0.4)] relative text-center text-parchment-100 overflow-hidden"
      >
        {/* Subtle background mandala watermark */}
        <div className="absolute inset-0 opacity-5 bg-[url('/mandala.svg')] bg-center bg-no-repeat pointer-events-none" />

        {/* Celebration Title */}
        <div className="text-[11px] font-mono uppercase tracking-[0.35em] text-gold-400 mb-2">
          Location Conquered
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-200 to-gold-500 mb-1">
          CHAPTER COMPLETE
        </h2>
        <p className="text-sm font-serif italic text-parchment-300 mb-6">
          {chapterTitle} · {locationName}
        </p>

        {/* Animated Stars Earned (0 to 3) */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2, 3].map((starIndex) => {
            const hasStar = starIndex <= starsEarned;
            return (
              <motion.div
                key={starIndex}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 + starIndex * 0.15, type: "spring" }}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
                  hasStar
                    ? "bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-500 border-gold-300 text-earth-950 shadow-[0_0_25px_rgba(212,175,55,0.6)]"
                    : "bg-earth-900/60 border-earth-800 text-earth-700"
                }`}
              >
                <Star
                  className={`w-8 h-8 ${
                    hasStar ? "fill-earth-950 text-earth-950" : "text-earth-700"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Performance & Rewards Box */}
        <div className="p-4 rounded-2xl bg-earth-900/80 border border-gold-500/30 mb-6 space-y-2.5 text-left">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
            <span className="text-parchment-300">Challenges Solved:</span>
            <span className="font-bold text-parchment-100">
              {correctAnswers} / {totalQuestions} Correct
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
            <span className="text-parchment-300">Chapter Stars:</span>
            <span className="font-bold text-gold-300">
              {starsEarned} / 3 Stars
              {newStarsEarned > 0 && (
                <span className="text-[11px] text-gold-400 ml-1.5 font-normal">
                  (+{newStarsEarned} Global)
                </span>
              )}
            </span>
          </div>

          {xpEarned > 0 && (
            <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
              <span className="text-parchment-300">Experience Awarded:</span>
              <span className="font-bold text-gold-400">+{xpEarned} XP</span>
            </div>
          )}

          {nextChapterUnlocked && (
            <div className="pt-2 border-t border-earth-800 flex items-center gap-2 text-xs font-mono text-gold-300">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Next sequential location unlocked on your map!</span>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-earth-950 font-serif font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
        >
          <span>Continue Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
