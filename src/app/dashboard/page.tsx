"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Map, Lock, Unlock, Trophy, Star, History, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { useGameStore, WORLD_SLOTS } from "@/store/gameState";

export default function Dashboard() {
  const {
    player,
    completedQuests,
    questProgress,
    unlockedLocations,
    placedNodes,
    connections,
    badges,
    heritageDNA,
  } = useGameStore();

  const nalandaDone = completedQuests.includes("nalanda");
  const nalandaProgress = questProgress["nalanda"] || (nalandaDone ? 100 : 0);
  const nalandaPlaced = placedNodes.some((n) => n.id.includes("nalanda"));

  // Dynamic Next Action Banner
  let nextAction = {
    title: "Continue The Lost Library of Nalanda",
    subtitle: "Recover foundational treatises and pass the Dwarapala's examination in Magadha.",
    link: "/quest/nalanda",
    buttonLabel: "Enter Nalanda Quest",
    progress: nalandaProgress,
  };

  if (nalandaDone && !nalandaPlaced) {
    nextAction = {
      title: "Place Nalanda on Your Living DHARA Board",
      subtitle: "The ancient university token is in your Heritage Chest. Construct it on the Living Board.",
      link: "/",
      buttonLabel: "Open Living Board",
      progress: 100,
    };
  } else if (nalandaPlaced && connections.length === 0) {
    nextAction = {
      title: "Form Your First Sangam Connection",
      subtitle: "Bridge Nalanda with the Silk Route to discover the Knowledge Exchange synergy.",
      link: "/",
      buttonLabel: "Open Living Board",
      progress: 100,
    };
  } else if (connections.length > 0) {
    nextAction = {
      title: "Explore the Traditional Game Lab",
      subtitle: "Master Ashtapada to strengthen your Strategy DNA and unlock ancient gaming lore.",
      link: "/games",
      buttonLabel: "Enter Game Lab",
      progress: 100,
    };
  }

  return (
    <div className="min-h-screen bg-parchment-200 flex flex-col selection:bg-gold-500/30">
      <Navigation />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Welcome Header with Actual Zustand Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-parchment-300 pb-6"
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-terracotta-600 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" /> Explorer Chronicle
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-earth-900 font-bold">
              Welcome, {player.title}.
            </h1>
            <p className="text-base text-earth-600 font-medium">
              Your living reconstruction of India&apos;s civilization is actively evolving.
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <div className="bg-parchment-100 border-2 border-gold-500/40 px-5 py-2.5 rounded-2xl shadow-sm flex items-center gap-3">
              <Trophy className="text-gold-600 w-6 h-6" />
              <div>
                <div className="text-[10px] text-earth-500 font-bold uppercase tracking-wider">
                  Heritage XP
                </div>
                <div className="text-xl font-serif font-bold text-earth-900">
                  {player.xp.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-parchment-100 border-2 border-gold-500/40 px-5 py-2.5 rounded-2xl shadow-sm flex items-center gap-3">
              <Star className="text-gold-600 w-6 h-6 fill-gold-500" />
              <div>
                <div className="text-[10px] text-earth-500 font-bold uppercase tracking-wider">
                  Level {player.level}
                </div>
                <div className="text-base font-serif font-bold text-earth-900 leading-tight">
                  {player.title}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Next Action Recommendation Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-earth-950 via-earth-900 to-earth-950 text-parchment-100 p-6 sm:p-8 rounded-3xl border-2 border-gold-500 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-gold-400" /> Next Milestone
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200">
              {nextAction.title}
            </h2>
            <p className="text-xs sm:text-sm text-parchment-300 leading-relaxed font-sans">
              {nextAction.subtitle}
            </p>
          </div>

          <Link href={nextAction.link} className="shrink-0 w-full md:w-auto">
            <Button
              size="lg"
              className="w-full font-serif font-bold uppercase tracking-wider text-xs py-4 px-8 bg-gradient-to-r from-gold-500 to-gold-600 text-earth-950 hover:brightness-110 shadow-[0_0_25px_rgba(212,175,55,0.5)] flex items-center justify-center gap-2"
            >
              <span>{nextAction.buttonLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Active Quests & India Civilizational Nodes */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quest Status Card */}
            <div>
              <h2 className="text-xl font-serif text-earth-900 font-bold mb-4 flex items-center gap-2">
                <History className="text-gold-600 w-5 h-5" /> Active Quests
              </h2>

              <Card className="bg-parchment-100 border-2 border-parchment-300 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-widest">
                      Classical Magadha · 5th - 12th Century CE
                    </span>
                    <CardTitle className="text-2xl font-serif text-earth-900 mt-0.5">
                      The Lost Library of Nalanda
                    </CardTitle>
                  </div>
                  <span
                    className={`text-xs font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider ${
                      nalandaDone
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gold-50 text-gold-800 border border-gold-300"
                    }`}
                  >
                    {nalandaDone ? "Completed" : "In Progress"}
                  </span>
                </div>

                <CardDescription className="text-xs sm:text-sm text-earth-700 leading-relaxed my-3 font-medium">
                  Enter the great Buddhist monastic university, pass the gatekeeper&apos;s challenge on poetic mathematics, recover ancient tala-patra manuscripts, and make a strategic preservation mandate.
                </CardDescription>

                <div className="mt-4 pt-4 border-t border-parchment-200">
                  <div className="flex justify-between text-xs font-bold text-earth-800 mb-1.5">
                    <span>Expedition Progress</span>
                    <span className="font-mono">{nalandaProgress}%</span>
                  </div>
                  <div className="w-full bg-parchment-300 rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-terracotta-500 to-gold-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${nalandaProgress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link href="/quest/nalanda">
                    <Button
                      size="sm"
                      className="font-serif font-bold uppercase tracking-wider text-xs py-2.5 px-5 bg-earth-900 text-parchment-100 hover:bg-earth-800"
                    >
                      {nalandaDone ? "Replay Quest" : "Continue Quest"}
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-serif font-bold uppercase tracking-wider text-xs py-2.5 px-5 border-parchment-300 text-earth-800 hover:bg-parchment-200"
                    >
                      View on Board
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Unlocked & Visible World Nodes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif text-earth-900 font-bold flex items-center gap-2">
                  <Map className="text-gold-600 w-5 h-5" /> Your Civilizational Network
                </h2>
                <Link href="/map" className="text-xs font-serif font-bold text-gold-700 hover:underline">
                  Open Heritage Atlas →
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {WORLD_SLOTS.slice(0, 4).map((slot) => {
                  const isUnlocked = unlockedLocations.includes(slot.id);
                  const isConstructed = placedNodes.some((n) => n.id.includes(slot.id));

                  return (
                    <Card
                      key={slot.id}
                      className={`p-5 rounded-2xl border-2 transition-all ${
                        isConstructed
                          ? "bg-parchment-100 border-gold-500/60 shadow-sm"
                          : isUnlocked
                          ? "bg-parchment-100 border-parchment-300"
                          : "bg-parchment-200/60 border-parchment-300 opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-serif font-bold text-base text-earth-900">
                            {slot.name}
                          </h4>
                          <span className="text-[10px] text-earth-500 uppercase tracking-wider font-semibold">
                            {slot.region} · {slot.era}
                          </span>
                        </div>
                        {isConstructed ? (
                          <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
                            Placed
                          </span>
                        ) : isUnlocked ? (
                          <Unlock className="w-4 h-4 text-gold-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-stone-500" />
                        )}
                      </div>
                      <p className="text-xs text-earth-700 leading-relaxed line-clamp-2">
                        {slot.historicalContext}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar: Heritage DNA & Badges */}
          <div className="space-y-6">
            {/* Heritage DNA Card */}
            <Card className="p-6 bg-parchment-100 border-2 border-parchment-300 rounded-3xl shadow-sm">
              <h3 className="font-serif text-lg font-bold text-earth-900 mb-4 pb-2 border-b border-parchment-300">
                Heritage DNA Matrix
              </h3>
              <div className="space-y-3">
                {Object.entries(heritageDNA).map(([trait, value]) => (
                  <div key={trait}>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-earth-700 mb-1">
                      <span className="capitalize">{trait}</span>
                      <span className="font-mono text-gold-700">{value}%</span>
                    </div>
                    <div className="w-full bg-parchment-300 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-gold-600 to-gold-400 h-full rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Badges Earned */}
            <Card className="p-6 bg-parchment-100 border-2 border-parchment-300 rounded-3xl shadow-sm">
              <h3 className="font-serif text-lg font-bold text-earth-900 mb-4 pb-2 border-b border-parchment-300 flex items-center justify-between">
                <span>Earned Badges</span>
                <span className="text-xs font-mono text-earth-500">{badges.length}</span>
              </h3>

              <div className="space-y-3">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 bg-parchment-200/90 rounded-xl border border-parchment-300 flex items-center gap-3"
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <div className="font-serif font-bold text-sm text-earth-900">{b.name}</div>
                      <div className="text-[11px] text-earth-600">{b.description}</div>
                    </div>
                  </div>
                ))}
                {badges.length === 0 && (
                  <p className="text-xs text-earth-500 italic text-center py-4">
                    Earn your first badge by completing the Nalanda expedition.
                  </p>
                )}
              </div>
            </Card>

            {/* Quick Links */}
            <div className="p-4 bg-earth-950 text-parchment-100 rounded-2xl border border-gold-500/40 space-y-3">
              <div className="text-xs font-bold font-serif uppercase tracking-widest text-gold-400">
                Knowledge Engines
              </div>
              <div className="space-y-2">
                <Link href="/historian" className="block">
                  <div className="p-2.5 rounded-xl bg-earth-900 hover:bg-earth-850 border border-gold-500/20 text-xs text-parchment-200 flex items-center justify-between">
                    <span>Consult AI Historian</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                  </div>
                </Link>
                <Link href="/classroom" className="block">
                  <div className="p-2.5 rounded-xl bg-earth-900 hover:bg-earth-850 border border-gold-500/20 text-xs text-parchment-200 flex items-center justify-between">
                    <span>Classroom Mode Preview</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
