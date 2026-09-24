"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Search, Eye, Check, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ManuscriptHuntProps {
  onComplete: (pts: number) => void;
}

interface HeritageClueItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  material: string;
  inspectionNotes: string;
  isTarget: boolean;
  whyMatters: string;
}

export default function ManuscriptHunt({ onComplete }: ManuscriptHuntProps) {
  const [inspectedItem, setInspectedItem] = useState<HeritageClueItem | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const [collectedClues, setCollectedClues] = useState<string[]>([]);

  const items: HeritageClueItem[] = [
    {
      id: "tala_patra",
      name: "Palm-Leaf Folio (Tala-Patra)",
      category: "Primary Manuscript",
      icon: "📜",
      material: "Dried Borassus Flabellifer (Palmyra) Leaf",
      inspectionNotes: "Smells of aged cedar oil and smoke. Incised with fine iron stylus writing in Magadhi Brahmi script, bound by a red silk cord through twin perforations.",
      isTarget: true,
      whyMatters: "Tala-patra was the classical medium for long-form scholarly treatises across ancient India, treated with anti-fungal herbal oils to endure for centuries."
    },
    {
      id: "tamra_patra",
      name: "Royal Copper Plate (Tamra-Patra)",
      category: "Epigraphic Grant",
      icon: "🪙",
      material: "Hammered Copper Alloy with Royal Seal",
      inspectionNotes: "Heavily oxidized metal plate recording land revenue granted by King Devapala to maintain scholar dormitories.",
      isTarget: false,
      whyMatters: "Copper plates recorded legal endowments and royal decrees rather than philosophical or mathematical texts."
    },
    {
      id: "kajal_inkpot",
      name: "Clay Inkpot & Bamboo Reed Stylus",
      category: "Scribe Instrument",
      icon: "🏺",
      material: "Terracotta & Cured Reed",
      inspectionNotes: "Traces of black lamp soot mixed with gum acacia still coat the interior of the terracotta vessel.",
      isTarget: false,
      whyMatters: "An essential tool used by copyists to rub pigment into stylus incisions, but not a manuscript itself."
    },
    {
      id: "terracotta_seal",
      name: "Nalanda Monastic Seal",
      category: "Administrative Artifact",
      icon: "🛡️",
      material: "Baked Terracotta with Dharmachakra Motif",
      inspectionNotes: "Bears the inscription: 'Sri-Nalanda-Mahavihariy-Arya-Bhikshu-Sanghasya' (Of the Community of Venerable Monks of the Great Monastery of Nalanda).",
      isTarget: false,
      whyMatters: "Used as an official institutional seal to certify correspondence and dispatched messengers."
    }
  ];

  const handleInspect = (item: HeritageClueItem) => {
    setInspectedItem(item);
    if (!collectedClues.includes(item.id)) {
      setCollectedClues((prev) => [...prev, item.id]);
    }
  };

  const handleSubmit = (item: HeritageClueItem) => {
    setSubmittedId(item.id);
    if (item.isTarget) {
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-parchment-300 pb-3">
        <div>
          <div className="text-xs font-bold tracking-widest text-terracotta-600 uppercase flex items-center gap-1.5 mb-1">
            <Search className="w-4 h-4 text-gold-600" /> Phase 04 · Dharmaganja Archives
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-earth-900 font-bold">
            The Lost Treatise Investigation
          </h2>
        </div>
        <div className="text-xs text-earth-600 bg-parchment-200 px-3 py-1.5 rounded-lg border border-parchment-300 font-mono self-start sm:self-auto">
          Artifacts Inspected: {collectedClues.length} / {items.length}
        </div>
      </div>

      <p className="text-earth-800 text-sm sm:text-base leading-relaxed max-w-3xl">
        The chief librarian has noted a missing foundational manuscript on logic (<em>Nyaya-Pramana</em>). Inspect the historical artifacts recovered from the reading chambers to identify the authentic medium used to preserve ancient Indian scholarship.
      </p>

      {/* Artifacts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const isInspected = collectedClues.includes(item.id);
          const isSelected = inspectedItem?.id === item.id;

          let cardBorder = "border-parchment-300 hover:border-gold-500 bg-parchment-100";
          if (isSelected) cardBorder = "border-gold-500 ring-2 ring-gold-400/40 bg-gold-50/40";
          if (feedback === "correct" && item.isTarget) cardBorder = "border-green-600 ring-2 ring-green-500 bg-green-50";

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              onClick={() => handleInspect(item)}
              className={`cursor-pointer rounded-2xl p-5 border-2 shadow-sm transition-all duration-200 flex flex-col justify-between ${cardBorder}`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 rounded-xl bg-parchment-200/80 border border-parchment-300">
                    {item.icon}
                  </span>
                  {isInspected && (
                    <span className="text-[10px] font-bold text-earth-600 bg-parchment-200 px-2 py-0.5 rounded-full border border-parchment-300 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-gold-600" /> Inspected
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg text-earth-900 font-bold mb-1 leading-snug">
                  {item.name}
                </h3>
                <span className="text-[11px] font-semibold text-terracotta-600 tracking-wider uppercase block mb-3">
                  {item.category}
                </span>
                <p className="text-xs text-earth-700 leading-relaxed line-clamp-3">
                  {item.inspectionNotes}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-parchment-200 flex items-center justify-between">
                <span className="text-xs text-gold-700 font-bold hover:underline">
                  Inspect Clues →
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Inspection Modal / Detail Drawer */}
      <AnimatePresence>
        {inspectedItem && feedback !== "correct" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-parchment-100 border-2 border-gold-500/50 rounded-2xl shadow-lg relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{inspectedItem.icon}</span>
                  <h3 className="font-serif text-xl font-bold text-earth-900">
                    {inspectedItem.name}
                  </h3>
                  <span className="text-xs bg-gold-500/20 text-earth-900 font-bold px-2.5 py-0.5 rounded-full">
                    {inspectedItem.material}
                  </span>
                </div>
                <p className="text-sm text-earth-800 leading-relaxed font-medium">
                  {inspectedItem.inspectionNotes}
                </p>
              </div>

              <div className="flex gap-3 shrink-0">
                <Button
                  size="md"
                  onClick={() => handleSubmit(inspectedItem)}
                  className="bg-gold-500 text-earth-950 hover:bg-gold-600 font-serif font-bold uppercase tracking-wider text-xs px-6 shadow-md"
                >
                  Submit as Lost Manuscript
                </Button>
              </div>
            </div>

            {feedback === "incorrect" && submittedId === inspectedItem.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  The head archivist shakes his head: &ldquo;This artifact is historically valuable, but remember that long treatises were bound on lightweight, inscribed organic leaves.&rdquo;
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success State */}
      <AnimatePresence>
        {feedback === "correct" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-green-50 border-2 border-green-400 rounded-2xl shadow-xl space-y-4"
          >
            <div className="flex items-center gap-2 text-green-900">
              <Check className="w-6 h-6 text-green-600" />
              <h3 className="font-serif text-2xl font-bold">Manuscript Successfully Identified</h3>
            </div>

            <p className="text-sm text-green-950 leading-relaxed font-medium">
              You correctly recovered the <strong>Palm-Leaf Folio (Tala-Patra)</strong>. Scribes etched letters onto Palmyra leaves with an iron stylus and filled them with carbon lamp soot. Bound together with silk cords and wooden covers, these folios allowed Nalanda&apos;s library to hold thousands of portable, resilient philosophical volumes.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-green-200">
              <span className="text-xs font-bold text-green-800 font-mono">
                +150 Heritage XP · +20 History DNA · Tala-patra Folio Unlocked
              </span>
              <Button
                size="md"
                onClick={() => onComplete(150)}
                className="bg-green-700 hover:bg-green-800 text-white font-serif flex items-center gap-2 text-sm shadow-md"
              >
                <span>Proceed to Cultural Decision</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
