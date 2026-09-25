"use client";

import { useState, useEffect } from "react";
import { useGameStore } from "@/store/gameState";
import { useVedaStore } from "@/store/vedaStore";
import { CITIES_DATA, PuzzleOption } from "@/data/gameContent";
import ChapterCompleteModal from "./ChapterCompleteModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  HelpCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Play,
  Sun,
} from "lucide-react";
import KonarkTimeLens from "../quest/konark/KonarkTimeLens";
import HeritageLearningSequence from "./HeritageLearningSequence";

interface ChapterViewProps {
  cityId: string;
  chapterId: string;
}

export default function ChapterView({ cityId, chapterId }: ChapterViewProps) {
  const {
    getChapterState,
    enterChapter,
    submitPuzzleAnswer,
    completeChapter,
  } = useGameStore();

  const city = CITIES_DATA.find((c) => c.id === cityId);
  const chapter = city?.chapters.find((ch) => ch.id === chapterId);
  const chapterState = getChapterState(chapterId);

  // States
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<"correct" | "incorrect" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarnedInRun, setXpEarnedInRun] = useState(0);
  const [showXpToast, setShowXpToast] = useState(false);
  const [showTimeLens, setShowTimeLens] = useState(false);

  // Completion modal state
  const [completionData, setCompletionData] = useState<{
    starsAwarded: number;
    newStarsEarned: number;
    nextChapterUnlocked: string | null;
  } | null>(null);

  // Automatically lock AI consultation while an active puzzle is unanswered; unlock once answered or completed
  useEffect(() => {
    const isOngoing = evaluation === null && completionData === null;
    useVedaStore.getState().setPuzzleActive(isOngoing);

    return () => {
      useVedaStore.getState().setPuzzleActive(false);
    };
  }, [evaluation, completionData]);

  // Guard: Chapter or City not found
  if (!city || !chapter) {
    return (
      <div className="min-h-screen bg-earth-950 flex flex-col items-center justify-center text-parchment-100 p-6 text-center">
        <p className="font-serif text-xl mb-4">Location not found.</p>
        <button
          onClick={() => enterChapter(null)}
          className="px-6 py-2.5 rounded-xl bg-gold-500 text-earth-950 font-serif font-bold text-xs uppercase"
        >
          Return to City Map
        </button>
      </div>
    );
  }

  // Guard: Locked chapter cannot be played
  if (chapterState.status === "locked") {
    return (
      <div className="min-h-screen bg-earth-950 flex flex-col items-center justify-center text-parchment-100 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-400 mb-4">
          <Lock className="w-8 h-8 text-gold-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold mb-2">Location Locked</h2>
        <p className="text-sm text-parchment-300 max-w-md mb-6">
          Complete the preceding chapters sequentially in {city.name} to unlock this location.
        </p>
        <button
          onClick={() => enterChapter(null)}
          className="px-6 py-2.5 rounded-xl bg-gold-500 text-earth-950 font-serif font-bold text-xs uppercase tracking-wider"
        >
          Return to City Map
        </button>
      </div>
    );
  }

  if (chapter.chapterNumber === 1 && !completionData) {
    return (
      <div className="relative w-full h-screen">
        <HeritageLearningSequence 
          cityId={city.id} 
          chapterId={chapter.id} 
          onSequenceComplete={() => {
            const result = completeChapter(city.id, chapter.id, 5, 5); // perfect score
            setCompletionData({
              starsAwarded: result.starsAwarded,
              newStarsEarned: result.newStarsEarned,
              nextChapterUnlocked: result.nextChapterUnlocked,
            });
            setXpEarnedInRun(50);
          }} 
        />
      </div>
    );
  }

  // Show completion modal immediately if triggered from learning sequence
  if (chapter.chapterNumber === 1 && completionData) {
    return (
      <div className="min-h-screen bg-earth-950 flex flex-col justify-center relative">
        <ChapterCompleteModal
          chapterTitle={chapter.title}
          locationName={chapter.locationName}
          correctAnswers={5}
          totalQuestions={5}
          starsEarned={completionData.starsAwarded}
          newStarsEarned={completionData.newStarsEarned}
          xpEarned={50}
          nextChapterUnlocked={completionData.nextChapterUnlocked}
          onContinue={() => enterChapter(null)}
        />
      </div>
    );
  }

  const puzzles = chapter.puzzles;
  const currentPuzzle = puzzles[currentPuzzleIndex];

  // Option selection with double-submission guard
  const handleSelectOption = (option: PuzzleOption) => {
    if (isSubmitting || evaluation !== null) return;
    setIsSubmitting(true);
    setSelectedOptionId(option.id);

    if (option.isCorrect) {
      setEvaluation("correct");
      setCorrectCount((prev) => prev + 1);

      // Veda celebrates correct deduction
      useVedaStore.getState().popWithDialogue(
        `Brilliant deduction! The truth of ${chapter.locationName} is unveiled.`,
        "happy"
      );

      // Submit to authoritative store (awards +100 XP only on first solve)
      const { xpAwarded } = submitPuzzleAnswer(chapterId, currentPuzzle.id, true);
      if (xpAwarded > 0) {
        setXpEarnedInRun((prev) => prev + xpAwarded);
        setShowXpToast(true);
        setTimeout(() => setShowXpToast(false), 2200);
      }
    } else {
      setEvaluation("incorrect");
      // Veda offers encouragement and guidance
      useVedaStore.getState().popWithDialogue(
        `Ponder deeply! Ancient mysteries often reveal themselves upon careful reflection.`,
        "thinking"
      );
    }

    setIsSubmitting(false);
  };

  // Next puzzle or complete chapter
  const handleNext = () => {
    setSelectedOptionId(null);
    setEvaluation(null);
    setHintShown(false);

    if (currentPuzzleIndex + 1 < puzzles.length) {
      setCurrentPuzzleIndex((prev) => prev + 1);
    } else {
      // Final puzzle completed: calculate authoritative chapter result
      const result = completeChapter(city.id, chapter.id, correctCount, puzzles.length);
      if (result.starsAwarded === 3) {
        useVedaStore.getState().popWithDialogue(
          `Sensational mastery! You have earned all 3 stars in ${chapter.title}!`,
          "excited"
        );
      } else {
        useVedaStore.getState().popWithDialogue(
          `Well journeyed, scholar! ${chapter.title} has yielded its secrets to you.`,
          "happy"
        );
      }
      setCompletionData({
        starsAwarded: result.starsAwarded,
        newStarsEarned: result.newStarsEarned,
        nextChapterUnlocked: result.nextChapterUnlocked,
      });
    }
  };

  return (
    <div className="min-h-screen bg-earth-950 text-parchment-100 flex flex-col justify-between selection:bg-gold-500/40 relative overflow-x-hidden pt-20 pb-12">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(44,26,18,0.7)_0%,_#090705_80%)] pointer-events-none" />

      {/* Floating XP Toast */}
      <AnimatePresence>
        {showXpToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-gradient-to-r from-gold-600 to-gold-400 text-earth-950 font-serif font-bold text-sm shadow-xl flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 fill-earth-950" />
            <span>+100 XP Earned</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Controls */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 flex items-center justify-between relative z-20">
        <button
          onClick={() => enterChapter(null)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-earth-900/80 border border-gold-500/30 text-parchment-300 hover:text-gold-300 hover:border-gold-400 text-xs font-serif font-bold uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-gold-400" />
          <span>Exit to {city.name}</span>
        </button>

        {hasStarted && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-parchment-400">
              Challenge {currentPuzzleIndex + 1} of {puzzles.length}
            </span>
            <div className="w-24 sm:w-32 bg-earth-900 rounded-full h-2 border border-gold-500/30 overflow-hidden">
              <div
                className="bg-gradient-to-r from-gold-500 to-gold-300 h-full transition-all duration-300"
                style={{
                  width: `${((currentPuzzleIndex + 1) / puzzles.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 my-auto relative z-20">
        {/* Step 0: Chapter Intro */}
        {!hasStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-10 rounded-3xl bg-earth-900/90 border-2 border-gold-500/50 shadow-2xl relative overflow-hidden text-center"
          >
            <div className="absolute inset-0 opacity-5 bg-[url('/mandala.svg')] bg-center bg-no-repeat pointer-events-none" />

            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-gold-400 mb-2">
              {city.name} · Chapter {chapter.chapterNumber}
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-parchment-100 mb-2">
              {chapter.title}
            </h1>
            <p className="font-serif text-lg text-gold-300 italic mb-4">
              {chapter.locationName}
            </p>
            <p className="text-sm sm:text-base text-parchment-300 leading-relaxed max-w-xl mx-auto mb-8">
              {chapter.description}
            </p>

            <div className="p-4 rounded-2xl bg-earth-950/80 border border-gold-500/30 max-w-md mx-auto mb-8 text-xs font-mono text-parchment-300 space-y-1.5 text-left">
              <div className="flex justify-between">
                <span>Total Challenges:</span>
                <span className="font-bold text-parchment-100">{puzzles.length} Trials</span>
              </div>
              <div className="flex justify-between">
                <span>Reward Potential:</span>
                <span className="font-bold text-gold-300">Up to 3 Stars · +{puzzles.length * 100} XP</span>
              </div>
              <div className="flex justify-between">
                <span>Progression:</span>
                <span className="font-bold text-parchment-100">Unlocks Next Location</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto max-w-lg">
              {city.id === "konark" && (
                <button
                  onClick={() => setShowTimeLens(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-earth-800 border border-gold-500/40 text-gold-400 font-serif font-bold text-xs sm:text-sm uppercase tracking-widest hover:bg-earth-700 hover:text-gold-300 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <Sun className="w-4 h-4" />
                  <span>Time Lens</span>
                </button>
              )}

              <button
                onClick={() => setHasStarted(true)}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-earth-950 font-serif font-bold text-xs sm:text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <span>Begin Chapter</span>
                <Play className="w-4 h-4 fill-earth-950" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Step 1..N: Puzzles Runner */
          <motion.div
            key={currentPuzzle.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 sm:p-10 rounded-3xl bg-earth-900/90 border-2 border-gold-500/50 shadow-2xl relative overflow-hidden"
          >
            {/* Subtle background mandala watermark */}
            <div className="absolute inset-0 opacity-5 bg-[url('/mandala.svg')] bg-center bg-no-repeat pointer-events-none" />

            {/* Puzzle Header */}
            <div className="flex items-center justify-between mb-4 border-b border-earth-800 pb-3">
              <span className="text-xs font-bold tracking-widest text-gold-400 uppercase flex items-center gap-1.5 font-mono">
                <Brain className="w-4 h-4 text-gold-400" /> Trial {currentPuzzleIndex + 1} of {puzzles.length}
              </span>
              <span className="text-xs text-parchment-400 font-mono">
                {chapter.locationName}
              </span>
            </div>

            {/* Question Prompt */}
            <h3 className="font-serif text-xl sm:text-2xl text-parchment-100 font-bold mb-4 leading-snug">
              {currentPuzzle.prompt}
            </h3>

            {/* Speaker / Dialogue Quote Box if available */}
            {currentPuzzle.speaker && (
              <div className="bg-earth-950/80 border-l-4 border-gold-500 p-4 rounded-r-xl mb-6 relative">
                <div className="flex items-center justify-between text-xs text-gold-400 font-medium mb-1">
                  <span>Speaker: {currentPuzzle.speaker}</span>
                  {currentPuzzle.hint && (
                    <button
                      onClick={() => {
                        const next = !hintShown;
                        setHintShown(next);
                        if (next && currentPuzzle.hint) {
                          useVedaStore.getState().popWithDialogue(
                            `Veda's ancient whisper: "${currentPuzzle.hint}"`,
                            "guiding"
                          );
                        }
                      }}
                      className="text-gold-300 hover:text-gold-200 underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {hintShown ? "Hide Hint" : "Request Hint"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* In-Game Hint */}
            <AnimatePresence>
              {hintShown && currentPuzzle.hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-6"
                >
                  <div className="p-4 bg-earth-950/90 border border-gold-500/40 rounded-xl text-xs text-gold-300 leading-relaxed">
                    <strong>Sage&apos;s Whisper:</strong> {currentPuzzle.hint}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
              {currentPuzzle.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                let optStyle =
                  "border-earth-800 bg-earth-950/80 text-parchment-200 hover:border-gold-500 hover:bg-earth-850";

                if (evaluation !== null) {
                  if (option.isCorrect) {
                    optStyle =
                      "border-emerald-500/80 bg-emerald-950/60 text-emerald-200 font-semibold";
                  } else if (isSelected && !option.isCorrect) {
                    optStyle =
                      "border-rose-500/80 bg-rose-950/60 text-rose-200 font-semibold";
                  } else {
                    optStyle = "opacity-40 border-earth-800 bg-earth-950/40 text-stone-400";
                  }
                }

                return (
                  <button
                    key={option.id}
                    disabled={evaluation !== null || isSubmitting}
                    onClick={() => handleSelectOption(option)}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-200 flex items-start gap-3 select-none ${optStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-earth-900 border border-earth-700 flex items-center justify-center font-mono text-xs text-gold-300 shrink-0 mt-0.5">
                      {option.id}
                    </span>
                    <span className="leading-relaxed">{option.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Explanation Card */}
            <AnimatePresence>
              {evaluation !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-earth-950/95 border border-gold-500/40 mb-6 text-xs sm:text-sm leading-relaxed"
                >
                  <div className="flex items-center gap-2 mb-2 font-bold font-serif">
                    {evaluation === "correct" ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 text-sm sm:text-base">
                          Mastered! +100 XP
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400" />
                        <span className="text-rose-400 text-sm sm:text-base">
                          Incorrect Perception
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-parchment-300">
                    {currentPuzzle.options.find((o) => o.isCorrect)?.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Button */}
            {evaluation !== null && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleNext}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-earth-950 font-serif font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>
                  {currentPuzzleIndex + 1 < puzzles.length
                    ? "Proceed to Next Challenge"
                    : "Complete Chapter"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* Chapter Completion Modal */}
      {completionData && (
        <ChapterCompleteModal
          chapterTitle={chapter.title}
          locationName={chapter.locationName}
          correctAnswers={correctCount}
          totalQuestions={puzzles.length}
          starsEarned={completionData.starsAwarded}
          newStarsEarned={completionData.newStarsEarned}
          xpEarned={xpEarnedInRun}
          nextChapterUnlocked={completionData.nextChapterUnlocked}
          onContinue={() => enterChapter(null)}
        />
      )}

      {/* Time Lens Modal */}
      <AnimatePresence>
        {showTimeLens && (
          <KonarkTimeLens onClose={() => setShowTimeLens(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
