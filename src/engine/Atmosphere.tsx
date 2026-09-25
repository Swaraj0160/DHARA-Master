"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AtmosphereProps {
  type: "dust" | "fog" | "embers" | "none";
}

export default function Atmosphere({ type }: AtmosphereProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (type === "none" || prefersReducedMotion) return null;

  // We use a small number of divs and animate them infinitely.
  if (type === "dust") {
    // Generate static random values once per component lifecycle to avoid hydration mismatch
    // and satisfy react-hooks/purity rules.
    const dustParticles = [...Array(15)].map((_, i) => {
      // Use pseudo-random based on index so it's pure during render
      const seed = i * 0.12345;
      const x1 = (seed * 100) % 100;
      const y1 = (seed * 70) % 100;
      const op = (seed * 0.5) % 0.5 + 0.1;
      const dir = (seed * 10) % 1 > 0.5 ? "+" : "-";
      const dur = (seed * 20) % 10 + 15;
      return { x1, y1, op, dir, dur };
    });

    return (
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen opacity-40">
        {dustParticles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-parchment-200 rounded-full blur-[1px]"
            initial={{
              x: p.x1 + "vw",
              y: p.y1 + "vh",
              opacity: p.op,
            }}
            animate={{
              y: [null, "-20vh"],
              x: [null, p.dir + "10vw"],
              opacity: [null, 0, 0.5],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "fog") {
    return (
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <motion.div
          className="absolute inset-[-50%] bg-[url('/noise.png')] opacity-10 mix-blend-overlay"
          animate={{ x: ["0%", "-5%", "0%"], y: ["0%", "2%", "0%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 via-transparent to-earth-900/20" />
      </div>
    );
  }

  return null;
}

