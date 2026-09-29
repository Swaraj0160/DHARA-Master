"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Shuffle, Eye, HelpCircle, CheckCircle } from "lucide-react";
import Image from "next/image";

interface SlidingPuzzleProps {
  imageUrl: string;
  onComplete: (moves: number, timeElapsed: number) => void;
}

const GRID_SIZE = 3;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;
const EMPTY_TILE = TOTAL_TILES - 1;

// Helper to generate a solvable shuffled board
const generateShuffledTiles = () => {
  const currentTiles = Array.from({ length: TOTAL_TILES }, (_, i) => i);
  let emptyIdx = EMPTY_TILE;
  
  // 150 random valid moves to shuffle ensures solvability
  for (let i = 0; i < 150; i++) {
    const validMoves = [];
    const row = Math.floor(emptyIdx / GRID_SIZE);
    const col = emptyIdx % GRID_SIZE;
    
    if (row > 0) validMoves.push(emptyIdx - GRID_SIZE);
    if (row < GRID_SIZE - 1) validMoves.push(emptyIdx + GRID_SIZE);
    if (col > 0) validMoves.push(emptyIdx - 1);
    if (col < GRID_SIZE - 1) validMoves.push(emptyIdx + 1);
    
    const move = validMoves[Math.floor(Math.random() * validMoves.length)];
    [currentTiles[emptyIdx], currentTiles[move]] = [currentTiles[move], currentTiles[emptyIdx]];
    emptyIdx = move;
  }
  return currentTiles;
};

export default function SlidingPuzzle({ imageUrl, onComplete }: SlidingPuzzleProps) {
  // Lazy initialize to avoid useEffect cascading renders
  const [initialTiles, setInitialTiles] = useState<number[]>(() => generateShuffledTiles());
  const [tiles, setTiles] = useState<number[]>(initialTiles);
  const [isSolved, setIsSolved] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [showReference, setShowReference] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [vedaMessage, setVedaMessage] = useState<string | null>(
    "A fragmented relic lies before you. Slide the stone tiles to restore its original form."
  );

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hasStarted && !isSolved) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, isSolved]);

  const initPuzzle = useCallback(() => {
    const shuffled = generateShuffledTiles();
    setInitialTiles(shuffled);
    setTiles(shuffled);
    setMoves(0);
    setTime(0);
    setIsSolved(false);
    setHasStarted(false); // Timer starts on first move
    setHintsUsed(0);
    setVedaMessage("A fragmented relic lies before you. Slide the stone tiles to restore its original form.");
  }, []);

  const handleTileClick = (index: number) => {
    if (isSolved) return;
    
    const emptyIndex = tiles.indexOf(EMPTY_TILE);
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;
    
    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);
      
    if (isAdjacent) {
      if (!hasStarted) setHasStarted(true);
      if (vedaMessage?.includes("relic") || vedaMessage?.includes("fragmented")) {
        setVedaMessage(null);
      }

      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(m => m + 1);
      
      // Check win condition
      if (newTiles.every((val, i) => val === i)) {
        setIsSolved(true);
        setVedaMessage("Excellent. The relic is restored to its former glory.");
      }
    }
  };

  const requestHint = () => {
    if (isSolved) return;
    const nextHint = hintsUsed + 1;
    setHintsUsed(nextHint);
    
    if (nextHint === 1) {
      setVedaMessage("Look closely at the continuous lines in the carving. They will guide you.");
    } else if (nextHint === 2) {
      setVedaMessage("Focus on solving the top row first. Once placed, do not move those tiles.");
    } else {
      setVedaMessage("Work on the left column next. The bottom right should be solved last.");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isMovable = (index: number) => {
    if (isSolved) return false;
    const emptyIndex = tiles.indexOf(EMPTY_TILE);
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;
    return (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
           (Math.abs(col - emptyCol) === 1 && row === emptyRow);
  };

  return (
    <div className="min-h-screen bg-earth-950/95 flex flex-col xl:flex-row items-center justify-center p-4 sm:p-8 gap-8 xl:gap-12 overflow-y-auto w-full">
      
      {/* LEFT (or TOP on mobile): Controls & Info */}
      <div className="w-full max-w-sm xl:max-w-md flex flex-col gap-6 order-2 xl:order-1 mt-6 xl:mt-0 shrink-0">
        <div className="bg-[#110C0A]/95 border border-gold-500/20 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl font-serif font-bold text-parchment-100 mb-2">Relic Restoration</h2>
          <p className="text-sm text-parchment-300 font-serif mb-6">
            Rearrange the sliding tiles to reveal the hidden heritage carving.
          </p>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-charcoal-900/60 rounded-xl p-3 border border-charcoal-700/50 text-center">
              <div className="text-[10px] uppercase tracking-wider text-gold-500 font-mono mb-1">Moves</div>
              <div className="text-2xl font-bold text-parchment-100 font-mono">{moves}</div>
            </div>
            <div className="flex-1 bg-charcoal-900/60 rounded-xl p-3 border border-charcoal-700/50 text-center">
              <div className="text-[10px] uppercase tracking-wider text-gold-500 font-mono mb-1">Time</div>
              <div className="text-2xl font-bold text-parchment-100 font-mono">{formatTime(time)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={initPuzzle}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-600 text-parchment-200 text-xs font-serif font-bold uppercase tracking-wider transition-colors"
            >
              <Shuffle className="w-4 h-4 text-gold-400" />
              Shuffle
            </button>
            <button 
              onClick={() => {
                setTiles(initialTiles);
                setMoves(0);
                setTime(0);
                setHasStarted(false);
                setHintsUsed(0);
                setVedaMessage("The pieces return to their original fractured state.");
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-600 text-parchment-200 text-xs font-serif font-bold uppercase tracking-wider transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-gold-400" />
              Reset
            </button>
            <button 
              onPointerDown={() => setShowReference(true)}
              onPointerUp={() => setShowReference(false)}
              onPointerLeave={() => setShowReference(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-600 text-parchment-200 text-xs font-serif font-bold uppercase tracking-wider transition-colors select-none"
            >
              <Eye className="w-4 h-4 text-gold-400" />
              Peek
            </button>
            <button 
              onClick={() => {
                if (isSolved) return;
                let correctCount = 0;
                for (let i = 0; i < TOTAL_TILES; i++) {
                  if (tiles[i] === i) correctCount++;
                }
                setVedaMessage(`You have placed ${correctCount} out of 9 tiles correctly.`);
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-600 text-parchment-200 text-xs font-serif font-bold uppercase tracking-wider transition-colors"
            >
              <CheckCircle className="w-4 h-4 text-gold-400" />
              Check
            </button>
          </div>
        </div>

        {/* VEDA Message */}
        <AnimatePresence mode="wait">
          {vedaMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-charcoal-900 border border-gold-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold-400 to-gold-600" />
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0 border border-gold-500/30">
                  <span className="text-gold-400 text-xs font-mono font-bold">V</span>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-gold-500 mb-1 uppercase tracking-widest">VEDA</p>
                  <p className="text-sm font-serif text-parchment-200 leading-relaxed">
                    {vedaMessage}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 mt-2">
          {!isSolved ? (
            <button 
              onClick={requestHint}
              disabled={hintsUsed >= 3}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-stone-400 hover:text-gold-400 transition-colors disabled:opacity-50 disabled:hover:text-stone-400"
            >
              <HelpCircle className="w-4 h-4" />
              {hintsUsed >= 3 ? "No Hints Left" : "Request Hint"}
            </button>
          ) : (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onComplete(moves, time)}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-earth-950 font-serif font-bold uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              Continue Journey
            </motion.button>
          )}
        </div>
      </div>

      {/* RIGHT (or MAIN on mobile): Puzzle Board */}
      <div className="w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-lg lg:max-w-xl xl:max-w-2xl aspect-square relative order-1 xl:order-2 shrink-0">
        <div className="absolute -inset-4 bg-gold-500/5 rounded-3xl blur-3xl" />
        <div className="relative w-full h-full bg-[#110C0A] border-2 border-gold-500/30 rounded-2xl p-2 sm:p-3 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
          
          <AnimatePresence>
            {showReference && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-2 sm:inset-3 z-30 rounded-xl overflow-hidden shadow-2xl border border-gold-500/20"
              >
                <Image src={imageUrl} alt="Reference" fill className="object-cover" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full h-full relative z-20">
            {tiles.map((tileValue, index) => {
              const isEmpty = tileValue === EMPTY_TILE && !isSolved;
              const movable = isMovable(index);
              
              return (
                <motion.div
                  key={tileValue}
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  onClick={() => movable && handleTileClick(index)}
                  className={`relative w-full h-full rounded-lg transition-all duration-200 ${
                    isEmpty ? 'opacity-0 cursor-default pointer-events-none' : 
                    (movable ? 'cursor-pointer hover:brightness-110 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] z-10 hover:scale-[1.02]' : 'cursor-default opacity-95')
                  }`}
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${(tileValue % GRID_SIZE) * 50}% ${Math.floor(tileValue / GRID_SIZE) * 50}%`,
                    boxShadow: !isEmpty ? 'inset 0 0 0 1px rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.5)' : 'none'
                  }}
                />
              );
            })}
          </div>
          
          {/* Solved Overlay Shine */}
          {isSolved && (
            <motion.div 
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: [0, 0.4, 0], x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              className="absolute inset-0 z-40 bg-gradient-to-r from-transparent via-gold-300 to-transparent skew-x-12 pointer-events-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}
