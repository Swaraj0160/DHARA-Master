"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENES = [
  { id: "aerial", src: "/intro/01_aerial.jpg", name: "Modern India" },
  { id: "varanasi", src: "/intro/02_varanasi.jpg", name: "Varanasi" },
  { id: "madurai", src: "/intro/03_madurai.jpg", name: "Madurai" },
  { id: "konark", src: "/intro/04_konark.jpg", name: "Konark" },
  { id: "hampi", src: "/intro/05_hampi.jpg", name: "Hampi" },
  { id: "pataliputra", src: "/intro/06_pataliputra.jpg", name: "Pataliputra" },
  { id: "nalanda", src: "/intro/07_nalanda.jpg", name: "Nalanda" },
];

export default function CinematicVRIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"PROMPT" | "JOURNEY" | "COMPLETE">("PROMPT");
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  
  // Parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Preload images
  useEffect(() => {
    SCENES.forEach((scene) => {
      const img = new Image();
      img.src = scene.src;
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Normalize to -1 to 1
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  const startJourney = () => {
    setPhase("JOURNEY");
    startAudioDrone();

    // Sequence the scenes
    // Each scene lasts 4 seconds. Transition happens in the last 1.5s
    const sceneDuration = 4500;
    
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx >= SCENES.length) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase("COMPLETE");
          setTimeout(onComplete, 2000); // Wait for fade out
        }, 2000);
      } else {
        setCurrentSceneIdx(idx);
      }
    }, sceneDuration);
  };

  const startAudioDrone = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Deep drone
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(45, ctx.currentTime);
      
      // LFO for movement
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(10, ctx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      // Main Gain (Volume envelope)
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 4);
      
      // Filter to muffle
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      lfo.start();
      
      // Stop smoothly on complete
      setTimeout(() => {
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);
        setTimeout(() => {
          osc.stop();
          ctx.close();
        }, 3000);
      }, SCENES.length * 4500);

    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[200] bg-black overflow-hidden flex items-center justify-center cursor-crosshair"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "COMPLETE" ? 0 : 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      {/* SCENE STACK */}
      <div className="absolute inset-0 pointer-events-none">
        {SCENES.map((scene, idx) => {
          const isActive = idx === currentSceneIdx;
          const isPast = idx < currentSceneIdx;
          const isFuture = idx > currentSceneIdx;
          
          if (isFuture) return null; // Don't render yet

          // Parallax calculation
          const parallaxX = mousePos.x * -25;
          const parallaxY = mousePos.y * -25;

          return (
            <motion.div
              key={scene.id}
              className="absolute inset-0 w-full h-full origin-center"
              initial={{
                clipPath: idx === 0 ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
                scale: 1.05,
                filter: idx === 0 ? "blur(0px)" : "blur(25px)",
                opacity: idx === 0 ? 1 : 0
              }}
              animate={{
                clipPath: "circle(150% at 50% 50%)",
                scale: isActive ? 1.25 : (isPast ? 1.5 : 1.05),
                filter: "blur(0px)",
                opacity: 1,
                x: parallaxX,
                y: parallaxY,
              }}
              transition={{
                clipPath: { duration: 2.5, ease: [0.45, 0, 0.15, 1] },
                scale: { duration: 8, ease: "easeOut" }, 
                filter: { duration: 2.5 },
                opacity: { duration: 1.0 },
                x: { type: "spring", stiffness: 30, damping: 15 },
                y: { type: "spring", stiffness: 30, damping: 15 },
              }}
              style={{ zIndex: idx }}
            >
              {/* Foreground Vignette & Dust for VR immersion */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] z-10 mix-blend-multiply" />
              <img 
                src={scene.src} 
                alt={scene.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          );
        })}
      </div>

      {/* START PROMPT */}
      <AnimatePresence>
        {phase === "PROMPT" && (
          <motion.div 
            className="relative z-50 flex flex-col items-center justify-center gap-8 text-center mt-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <h2 className="text-sm md:text-base font-serif tracking-[0.4em] text-parchment-300 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Ready to enter India's heritage?
            </h2>
            <button
              onClick={startJourney}
              className="px-8 py-3 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/50 rounded-full text-gold-300 font-serif tracking-widest text-sm uppercase transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] backdrop-blur-md cursor-pointer"
            >
              Enter Dhara
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
