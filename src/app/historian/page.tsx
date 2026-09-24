"use client";

import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/Button";
import { BrainCircuit, Send, ShieldCheck, BookMarked, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Message = {
  role: "user" | "ai";
  content: string;
  sources?: { title: string; type: string }[];
};

export default function AIHistorian() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Namaste, Scholar. I am the AI Historian—your verified knowledge companion. While the Game Master guides your gameplay and challenges, I provide source-grounded historical context, epigraphic records, and architectural analysis for the civilizations you uncover.",
      sources: [
        { title: "Archaeological Survey of India (ASI) Gazetteers", type: "Official Epigraphic Archive" }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: query }]);
    setIsTyping(true);

    // Contextual Grounded Responses
    setTimeout(() => {
      let aiResponse: Message;
      const lower = query.toLowerCase();

      if (lower.includes("nalanda") || lower.includes("university") || lower.includes("dharama")) {
        aiResponse = {
          role: "ai",
          content: "Nalanda Mahavihara flourished in ancient Magadha (modern Bihar) from approximately 427 to 1197 CE. Founded under Gupta patronage and supported by Emperor Harsha and the Pala kings, it served 10,000 students under 2,000 preceptors. Its monumental nine-storey library complex, Dharmaganja, housed three primary buildings: Ratnasagara, Ratnodadhi, and Ratnaranjaka. Admissions were strictly guarded by the 'Dwarapalas' (scholar gatekeepers) who examined applicants at the gate.",
          sources: [
            { title: "Si-Yu-Ki: Buddhist Records of the Western World by Xuanzang (646 CE)", type: "Primary Travel Chronicle" },
            { title: "Nalanda and Its Epigraphic Records - H. Sastri (ASI Memoir 66)", type: "Archaeological Survey of India" }
          ]
        };
      } else if (lower.includes("manuscript") || lower.includes("palm") || lower.includes("tala")) {
        aiResponse = {
          role: "ai",
          content: "Ancient Indian scholarship was preserved predominantly on Tala-patra (dried Palmyra palm leaves) and Bhurja-patra (Himalayan birch bark). Scribes etched characters into the cured leaf fibers using a pointed iron stylus (Kanta), rubbing charcoal or lamp soot mixed with neem or cedar oils into the incisions to prevent insect decay. Twin holes allowed silk or hemp cords to bind hundreds of leaves between carved wooden boards.",
          sources: [
            { title: "Manuscriptology and Palaeography of India - K. V. Sarma", type: "Historical Analysis" },
            { title: "National Mission for Manuscripts (NMM) Conservator Guide", type: "Government Cultural Registry" }
          ]
        };
      } else if (lower.includes("ashtapada") || lower.includes("chess") || lower.includes("game")) {
        aiResponse = {
          role: "ai",
          content: "Ashtapada ('having eight feet') is an ancient Indian board game played on an uncheckered 8x8 grid. Mentioned in the Brahmajāla Sutta (5th c. BCE) and Patanjali's Mahabhasya, it was played with cowrie shells and race pieces circling in a spiral toward the center sanctuary. Cross-cut squares served as safe havens. It was the direct structural progenitor of Chaturanga (four-division army game), which later evolved into modern chess.",
          sources: [
            { title: "A History of Chess - H. J. R. Murray (Oxford)", type: "Academic Monograph" },
            { title: "Patanjali's Mahābhāṣya (2nd Century BCE)", type: "Classical Sanskrit Reference" }
          ]
        };
      } else if (lower.includes("fibonacci") || lower.includes("pingala") || lower.includes("meter") || lower.includes("hemachandra")) {
        aiResponse = {
          role: "ai",
          content: "The sequence 1, 2, 3, 5, 8, 13... was formulated by Indian scholars analyzing poetic meters (Chandas). Pingala's Chandaḥśāstra (3rd c. BCE) outlined the binary combinatorics of short (Laghu, 1 beat) and long (Guru, 2 beats) syllables. Later scholars Virahanka (c. 600 CE), Gopala (c. 1135 CE), and Hemachandra (c. 1150 CE) explicitly described the additive recurrence relation centuries before Fibonacci introduced it to Europe.",
          sources: [
            { title: "The So-called Fibonacci Numbers in Ancient and Medieval India - Parmanand Singh", type: "Historia Mathematica" },
            { title: "Pingala's Chandaḥśāstra", type: "Primary Sanskrit Metric Treatise" }
          ]
        };
      } else {
        aiResponse = {
          role: "ai",
          content: "A profound inquiry into India's civilizational heritage. Indian intellectual history spans six orthodox systems of philosophy (Shad-darshana), extensive marine trade networks along the Uttarapatha and Dakshinapatha, and monumental stone architectural traditions. In this prototype, our responses are grounded directly in vetted ASI records and classical primary texts.",
          sources: [
            { title: "A Cultural History of India - A. L. Basham", type: "Reference Text" },
            { title: "Archaeological Survey of India Research Publications", type: "Official Archive" }
          ]
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const sampleQuestions = [
    "Tell me about the Nalanda library complex.",
    "How were palm-leaf manuscripts made?",
    "What is the history of Ashtapada?",
    "How did Indian metricians discover the Fibonacci sequence?"
  ];

  return (
    <div className="min-h-screen bg-parchment-200 flex flex-col selection:bg-gold-500/30">
      <Navigation />

      {/* Role Distinction Banner */}
      <div className="bg-earth-900 border-b border-gold-500/30 px-4 py-2.5 text-parchment-200">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span className="font-serif font-bold text-parchment-100">HISTORIAN VS GAME MASTER:</span>
            <span>The Historian explains &ldquo;What did I discover?&rdquo;, grounded in verified historical records.</span>
          </div>
          <Link href="/" className="text-gold-400 hover:text-gold-300 underline font-serif font-bold">
            To manage quests & tactics, use the Game Master →
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col h-[calc(100vh-106px)]">
        {/* Header Box */}
        <div className="bg-parchment-100 p-5 rounded-t-3xl border-x-2 border-t-2 border-parchment-300 shadow-sm flex items-center justify-between z-10">
          <div className="flex items-center gap-3.5">
            <div className="bg-gold-500/20 p-2.5 rounded-2xl border border-gold-500/40 text-gold-700">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-earth-900">
                AI Historian & Knowledge Archive
              </h1>
              <p className="text-xs text-earth-600 flex items-center gap-1.5 font-medium mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-700" /> Strictly grounded in verified primary and archaeological sources
              </p>
            </div>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 bg-white border-x-2 border-parchment-300 overflow-y-auto p-4 sm:p-6 space-y-6 shadow-inner">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3.5 max-w-[90%] sm:max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-sm shadow-md ${
                    msg.role === "user"
                      ? "bg-earth-900 text-parchment-100"
                      : "bg-gradient-to-br from-gold-400 to-gold-600 text-earth-950 font-bold"
                  }`}
                >
                  {msg.role === "user" ? <User size={18} /> : <BrainCircuit size={20} />}
                </div>

                <div className={`space-y-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-earth-900 text-parchment-100 rounded-tr-none shadow-md font-sans"
                        : "bg-parchment-100 text-earth-900 border border-parchment-300 rounded-tl-none shadow-sm font-medium"
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>

                  {msg.sources && (
                    <div className="bg-amber-500/10 border border-gold-500/30 p-3 rounded-xl text-xs space-y-1.5 max-w-lg">
                      <div className="text-[10px] font-bold text-gold-800 uppercase tracking-widest flex items-center gap-1.5">
                        <BookMarked className="w-3.5 h-3.5 text-gold-700" /> Historical Source Citation
                      </div>
                      {msg.sources.map((src, i) => (
                        <div key={i} className="text-earth-900 bg-white/80 p-2 rounded-lg border border-parchment-200">
                          <span className="font-serif font-bold text-xs block">{src.title}</span>
                          <span className="text-[10px] text-earth-600 uppercase font-mono">{src.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[80%]">
                <div className="shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-earth-950 flex items-center justify-center font-bold">
                  <BrainCircuit size={20} />
                </div>
                <div className="bg-parchment-100 border border-parchment-300 p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gold-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-gold-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-gold-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </AnimatePresence>
        </div>

        {/* Sample Prompts & Input Area */}
        <div className="bg-parchment-100 p-4 rounded-b-3xl border-x-2 border-b-2 border-t border-parchment-300 shadow-sm space-y-3 z-10">
          {/* Quick Query Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 shrink-0">
              Inquire:
            </span>
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap bg-white hover:bg-gold-50 border border-parchment-300 hover:border-gold-500 px-3 py-1 rounded-full text-earth-800 text-[11px] font-medium transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about verified Nalanda sources, ancient manuscripts, or historical dates..."
              className="flex-1 bg-white border border-parchment-300 rounded-2xl px-4 py-3 text-xs sm:text-sm text-earth-900 focus:outline-none focus:border-gold-500 shadow-inner"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isTyping}
              size="md"
              className="rounded-2xl px-6 bg-gold-500 text-earth-950 hover:bg-gold-600 font-serif font-bold uppercase tracking-wider text-xs"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
