"use client";

import { Suspense, useEffect } from "react";
import { useGameStore } from "@/store/gameState";
import { motion } from "framer-motion";
import WorldHUD from "@/components/game/WorldHUD";
import WorldMap from "@/components/game/WorldMap";
import CityMap from "@/components/game/CityMap";
import ChapterView from "@/components/game/ChapterView";
import { useRouter } from "next/navigation";

function GameRootContent() {
  const router = useRouter();
  
  const {
    currentCityId,
    currentChapterId,
    enteringCityId,
    confirmEnterRealm
  } = useGameStore();

  useEffect(() => {
    // Bypass the old Time Portal entirely if the map sets enteringCityId
    if (enteringCityId) {
      confirmEnterRealm();
    }
  }, [enteringCityId, confirmEnterRealm]);

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
    </motion.div>
  );
}

export default function GameRoot() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <GameRootContent />
    </Suspense>
  );
}

