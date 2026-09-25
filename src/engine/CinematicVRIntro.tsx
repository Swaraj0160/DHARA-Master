"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CinematicVRIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"POSTER" | "VIDEO">("POSTER");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Preload video to ensure immediate playback on click
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = '/intro/final_cinematic.mp4';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleEnterClick = () => {
    setPhase("VIDEO");
  };

  const handleVideoEnded = () => {
    onComplete();
  };

  // Ensure video plays when it mounts, as autoPlay can sometimes be finicky even after a click
  useEffect(() => {
    if (phase === "VIDEO" && videoRef.current) {
      videoRef.current.play().catch((e) => {
        console.warn("Autoplay with sound failed, attempting muted playback", e);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {phase === "POSTER" && (
          <motion.div
            key="poster"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="absolute inset-0"
          >
            {/* 
              Aspect Ratio Preserving Container for Perfect Overlay Alignment 
              This perfectly mimics object-fit: cover for a 16:9 image while allowing 
              absolute percentage positioning inside it that never drifts from the baked-in pixels.
            */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] bg-[url('/intro/final_poster.png')] bg-cover bg-center">
              
              {/* Invisible Click Target over the baked-in "ENTER DHARA" button */}
              <button
                onClick={handleEnterClick}
                className="absolute top-[82%] left-1/2 -translate-x-1/2 w-[22%] h-[8%] cursor-pointer rounded-full outline-none group"
                aria-label="Enter Dhara"
              >
                {/* Extremely subtle responsive interaction as requested */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-white/5" />
                <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 transition-opacity duration-150 bg-black/10" />
              </button>

            </div>
          </motion.div>
        )}

        {phase === "VIDEO" && (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-black"
          >
            <video
              ref={videoRef}
              src="/intro/final_cinematic.mp4"
              // Scale slightly crops out any potential Gemini watermark on the edges cleanly
              className="w-full h-full object-cover scale-[1.04]" 
              playsInline
              onEnded={handleVideoEnded}
              // Prevent native controls from ever showing
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
