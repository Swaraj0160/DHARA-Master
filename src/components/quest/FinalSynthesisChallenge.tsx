"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Compass, RotateCcw, ArrowRight } from "lucide-react";

interface FinalSynthesisProps {
  onComplete: (score: number) => void;
}

export default function FinalSynthesisChallenge({ onComplete }: FinalSynthesisProps) {
  // Synthesis: Connecting the 3 Great Intellectual Centers of Ancient India to their contributions
  const targets = [
    {
      center: "Takshashila (Taxila)",
      correctMatch: "Statecraft & Surgery (Arthashastra & Jivaka)",
      hint: "Northwestern university on Uttarapatha trade crossroads"
    },
    {
      center: "Nalanda Mahavihara",
      correctMatch: "Universal Logic & Monastic Library (Dharmaganja)",
      hint: "Magadha institution home to 10,000 scholars"
    },
    {
      center: "Ujjayini (Ujjain)",
      correctMatch: "Zero Longitude & Mathematical Astronomy (Varahamihira)",
      hint: "Central meridian observatory of ancient India"
    }
  ];

  const availableOptions = [
    "Zero Longitude & Mathematical Astronomy (Varahamihira)",
    "Statecraft & Surgery (Arthashastra & Jivaka)",
    "Universal Logic & Monastic Library (Dharmaganja)"
  ];

  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedTarget, setSelectedTarget] = useState<string | null>(targets[0].center);
  const [submitted, setSubmitted] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);

  const handlePair = (optionText: string) => {
    if (!selectedTarget) return;
    setMatches((prev) => ({
      ...prev,
      [selectedTarget]: optionText
    }));

    // Auto-advance to next unfilled target
    const nextUnfilled = targets.find((t) => t.center !== selectedTarget && !matches[t.center]);
    setSelectedTarget(nextUnfilled ? nextUnfilled.center : null);
  };

  const handleVerify = () => {
    const correct = targets.every((t) => matches[t.center] === t.correctMatch);
    setIsAllCorrect(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setMatches({});
    setSelectedTarget(targets[0].center);
    setSubmitted(false);
    setIsAllCorrect(false);
  };

  const allAssigned = targets.every((t) => !!matches[t.center]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="text-xs font-bold tracking-widest text-terracotta-600 uppercase flex items-center justify-center gap-1.5">
          <Compass className="w-4 h-4 text-gold-600" /> Phase 06 · Culmination Trial
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-earth-900 font-bold">
          The Tri-Ratna of Ancient Learning
        </h2>
        <p className="text-earth-700 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Before taking the knowledge back to your Living Board, demonstrate your synthesis of India&apos;s intellectual geography. Pair each historic center with its renowned scholarly contribution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Centers Column */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-earth-600 uppercase tracking-widest px-1">
            1. Select Ancient Academic Hub
          </h3>
          {targets.map((t) => {
            const isSelected = selectedTarget === t.center;
            const assignedMatch = matches[t.center];
            const isCorrect = assignedMatch === t.correctMatch;

            return (
              <div
                key={t.center}
                onClick={() => setSelectedTarget(t.center)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer bg-parchment-100 ${
                  isSelected
                    ? "border-gold-500 ring-2 ring-gold-400/40 bg-gold-50/60 shadow-md"
                    : "border-parchment-300 hover:border-gold-400"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-serif font-bold text-base text-earth-900">{t.center}</h4>
                  <span className="text-[10px] text-earth-500 font-mono italic">{t.hint}</span>
                </div>

                <div className="mt-2 min-h-[36px] p-2 rounded-xl bg-parchment-200/90 border border-parchment-300 text-xs flex items-center justify-between">
                  {assignedMatch ? (
                    <span className="font-medium text-earth-900 font-sans">{assignedMatch}</span>
                  ) : (
                    <span className="text-earth-400 italic font-mono">Tap an option on the right to assign</span>
                  )}
                  {submitted && (
                    <span className={`text-xs font-bold ${isCorrect ? "text-green-700" : "text-red-600"}`}>
                      {isCorrect ? "✓" : "✗"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contributions Column */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-earth-600 uppercase tracking-widest px-1">
            2. Assign Scholarly Contribution
          </h3>
          <div className="space-y-2.5">
            {availableOptions.map((opt) => {
              const isUsed = Object.values(matches).includes(opt);
              return (
                <button
                  key={opt}
                  disabled={submitted && isAllCorrect}
                  onClick={() => handlePair(opt)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all text-xs sm:text-sm font-medium leading-snug flex items-center justify-between ${
                    isUsed
                      ? "bg-parchment-200/70 border-parchment-300 text-earth-500 opacity-60"
                      : "bg-white border-parchment-300 hover:border-gold-500 text-earth-900 shadow-sm hover:shadow"
                  }`}
                >
                  <span>{opt}</span>
                  <span className="text-xs text-gold-600 font-bold ml-2">Assign</span>
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="pt-4 flex items-center gap-3">
            {!submitted ? (
              <Button
                size="lg"
                disabled={!allAssigned}
                onClick={handleVerify}
                className="w-full bg-gold-500 text-earth-950 hover:bg-gold-600 font-serif font-bold uppercase tracking-wider text-xs py-4 shadow-md"
              >
                Synthesize & Verify
              </Button>
            ) : isAllCorrect ? (
              <Button
                size="lg"
                onClick={() => onComplete(250)}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-serif font-bold uppercase tracking-wider text-xs py-4 shadow-md flex items-center justify-center gap-2"
              >
                <span>Claim Scholar Acclaim (+250 XP)</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="w-full border-red-400 text-red-800 hover:bg-red-50 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Adjust Assignments & Retry</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
