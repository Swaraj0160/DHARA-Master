"use client";

import { useGameStore } from "@/store/gameState";
import { motion } from "framer-motion";
import WorldHUD from "@/components/game/WorldHUD";
import WorldMap from "@/components/game/WorldMap";
import CityMap from "@/components/game/CityMap";
import ChapterView from "@/components/game/ChapterView";
import RealmEntranceAnimation from "@/components/game/RealmEntranceAnimation";
import CinematicIntro from "@/engine/CinematicIntro";

export default function GameRoot() {
  const {
    currentCityId,
    currentChapterId,
    enteringCityId,
    confirmEnterRealm,
    hasSeenIntro,
  } = useGameStore();

  if (!hasSeenIntro) {
    return <CinematicIntro />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="min-h-screen bg-earth-950 overflow-hidden relative selection:bg-gold-500/30"
    >
      <WorldHUD />
      <main className="relative w-full h-full">
        {currentChapterId && currentCityId ? (
          <ChapterView cityId={currentCityId} chapterId={currentChapterId} />
        ) : currentCityId ? (
          <CityMap cityId={currentCityId} />
        ) : (
          <WorldMap />
        )}
      </main>

      {/* Cinematic AAA-game inspired Realm Entrance Animation */}
      {enteringCityId && (
        <RealmEntranceAnimation
          cityId={enteringCityId}
          onComplete={confirmEnterRealm}
          onSkip={confirmEnterRealm}
        />
      )}
    </motion.div>
  );
}

