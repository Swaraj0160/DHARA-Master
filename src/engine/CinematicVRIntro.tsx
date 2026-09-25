"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CinematicVRIntro({ onComplete }: { onComplete: () => void }) {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
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
        // If it completely fails, we keep the poster visible.
        // We log it as requested by the user.
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
        LAYER 2: THE POSTER
        Sits precisely on top of the video. 
        Only fades out when isVideoReady is confirmed by timeUpdate.
      */}
      <AnimatePresence>
        {!isVideoReady && (
          <motion.div
            key="poster-layer"
            className="absolute inset-0 z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }} // Short, cinematic dissolve
          >
            {/* Visual Poster matching the video's object-fit perfectly */}
            <img 
              src="/intro/intro_frame.png" 
              alt="Dhara Heritage Poster" 
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            />

            {/* 
              Aspect Ratio Preserving Container for Perfect Overlay Alignment 
              This invisibly matches a 16:9 ratio, scaling exactly like the object-cover image.
              It ensures the button target never drifts from the baked pixels on wide/tall screens.
            */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] pointer-events-none">
              
              {/* Invisible Click Target over the baked-in "ENTER DHARA" button */}
              <button
                onClick={handleEnterClick}
                className="absolute top-[82%] left-1/2 -translate-x-1/2 w-[22%] h-[8%] cursor-pointer rounded-full outline-none group pointer-events-auto"
                aria-label="Enter Dhara"
              >
                {/* Extremely subtle responsive interaction as requested */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-white/5" />
                <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 transition-opacity duration-150 bg-black/10" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
