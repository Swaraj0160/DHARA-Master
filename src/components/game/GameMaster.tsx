"use client";

import { useState } from "react";
import { BrainCircuit, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/gameState";
import Link from "next/link";

export default function GameMaster() {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"advisor" | "chat">("advisor");
  const { heritageDNA, completedQuests, placedNodes } = useGameStore();

  const [chatMessages, setChatMessages] = useState<Array<{ role: "gm" | "user"; text: string; actionLink?: string }>>([
    {
      role: "gm",
      text: "Greetings, Seeker. I guide your exploration across India's civilization. Ask me for gameplay tactics, quest hints, or where to direct your next discovery.",
    },
  ]);
  const [input, setInput] = useState("");

  // Sort traits by value to find strongest and developing
  const sortedTraits = Object.entries(heritageDNA).sort((a, b) => b[1] - a[1]);
  const strongest = sortedTraits[0] || ["history", 15];
  const developing = sortedTraits[sortedTraits.length - 1] || ["geography", 15];

  // Dynamic Goal based on player progress
  const nalandaDone = completedQuests.includes("nalanda");
  const nalandaPlaced = placedNodes.some((n) => n.id.includes("nalanda"));

  let currentGoal = {
    title: "Recover the Lost Library of Nalanda",
    focus: "History & Mathematics",
    desc: "Pass the Dwarapala entrance test in ancient Magadha and bring back the foundational learning token.",
    link: "/quest/nalanda",
    linkLabel: "Enter Nalanda Quest",
  };

  if (nalandaDone && !nalandaPlaced) {
    currentGoal = {
      title: "Place Nalanda on Your Living India",
      focus: "Living Board Strategy",
      desc: "Nalanda is in your Heritage Chest. Select the Magadha slot on the map to construct it.",
      link: "/",
      linkLabel: "Open Living Board",
    };
  } else if (nalandaPlaced) {
    currentGoal = {
      title: "Form Your First Sangam Connection",
      focus: "Cultural Synergy",
      desc: "Connect Nalanda with the Silk Route Gateway to discover the Knowledge Exchange synergy.",
      link: "/",
      linkLabel: "Form Connection",
    };
  }

  const recommendations = [
    {
      title: "THE FORGOTTEN TRADE ROUTE",
      difficulty: "★★★☆☆",
      focus: "Geography + Trade",
      desc: "Trace ancient caravan arteries linking northern Uttarapatha markets to western coastal ports.",
      link: "/map",
    },
    {
      title: "ASTRONOMERS OF UJJAYINI",
      difficulty: "★★★★☆",
      focus: "Mathematics + Astronomy",
      desc: "Explore how ancient Indian astronomers mapped the prime meridian through central India.",
      link: "/historian",
    },
    {
      title: "ASHTAPADA STRATEGY LAB",
      difficulty: "★★☆☆☆",
      focus: "Strategy DNA",
      desc: "Master the ancient 8x8 spiral race game that gave birth to modern chess.",
      link: "/games",
    },
  ];

  const [recIndex, setRecIndex] = useState(0);
  const activeRec = recommendations[recIndex];

  const handleSendChat = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput("");

    setChatMessages((prev) => [...prev, { role: "user", text: userText }]);

    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = "Your journey is currently expanding. Focus on completing active expeditions and forming Sangam connections on the map.";
      let actionLink: string | undefined = undefined;

      if (lower.includes("hint") || lower.includes("dwarapala") || lower.includes("scholar") || lower.includes("answer")) {
        reply = "In the Dwarapala examination, remember Pingala's meter progression: each new variation is formed by summing the counts of the previous two meters (1, 2, 3, 5, 8, 13...).";
        actionLink = "/quest/nalanda";
      } else if (lower.includes("quest") || lower.includes("where") || lower.includes("next")) {
        if (!nalandaDone) {
          reply = "Your primary objective is the Nalanda Expedition in Magadha. Unlocking it will grant your first living heritage node.";
          actionLink = "/quest/nalanda";
        } else {
          reply = "Your Nalanda foundation is secured! Next, look toward the Silk Route gateway or explore the Chola Maritime horizons in the south.";
          actionLink = "/map";
        }
      } else if (lower.includes("sangam") || lower.includes("connect")) {
        reply = "Sangam represents cultural fusion. Click any placed node, choose 'Form Sangam', and click another node to discover mutual synergies.";
      } else if (lower.includes("game") || lower.includes("ashtapada")) {
        reply = "You can test your tactical prowess in the Ancient Game Lab. Playing Ashtapada earns Strategy DNA and unlocks gaming traditions.";
        actionLink = "/games";
      }

      setChatMessages((prev) => [...prev, { role: "gm", text: reply, actionLink }]);
    }, 700);
  };

  return (
    <div className="absolute bottom-6 left-4 sm:left-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-[92vw] sm:w-[380px] bg-parchment-100 border-2 border-gold-500 rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.65)] mb-4 overflow-hidden flex flex-col h-[520px] pointer-events-auto text-earth-900"
          >
            {/* Header */}
            <div className="bg-earth-950 text-parchment-100 p-4 sm:p-5 flex items-center justify-between border-b-2 border-gold-600">
              <div className="flex items-center gap-3">
                <div className="bg-gold-500/20 p-2 rounded-xl border border-gold-500/40 text-gold-400">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight text-parchment-100">
                    Game Master
                  </h3>
                  <div className="text-[10px] uppercase tracking-widest text-gold-400 font-mono">
                    Civilization Guide
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(viewMode === "advisor" ? "chat" : "advisor")}
                  className="px-2.5 py-1 rounded-lg bg-earth-900 border border-gold-500/40 text-gold-300 text-[11px] font-serif font-bold hover:bg-gold-500 hover:text-earth-950 transition-colors"
                >
                  {viewMode === "advisor" ? "Chat Mode" : "Advisor"}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full text-parchment-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* View Mode: Advisor Panel */}
            {viewMode === "advisor" ? (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Your Journey Snapshot */}
                <div className="p-3.5 bg-parchment-200/90 rounded-2xl border border-parchment-300">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-earth-600 mb-2">
                    Your Journey Snapshot
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white rounded-xl border border-parchment-200">
                      <span className="text-[10px] text-earth-500 uppercase font-medium block">
                        Dominant Trait
                      </span>
                      <span className="font-serif font-bold text-earth-900 capitalize">
                        {strongest[0]} ({strongest[1]}%)
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-parchment-200">
                      <span className="text-[10px] text-earth-500 uppercase font-medium block">
                        Developing
                      </span>
                      <span className="font-serif font-bold text-earth-900 capitalize">
                        {developing[0]} ({developing[1]}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Current Objective */}
                <div className="p-4 bg-earth-900 text-parchment-100 rounded-2xl border border-gold-500/40 shadow-sm space-y-2">
                  <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold-400">
                    Primary Objective
                  </div>
                  <h4 className="font-serif font-bold text-lg text-parchment-100 leading-snug">
                    {currentGoal.title}
                  </h4>
                  <p className="text-xs text-parchment-300 leading-relaxed">
                    {currentGoal.desc}
                  </p>
                  <div className="pt-2">
                    <Link href={currentGoal.link}>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-earth-950 font-serif font-bold text-xs uppercase tracking-wider hover:brightness-110 flex items-center justify-center gap-1.5 shadow"
                      >
                        <span>{currentGoal.linkLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Recommended Challenge */}
                <div className="p-4 bg-white rounded-2xl border-2 border-parchment-300 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-terracotta-600">
                    <span>Recommended Challenge</span>
                    <span className="font-mono text-earth-600">{activeRec.difficulty}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-earth-900">
                    {activeRec.title}
                  </h4>
                  <div className="text-[10px] text-gold-700 font-semibold uppercase">
                    Focus: {activeRec.focus}
                  </div>
                  <p className="text-xs text-earth-700 leading-relaxed">
                    {activeRec.desc}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <Link href={activeRec.link} className="flex-1">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-2 bg-earth-900 text-parchment-100 rounded-xl font-serif font-bold text-[11px] uppercase tracking-wider hover:bg-earth-800"
                      >
                        Accept
                      </button>
                    </Link>
                    <button
                      onClick={() => setRecIndex((prev) => (prev + 1) % recommendations.length)}
                      className="px-3 py-2 bg-parchment-200 hover:bg-parchment-300 border border-parchment-300 rounded-xl font-serif font-bold text-[11px] text-earth-800"
                    >
                      Another
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* View Mode: Tactical Chat */
              <div className="flex-1 flex flex-col h-full bg-parchment-50">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm ${
                          msg.role === "user"
                            ? "bg-earth-900 text-parchment-100 rounded-br-none"
                            : "bg-parchment-200 border border-parchment-300 text-earth-900 rounded-bl-none font-medium"
                        }`}
                      >
                        <p>{msg.text}</p>
                        {msg.actionLink && (
                          <Link href={msg.actionLink}>
                            <button
                              onClick={() => setIsOpen(false)}
                              className="mt-2 text-[11px] font-bold text-gold-700 underline block"
                            >
                              Follow Objective →
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChat();
                  }}
                  className="p-3 bg-parchment-200 border-t border-parchment-300 flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask for hints or tactical recommendations..."
                    className="flex-1 bg-white border border-parchment-300 rounded-xl px-3 py-2 text-xs text-earth-900 focus:outline-none focus:border-gold-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-gold-500 text-earth-950 font-serif font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.6)] border-2 border-gold-400 text-earth-950 pointer-events-auto hover:scale-105 transition-all ${
          isOpen
            ? "bg-parchment-100 text-earth-900"
            : "bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_0_25px_rgba(212,175,55,0.7)]"
        }`}
        aria-label="Toggle Game Master"
      >
        {isOpen ? <X size={26} /> : <BrainCircuit size={28} className="text-earth-950" />}
      </button>
    </div>
  );
}
