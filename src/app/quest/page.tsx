"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import WorldHUD from "@/components/game/WorldHUD";
import { useGameStore } from "@/store/gameState";
import { CITIES_DATA } from "@/data/gameContent";
import { Compass, Book, Lock, Star, ChevronRight, X, PlayCircle, Trophy, CheckCircle2 } from "lucide-react";

export default function QuestJournalPage() {
  const router = useRouter();
  const { chapterProgress, isCityUnlocked, completedQuests } = useGameStore();
  const [selectedQuest, setSelectedQuest] = useState<{id:string, type:string, title:string, realm:string, description:string, status:string, progress:string, reward:string, route:string, chapters?:{id:string, title:string}[], heroImage:string} | null>(null);

  // Construct our Expeditions (Quests) from game data
  const quests = useMemo(() => {
    const list = [];

    // 1. Nalanda Special Quest
    const nalandaCompleted = completedQuests.includes("nalanda");
    list.push({
      id: "nalanda",
      type: "special",
      title: "The Lost Library of Nalanda",
      realm: "Magadha",
      description: "A temporal translation into the 7th Century CE to recover lost manuscripts and rebuild the Dharmaganja library.",
      status: nalandaCompleted ? "completed" : "active",
      progress: nalandaCompleted ? "100%" : "0%",
      reward: "Nalanda Scholar Badge, 450 XP",
      route: "/quest/nalanda",
      heroImage: "/destinations/pataliputra-hero.png" // fallback
    });

    // 2. City Mastery Expeditions
    CITIES_DATA.forEach(city => {
      const unlocked = isCityUnlocked(city.id);
      const chCount = city.chapters.length;
      if (chCount === 0) return; // Skip cities with no chapters

      let chCompleted = 0;
      city.chapters.forEach(ch => {
        const p = chapterProgress[ch.id];
        if (p?.completed) chCompleted++;
      });

      const isCompleted = chCompleted === chCount;
      const status = isCompleted ? "completed" : (unlocked ? "active" : "locked");
      const progressPct = Math.round((chCompleted / chCount) * 100);

      list.push({
        id: city.id,
        type: "realm",
        title: `Mastery of ${city.name}`,
        realm: city.region,
        description: `Explore the ruins and history of ${city.name}. Complete all ${chCount} chapters to master this realm.`,
        status: status,
        progress: `${progressPct}%`,
        reward: `${chCount * 100} XP Potential`,
        route: "/", // Returns to World map to select it
        chapters: city.chapters,
        heroImage: `/destinations/${city.id}-hero.png`
      });
    });

    return list;
  }, [chapterProgress, isCityUnlocked, completedQuests]);

  const activeQuests = quests.filter(q => q.status === "active");
  const completedQuestsList = quests.filter(q => q.status === "completed");
  const lockedQuests = quests.filter(q => q.status === "locked");

  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'locked'>('active');

  const getActiveList = () => {
    if (activeTab === 'active') return activeQuests;
    if (activeTab === 'completed') return completedQuestsList;
    return lockedQuests;
  };

  return (
    <div className="h-[100dvh] w-full bg-earth-950 flex flex-col font-sans relative selection:bg-[#b07d53]/30 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#1c140e] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-multiply pointer-events-none" />
      
      {/* Global Navigation */}
      <div className="relative z-50 shrink-0">
        <WorldHUD />
      </div>

      <main className="flex-1 flex flex-col w-full relative z-10 pt-20 overflow-hidden">
        
        {/* Header */}
        <header className="shrink-0 pt-8 pb-6 px-4 sm:px-8 border-b border-[#8c5b36]/20 bg-earth-900/50 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Compass className="w-5 h-5 text-[#8c5b36]" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#8c5b36] font-bold">
                  Active Journey
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#f4e7dc] uppercase tracking-[0.1em] font-bold">
                Heritage Expedition
              </h1>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4 sm:gap-8">
              <div className="text-center sm:text-right">
                <div className="font-mono text-2xl text-[#f4e7dc] font-bold">{activeQuests.length}</div>
                <div className="text-[9px] uppercase tracking-widest text-[#8c5b36] font-bold">Active</div>
              </div>
              <div className="w-px bg-[#8c5b36]/30" />
              <div className="text-center sm:text-right">
                <div className="font-mono text-2xl text-[#f4e7dc] font-bold">{completedQuestsList.length}</div>
                <div className="text-[9px] uppercase tracking-widest text-[#8c5b36] font-bold">Completed</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col relative w-full max-w-6xl mx-auto">
          
          {/* Tabs */}
          <div className="shrink-0 flex items-center gap-6 px-4 sm:px-8 pt-6 pb-2 overflow-x-auto no-scrollbar">
            {(['active', 'completed', 'locked'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-serif text-xs sm:text-sm uppercase tracking-widest transition-colors relative whitespace-nowrap font-bold ${
                  activeTab === tab ? 'text-[#f4e7dc]' : 'text-[#8c5b36] hover:text-[#d6c4a4]'
                }`}
              >
                {tab} Expeditions
                {activeTab === tab && (
                  <motion.div layoutId="questTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8c5b36]" />
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-12">
              <AnimatePresence mode="popLayout">
                {getActiveList().length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="col-span-full py-12 flex flex-col items-center justify-center text-center opacity-50"
                  >
                    <Book className="w-12 h-12 text-[#8c5b36] mb-4" />
                    <p className="font-serif italic text-lg text-[#f4e7dc]">No expeditions found in this archive.</p>
                  </motion.div>
                ) : (
                  getActiveList().map((quest, idx) => (
                    <motion.div
                      layout
                      key={quest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedQuest(quest)}
                      className={`group cursor-pointer rounded-xl border p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden min-h-[160px] ${
                        quest.status === 'active' 
                          ? 'border-[#8c5b36]/40 bg-earth-900/60 hover:bg-earth-900/90 hover:border-[#8c5b36]' 
                          : quest.status === 'completed'
                          ? 'border-emerald-900/50 bg-emerald-950/20 hover:border-emerald-800'
                          : 'border-white/5 bg-white/[0.02] grayscale opacity-70 hover:opacity-100'
                      }`}
                    >
                      {/* Background image tint */}
                      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity pointer-events-none bg-cover bg-center mask-image-gradient" style={{ backgroundImage: `url(${quest.heroImage})`, WebkitMaskImage: 'linear-gradient(to left, black, transparent)' }} />

                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          {quest.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          {quest.status === 'locked' && <Lock className="w-4 h-4 text-[#8c5b36]/50" />}
                          {quest.status === 'active' && <Star className="w-4 h-4 text-[#8c5b36]" />}
                          <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-[#8c5b36]">
                            {quest.type === 'special' ? 'Special Expedition' : `Realm: ${quest.realm}`}
                          </span>
                        </div>
                        <h3 className={`font-serif text-lg sm:text-xl font-bold tracking-wider mb-2 line-clamp-1 ${quest.status === 'locked' ? 'text-[#d6c4a4]/50' : 'text-[#f4e7dc]'}`}>
                          {quest.title}
                        </h3>
                        <p className="text-xs text-[#d6c4a4]/70 line-clamp-2 leading-relaxed">
                          {quest.description}
                        </p>
                      </div>

                      <div className="relative z-10 mt-6 flex items-end justify-between">
                        <div className="flex flex-col gap-1.5 w-1/2">
                          <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-[#8c5b36]">
                            <span>Progress</span>
                            <span>{quest.progress}</span>
                          </div>
                          <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                            <div className={`h-full ${quest.status === 'completed' ? 'bg-emerald-500' : 'bg-[#8c5b36]'}`} style={{ width: quest.progress }} />
                          </div>
                        </div>
                        
                        <div className="w-8 h-8 rounded-full border border-[#8c5b36]/30 flex items-center justify-center group-hover:bg-[#8c5b36]/20 transition-colors">
                          <ChevronRight className="w-4 h-4 text-[#8c5b36]" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Quest Detail Modal */}
      <AnimatePresence>
        {selectedQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedQuest(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-earth-900 border border-[#8c5b36]/40 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header Image */}
              <div className="h-40 sm:h-52 w-full relative shrink-0 border-b border-[#8c5b36]/30">
                <img src={selectedQuest.heroImage} alt={selectedQuest.title} className="w-full h-full object-cover opacity-60" onError={e => e.currentTarget.src = '/passport-bg.png'} />
                <div className="absolute inset-0 bg-gradient-to-t from-earth-900 to-transparent" />
                <button onClick={() => setSelectedQuest(null)} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 font-bold bg-black/40 px-2 py-1 rounded backdrop-blur-md">
                    {selectedQuest.type === 'special' ? 'Special Encounter' : 'Realm Exploration'}
                  </span>
                </div>
              </div>

              {/* Details Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
                <h2 className="font-serif text-2xl sm:text-3xl text-parchment-100 font-bold tracking-wide uppercase mb-4">
                  {selectedQuest.title}
                </h2>
                <p className="text-sm sm:text-base text-parchment-300/80 leading-relaxed font-serif mb-8">
                  {selectedQuest.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-earth-950/50 rounded-lg border border-gold-500/10">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gold-500/70 mb-1">Status</div>
                    <div className="font-bold text-parchment-200 capitalize">{selectedQuest.status}</div>
                  </div>
                  <div className="p-4 bg-earth-950/50 rounded-lg border border-gold-500/10">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gold-500/70 mb-1">Rewards</div>
                    <div className="font-bold text-parchment-200 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-gold-400" />
                      {selectedQuest.reward}
                    </div>
                  </div>
                </div>

                {selectedQuest.type === 'realm' && selectedQuest.chapters && (
                  <div className="space-y-3">
                    <h4 className="font-serif text-gold-400 uppercase tracking-widest text-xs font-bold mb-4">Expedition Objectives</h4>
                    {selectedQuest.chapters.map(ch => {
                      const p = chapterProgress[ch.id];
                      const completed = p?.completed;
                      return (
                        <div key={ch.id} className="flex items-start gap-3 p-3 rounded bg-earth-800/30 border border-white/5">
                          {completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-gold-500/40 shrink-0 mt-0.5 flex items-center justify-center">
                              {selectedQuest.status === 'locked' && <Lock className="w-2.5 h-2.5 text-gold-500/30" />}
                            </div>
                          )}
                          <div>
                            <div className={`text-sm font-bold ${completed ? 'text-parchment-200' : 'text-parchment-400'}`}>{ch.title}</div>
                            <div className="text-[10px] uppercase font-mono tracking-wider text-gold-500/60 mt-1">
                              {completed ? `${p?.stars || 0} Stars Earned` : 'Undiscovered'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer Action */}
              <div className="shrink-0 p-4 sm:p-6 border-t border-[#8c5b36]/30 bg-earth-950 flex justify-end">
                {selectedQuest.status === 'locked' ? (
                  <div className="px-6 py-3 flex items-center gap-2 text-gold-500/50 text-xs font-mono uppercase tracking-widest font-bold">
                    <Lock className="w-4 h-4" /> Visa Required
                  </div>
                ) : (
                  <button 
                    onClick={() => router.push(selectedQuest.route)}
                    className="px-6 py-3 bg-[#8c5b36] hover:bg-[#a66c42] text-white text-xs font-mono uppercase tracking-widest font-bold rounded flex items-center gap-2 transition-colors shadow-lg"
                  >
                    {selectedQuest.status === 'completed' ? 'Revisit Expedition' : 'Continue Expedition'}
                    <PlayCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
