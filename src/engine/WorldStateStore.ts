import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WorldState } from "./types";

interface WorldStateStore {
  // Map of location/scene IDs to their current progression state
  sceneStates: Record<string, WorldState>;
  
  // Array of discovered fragment IDs
  discoveredFragments: string[];
  
  // Methods
  setSceneState: (sceneId: string, state: WorldState) => void;
  addFragment: (fragmentId: string) => void;
  hasFragment: (fragmentId: string) => boolean;
}

export const useWorldState = create<WorldStateStore>()(
  persist(
    (set, get) => ({
      sceneStates: {},
      discoveredFragments: [],
      
      setSceneState: (sceneId, state) => 
        set((prev) => ({
          sceneStates: {
            ...prev.sceneStates,
            [sceneId]: state
          }
        })),
        
      addFragment: (fragmentId) => {
        if (!get().discoveredFragments.includes(fragmentId)) {
          set((prev) => ({
            discoveredFragments: [...prev.discoveredFragments, fragmentId]
          }));
        }
      },
      
      hasFragment: (fragmentId) => get().discoveredFragments.includes(fragmentId),
    }),
    {
      name: "dhara-world-state",
      partialize: (state) => ({ 
        sceneStates: state.sceneStates,
        discoveredFragments: state.discoveredFragments
      }),
    }
  )
);
