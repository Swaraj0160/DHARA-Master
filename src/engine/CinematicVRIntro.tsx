"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CinematicVRIntro({ onComplete }: { onComplete: () => void }) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hasPlaybackFailed, setHasPlaybackFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Preload video to ensure it's in browser cache immediately
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = '/intro/intro_video.mp4';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleEnterClick = async () => {
    if (!videoRef.current) return;

    try {
      // Start from the very beginning
      videoRef.current.currentTime = 0;
      
      // Attempt unmuted playback first since we have a user click gesture
      await videoRef.current.play();
    } catch (err) {
      console.warn("Unmuted playback failed, attempting muted fallback:", err);
      try {
        // Fallback to muted playback if browser policies block unmuted audio
        if (videoRef.current) {
          videoRef.current.muted = true;
          await videoRef.current.play();
        }
      } catch (mutedErr) {
        console.error("Video playback completely failed:", mutedErr);
        setHasPlaybackFailed(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    // We only trigger the poster fade-out when the video has definitively
    // rendered its first frames to the screen (currentTime > 0.1).
    // This absolutely prevents the "black screen flash".
    if (!isVideoReady && videoRef.current && videoRef.current.currentTime > 0.1) {
      setIsVideoReady(true);
    }
  };

  const handleVideoEnded = () => {
    // Smoothly dissolve into the DHARA homepage
    setIsFadingOut(true);
    // Give the fade transition time to finish before unmounting this component
    setTimeout(() => {
      onComplete();
    }, 1000); 
  };

  return (
    <motion.div 
      className="fixed inset-0 z-[200] bg-black overflow-hidden select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
    >
      {/* 
        LAYER 1: THE VIDEO
        Always mounted, sitting behind the poster. Preloads silently.
      */}
      <video
        ref={videoRef}
        src="/intro/intro_video.mp4"
        className="absolute inset-0 w-full h-full object-cover object-center" 
        preload="auto"
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
      />

      {/* 
        LAYER 2: RESPONSIVE CONTENT OVERLAY
        Sits on top of the video and poster.
      */}
      <AnimatePresence>
        {!isVideoReady && (
          <motion.div
            key="poster-layer"
            className="absolute inset-0 z-10 flex flex-col justify-between p-8 sm:p-12 pb-16 sm:pb-20"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Visual Poster */}
            <div className="absolute inset-0 z-[-1] pointer-events-none bg-[#171513]">
              <img 
                src="/intro/intro_frame.png" 
                alt="Dhara Heritage Poster" 
                className="w-full h-full object-cover object-center opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            </div>

            {/* TOP LEFT: LOGO */}
            <div className="w-full max-w-[1800px] mx-auto flex items-start justify-start z-10">
              <img src="/LOGO.png" alt="DHARA Logo" className="w-[120px] md:w-[160px] lg:w-[200px] h-auto object-contain invert opacity-90 drop-shadow-lg" />
            </div>

            {/* BOTTOM / LOWER AREA: CTA */}
            <div className="w-full max-w-[1800px] mx-auto flex flex-col items-center justify-end z-10 mt-auto">
              <p className="text-[#D8CCB8] text-xs sm:text-sm md:text-base font-serif italic mb-6 tracking-widest opacity-80 text-center">
                Where India's Heritage Flows
              </p>
              
              <button
                onClick={handleEnterClick}
                className="group relative px-10 sm:px-16 py-4 sm:py-5 border border-gold-500/30 bg-black/40 backdrop-blur-md rounded-full shadow-[0_0_40px_rgba(212,175,55,0.1)] hover:shadow-[0_0_60px_rgba(212,175,55,0.3)] hover:border-gold-400 transition-all cursor-pointer pointer-events-auto overflow-hidden"
              >
                <div className="absolute inset-0 bg-gold-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 text-[#F5EFE4] font-bold text-xs sm:text-sm tracking-[0.3em] uppercase">
                  Enter Dhara
                </span>
              </button>

              {hasPlaybackFailed && (
                <div className="mt-8 text-red-400 text-xs font-mono tracking-widest text-center bg-black/50 px-4 py-2 rounded">
                  Autoplay restricted. Please click to play.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SKIP INTRO CONTROL */}
      <button 
        onClick={onComplete}
        className="absolute bottom-8 sm:bottom-12 right-8 sm:right-12 z-[210] flex items-center gap-2 text-[#D8CCB8]/50 hover:text-white transition-colors cursor-pointer group"
      >
        <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.3em]">Skip Intro</span>
        <div className="w-[1px] h-3 bg-white/20 group-hover:bg-white/50 transition-colors" />
        <span className="text-[12px] group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </motion.div>
  );
}
