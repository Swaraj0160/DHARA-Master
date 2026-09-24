export interface PrewrittenDialogue {
  text: string;
  emotion: string;
}

export const REALM_ENTRANCE_DIALOGUES: Record<string, PrewrittenDialogue> = {
  hampi: {
    text: "Welcome to Vijayanagara (Hampi)! Examine the monolithic shrines, musical pillars, and sacred Tungabhadra waters. I am by your side!",
    emotion: "Excited",
  },
  pataliputra: {
    text: "You stand in glorious Pataliputra! Port of the sacred Ganga and seat of the Mauryan Empire. Walk with Emperor Ashoka and Chandragupta!",
    emotion: "Confident",
  },
  nalanda: {
    text: "Welcome to Nalanda Mahavihara! The premier seat of universal learning where scholars from across Asia gathered to study philosophy and astronomy.",
    emotion: "Reading",
  },
};

export const QUICK_PROMPT_DIALOGUES: Record<string, (cityId?: string | null) => PrewrittenDialogue> = {
  who_are_you: () => ({
    text: "I am Veda, an ancient celestial scholar born of Bharat's living memories. My purpose is to guide you across eras and help restore our civilization's chronicles!",
    emotion: "Namaste",
  }),

  tell_me_lore: (cityId) => {
    if (cityId === "hampi") {
      return {
        text: "Hampi was the grand jewel of the Vijayanagara Empire! Its granite monuments blend Dravidian temple architecture with acoustic brilliance. Look for the stone chariot!",
        emotion: "Excited",
      };
    }
    if (cityId === "pataliputra") {
      return {
        text: "Pataliputra was the capital of the Nanda, Maurya, and Gupta empires. From Chanakya's Arthashastra to Ashoka's Dhamma edicts, it shaped India's destiny!",
        emotion: "Proud",
      };
    }
    if (cityId === "nalanda") {
      return {
        text: "Nalanda's library, Dharmaganja, once held hundreds of thousands of sacred manuscripts on logic, medicine, and cosmology. It was illuminated by wisdom for over 800 years!",
        emotion: "Reading",
      };
    }
    return {
      text: "You gaze upon the sacred land of Bharat! Each glowing realm holds ancient trials. Select an unlocked city on the map to begin your expedition!",
      emotion: "Pointing",
    };
  },

  how_to_earn_stars: () => ({
    text: "Complete each chapter's trials with high accuracy! Answering correctly on your first attempt awards 3 stars, unlocking sealed realms and prestigious heritage passports!",
    emotion: "Happy",
  }),

  need_a_hint: () => ({
    text: "Ponder the motifs and ancient descriptions carefully! Ancient builders and sages encoded mathematics, geometry, and cosmology right into stone carvings!",
    emotion: "Idea",
  }),
};

export const DAILY_AI_LIMIT = 5;

export const LIMIT_REACHED_DIALOGUE: PrewrittenDialogue = {
  text: `You have reached your daily celestial query limit with VEDA (${DAILY_AI_LIMIT}/${DAILY_AI_LIMIT}). Upgrade to DHARA Premium for unlimited scholar guidance, or return tomorrow at dawn when the cosmic energies reset!`,
  emotion: "LowBattery",
};
