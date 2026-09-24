import { create } from 'zustand';
import { VedaEmotion, VedaMessage } from '@/components/veda/types';
import {
  DAILY_AI_LIMIT,
  LIMIT_REACHED_DIALOGUE,
  QUICK_PROMPT_DIALOGUES,
} from '@/data/vedaDialogues';

interface VedaState {
  isOpen: boolean;
  currentEmotion: VedaEmotion;
  messages: VedaMessage[];
  isTyping: boolean;
  dailyAiCount: number;
  isPuzzleActive: boolean;

  // Actions
  toggleOpen: () => void;
  openVeda: () => void;
  closeVeda: () => void;
  setEmotion: (emotion: VedaEmotion) => void;
  setPuzzleActive: (active: boolean) => void;
  popWithDialogue: (text: string, emotion?: VedaEmotion) => void;
  triggerQuickPrompt: (key: string, cityId?: string | null) => void;
  sendPlayerMessage: (text: string, context?: { cityId?: string | null; chapterId?: string | null; isPuzzleActive?: boolean }) => Promise<void>;
  getRemainingDailyAiQueries: () => number;
  resetConversation: () => void;
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getStoredDailyCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem('veda_daily_ai_v1');
    if (!raw) return 0;
    const data = JSON.parse(raw);
    if (data.date === getTodayString()) {
      return Number(data.count) || 0;
    }
  } catch (e) {
    console.error("Error reading Veda daily AI quota:", e);
  }
  return 0;
}

function incrementStoredDailyCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const today = getTodayString();
    let current = getStoredDailyCount();
    current += 1;
    localStorage.setItem('veda_daily_ai_v1', JSON.stringify({ date: today, count: current }));
    return current;
  } catch (e) {
    console.error("Error saving Veda daily AI quota:", e);
    return 1;
  }
}

const INITIAL_MESSAGES: VedaMessage[] = [
  {
    id: 'veda-intro',
    sender: 'veda',
    text: 'Namaste, seeker! I am Veda, your companion through the vast tapestry of Bharat. Click me anytime for ancient lore and guidance!',
    emotion: 'Namaste',
    timestamp: Date.now(),
  },
];

export const useVedaStore = create<VedaState>((set, get) => ({
  isOpen: false,
  currentEmotion: 'Namaste',
  messages: INITIAL_MESSAGES,
  isTyping: false,
  dailyAiCount: typeof window !== 'undefined' ? getStoredDailyCount() : 0,
  isPuzzleActive: false,

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  openVeda: () => set({ isOpen: true }),

  closeVeda: () => set({ isOpen: false }),

  setEmotion: (emotion) => set({ currentEmotion: emotion }),

  setPuzzleActive: (active) => set({ isPuzzleActive: active }),

  popWithDialogue: (text, emotion = 'Pointing') => {
    const newMessage: VedaMessage = {
      id: `veda-${Date.now()}`,
      sender: 'veda',
      text,
      emotion,
      timestamp: Date.now(),
    };
    set((state) => ({
      isOpen: true,
      currentEmotion: emotion,
      messages: [...state.messages, newMessage],
    }));
  },

  // 0 AI Tokens: Pure prewritten lore & mechanics answers
  triggerQuickPrompt: (key: string, cityId?: string | null) => {
    const getter = QUICK_PROMPT_DIALOGUES[key];
    if (!getter) return;

    const dialogue = getter(cityId);
    const newMessage: VedaMessage = {
      id: `veda-quick-${Date.now()}`,
      sender: 'veda',
      text: dialogue.text,
      emotion: dialogue.emotion,
      timestamp: Date.now(),
    };

    set((state) => ({
      isOpen: true,
      currentEmotion: dialogue.emotion,
      messages: [...state.messages, newMessage],
    }));
  },

  getRemainingDailyAiQueries: () => {
    const used = getStoredDailyCount();
    return Math.max(0, DAILY_AI_LIMIT - used);
  },

  // Custom User Input -> Powered by Gemini Flash with strict daily limit & token guardrails
  sendPlayerMessage: async (text, context) => {
    const playerMsg: VedaMessage = {
      id: `player-${Date.now()}`,
      sender: 'player',
      text,
      timestamp: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, playerMsg],
      currentEmotion: 'Thinking',
      isTyping: true,
      isOpen: true,
    }));

    // Check Daily Limit before calling Gemini API
    const currentUsage = getStoredDailyCount();
    if (currentUsage >= DAILY_AI_LIMIT) {
      setTimeout(() => {
        const limitReply: VedaMessage = {
          id: `veda-limit-${Date.now()}`,
          sender: 'veda',
          text: LIMIT_REACHED_DIALOGUE.text,
          emotion: LIMIT_REACHED_DIALOGUE.emotion,
          timestamp: Date.now(),
        };

        set((state) => ({
          messages: [...state.messages, limitReply],
          currentEmotion: LIMIT_REACHED_DIALOGUE.emotion,
          isTyping: false,
          dailyAiCount: currentUsage,
        }));
      }, 500);
      return;
    }

    try {
      const res = await fetch('/api/veda/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            ...context,
            isPuzzleActive: get().isPuzzleActive,
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      const newCount = incrementStoredDailyCount();

      const vedaReply: VedaMessage = {
        id: `veda-reply-${Date.now()}`,
        sender: 'veda',
        text: data.reply || "The ancient chronicles whisper their secrets...",
        emotion: data.emotion || 'Pointing',
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, vedaReply],
        currentEmotion: data.emotion || 'Pointing',
        isTyping: false,
        dailyAiCount: newCount,
      }));
    } catch (err) {
      console.warn("Failed to reach Gemini Veda API, using offline companion lore:", err);
      const vedaReply: VedaMessage = {
        id: `veda-reply-${Date.now()}`,
        sender: 'veda',
        text: "The sands of time reveal many secrets. Delve into the architecture and scriptures, for every stone in Bharat whispers a forgotten truth.",
        emotion: 'Idea',
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, vedaReply],
        currentEmotion: 'Idea',
        isTyping: false,
      }));
    }
  },

  resetConversation: () => set({ messages: INITIAL_MESSAGES, currentEmotion: 'Namaste' }),
}));
