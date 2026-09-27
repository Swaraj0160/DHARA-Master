"use client";

import React, { useState } from 'react';
import { motion, useAnimation, useDragControls, PanInfo, AnimatePresence } from 'framer-motion';
import { CITIES_DATA } from '@/data/gameContent';
import { MapPin, X, Fingerprint, QrCode, Star, Compass } from 'lucide-react';

interface HeritageJourneyTicketProps {
  cityId: string;
  onAccept: () => void;
  onCancel: () => void;
}

// Realm-specific ticket identity — accent color, stamp text, motif character
const REALM_TICKET_IDENTITY: Record<string, {
  accentColor: string;
  accentHex: string;
  bgHex: string;
  stampText: string;
  motif: string;
  borderlinePattern: string;
}> = {
  pataliputra: {
    accentColor: 'bg-[#C49A00]',
    accentHex: '#C49A00',
    bgHex: '#1a1200',
    stampText: 'MAURYAN EMPIRE',
    motif: '☸',
    borderlinePattern: 'repeating-linear-gradient(90deg, #C49A00 0px, #C49A00 4px, transparent 4px, transparent 12px)',
  },
  hampi: {
    accentColor: 'bg-[#c25934]',
    accentHex: '#c25934',
    bgHex: '#1a0d08',
    stampText: 'VIJAYANAGARA',
    motif: '🛕',
    borderlinePattern: 'repeating-linear-gradient(90deg, #c25934 0px, #c25934 4px, transparent 4px, transparent 12px)',
  },
  varanasi: {
    accentColor: 'bg-[#4d8fc4]',
    accentHex: '#4d8fc4',
    bgHex: '#080e18',
    stampText: 'KASHI ETERNAL',
    motif: '🕉',
    borderlinePattern: 'repeating-linear-gradient(90deg, #4d8fc4 0px, #4d8fc4 4px, transparent 4px, transparent 12px)',
  },
  madurai: {
    accentColor: 'bg-[#9b4d8c]',
    accentHex: '#9b4d8c',
    bgHex: '#160a14',
    stampText: 'PANDYAN REALM',
    motif: '🌸',
    borderlinePattern: 'repeating-linear-gradient(90deg, #9b4d8c 0px, #9b4d8c 4px, transparent 4px, transparent 12px)',
  },
  konark: {
    accentColor: 'bg-[#e4c23f]',
    accentHex: '#e4c23f',
    bgHex: '#18140a',
    stampText: 'KALINGA ORDER',
    motif: '☀',
    borderlinePattern: 'repeating-linear-gradient(90deg, #e4c23f 0px, #e4c23f 4px, transparent 4px, transparent 12px)',
  },
  nalanda: {
    accentColor: 'bg-[#4d9b6e]',
    accentHex: '#4d9b6e',
    bgHex: '#081410',
    stampText: 'MAGADHA VIDYA',
    motif: '📜',
    borderlinePattern: 'repeating-linear-gradient(90deg, #4d9b6e 0px, #4d9b6e 4px, transparent 4px, transparent 12px)',
  },
};

const DEFAULT_IDENTITY = REALM_TICKET_IDENTITY.pataliputra;

export default function HeritageJourneyTicket({ cityId, onAccept, onCancel }: HeritageJourneyTicketProps) {
  const city = CITIES_DATA.find(c => c.id === cityId);
  const controls = useAnimation();
  const dragControls = useDragControls();
  const [isTorn, setIsTorn] = useState(false);
  const [dragProgress, setDragProgress] = useState(0); // 0-1
  const [ticketNo] = useState(() => Math.floor(Date.now() / 1000).toString().slice(-6));
  const [showTapHint, setShowTapHint] = useState(false);

  if (!city) return null;

  const identity = REALM_TICKET_IDENTITY[cityId] || DEFAULT_IDENTITY;

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      setIsTorn(true);
      controls.start({
        x: 500,
        y: 80,
        rotate: 30,
        opacity: 0,
        transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
      }).then(() => {
        onAccept();
      });
    } else {
      setDragProgress(0);
      controls.start({ x: 0, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } });
    }
  };

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const progress = Math.max(0, Math.min(1, info.offset.x / 160));
    setDragProgress(progress);
  };

  // Tap-to-enter fallback for devices where drag is difficult
  const handleTapStub = () => {
    setShowTapHint(true);
    setTimeout(() => setShowTapHint(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden"
      style={{ background: `radial-gradient(ellipse at center, ${identity.bgHex}ee 0%, #0a0807 80%)` }}
    >
      {/* Dismiss */}
      <button
        onClick={onCancel}
        className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-20"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Ticket label above */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20">
        <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/30">
          Heritage Journey · {identity.stampText}
        </span>
      </div>

      {/* THE TICKET */}
      <motion.div
        initial={{ y: 60, scale: 0.88, rotateX: 15, opacity: 0 }}
        animate={{ y: 0, scale: 1, rotateX: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 120, delay: 0.1 }}
        className="relative flex flex-col md:flex-row w-full max-w-[820px] shadow-[0_30px_80px_rgba(0,0,0,0.8)] select-none"
        style={{ perspective: '1200px' }}
      >
        {/* ── MAIN TICKET BODY ── */}
        <div
          className="relative flex-1 overflow-hidden flex flex-col border border-[#D8CCB8]/20"
          style={{ background: '#F8F3EA' }}
        >
          {/* Realm-specific decorative top border line */}
          <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: identity.borderlinePattern }} />

          {/* Background watermark motif */}
          <div
            className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none select-none"
            aria-hidden="true"
          >
            <span
              className="text-[140px] sm:text-[180px] leading-none opacity-[0.06] select-none"
              style={{ color: identity.accentHex }}
            >
              {identity.motif}
            </span>
          </div>

          <div className="relative p-7 md:p-10 flex-1 flex flex-col justify-between gap-6">
            {/* Header row */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[9px] font-mono tracking-[0.5em] uppercase text-charcoal-800/40 mb-0.5">
                  DHARA HERITAGE JOURNEY
                </p>
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase font-serif" style={{ color: identity.accentHex }}>
                  {identity.stampText}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-[9px] uppercase font-mono tracking-widest text-charcoal-800/40">Ticket No.</span>
                <span className="block text-sm font-mono font-bold text-charcoal-900 tracking-widest">
                  {city.id.toUpperCase().slice(0, 3)}-{ticketNo}
                </span>
              </div>
            </div>

            {/* Destination name */}
            <div>
              <h2 className="text-5xl sm:text-7xl font-serif font-black text-charcoal-900 tracking-tight leading-none mb-2">
                {city.name}
              </h2>
              <p className="text-sm sm:text-base font-serif text-charcoal-800/70 italic">
                {city.subtitle}
              </p>
            </div>

            {/* Journey details row */}
            <div className="flex flex-wrap gap-8 border-t border-[#D8CCB8]/60 pt-5">
              <div>
                <span className="block text-[8px] uppercase font-mono tracking-[0.3em] text-charcoal-800/40 mb-1">Era</span>
                <span className="block text-xs font-bold uppercase tracking-wider text-charcoal-800">{city.era}</span>
              </div>
              <div>
                <span className="block text-[8px] uppercase font-mono tracking-[0.3em] text-charcoal-800/40 mb-1">Region</span>
                <span className="block text-xs font-bold uppercase tracking-wider text-charcoal-800">{city.region}</span>
              </div>
              <div>
                <span className="block text-[8px] uppercase font-mono tracking-[0.3em] text-charcoal-800/40 mb-1">Chapters</span>
                <span className="block text-xs font-bold uppercase tracking-wider text-charcoal-800">{city.chapters.length} Locations</span>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5" style={{ color: identity.accentHex, fill: identity.accentHex }} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom border accent */}
          <div className="absolute bottom-0 left-0 w-full h-[3px]" style={{ background: identity.borderlinePattern }} />
        </div>

        {/* ── PERFORATION ── */}
        <div className="relative w-full h-5 md:w-5 md:h-full flex items-center justify-center overflow-hidden shrink-0"
          style={{ background: '#F8F3EA' }}>
          {/* Punch holes */}
          <div className="absolute inset-0 flex flex-row md:flex-col items-center justify-between px-1 py-0 md:px-0 md:py-1 pointer-events-none">
            {[...Array(22)].map((_, i) => (
              <div key={i} className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full shadow-inner"
                style={{ background: '#0a0807', opacity: 0.5 }} />
            ))}
          </div>
          <div className="w-full h-px md:w-px md:h-full border-t md:border-t-0 md:border-l border-dashed"
            style={{ borderColor: `${identity.accentHex}40` }} />
        </div>

        {/* ── TEAR STUB ── */}
        <motion.div
          drag={isTorn ? false : 'x'}
          dragControls={dragControls}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={{ right: 1, left: 0 }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
          onClick={handleTapStub}
          className="relative w-full md:w-[230px] overflow-hidden cursor-grab active:cursor-grabbing flex flex-col border border-opacity-30"
          style={{
            background: identity.accentHex,
            borderColor: identity.accentHex,
            minHeight: '140px',
          }}
        >
          {/* Noise texture */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />

          {/* Drag fill indicator */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `rgba(255,255,255,${dragProgress * 0.25})`,
            }}
          />

          <div className="p-6 md:p-8 flex flex-row md:flex-col items-center md:items-start justify-between h-full w-full pointer-events-none gap-4">

            <div className="hidden md:flex flex-col gap-2">
              <QrCode className="w-14 h-14 opacity-50" style={{ color: '#0a0807' }} />
              <span className="text-[7px] font-mono font-bold tracking-[0.35em] uppercase opacity-50" style={{ color: '#0a0807' }}>
                ADMIT ONE
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left md:mt-auto">
              <Fingerprint className="w-8 h-8 opacity-70 mb-2 md:hidden" style={{ color: '#0a0807' }} />
              <Compass className="w-6 h-6 opacity-50 mb-3 hidden md:block" style={{ color: '#0a0807' }} />
              <h3 className="text-xl md:text-2xl font-serif font-black leading-none uppercase tracking-tight" style={{ color: '#0a0807' }}>
                Tear to Enter
              </h3>
              <span className="text-[10px] font-mono font-bold tracking-widest mt-2 uppercase opacity-60 flex items-center gap-1" style={{ color: '#0a0807' }}>
                <MapPin className="w-3 h-3" />
                Swipe Right
              </span>

              {/* Drag progress bar */}
              <div className="w-full mt-4 h-0.5 rounded-full overflow-hidden hidden md:block" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ width: `${dragProgress * 100}%`, background: 'rgba(0,0,0,0.5)' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tap hint (mobile fallback) */}
      <AnimatePresence>
        {showTapHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-3 text-xs font-mono tracking-widest uppercase border backdrop-blur-md"
            style={{ borderColor: `${identity.accentHex}50`, color: identity.accentHex, background: `${identity.bgHex}cc` }}
          >
            ← Swipe the gold stub right to enter →
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructional hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest uppercase text-white/20 whitespace-nowrap"
      >
        Drag the stub right to tear your ticket · Press Escape to cancel
      </motion.p>
    </motion.div>
  );
}
