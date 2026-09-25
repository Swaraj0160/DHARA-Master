"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CinematicVRIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"IDLE" | "FLYING" | "COMPLETE">("IDLE");
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Mouse parallax state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Preload main visual
    const img = new Image();
    img.src = "/intro/dhara_world.jpg";
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (phase !== "IDLE" && phase !== "FLYING") return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  const startJourney = () => {
    setPhase("FLYING");
    startAudio();

    // The entire journey takes 12 seconds.
    setTimeout(() => {
      setPhase("COMPLETE");
      setTimeout(onComplete, 2000); // 2s fade out before unmounting
    }, 12000);
  };

  const startAudio = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Deep cinematic drone
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0, ctx.currentTime);
      
      // Drone swells up during acceleration, stays loud, fades at end
      oscGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 3);
      oscGain.gain.setValueAtTime(0.5, ctx.currentTime + 10);
      oscGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 13);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();

      // Wind / Air rushing sound using filtered noise
      const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // White noise
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(100, ctx.currentTime);
      // Wind gets higher pitched as we accelerate
      noiseFilter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 4);
      noiseFilter.frequency.linearRampToValueAtTime(300, ctx.currentTime + 12);
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 3);
      noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 12);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();

    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  };

  // Parallax offsets based on mouse
  const pX = mousePos.x;
  const pY = mousePos.y;

  return (
    <motion.div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[200] bg-black overflow-hidden flex items-center justify-center cursor-crosshair"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "COMPLETE" ? 0 : 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      {/* 2.5D PARALLAX ENVIRONMENT */}
      <div className="absolute inset-0 w-full h-full pointer-events-none perspective-[1000px]">
        
        {/* LAYER 1: BACKGROUND (Sky, Distant Mountains, Hampi) */}
        <motion.div
          className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%] bg-[url('/intro/dhara_world.jpg')] bg-cover bg-center origin-center"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 35%, transparent 55%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 35%, transparent 55%)",
          }}
          initial={{ scale: 1.0, x: "0%", y: "0%" }}
          animate={{
            scale: phase === "FLYING" ? [1.0, 1.2, 1.3, 1.1] : 1.0,
            x: phase === "FLYING" ? ["0%", "5%", "-5%", "0%"] : `${pX * -1}%`,
            y: phase === "FLYING" ? ["0%", "2%", "2%", "5%"] : `${pY * -1}%`,
          }}
          transition={{
            duration: phase === "FLYING" ? 12 : 0.5,
            ease: phase === "FLYING" ? "easeInOut" : "easeOut",
            times: [0, 0.33, 0.66, 1],
          }}
        />

        {/* LAYER 2: MIDGROUND (River, Cities: Nalanda, Varanasi, Madurai) */}
        <motion.div
          className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%] bg-[url('/intro/dhara_world.jpg')] bg-cover bg-center origin-center"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent 25%, black 45%, black 75%, transparent 90%)",
            maskImage: "linear-gradient(to bottom, transparent 25%, black 45%, black 75%, transparent 90%)",
          }}
          initial={{ scale: 1.0, x: "0%", y: "0%" }}
          animate={{
            // Scale in, pan left to see Nalanda, pan right to see Konark, pull back
            scale: phase === "FLYING" ? [1.0, 2.2, 2.5, 1.4] : 1.0,
            x: phase === "FLYING" ? ["0%", "18%", "-18%", "0%"] : `${pX * -3}%`,
            y: phase === "FLYING" ? ["0%", "8%", "5%", "10%"] : `${pY * -3}%`,
          }}
          transition={{
            duration: phase === "FLYING" ? 12 : 0.5,
            ease: phase === "FLYING" ? "easeInOut" : "easeOut",
            times: [0, 0.33, 0.66, 1],
          }}
        />

        {/* LAYER 3: FOREGROUND (Rocks, Trees, Architecture closest to camera) */}
        <motion.div
          className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%] bg-[url('/intro/dhara_world.jpg')] bg-cover bg-center origin-bottom"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent 65%, black 80%, black 100%)",
            maskImage: "linear-gradient(to bottom, transparent 65%, black 80%, black 100%)",
          }}
          initial={{ scale: 1.0, x: "0%", y: "0%", opacity: 1 }}
          animate={{
            // Massive scale out to simulate flying OVER it. Exits screen by T=0.33 (4 seconds)
            scale: phase === "FLYING" ? [1.0, 5.0, 6.0, 6.0] : 1.0,
            y: phase === "FLYING" ? ["0%", "40%", "50%", "50%"] : `${pY * -6}%`,
            x: phase === "FLYING" ? ["0%", "5%", "-5%", "0%"] : `${pX * -6}%`,
            opacity: phase === "FLYING" ? [1, 0, 0, 0] : 1,
            filter: phase === "FLYING" ? ["blur(0px)", "blur(10px)", "blur(10px)", "blur(10px)"] : "blur(0px)",
          }}
          transition={{
            duration: phase === "FLYING" ? 12 : 0.5,
            ease: phase === "FLYING" ? "easeInOut" : "easeOut",
            times: [0, 0.33, 0.66, 1],
          }}
        />

        {/* CLOUDS / ATMOSPHERE (Only visible during flight for speed/depth illusion) */}
        <AnimatePresence>
          {phase === "FLYING" && (
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0.4, 0] }}
              transition={{ duration: 12, times: [0, 0.3, 0.7, 1] }}
            >
              {/* Flying mist particles faked with large blurred radial gradients moving across screen */}
              <motion.div 
                className="absolute w-[150vw] h-[150vh] -top-[25vh] -left-[25vw] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] blur-2xl mix-blend-screen"
                animate={{ scale: [1, 3], x: ["0%", "-30%"], y: ["0%", "20%"] }}
                transition={{ duration: 6, ease: "easeIn" }}
              />
              <motion.div 
                className="absolute w-[150vw] h-[150vh] -top-[25vh] -left-[25vw] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] blur-2xl mix-blend-screen"
                animate={{ scale: [1, 4], x: ["10%", "40%"], y: ["10%", "-20%"] }}
                transition={{ duration: 8, ease: "easeIn", delay: 2 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Vignette to blend edges and make it feel cinematic */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-30 mix-blend-multiply" />
      </div>

      {/* START PROMPT */}
      <AnimatePresence>
        {phase === "IDLE" && (
          <motion.div 
            className="relative z-50 flex flex-col items-center justify-center gap-6 text-center mt-40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="flex flex-col gap-2 mb-4">
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-200 to-gold-500 drop-shadow-xl uppercase">
                DHARA
              </h1>
              <h2 className="text-xs md:text-sm font-serif tracking-[0.4em] text-parchment-300 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                India's Heritage. Yours to Explore.
              </h2>
            </div>

            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent my-2" />

            <h3 className="text-sm font-serif tracking-[0.2em] text-white/90">
              READY TO ENTER INDIA'S HERITAGE?
            </h3>
            
            <button
              onClick={startJourney}
              className="mt-4 px-8 py-3 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/50 rounded-full text-gold-300 font-serif tracking-widest text-sm uppercase transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] backdrop-blur-md cursor-pointer group"
            >
              Enter Dhara <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
