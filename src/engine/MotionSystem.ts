// Central motion and cinematic easing configuration
// Reusable across all framer-motion components for consistency.

export const CinematicEasing = {
  // Cinematic, slow, dramatic reveal (good for environments, time lens)
  slowReveal: [0.25, 0.1, 0.25, 1] as const,
  
  // Standard UI transition with slightly more weight than typical web ease
  uiStandard: [0.33, 1, 0.68, 1] as const,
  
  // A heavy, slow camera pan easing
  cameraPan: [0.45, 0, 0.55, 1] as const,
  
  // Snappy but heavy for modals (like an ancient tome opening)
  heavyModal: [0.16, 1, 0.3, 1] as const
};

export const MotionConfigs = {
  // Map -> World travel transition overlay
  travelTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 1.5, ease: CinematicEasing.slowReveal }
  },
  
  // Scene environment fading in
  sceneReveal: {
    initial: { opacity: 0, scale: 1.05 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 2.0, ease: CinematicEasing.cameraPan }
  },

  // Modal / Evidence reveal
  evidenceReveal: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: { duration: 0.8, ease: CinematicEasing.heavyModal }
  },
  
  // Parallax layer subtle movement base
  parallaxLayer: (depth: number) => ({
    transition: {
      type: "spring",
      stiffness: 40,
      damping: 25,
      mass: 1 + depth // Deeper layers move heavier/slower
    }
  })
};
