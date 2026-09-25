"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import { CinematicEasing } from "./MotionSystem";

interface CameraProps {
  children: ReactNode;
  bounds?: { x: number; y: number }; // Max pan distance from center
  zoom?: number;
  interactive?: boolean;
}

export default function Camera({ children, bounds = { x: 50, y: 30 }, zoom = 1, interactive = true }: CameraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Raw motion values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  
  // Spring physics for smooth, heavy camera movement
  const springConfig = { damping: 40, stiffness: 60, mass: 2 };
  const cameraX = useSpring(rawX, springConfig);
  const cameraY = useSpring(rawY, springConfig);

  useEffect(() => {
    if (!interactive || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Calculate normalized mouse position (-1 to 1)
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;

      // Apply bounds (reverse direction so camera pans "into" mouse)
      rawX.set(nx * -bounds.x);
      rawY.set(ny * -bounds.y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive, bounds, rawX, rawY]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-earth-950"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="absolute inset-0 w-full h-full transform-gpu"
        style={{
          x: cameraX,
          y: cameraY,
          scale: zoom,
        }}
        initial={{ opacity: 0, scale: zoom + 0.1 }}
        animate={{ opacity: 1, scale: zoom }}
        transition={{ duration: 1.5, ease: CinematicEasing.slowReveal }}
      >
        {children}
      </motion.div>
    </div>
  );
}
