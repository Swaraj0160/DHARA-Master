"use client";

import { useGameStore } from "@/store/gameState";
import { CITIES_DATA } from "@/data/gameContent";
import { motion } from "framer-motion";
import { X, Star, ShieldCheck, Lock, Award, Sparkles, Compass } from "lucide-react";

interface PassportModalProps {
  onClose: () => void;
}

export default function PassportModal({ onClose }: PassportModalProps) {
  const { player, chapterProgress, getTotalStars, isCityUnlocked, isCityPassportUnlocked, getUnlockedPassportsCount } = useGameStore();

  const totalGlobalStars = getTotalStars();
  const unlockedPassportsCount = getUnlockedPassportsCount();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.25 }}
        className="bg-earth-950 border-2 border-gold-500/60 rounded-3xl max-w-2xl w-full shadow-[0_0_60px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Decorative Background Watermark */}
        <div className="absolute inset-0 opacity-5 bg-[url('/mandala.svg')] bg-center bg-no-repeat pointer-events-none" />

        {/* Modal Top Header Bar */}
        <div className="relative z-10 p-6 sm:px-8 sm:pt-8 pb-4 border-b border-gold-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-earth-950 via-earth-900 to-earth-850 border-2 border-gold-400 flex items-center justify-center text-gold-400 shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-parchment-100 uppercase">
                  Heritage Passport
                </h2>
                <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40">
                  Official Record
                </span>
              </div>
              <p className="text-xs font-serif italic text-gold-300/80 mt-0.5">
                Imperial Seals &amp; Permanent Realm Visas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-earth-900/80 border border-gold-500/30 text-parchment-400 hover:text-gold-200 hover:border-gold-400 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passport Holder Dossier Strip */}
        <div className="relative z-10 px-6 sm:px-8 py-3 bg-earth-900/60 border-b border-gold-500/15 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-parchment-400">Bearer:</span>
            <span className="text-parchment-100 font-bold">{player.name}</span>
            <span className="text-earth-600">·</span>
            <span className="text-gold-400 font-serif italic">{player.title}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-parchment-400">Passports Granted:</span>
              <span className="text-gold-300 font-bold">
                {unlockedPassportsCount} / {CITIES_DATA.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              <span className="text-gold-300 font-bold">{totalGlobalStars} ★</span>
            </div>
          </div>
        </div>

        {/* Requirement Explainer Banner */}
        <div className="relative z-10 px-6 sm:px-8 py-2.5 bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent border-b border-gold-500/10 flex items-center gap-2 text-[11px] text-parchment-300 font-serif">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span>
            <strong>Permanent Passport Rule:</strong> Master all chapters of an ancient realm with a full <strong>3★ rating</strong> (all stars gained) to seal its permanent royal passport.
          </span>
        </div>

        {/* Scrollable City Passports List */}
        <div className="relative z-10 p-6 sm:px-8 overflow-y-auto space-y-4 flex-1">
          {CITIES_DATA.map((city) => {
            const unlocked = isCityUnlocked(city.id);
            const passportUnlocked = isCityPassportUnlocked(city.id);

            const totalChapters = city.chapters.length;
            const perfectChaptersCount = city.chapters.filter(
              (ch) => chapterProgress[ch.id]?.completed && chapterProgress[ch.id]?.stars === 3
            ).length;

            const starsEarned = city.chapters.reduce((acc, ch) => {
              const p = chapterProgress[ch.id];
              return acc + (p?.completed ? p.stars : 0);
            }, 0);
            const maxStars = totalChapters * 3;

            return (
              <div
                key={city.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all relative overflow-hidden ${
                  passportUnlocked
                    ? "bg-gradient-to-r from-gold-950/40 via-earth-900/80 to-earth-950 border-gold-400/60 shadow-[0_0_25px_rgba(212,175,55,0.2)]"
                    : unlocked
                    ? "bg-earth-900/50 border-gold-500/25 text-parchment-200"
                    : "bg-stone-950/60 border-stone-800/80 opacity-60 text-stone-400"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* City Info */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border ${
                        passportUnlocked
                          ? "bg-gradient-to-br from-earth-950 to-earth-900 border-gold-400 shadow-md"
                          : unlocked
                          ? "bg-earth-950 border-gold-500/30"
                          : "bg-stone-900 border-stone-800 text-stone-500"
                      }`}
                    >
                      {unlocked ? city.artwork : <Lock className="w-6 h-6 text-stone-500" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-bold text-parchment-100 uppercase tracking-wide">
                          {city.name}
                        </h3>
                        <span className="text-[10px] font-mono text-gold-400/90">
                          {city.era}
                        </span>
                      </div>
                      <p className="text-xs font-serif italic text-parchment-300/80">
                        &ldquo;{city.subtitle}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-parchment-400">
                        <Compass className="w-3 h-3 text-gold-400" />
                        <span>{city.region}</span>
                        <span>·</span>
                        <span className="text-gold-300 font-bold">{starsEarned} / {maxStars} ★</span>
                      </div>
                    </div>
                  </div>

                  {/* Stamp / Passport Status Seal */}
                  <div className="sm:text-right shrink-0">
                    {passportUnlocked ? (
                      /* Royal Wax Stamp Granted */
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-gold-500/20 via-gold-400/20 to-gold-500/20 border-2 border-gold-400 text-gold-200 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                        <Award className="w-5 h-5 text-gold-400 shrink-0" />
                        <div className="text-left">
                          <div className="text-[10px] font-mono uppercase tracking-widest font-bold text-gold-300">
                            Permanent Passport
                          </div>
                          <div className="text-[9px] font-serif text-parchment-300">
                            All {totalChapters} Chapters Perfected (3★)
                          </div>
                        </div>
                      </div>
                    ) : unlocked ? (
                      /* Provisional Status */
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-earth-950/80 border border-gold-500/30 text-parchment-300">
                        <div className="text-left sm:text-right">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-parchment-300">
                            Provisional Visa
                          </div>
                          <div className="text-[10px] font-mono text-gold-400 font-bold">
                            {perfectChaptersCount} / {totalChapters} Chapters at 3★
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sealed Realm */
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-400 text-xs font-mono">
                        <Lock className="w-3.5 h-3.5 text-stone-500" />
                        <span>Requires {city.requiredStars}★</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Mini Bar */}
                {unlocked && !passportUnlocked && (
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-parchment-400">
                    <span>Master all {totalChapters} chapters with 3★ to unlock permanent seal</span>
                    <span className="text-gold-400 font-bold">
                      {Math.max(0, totalChapters - perfectChaptersCount)} chapter(s) remaining
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="relative z-10 p-4 sm:px-8 border-t border-gold-500/20 bg-earth-950 flex justify-between items-center">
          <span className="text-xs font-serif italic text-parchment-400">
            Dhara Cultural Archive Authority
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-earth-950 font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer"
          >
            Close Passport
          </button>
        </div>
      </motion.div>
    </div>
  );
}
