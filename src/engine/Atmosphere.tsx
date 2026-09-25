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
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (type === "none" || prefersReducedMotion) return null;

  // Lightweight CSS-based particles.
  // We use a small number of divs and animate them infinitely.
  if (type === "dust") {
    return (
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen opacity-40">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-parchment-200 rounded-full blur-[1px]"
            initial={{
              x: Math.random() * 100 + "vw",
              y: Math.random() * 100 + "vh",
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              y: [null, "-20vh"],
              x: [null, (Math.random() > 0.5 ? "+" : "-") + "10vw"],
              opacity: [null, 0, 0.5],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
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
