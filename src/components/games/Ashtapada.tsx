"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Dices, RefreshCw, Swords, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameState";

// Classic Ashtapada spiral path from outer edge to center (64 squares)
const spiralPath = [
  0, 1, 2, 3, 4, 5, 6, 7,
  15, 23, 31, 39, 47, 55, 63,
  62, 61, 60, 59, 58, 57, 56,
  48, 40, 32, 24, 16, 8,
  9, 10, 11, 12, 13, 14,
  22, 30, 38, 46, 54,
  53, 52, 51, 50, 49,
  41, 33, 25, 17,
  18, 19, 20, 21,
  29, 37, 45,
  44, 43, 42,
  34, 26,
  27, 28, 36, 35
];

// Cross-cut safe squares (Chaupar/Ashtapada traditions)
const SPECIAL_SQUARES = [0, 7, 56, 63, 27, 28, 35, 36];

export default function Ashtapada() {
  const { addXP, updateDNA } = useGameStore();
  const [playerIndex, setPlayerIndex] = useState(0);
  const [cpuIndex, setCpuIndex] = useState(0);
  const [dice, setDice] = useState<number | null>(null);
  const [turn, setTurn] = useState<"player" | "cpu" | "victory" | "defeat">("player");
  const [log, setLog] = useState<string[]>([
    "Match initiated. Roll cowrie shells to race along the spiral to the center.",
  ]);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const addLog = (msg: string) => setLog((prev) => [msg, ...prev].slice(0, 5));

  const handlePlayerRoll = () => {
    if (turn !== "player") return;
    const val = Math.floor(Math.random() * 4) + 1;
    setDice(val);

    const newIndex = Math.min(playerIndex + val, 63);
    addLog(`You cast cowrie shells: ${val} paces.`);

    if (
      newIndex === cpuIndex &&
      newIndex !== 0 &&
      !SPECIAL_SQUARES.includes(spiralPath[newIndex])
    ) {
      addLog(`⚔️ Captured opponent piece! Opponent retreats to start.`);
      setCpuIndex(0);
    }

    setPlayerIndex(newIndex);

    if (newIndex === 63) {
      addLog("🏆 Victory! You reached the sacred center!");
      setTurn("victory");
      if (!rewardClaimed) {
        addXP(150);
        updateDNA("strategy", 15);
        updateDNA("history", 10);
        setRewardClaimed(true);
      }
      return;
    }

    setTurn("cpu");
  };

  useEffect(() => {
    if (turn === "cpu") {
      const timer = setTimeout(() => {
        const val = Math.floor(Math.random() * 4) + 1;
        setDice(val);

        const newIndex = Math.min(cpuIndex + val, 63);
        addLog(`Opponent rolled: ${val} paces.`);

        if (
          newIndex === playerIndex &&
          newIndex !== 0 &&
          !SPECIAL_SQUARES.includes(spiralPath[newIndex])
        ) {
          addLog(`💀 Opponent captured your piece! Retreat to origin.`);
          setPlayerIndex(0);
        }

        setCpuIndex(newIndex);

        if (newIndex === 63) {
          addLog("❌ Opponent reached the center first.");
          setTurn("defeat");
          return;
        }

        setTurn("player");
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [turn, cpuIndex, playerIndex]);

  const resetGame = () => {
    setPlayerIndex(0);
    setCpuIndex(0);
    setDice(null);
    setTurn("player");
    setLog(["Board reset. Roll cowrie shells to begin."]);
  };

  return (
    <Card className="p-6 sm:p-10 bg-parchment-100 border-2 border-gold-500/60 shadow-2xl relative overflow-hidden text-earth-900">
      {/* Historical Disclaimer Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-parchment-300 pb-3 mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta-600 block">
            Traditional Game Lab
          </span>
          <h2 className="font-serif text-3xl font-bold text-earth-900">
            ASHTAPADA
          </h2>
        </div>
        <div className="text-[11px] font-mono text-earth-700 bg-parchment-200 px-3 py-1.5 rounded-xl border border-parchment-300 self-start sm:self-auto">
          DHARA Gameplay Adaptation
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Ashtapada 8x8 Board */}
        <div className="w-full max-w-[360px] sm:max-w-[400px] shrink-0">
          <div className="grid grid-cols-8 gap-1 bg-earth-950 p-3 rounded-2xl shadow-2xl border-4 border-earth-800">
            {Array(64)
              .fill(null)
              .map((_, i) => {
                const isSafe = SPECIAL_SQUARES.includes(i);
                const hasPlayer = spiralPath[playerIndex] === i;
                const hasCpu = spiralPath[cpuIndex] === i;

                return (
                  <div
                    key={i}
                    className={`aspect-square relative flex items-center justify-center rounded-sm transition-colors ${
                      isSafe ? "bg-earth-800/90" : "bg-parchment-200"
                    }`}
                  >
                    {isSafe && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <div className="w-full h-0.5 bg-gold-500 rotate-45 absolute" />
                        <div className="w-full h-0.5 bg-gold-500 -rotate-45 absolute" />
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center gap-1 z-10">
                      {hasPlayer && (
                        <motion.div
                          layoutId="ashtapada-player"
                          className={`${
                            hasCpu ? "w-2/5 h-2/5" : "w-2/3 h-2/3"
                          } rounded-full bg-gradient-to-br from-gold-300 to-gold-600 shadow-[0_2px_8px_rgba(0,0,0,0.6)] border border-white z-20`}
                        />
                      )}
                      {hasCpu && (
                        <motion.div
                          layoutId="ashtapada-cpu"
                          className={`${
                            hasPlayer ? "w-2/5 h-2/5" : "w-2/3 h-2/3"
                          } rounded-full bg-gradient-to-br from-stone-600 to-stone-950 shadow-[0_2px_8px_rgba(0,0,0,0.6)] border border-stone-400 z-10`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-earth-600 font-serif mt-2 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-500 inline-block border border-gold-600" /> Your Seeker
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-800 inline-block border border-stone-600" /> Ancient AI
            </span>
            <span>&apos;X&apos; = Sanctuary Safe Haven</span>
          </div>
        </div>

        {/* Tactical Controls & Log */}
        <div className="flex-1 w-full flex flex-col justify-between space-y-4">
          <div className="p-3.5 bg-parchment-200/90 rounded-2xl border border-parchment-300 text-xs text-earth-800 leading-relaxed font-medium">
            <strong>Historical Gameplay Note:</strong> Ashtapada (literally &ldquo;having eight steps&rdquo;) was mentioned in Buddhist lists of games forbidden to monks in the 5th c. BCE, eventually evolving into Chaturanga and modern chess.
          </div>

          {/* Turn status */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-earth-600">
              Match Status
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-wider ${
                turn === "player"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : turn === "cpu"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : turn === "victory"
                  ? "bg-gold-500 text-earth-950 font-bold"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {turn === "player"
                ? "Your Turn"
                : turn === "cpu"
                ? "Opponent Contemplating..."
                : turn === "victory"
                ? "Victory!"
                : "Defeat"}
            </span>
          </div>

          {/* Chronicle Move Log */}
          <div className="bg-earth-950 p-4 rounded-2xl border border-gold-500/30 text-parchment-200 min-h-[110px] space-y-1.5 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-gold-400 font-bold text-[10px] uppercase tracking-widest border-b border-earth-800 pb-1 mb-2">
              <Swords className="w-3.5 h-3.5" /> Move Chronicle
            </div>
            {log.map((entry, idx) => (
              <div
                key={idx}
                className={`${
                  idx === 0 ? "text-gold-300 font-bold" : "text-parchment-300/70"
                }`}
              >
                {entry}
              </div>
            ))}
          </div>

          {/* Victory Banner */}
          <AnimatePresence>
            {turn === "victory" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border-2 border-green-400 rounded-2xl flex items-center justify-between gap-3 text-green-950"
              >
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-serif font-bold text-sm">Ashtapada Mastered!</div>
                    <div className="text-xs text-green-800">+150 XP · +15 Strategy DNA Granted</div>
                  </div>
                </div>
                <Button size="sm" onClick={resetGame} variant="outline" className="border-green-600 text-green-800">
                  Play Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3 items-stretch pt-2">
            <Button
              size="lg"
              disabled={turn !== "player"}
              onClick={handlePlayerRoll}
              className="flex-1 gap-2.5 py-4 font-serif font-bold text-sm tracking-wider uppercase shadow-md bg-gold-500 text-earth-950 hover:bg-gold-600"
            >
              <Dices className="w-5 h-5" />
              <span>{turn === "cpu" ? "Waiting for Opponent..." : "Cast Cowrie Shells"}</span>
            </Button>

            <div className="w-16 bg-white rounded-2xl border-2 border-parchment-300 shadow-inner flex items-center justify-center font-serif text-3xl font-bold text-gold-700 shrink-0">
              {dice ?? "-"}
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={resetGame}
              className="px-4 border-parchment-300 hover:bg-parchment-200"
              aria-label="Reset Match"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
