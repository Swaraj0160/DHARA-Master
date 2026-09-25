"use client";

import React, { useRef, useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

interface GooeyActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  gooColor?: string; // e.g. "bg-gold-500" or "bg-charcoal-800"
}

export default function GooeyActionButton({
  children,
  onClick,
  className = "",
  gooColor = "bg-gold-600",
  ...props
}: GooeyActionButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const makeParticles = () => {
    if (!filterRef.current || shouldReduceMotion) return;
    
    const count = 12; // controlled burst
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.className = "goo-particle";
      
      const point = document.createElement("span");
      point.className = `goo-point ${gooColor}`;
      
      const scale = Math.random() * (1.2 - 0.4) + 0.4;
      point.style.setProperty("--scale", scale.toString());
      
      const angle = Math.random() * 360;
      // Emit outwards from the button boundary
      const distance = Math.random() * 30 + 15;
      
      const startX = Math.cos((angle * Math.PI) / 180) * 5;
      const startY = Math.sin((angle * Math.PI) / 180) * 5;
      const endX = Math.cos((angle * Math.PI) / 180) * distance;
      const endY = Math.sin((angle * Math.PI) / 180) * distance;
      
      particle.style.setProperty("--start-x", `${startX}px`);
      particle.style.setProperty("--start-y", `${startY}px`);
      particle.style.setProperty("--end-x", `${endX}px`);
      particle.style.setProperty("--end-y", `${endY}px`);
      particle.style.setProperty("--rotate", `${Math.random() * 360}deg`);
      
      const time = Math.random() * 0.4 + 0.3; // fast, physical liquid effect
      particle.style.setProperty("--time", `${time}s`);
      
      particle.appendChild(point);
      filterRef.current.appendChild(particle);
      
      setTimeout(() => {
        if (filterRef.current?.contains(particle)) {
          filterRef.current.removeChild(particle);
        }
      }, time * 1000 + 100);
    }
  };

  const handleInteraction = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
    makeParticles();
    if (onClick) onClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
  };

  const handleHover = () => {
    if (isHovered) return;
    setIsHovered(true);
    makeParticles();
  };

  // If reduced motion is requested, render a clean, standard button
  if (shouldReduceMotion) {
    return (
      <button
        className={`relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
        onClick={handleInteraction}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <div className={`absolute inset-0 opacity-10 hover:opacity-20 transition-opacity ${gooColor}`} />
      </button>
    );
  }

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="dhara-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      
      <style>{`
        .goo-effect-container {
          position: absolute;
          inset: -30px; /* bleed area for particles */
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          filter: url('#dhara-goo');
        }

        /* The core button liquid mass */
        .goo-core {
          position: absolute;
          top: 30px;
          bottom: 30px;
          left: 30px;
          right: 30px;
          border-radius: 9999px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        /* Particle animation from React Bits */
        .goo-particle, .goo-point {
          display: block;
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          transform-origin: center;
        }

        .goo-particle {
          top: calc(50% - 10px);
          left: calc(50% - 10px);
          animation: goo-particle-anim var(--time) cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .goo-point {
          animation: goo-point-anim var(--time) ease forwards;
        }

        @keyframes goo-particle-anim {
          0% { transform: rotate(0deg) translate(var(--start-x), var(--start-y)); opacity: 1; }
          100% { transform: rotate(var(--rotate)) translate(var(--end-x), var(--end-y)); opacity: 0; }
        }

        @keyframes goo-point-anim {
          0% { transform: scale(0); opacity: 1; }
          40% { transform: scale(var(--scale)); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
      `}</style>

      <div ref={containerRef} className={`relative group select-none ${className.includes('w-full') ? 'flex w-full' : 'inline-flex'}`}>
        {/* The Gooey Liquid Layer */}
        <div ref={filterRef} className="goo-effect-container">
          <div className={`goo-core ${gooColor} ${isHovered ? 'scale-[1.02]' : 'scale-100'}`} />
        </div>

        {/* The Actual Accessible Button */}
        <button
          className={`relative z-10 border border-transparent rounded-full transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 active:scale-[0.98] ${className}`}
          onClick={handleInteraction}
          onMouseEnter={handleHover}
          onMouseLeave={() => setIsHovered(false)}
          {...props}
        >
          {children}
        </button>
      </div>
    </>
  );
}
