"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameState";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, SkipForward } from "lucide-react";
import NalandaMap from "@/components/quest/NalandaMap";
import ScholarChallenge from "@/components/quest/ScholarChallenge";
import ManuscriptHunt from "@/components/quest/ManuscriptHunt";
import CulturalDecision from "@/components/quest/CulturalDecision";
import FinalSynthesisChallenge from "@/components/quest/FinalSynthesisChallenge";
import QuestComplete from "@/components/quest/QuestComplete";
import DiscoveryReveal from "@/components/game/DiscoveryReveal";

export default function NalandaQuestPage() {
  const router = useRouter();
  const { completeQuest, setFlyToTarget } = useGameStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [chosenCurriculum, setChosenCurriculum] = useState<string>("astronomy");
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);

  // Time portal auto-transition (5s)
  useEffect(() => {
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        setCurrentStep(1);
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const questSteps = [
    { num: "01", label: "ARRIVE", stepIndex: 1 },
    { num: "02", label: "EXPLORE", stepIndex: 2 },
    { num: "03", label: "SCHOLAR", stepIndex: 3 },
    { num: "04", label: "INVESTIGATE", stepIndex: 4 },
    { num: "05", label: "DECIDE", stepIndex: 5 },
    { num: "06", label: "DISCOVER", stepIndex: 6 },
  ];

  const handleScholarSolved = (pts: number) => {
    setTotalScore((prev) => prev + pts);
    setCurrentStep(4);
  };

  const handleManuscriptSolved = (pts: number) => {
    setTotalScore((prev) => prev + pts);
    setCurrentStep(5);
  };

  const handleDecisionMade = (choice: string, pts: number) => {
    setChosenCurriculum(choice);
    setTotalScore((prev) => prev + pts);
    setCurrentStep(6);
  };

  const handleSynthesisSolved = (pts: number) => {
    setTotalScore((prev) => prev + pts);
    setCurrentStep(7);
  };

  const handleTriggerAddToBharat = () => {
    // Commit rewards and state to authoritative store
    const item = {
      id: "nalanda_token",
      name: "Nalanda Mahavihara",
      icon: "🏛️",
      category: "monument" as const,
      rarity: "Legendary" as const,
      era: "Classical India (5th - 12th Century CE)",
      source: "Quest: The Lost Library of Nalanda",
      description: "The premier residential university of the ancient world. Fosters philosophical debate, mathematical science, and global knowledge exchange.",
      historicalContext: "Founded under the Gupta dynasty, Nalanda attracted students from China, Korea, Japan, Tibet, and Central Asia.",
      tags: ["Education", "Logic", "Architecture", "Magadha"],
      placeable: true,
      isPlaced: false,
      targetSlotId: "magadha",
    };

    const badge = {
      id: "badge_nalanda_scholar",
      name: "Nalanda Scholar",
      icon: "🎖️",
      description: "Passed the rigorous Dwarapala test and recovered classical treatises in the Dharmaganja.",
      category: "Academic",
      earnedAt: new Date().toLocaleDateString(),
    };

    const curriculumDNA =
      chosenCurriculum === "arts"
        ? { arts: 30, architecture: 20, history: 15, strategy: 15 }
        : chosenCurriculum === "medicine"
        ? { science: 30, history: 20, mathematics: 15, strategy: 15 }
        : { mathematics: 30, history: 20, architecture: 15, strategy: 15 };

    completeQuest("nalanda", {
      xp: 450,
      dnaDeltas: curriculumDNA,
      badge,
      item,
    });

    // Open Discovery Reveal overlay
    setShowDiscoveryModal(true);
  };

  const handleFinalConfirmReturn = () => {
    setShowDiscoveryModal(false);
    // Set fly to target coords for Bihar / Nalanda: [25.1333, 85.4419]
    setFlyToTarget([25.1333, 85.4419]);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-earth-950 text-parchment-100 flex flex-col justify-between selection:bg-gold-500/40 relative overflow-x-hidden">
      {/* Step 0: Cinematic Time Portal */}
      <AnimatePresence>
        {currentStep === 0 && (
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[600] bg-black flex flex-col items-center justify-center p-6 text-center overflow-hidden"
          >
            {/* Hyperspace Time-folding rings */}
            <div className="absolute w-[180vw] h-[180vw] max-w-[1200px] max-h-[1200px] rounded-full border border-gold-500/20 animate-[spin_30s_linear_infinite]" />
            <div className="absolute w-[140vw] h-[140vw] max-w-[900px] max-h-[900px] rounded-full border-2 border-dashed border-gold-400/30 animate-[spin_20s_linear_infinite_reverse]" />
            <div className="absolute w-[90vw] h-[90vw] max-w-[600px] max-h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,0.15)_0%,_transparent_70%)] blur-2xl" />

            {/* Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="relative z-10 max-w-lg space-y-4"
            >
              <div className="text-gold-400 font-mono text-xs tracking-[0.4em] uppercase">
                Temporal Translation Active
              </div>
              <h1 className="font-serif text-5xl sm:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-200 to-gold-500 font-bold tracking-widest uppercase drop-shadow-[0_0_30px_rgba(212,175,55,0.8)]">
                Time Portal
              </h1>
              <div className="py-2 px-6 rounded-full bg-earth-900/80 border border-gold-500/40 inline-block font-mono text-sm text-gold-300">
                Destination: NALANDA · Era: 7th Century CE
              </div>
              <p className="text-parchment-300/80 text-sm italic font-serif">
                &ldquo;Folding centuries of recorded memory into living experience...&rdquo;
              </p>
            </motion.div>

            {/* Skip Button */}
            <button
              onClick={() => setCurrentStep(1)}
              className="absolute bottom-10 right-10 text-xs font-mono tracking-widest text-parchment-300 hover:text-gold-300 flex items-center gap-1.5 z-20 bg-earth-900/60 px-4 py-2 rounded-xl border border-white/10 hover:border-gold-500/50 transition-all"
            >
              <span>Skip Sequence</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Quest Progress Header (Visible Steps 1-7) */}
      {currentStep > 0 && (
        <header className="sticky top-0 z-40 bg-earth-900/95 backdrop-blur-md border-b border-gold-500/30 px-4 py-3 shadow-lg">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-gold-400">
                Active Expedition
              </div>
              <h1 className="font-serif text-xl sm:text-2xl text-parchment-100 font-bold tracking-wide">
                The Lost Library of Nalanda
              </h1>
            </div>

            {/* Stepper Dots / Badges */}
            <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
              {questSteps.map((step) => {
                const isCompleted = currentStep > step.stepIndex;
                const isCurrent = currentStep === step.stepIndex;

                return (
                  <div
                    key={step.num}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all ${
                      isCurrent
                        ? "bg-gold-500 text-earth-950 font-bold shadow-[0_0_15px_rgba(212,175,55,0.6)]"
                        : isCompleted
                        ? "bg-earth-800 text-gold-400 border border-gold-500/40"
                        : "bg-earth-950/60 text-parchment-400/50 border border-white/5"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 text-gold-400" />
                    ) : (
                      <span>{step.num}</span>
                    )}
                    <span>{step.label}</span>
                  </div>
                );
              })}
            </nav>
          </div>
        </header>
      )}

      {/* Main Quest Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex items-center justify-center my-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Nalanda Arrival Briefing */}
          {currentStep === 1 && (
            <motion.div
              key="arrival"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl w-full bg-parchment-100 text-earth-900 rounded-3xl p-8 sm:p-12 border-2 border-gold-500 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-5 bg-[url('/mandala.svg')] bg-center bg-no-repeat pointer-events-none" />

              <div className="text-xs font-bold tracking-widest text-terracotta-600 uppercase mb-2">
                Ancient Magadha · 650 CE
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
                Arrival at the Mahavihara
              </h2>
              <p className="text-earth-800 text-base sm:text-lg leading-relaxed mb-6 font-medium">
                You step through the southern mist onto the red baked-brick paths of Nalanda. Ahead rise the nine storeys of the <em>Dharmaganja</em> library towers, reflecting the afternoon sun. Hundreds of monks and scholars from across Asia pace the stone courtyards in deep debate.
              </p>

              <div className="p-4 bg-parchment-200/90 rounded-2xl border border-parchment-300 mb-8 space-y-2 text-sm text-earth-900">
                <div className="font-bold text-xs uppercase tracking-wider text-earth-700">Mission Objectives:</div>
                <ul className="space-y-1.5 text-xs sm:text-sm list-disc list-inside">
                  <li>Survey the campus sectors to understand institutional layout.</li>
                  <li>Pass the Dwarapala entrance riddle on poetic mathematics.</li>
                  <li>Recover the misplaced palm-leaf philosophical treatise.</li>
                  <li>Make a strategic preservation choice for the library&apos;s copyists.</li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-earth-950 font-serif font-bold text-sm uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Campus Survey</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Campus Map Exploration */}
          {currentStep === 2 && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <NalandaMap onComplete={() => setCurrentStep(3)} />
            </motion.div>
          )}

          {/* Step 3: Scholar Challenge */}
          {currentStep === 3 && (
            <motion.div
              key="scholar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <ScholarChallenge onComplete={handleScholarSolved} />
            </motion.div>
          )}

          {/* Step 4: Manuscript Hunt */}
          {currentStep === 4 && (
            <motion.div
              key="hunt"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <ManuscriptHunt onComplete={handleManuscriptSolved} />
            </motion.div>
          )}

          {/* Step 5: Cultural Decision */}
          {currentStep === 5 && (
            <motion.div
              key="decision"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <CulturalDecision onComplete={handleDecisionMade} />
            </motion.div>
          )}

          {/* Step 6: Final Synthesis Challenge */}
          {currentStep === 6 && (
            <motion.div
              key="synthesis"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <FinalSynthesisChallenge onComplete={handleSynthesisSolved} />
            </motion.div>
          )}

          {/* Step 7: Quest Complete */}
          {currentStep === 7 && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <QuestComplete
                score={totalScore || 450}
                onAddToBharat={handleTriggerAddToBharat}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Discovery Reveal Modal for Nalanda */}
      <DiscoveryReveal
        isOpen={showDiscoveryModal}
        title="NALANDA MAHAVIHARA"
        subtitle="Center of Classical Learning"
        category="Monument / University"
        rarity="Legendary"
        icon="🏛️"
        description="You have fully reconstructed the foundational knowledge of Nalanda. The ancient university token is now yours to physically place on your Living India Board."
        historicalContext="Operating from 427 to 1197 CE in Magadha, Nalanda was the world's first great residential university, sheltering thousands of masters of logic, mathematics, astronomy, and medicine."
        rewards={{
          xp: 450,
          badge: "Nalanda Scholar",
          dna: [
            { trait: "History", value: 25 },
            { trait: "Mathematics", value: 25 },
            { trait: "Architecture", value: 20 },
          ],
        }}
        tags={["Magadha", "Dharmaganja", "Tala-Patra", "Knowledge Hub"]}
        ctaLabel="RETURN TO LIVING INDIA"
        onConfirm={handleFinalConfirmReturn}
      />
    </div>
  );
}
