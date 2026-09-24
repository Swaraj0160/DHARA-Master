"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Brain, HelpCircle, CheckCircle, RotateCcw, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScholarChallengeProps {
  onComplete: (pts: number) => void;
}

export default function ScholarChallenge({ onComplete }: ScholarChallengeProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "evaluating" | "correct" | "incorrect">("idle");
  const [hintShown, setHintShown] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const options = [
    { id: "A", text: "The Pythagorean Ratio (1, 2, 4, 8...)", value: "pythagorean", isCorrect: false },
    { id: "B", text: "The Hemachandra Sequence (1, 2, 3, 5, 8, 13...)", value: "hemachandra", isCorrect: true },
    { id: "C", text: "The Vedic Square Modular Cycle", value: "vedic_square", isCorrect: false },
    { id: "D", text: "The Binary Exponent Scale", value: "binary_exponent", isCorrect: false },
  ];

  const handleSelect = (option: typeof options[0]) => {
    setSelectedOption(option.value);
    setAttempts((prev) => prev + 1);

    if (option.isCorrect) {
      setStatus("correct");
    } else {
      setStatus("incorrect");
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setStatus("idle");
  };

  const pointsEarned = hintShown ? (attempts > 2 ? 100 : 130) : attempts === 1 ? 180 : 140;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="p-6 sm:p-10 bg-parchment-100 border-2 border-gold-500/50 shadow-2xl relative overflow-hidden">
        {/* Decorative background watermark */}
        <div className="absolute inset-0 opacity-5 bg-[url('/mandala.svg')] bg-center bg-no-repeat pointer-events-none" />

        {/* Phase Header */}
        <div className="flex items-center justify-between mb-4 border-b border-parchment-300 pb-3">
          <span className="text-xs font-bold tracking-widest text-terracotta-600 uppercase flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-gold-600" /> Phase 03 · The Dwarapala&apos;s Examination
          </span>
          <span className="text-xs text-earth-600 font-mono">Admission Trial</span>
        </div>

        {/* Question Prompt */}
        <h2 className="font-serif text-2xl sm:text-3xl text-earth-900 font-bold mb-3">
          The Rhythm of Syllables
        </h2>

        {/* Dwarapala dialogue box */}
        <div className="bg-parchment-200/90 border-l-4 border-gold-500 p-4 sm:p-5 rounded-r-xl mb-6 relative">
          <p className="text-earth-900 text-base leading-relaxed italic font-serif">
            &ldquo;Seeker of the Mahavihara, the gates open only to those who comprehend the mathematics underpinning the cosmos. In Pingala&apos;s <em>Chandaḥśāstra</em>, as meters are constructed from combinations of short (Laghu) and long (Guru) syllables, which mathematical progression determines the number of variations for each meter length?&rdquo;
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-earth-600 font-medium">
            <span>— The Senior Dwarapala (Gatekeeper Scholar)</span>
            <button
              onClick={() => setHintShown(!hintShown)}
              className="text-gold-700 hover:text-gold-900 underline flex items-center gap-1 font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {hintShown ? "Hide Hint" : "Request Hint"}
            </button>
          </div>
        </div>

        {/* In-Game Hint */}
        <AnimatePresence>
          {hintShown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-4 bg-amber-50 border border-gold-400/40 rounded-xl text-xs text-amber-900 leading-relaxed">
                <strong>Scholar&apos;s Whisper:</strong> Each new meter variation is derived by adding the variations of the previous two meter counts: 1, 2, 3, 5, 8... Note which sequence describes sum-of-preceding-terms.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {options.map((opt) => {
            const isChosen = selectedOption === opt.value;
            let optClass = "border-parchment-300 hover:border-gold-500 hover:bg-gold-50/50 bg-white text-earth-900";

            if (status !== "idle" && isChosen) {
              if (opt.isCorrect) {
                optClass = "border-green-600 bg-green-50 text-green-950 ring-2 ring-green-500";
              } else {
                optClass = "border-red-500 bg-red-50 text-red-950";
              }
            }

            return (
              <button
                key={opt.id}
                disabled={status === "correct"}
                onClick={() => handleSelect(opt)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 shadow-sm flex items-start gap-3 group ${optClass}`}
              >
                <span className="w-6 h-6 rounded-full bg-parchment-200 border border-parchment-300 flex items-center justify-center font-bold text-xs text-earth-700 shrink-0 group-hover:bg-gold-500 group-hover:text-earth-950 transition-colors">
                  {opt.id}
                </span>
                <span className="text-sm font-medium leading-snug">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* In-Game Error Feedback (Replaces browser alert) */}
        <AnimatePresence>
          {status === "incorrect" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-50 border border-red-300 rounded-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <h4 className="font-serif font-bold text-red-900 text-sm">The Dwarapala pauses...</h4>
                <p className="text-red-800 text-xs mt-1">
                  &ldquo;Not quite, seeker. Think about adding the variations of the previous two meters together.&rdquo;
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="border-red-400 text-red-800 hover:bg-red-100 flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success State with Context Explanation */}
        <AnimatePresence>
          {status === "correct" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-green-50 border-2 border-green-300 rounded-2xl space-y-4"
            >
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-serif font-bold text-lg">The Gates Swing Open</h4>
              </div>

              <div className="text-xs text-green-900 leading-relaxed space-y-2">
                <p>
                  <strong>Historical Truth:</strong> Ancient Indian prosodists like <em>Pingala</em> (3rd c. BCE), <em>Virahanka</em> (6th c. CE), and <em>Hemachandra</em> (11th c. CE) developed this sequence while systematically mapping rhythmic permutations in Sanskrit poetry—centuries before Fibonacci introduced it in Europe in 1202 CE.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-green-200">
                <div className="text-xs font-bold text-green-800 font-mono">
                  +{pointsEarned} Heritage XP · +20 Mathematics DNA
                </div>
                <Button
                  size="md"
                  onClick={() => onComplete(pointsEarned)}
                  className="bg-green-700 hover:bg-green-800 text-white flex items-center gap-2 font-serif text-sm shadow-md"
                >
                  <span>Enter Dharmaganja</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
