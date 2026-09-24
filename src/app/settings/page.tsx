"use client";

import { useState } from "react";
import { useGameStore } from "@/store/gameState";
import Link from "next/link";
import { ArrowLeft, Settings as SettingsIcon, Volume2, VolumeX, RotateCcw, AlertTriangle, Check } from "lucide-react";
import WorldHUD from "@/components/game/WorldHUD";

export default function SettingsPage() {
  const { resetProgress } = useGameStore();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetProgress();
    setResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-earth-950 text-parchment-100 flex flex-col justify-between selection:bg-gold-500/40 relative pt-24 pb-12 px-4 sm:px-6">
      <WorldHUD />

      <div className="max-w-xl mx-auto w-full my-auto">
        <div className="p-6 sm:p-10 rounded-3xl bg-earth-900/90 border-2 border-gold-500/50 shadow-2xl relative overflow-hidden">
          {/* Background watermark */}
          <div className="absolute inset-0 opacity-5 bg-[url('/mandala.svg')] bg-center bg-no-repeat pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-earth-800 pb-5 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-earth-950 via-earth-900 to-earth-850 border-2 border-gold-400 flex items-center justify-center text-gold-400 shadow-md">
                <SettingsIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-parchment-100">
                  Settings
                </h1>
                <p className="text-xs font-mono text-gold-400 uppercase tracking-widest">
                  Game Configuration
                </p>
              </div>
            </div>

            <Link href="/">
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-earth-950/80 border border-gold-500/30 text-parchment-300 hover:text-gold-300 hover:border-gold-400 text-xs font-serif font-bold uppercase tracking-wider transition-all">
                <ArrowLeft className="w-4 h-4 text-gold-400" />
                <span>World</span>
              </button>
            </Link>
          </div>

          {/* Audio Toggles */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-earth-950/80 border border-gold-500/25">
              <div>
                <div className="font-serif text-sm font-bold text-parchment-100">
                  Sound Effects
                </div>
                <div className="text-[11px] font-mono text-parchment-400">
                  Puzzle interactions and milestone rewards
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2.5 rounded-xl border transition-all ${
                  soundEnabled
                    ? "bg-gold-500 text-earth-950 border-gold-400"
                    : "bg-earth-900 text-stone-500 border-earth-800"
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-earth-950/80 border border-gold-500/25">
              <div>
                <div className="font-serif text-sm font-bold text-parchment-100">
                  Ambient Atmosphere
                </div>
                <div className="text-[11px] font-mono text-parchment-400">
                  World map animations and background particle effects
                </div>
              </div>
              <button
                onClick={() => setAmbientEnabled(!ambientEnabled)}
                className={`p-2.5 rounded-xl border transition-all ${
                  ambientEnabled
                    ? "bg-gold-500 text-earth-950 border-gold-400"
                    : "bg-earth-900 text-stone-500 border-earth-800"
                }`}
              >
                {ambientEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Danger Zone: Reset Game Progress */}
          <div className="pt-6 border-t border-earth-800">
            <div className="text-xs font-mono uppercase tracking-widest text-terracotta-400 font-bold mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-terracotta-400" />
              Testing & Diagnostics
            </div>

            {resetSuccess && (
              <div className="p-3.5 mb-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Progression reset to 0 XP, Level 0, 0 Stars. Pataliputra Chapter 1 unlocked.</span>
              </div>
            )}

            {!resetConfirm ? (
              <button
                onClick={() => setResetConfirm(true)}
                className="w-full py-3 rounded-xl border border-terracotta-500/50 text-terracotta-400 hover:bg-terracotta-900/30 hover:border-terracotta-400 text-xs font-serif font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Game Progression</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-stone-950/90 border border-terracotta-500/60 space-y-3">
                <p className="text-xs text-parchment-300 leading-relaxed">
                  Are you sure? This will wipe stored XP, Level, and Stars, resetting your journey back to a fresh player state for testing.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-500 text-white text-xs font-serif font-bold uppercase tracking-wider transition-all"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setResetConfirm(false)}
                    className="px-4 py-2 rounded-xl bg-earth-900 text-parchment-300 hover:text-white text-xs font-serif font-bold uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
