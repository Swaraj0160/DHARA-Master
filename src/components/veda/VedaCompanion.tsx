"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVedaStore } from "@/store/vedaStore";
import { useGameStore } from "@/store/gameState";
import { useMounted } from "@/hooks/useMounted";
import { REALM_ENTRANCE_DIALOGUES, DAILY_AI_LIMIT } from "@/data/vedaDialogues";
import { X, Send, Sparkles, Crown, Lock } from "lucide-react";
import Image from "next/image";
import VoicePill from "./VoicePill";

// Map logical emotions to user's PNG files in public/veda/
const EMOTION_FILE_MAP: Record<string, string> = {
  neutral: "Hello.png",
  hello: "Hello.png",
  namaste: "Namaste.png",
  happy: "Happy.png",
  thinking: "Thinking.png",
  curious: "Curious.png",
  excited: "Excited.png",
  guiding: "Pointing.png",
  pointing: "Pointing.png",
  idea: "Idea.png",
  celebrating: "Celebrating.png",
  cheering: "Cheering.png",
  proud: "Proud.png",
  victorysmile: "VictorySmile.png",
  confused: "Confused.png",
  bye: "Bye.png",
  lowbattery: "LowBattery.png",
  meditating: "Meditating.png",
  skeptical: "Skeptical.png",
};

function resolveVedaImage(emotion: string): string {
  const key = (emotion || "").toLowerCase().trim();
  if (EMOTION_FILE_MAP[key]) {
    return `/veda/${EMOTION_FILE_MAP[key]}`;
  }
  const capitalized = emotion.charAt(0).toUpperCase() + emotion.slice(1);
  return `/veda/${capitalized}.png`;
}

export default function VedaCompanion() {
  const mounted = useMounted();
  const {
    isOpen,
    currentEmotion,
    messages,
    isTyping,
    isPuzzleActive,
    toggleOpen,
    closeVeda,
    triggerQuickPrompt,
    sendPlayerMessage,
    popWithDialogue,
    getRemainingDailyAiQueries,
  } = useVedaStore();

  const { currentCityId, currentChapterId, hasSeenIntro } = useGameStore();
  const [inputText, setInputText] = useState("");
  const [imageSrc, setImageSrc] = useState<string>("/veda/Hello.png");
  const prevCityRef = useRef<string | null>(null);
  const companionRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLDivElement>(null);

  // Click outside to dismiss Veda
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        companionRef.current &&
        !companionRef.current.contains(target) &&
        launcherRef.current &&
        !launcherRef.current.contains(target)
      ) {
        closeVeda();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, closeVeda]);

  // Update image source whenever emotion changes
  useEffect(() => {
    // eslint-disable-next-line
    setImageSrc(resolveVedaImage(currentEmotion));
  }, [currentEmotion]);

  // Proactive guide trigger on entering a new realm (0 AI Tokens - Prewritten)
  useEffect(() => {
    if (!mounted) return;

    if (currentCityId && currentCityId !== prevCityRef.current) {
      prevCityRef.current = currentCityId;
      const entrance = REALM_ENTRANCE_DIALOGUES[currentCityId] || {
        text: `Welcome to the realm of ${currentCityId}! Examine the sacred monuments and architectural wonders. I am by your side!`,
        emotion: "Excited",
      };
      popWithDialogue(entrance.text, entrance.emotion);
    }
  }, [currentCityId, mounted, popWithDialogue]);

  // Find the latest message to display in the speech cloud
  const latestMessage = useMemo(() => {
    if (messages.length === 0) return null;
    return messages[messages.length - 1];
  }, [messages]);

  const remainingAiQueries = mounted ? getRemainingDailyAiQueries() : DAILY_AI_LIMIT;
  const isLimitReached = remainingAiQueries <= 0;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    if (isPuzzleActive) return; // Hard guard

    const text = inputText;
    setInputText("");
    sendPlayerMessage(text, { cityId: currentCityId, chapterId: currentChapterId });
  };

  // Never let VEDA appear over the cinematic opening — it belongs to the
  // game, not the pre-"ENTER DHARA" title sequence.
  if (!mounted || !hasSeenIntro) return null;

  return (
    <>
      {/* ─── CORNER ICON: JUST NEUTRAL SVG IN THE CORNER ─── */}
      <div ref={launcherRef} className="fixed bottom-6 left-6 z-40">
        <motion.button
          onClick={toggleOpen}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-14 h-14 rounded-full border-2 border-gold-400/80 bg-earth-950/95 p-1.5 shadow-xl hover:shadow-xl backdrop-blur-md transition-all cursor-pointer flex items-center justify-center group"
          title="VEDA - Heritage Guide"
          aria-label="Toggle Veda Guide"
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src="/veda/neutral.svg"
              alt="Veda Icon"
              fill
              sizes="56px"
              className="object-contain"
              priority
            />
          </div>

          {/* Active subtle status dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-earth-950 shadow-[0_0_8px_#34d399]" />
        </motion.button>
      </div>

      {/* ─── VEDA POPS: PNG CHARACTER + SPEECH CLOUD IN FRONT OF MOUTH ─── */}
      <AnimatePresence>
        {isOpen && (
          <div ref={companionRef} className="fixed bottom-22 left-6 z-50 flex flex-col sm:flex-row items-start sm:items-end gap-3 pointer-events-none select-none max-w-[95vw]">
            {/* Character PNG (Floating with gentle bob animation) */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="relative w-44 sm:w-56 h-48 sm:h-60 shrink-0 pointer-events-auto"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                className="relative w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
              >
                <Image
                  src={imageSrc}
                  alt="Veda Character"
                  fill
                  sizes="(max-width: 640px) 176px, 224px"
                  className="object-contain object-bottom"
                  onError={() => setImageSrc("/veda/neutral.svg")}
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Speech Cloud in Front of Veda's Mouth */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative pointer-events-auto max-w-[340px] sm:max-w-md -mt-4 sm:mb-8"
            >
              {/* Cloud Speech Bubble Tail (Puffy speech bubbles pointing to mouth) */}
              <div className="hidden sm:block absolute -left-3.5 bottom-8 z-10">
                <div className="w-3.5 h-3.5 rounded-full bg-[#fffef9] border border-gold-400/60 shadow-sm" />
                <div className="w-2 h-2 rounded-full bg-[#fffef9] border border-gold-400/50 -ml-1 mt-1" />
              </div>

              {/* Main Cloud Body */}
              <div className="relative bg-gradient-to-b from-[#ffffff] via-[#fffdf7] to-[#faf3e3] text-earth-950 p-4 sm:p-5 rounded-[28px] border-2 border-gold-400/70 shadow-[0_12px_35px_rgba(0,0,0,0.4)] backdrop-blur-md">
                {/* Cloud Header: Name Badge & Status Pill */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200/60">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-xs uppercase tracking-wider text-earth-900 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-gold-600 fill-gold-500" />
                      VEDA
                    </span>
                    <span className="text-[10px] font-serif italic text-amber-800/80">
                      • Guide of Bharat
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isPuzzleActive ? (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-400 flex items-center gap-1 font-bold">
                        <Lock className="w-2.5 h-2.5" />
                        Trial Active
                      </span>
                    ) : isLimitReached ? (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        Limit Reached
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        {remainingAiQueries} AI queries left
                      </span>
                    )}
                    <button
                      onClick={closeVeda}
                      className="p-1 rounded-full text-stone-500 hover:text-earth-950 hover:bg-amber-200/50 transition-colors cursor-pointer"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Cloud Dialogue Text */}
                <div className="text-xs sm:text-sm font-serif leading-relaxed text-earth-900 min-h-[44px]">
                  {isTyping ? (
                    <div className="flex items-center gap-1.5 py-2">
                      <span className="text-xs font-sans text-amber-800 italic">Veda is searching the ancient annals...</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-600 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-600 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-600 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <p>{latestMessage?.text || "I am by your side, seeker. Explore with an open mind!"}</p>
                  )}
                </div>

                {/* Quick Context Prompt Chips (0 AI Tokens - Prewritten) */}
                {isPuzzleActive ? (
                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-amber-200/60 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => triggerQuickPrompt("need_a_hint")}
                      className="px-2.5 py-1 rounded-full bg-amber-200/90 hover:bg-amber-300 text-earth-950 border border-amber-400 text-[10px] font-sans font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1"
                    >
                      ✦ Request Hint
                    </button>
                    <button
                      onClick={() => triggerQuickPrompt("who_are_you")}
                      className="px-2.5 py-1 rounded-full bg-amber-100/90 hover:bg-amber-200 text-earth-900 border border-amber-300/80 text-[10px] font-sans font-medium whitespace-nowrap transition-colors cursor-pointer"
                    >
                      ✦ Who are you?
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-amber-200/60 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => triggerQuickPrompt("who_are_you")}
                      className="px-2.5 py-1 rounded-full bg-amber-100/90 hover:bg-amber-200 text-earth-900 border border-amber-300/80 text-[10px] font-sans font-medium whitespace-nowrap transition-colors cursor-pointer"
                    >
                      ✦ Who are you?
                    </button>
                    <button
                      onClick={() => triggerQuickPrompt("tell_me_lore", currentCityId)}
                      className="px-2.5 py-1 rounded-full bg-amber-100/90 hover:bg-amber-200 text-earth-900 border border-amber-300/80 text-[10px] font-sans font-medium whitespace-nowrap transition-colors cursor-pointer"
                    >
                      ✦ Tell me lore
                    </button>
                    <button
                      onClick={() => triggerQuickPrompt("need_a_hint")}
                      className="px-2.5 py-1 rounded-full bg-amber-100/90 hover:bg-amber-200 text-earth-900 border border-amber-300/80 text-[10px] font-sans font-medium whitespace-nowrap transition-colors cursor-pointer"
                    >
                      ✦ Need a clue
                    </button>
                    <button
                      onClick={() => triggerQuickPrompt("how_to_earn_stars")}
                      className="px-2.5 py-1 rounded-full bg-amber-100/90 hover:bg-amber-200 text-earth-900 border border-amber-300/80 text-[10px] font-sans font-medium whitespace-nowrap transition-colors cursor-pointer"
                    >
                      ✦ Stars guide
                    </button>
                  </div>
                )}

                {/* Bottom Input Area: Locked during puzzles, or when daily limit reached */}
                {isPuzzleActive ? (
                  <div className="mt-2.5 p-2 rounded-xl bg-amber-100/95 border border-amber-300 text-amber-950 flex items-center justify-between text-[11px] font-sans shadow-sm">
                    <span className="flex items-center gap-1.5 font-bold text-amber-900">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      Trial in Progress • AI Chat Locked
                    </span>
                    <span className="text-[10px] font-mono text-amber-800 italic">
                      Declare answer to unlock
                    </span>
                  </div>
                ) : isLimitReached ? (
                  <div className="mt-2.5 p-2 rounded-xl bg-amber-100/90 border border-amber-300/90 flex items-center justify-between text-[11px] text-amber-950 font-sans">
                    <span className="flex items-center gap-1 font-medium">
                      <Crown className="w-3.5 h-3.5 text-amber-700" />
                      Daily AI limit reached
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                      Resets tomorrow
                    </span>
                  </div>
                ) : (
                  <form
                    id="veda-chat-form"
                    onSubmit={handleSendMessage}
                    className="mt-2.5 flex items-center gap-1.5 bg-amber-50/80 rounded-xl px-2.5 py-1.5 border border-amber-200"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`Ask Veda anything... (${remainingAiQueries} free left)`}
                      className="flex-1 bg-transparent text-xs text-earth-950 placeholder:text-stone-400 focus:outline-none font-sans"
                    />
                    <VoicePill 
                      onTranscript={(text) => setInputText(text)}
                      onFinal={(text) => {
                        setInputText(text);
                        setTimeout(() => {
                          const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
                          document.getElementById('veda-chat-form')?.dispatchEvent(submitEvent);
                        }, 50);
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="p-1 rounded-lg bg-gold-500 hover:bg-gold-600 disabled:opacity-30 text-earth-950 transition-all cursor-pointer"
                      title="Send question to Veda"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

