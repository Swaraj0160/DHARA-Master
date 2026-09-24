import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CITIES_DATA, XP_CONFIG, calculateLevel, calculateChapterStars } from '@/data/gameContent';

export interface PlayerProfile {
  name: string;
  title: string;
  level: number;
  xp: number;
  nextLevelXP: number;
}

export interface ChapterProgress {
  status: 'locked' | 'unlocked' | 'completed';
  completed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  stars: number; // 0..3 (authoritative best achieved)
  xpEarned: number;
  solvedPuzzleIds: string[];
}

// Legacy types preserved to ensure full compatibility with auxiliary pages
export type NodeType = 'monument' | 'knowledge' | 'craft' | 'trade' | 'music' | 'science' | 'arts';

export interface Element {
  id: string;
  name: string;
  type: NodeType;
  lat: number;
  lng: number;
  region: string;
  era: string;
  description: string;
  historicalContext: string;
  dnaInfluence: { trait: string; value: number }[];
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  name: string;
  synergyId?: string;
  synergyTitle?: string;
}

export type ItemRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  category: NodeType;
  rarity: ItemRarity;
  era: string;
  source: string;
  description: string;
  historicalContext: string;
  tags: string[];
  placeable: boolean;
  isPlaced: boolean;
  targetSlotId?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  earnedAt: string;
}

export interface Synergy {
  id: string;
  title: string;
  description: string;
  nodeA: string;
  nodeB: string;
  bonusDNA: { trait: keyof HeritageDNA; value: number }[];
  bonusXP: number;
}

export interface HeritageDNA {
  architecture: number;
  strategy: number;
  history: number;
  geography: number;
  arts: number;
  mathematics: number;
}

export interface WorldSlot {
  id: string;
  name: string;
  region: string;
  era: string;
  lat: number;
  lng: number;
  status: 'unlocked' | 'available' | 'locked';
  accepts: NodeType;
  historicalContext: string;
  recommendedQuest?: string;
}

export const WORLD_SLOTS: WorldSlot[] = [
  {
    id: 'magadha',
    name: 'Nalanda Mahavihara',
    region: 'Magadha (Bihar)',
    era: '5th - 12th Century CE',
    lat: 25.1333,
    lng: 85.4419,
    status: 'unlocked',
    accepts: 'monument',
    historicalContext: 'Ancient world-renowned Buddhist monastic university.'
  }
];

export interface DharaState {
  hasSeenIntro: boolean;
  setHasSeenIntro: (val: boolean) => void;

  player: PlayerProfile;
  chapterProgress: Record<string, ChapterProgress>;
  currentCityId: string | null;
  currentChapterId: string | null;
  enteringCityId: string | null;

  levelUpNotification: { oldLevel: number; newLevel: number; title: string } | null;
  dismissLevelUp: () => void;

  // Authoritative Getters
  getTotalStars: () => number;
  isCityUnlocked: (cityId: string) => boolean;
  isCityPassportUnlocked: (cityId: string) => boolean;
  getUnlockedPassportsCount: () => number;
  getChapterState: (chapterId: string) => ChapterProgress;

  // Primary Game Actions
  startEnterRealm: (cityId: string) => void;
  confirmEnterRealm: () => void;
  cancelEnterRealm: () => void;
  enterCity: (cityId: string | null) => void;
  enterChapter: (chapterId: string | null) => void;
  submitPuzzleAnswer: (chapterId: string, puzzleId: string, isCorrect: boolean) => { xpAwarded: number };
  completeChapter: (
    cityId: string,
    chapterId: string,
    correct: number,
    total: number
  ) => {
    starsAwarded: number;
    newStarsEarned: number;
    nextChapterUnlocked: string | null;
    newLevel: number;
    leveledUp: boolean;
  };
  addXP: (amount: number) => { leveledUp: boolean; newLevel: number };
  resetProgress: () => void;

  // Legacy stubs for existing components
  inventory: InventoryItem[];
  badges: Badge[];
  heritageDNA: HeritageDNA;
  placedNodes: Element[];
  connections: Connection[];
  discoveredSynergies: Synergy[];
  completedQuests: string[];
  activeQuest: string | null;
  questProgress: Record<string, number>;
  unlockedLocations: string[];
  unlockedEras: string[];
  unlockedGames: string[];
  flyToTarget: [number, number] | null;
  setFlyToTarget: (target: [number, number] | null) => void;
  bannerMessage: string | null;
  setBannerMessage: (msg: string | null) => void;
  completeQuest: (questId: string, rewards: { xp: number; dnaDeltas?: Partial<HeritageDNA>; badge?: Badge; item?: InventoryItem }) => void;
  addToInventory: (item: InventoryItem) => void;
  markPlaced: (id: string) => void;
  placeNode: (node: Element) => boolean;
  addConnection: (fromId: string, toId: string) => { success: boolean; message: string; synergy?: Synergy };
  updateDNA: (trait: keyof HeritageDNA, delta: number) => void;
  choices: Record<string, string>;
  recordChoice: (choiceKey: string, choiceValue: string) => void;
}

const PLAYER_TITLES: Record<number, string> = {
  0: 'Seeker of Bharat',
  1: 'Initiate of Vidya',
  2: 'Disciple of the Sages',
  3: 'Chronicler of Realms',
  4: 'Guardian of Traditions',
  5: 'Grand Acharya',
  6: 'Venerable Polymath',
  7: 'Master of Epics',
  8: 'Custodian of Civilization',
  9: 'Architect of Dhara',
  10: 'Eternal Sage',
};

function getPlayerTitle(level: number): string {
  if (level in PLAYER_TITLES) return PLAYER_TITLES[level];
  return `Grand Acharya Tier ${level - 4}`;
}

// Initial state builder
function getInitialChapterProgress(): Record<string, ChapterProgress> {
  const progress: Record<string, ChapterProgress> = {};
  
  CITIES_DATA.forEach((city) => {
    city.chapters.forEach((chapter, index) => {
      // First chapter of the first city (Pataliputra) is unlocked from the start
      const isInitialUnlocked = city.id === 'pataliputra' && index === 0;
      progress[chapter.id] = {
        status: isInitialUnlocked ? 'unlocked' : 'locked',
        completed: false,
        correctAnswers: 0,
        totalQuestions: chapter.puzzles.length,
        stars: 0,
        xpEarned: 0,
        solvedPuzzleIds: [],
      };
    });
  });

  return progress;
}

export const useGameStore = create<DharaState>()(
  persist(
    (set, get) => ({
      hasSeenIntro: false,
      setHasSeenIntro: (val) => set({ hasSeenIntro: val }),

      player: {
        name: 'Explorer',
        title: 'Seeker of Bharat',
        level: 0,
        xp: 0,
        nextLevelXP: 1000,
      },

      chapterProgress: getInitialChapterProgress(),
      currentCityId: null,
      currentChapterId: null,
      enteringCityId: null,
      levelUpNotification: null,

      dismissLevelUp: () => set({ levelUpNotification: null }),

      // Authoritative computation of Total Global Stars
      getTotalStars: () => {
        const { chapterProgress } = get();
        return Object.values(chapterProgress).reduce((acc, curr) => {
          return acc + (curr.completed ? curr.stars : 0);
        }, 0);
      },

      // Authoritative city unlock threshold check
      isCityUnlocked: (cityId: string) => {
        const city = CITIES_DATA.find((c) => c.id === cityId);
        if (!city) return false;
        const totalStars = get().getTotalStars();
        return totalStars >= city.requiredStars;
      },

      // A city's permanent passport is granted when all chapters are completed with 3 stars (all stars of realm gained)
      isCityPassportUnlocked: (cityId: string) => {
        const { chapterProgress } = get();
        const city = CITIES_DATA.find((c) => c.id === cityId);
        if (!city) return false;
        return city.chapters.every(
          (ch) => chapterProgress[ch.id]?.completed && chapterProgress[ch.id]?.stars === 3
        );
      },

      getUnlockedPassportsCount: () => {
        const { isCityPassportUnlocked } = get();
        return CITIES_DATA.filter((c) => isCityPassportUnlocked(c.id)).length;
      },

      getChapterState: (chapterId: string) => {
        const { chapterProgress, isCityUnlocked } = get();
        const existing = chapterProgress[chapterId];

        // Rule: When a realm is unlocked, its first chapter MUST also be unlocked
        const city = CITIES_DATA.find((c) => c.chapters.some((ch) => ch.id === chapterId));
        const isFirstChapter = city?.chapters[0]?.id === chapterId;

        if (city && isCityUnlocked(city.id) && isFirstChapter) {
          if (!existing || existing.status === 'locked') {
            return {
              status: existing?.completed ? 'completed' : 'unlocked',
              completed: existing?.completed || false,
              correctAnswers: existing?.correctAnswers || 0,
              totalQuestions: city.chapters[0].puzzles.length,
              stars: existing?.stars || 0,
              xpEarned: existing?.xpEarned || 0,
              solvedPuzzleIds: existing?.solvedPuzzleIds || [],
            };
          }
        }

        return (
          existing || {
            status: 'locked',
            completed: false,
            correctAnswers: 0,
            totalQuestions: 0,
            stars: 0,
            xpEarned: 0,
            solvedPuzzleIds: [],
          }
        );
      },

      startEnterRealm: (cityId) => set({ enteringCityId: cityId }),

      confirmEnterRealm: () => {
        const { enteringCityId, enterCity } = get();
        if (enteringCityId) {
          enterCity(enteringCityId);
          set({ enteringCityId: null });
        }
      },

      cancelEnterRealm: () => set({ enteringCityId: null }),

      enterCity: (cityId) => {
        if (cityId) {
          const city = CITIES_DATA.find((c) => c.id === cityId);
          const firstChapter = city?.chapters[0];
          if (firstChapter) {
            set((s) => {
              const currentFirst = s.chapterProgress[firstChapter.id];
              if (!currentFirst || currentFirst.status === 'locked') {
                return {
                  currentCityId: cityId,
                  currentChapterId: null,
                  chapterProgress: {
                    ...s.chapterProgress,
                    [firstChapter.id]: {
                      ...(currentFirst || {
                        completed: false,
                        correctAnswers: 0,
                        totalQuestions: firstChapter.puzzles.length,
                        stars: 0,
                        xpEarned: 0,
                        solvedPuzzleIds: [],
                      }),
                      status: 'unlocked',
                    },
                  },
                };
              }
              return { currentCityId: cityId, currentChapterId: null };
            });
            return;
          }
        }
        set({ currentCityId: cityId, currentChapterId: null });
      },

      enterChapter: (chapterId) => set({ currentChapterId: chapterId }),

      // Submitting an answer during a puzzle run
      submitPuzzleAnswer: (chapterId, puzzleId, isCorrect) => {
        const state = get();
        const currentChapter = state.chapterProgress[chapterId];
        const alreadySolved = currentChapter?.solvedPuzzleIds?.includes(puzzleId);

        // If not already solved and correct, award +100 XP
        if (isCorrect && !alreadySolved) {
          const xpGain = XP_CONFIG.PUZZLE_CORRECT;
          state.addXP(xpGain);

          set((s) => ({
            chapterProgress: {
              ...s.chapterProgress,
              [chapterId]: {
                ...s.chapterProgress[chapterId],
                solvedPuzzleIds: [
                  ...(s.chapterProgress[chapterId]?.solvedPuzzleIds || []),
                  puzzleId,
                ],
              },
            },
          }));

          return { xpAwarded: xpGain };
        }

        return { xpAwarded: 0 };
      },

      // Complete chapter after all questions attempted
      completeChapter: (cityId, chapterId, correct, total) => {
        const state = get();
        const existing = state.chapterProgress[chapterId] || {
          status: 'unlocked',
          completed: false,
          correctAnswers: 0,
          totalQuestions: total,
          stars: 0,
          xpEarned: 0,
          solvedPuzzleIds: [],
        };

        const newStars = calculateChapterStars(correct, total);
        const oldStars = existing.stars || 0;

        // Authoritative delta: only award improvement
        const newStarsEarned = Math.max(0, newStars - oldStars);
        const finalStars = Math.max(oldStars, newStars);

        // Find next chapter in the city
        const city = CITIES_DATA.find((c) => c.id === cityId);
        let nextChapterId: string | null = null;
        if (city) {
          const currentIndex = city.chapters.findIndex((ch) => ch.id === chapterId);
          if (currentIndex >= 0 && currentIndex + 1 < city.chapters.length) {
            nextChapterId = city.chapters[currentIndex + 1].id;
          }
        }

        const updatedProgress = {
          ...state.chapterProgress,
          [chapterId]: {
            ...existing,
            status: 'completed' as const,
            completed: true,
            correctAnswers: Math.max(existing.correctAnswers, correct),
            totalQuestions: total,
            stars: finalStars,
          },
        };

        // Unlock next chapter in this realm if it was locked
        if (nextChapterId && updatedProgress[nextChapterId]?.status === 'locked') {
          updatedProgress[nextChapterId] = {
            ...updatedProgress[nextChapterId],
            status: 'unlocked',
          };
        }

        // Rule: When global stars increase, check all realms and auto-unlock chapter 1 for newly unlocked realms
        const updatedTotalStars = Object.values(updatedProgress).reduce((acc, curr) => {
          return acc + (curr.completed ? curr.stars : 0);
        }, 0);

        CITIES_DATA.forEach((c) => {
          if (updatedTotalStars >= c.requiredStars && c.chapters.length > 0) {
            const firstChId = c.chapters[0].id;
            if (updatedProgress[firstChId]?.status === 'locked') {
              updatedProgress[firstChId] = {
                ...updatedProgress[firstChId],
                status: 'unlocked',
              };
            }
          }
        });

        set({ chapterProgress: updatedProgress });

        return {
          starsAwarded: finalStars,
          newStarsEarned,
          nextChapterUnlocked: nextChapterId,
          newLevel: state.player.level,
          leveledUp: false,
        };
      },

      addXP: (amount: number) => {
        const state = get();
        const safeAmount = Math.max(0, amount);
        const newXP = state.player.xp + safeAmount;
        const prevLevel = state.player.level;
        const newLevel = calculateLevel(newXP);
        const newTitle = getPlayerTitle(newLevel);
        const nextLevelXP = (newLevel + 1) * XP_CONFIG.XP_PER_LEVEL;

        const leveledUp = newLevel > prevLevel;

        set({
          player: {
            ...state.player,
            xp: newXP,
            level: newLevel,
            title: newTitle,
            nextLevelXP,
          },
          levelUpNotification: leveledUp
            ? { oldLevel: prevLevel, newLevel, title: newTitle }
            : state.levelUpNotification,
        });

        return { leveledUp, newLevel };
      },

      resetProgress: () => {
        set({
          player: {
            name: 'Explorer',
            title: 'Seeker of Bharat',
            level: 0,
            xp: 0,
            nextLevelXP: 1000,
          },
          chapterProgress: getInitialChapterProgress(),
          currentCityId: null,
          currentChapterId: null,
          levelUpNotification: null,
        });
      },

      // Legacy states preserved
      inventory: [],
      badges: [],
      heritageDNA: {
        architecture: 15,
        strategy: 15,
        history: 15,
        geography: 15,
        arts: 15,
        mathematics: 15,
      },
      placedNodes: [],
      connections: [],
      discoveredSynergies: [],
      completedQuests: [],
      activeQuest: null,
      questProgress: {},
      unlockedLocations: ['pataliputra'],
      unlockedEras: [],
      unlockedGames: ['ashtapada'],
      flyToTarget: null,
      setFlyToTarget: (target) => set({ flyToTarget: target }),
      bannerMessage: null,
      setBannerMessage: (msg) => set({ bannerMessage: msg }),
      completeQuest: (questId, rewards) => {
        get().addXP(rewards.xp);
      },
      addToInventory: () => {},
      markPlaced: () => {},
      placeNode: () => true,
      addConnection: () => ({ success: true, message: 'Connected' }),
      updateDNA: () => {},
      choices: {},
      recordChoice: () => {},
    }),
    {
      name: 'dhara_game_progression_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        player: state.player,
        chapterProgress: state.chapterProgress,
        currentCityId: state.currentCityId,
      }),
    }
  )
);
