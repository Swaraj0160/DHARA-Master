export type MediaType = 
  | "REAL"
  | "ARCHIVAL"
  | "VERIFIED_PLAN"
  | "EVIDENCE_BASED_RECONSTRUCTION"
  | "AI_ATMOSPHERIC"
  | "GAMEPLAY_FICTION";

export interface MediaAsset {
  id: string;
  type: MediaType;
  src: string;
  poster?: string; // For videos
  isVideo?: boolean;
  alt: string;
  attribution?: string;
}

export type WorldState = 
  | "LOCKED"
  | "DISCOVERED"
  | "EXPLORING"
  | "QUEST_ACTIVE"
  | "EVIDENCE_FOUND"
  | "PUZZLE_SOLVED"
  | "AREA_UNLOCKED"
  | "WORLD_COMPLETED";

export type RendererType = "DOM_2_5D" | "CANVAS" | "THREE" | "VIDEO_OVERLAY";

export interface Hotspot {
  id: string;
  x: number; // percentage or local coordinates
  y: number;
  label: string;
  mediaAsset?: MediaAsset;
  actionPayload?: Record<string, unknown>; // To trigger quests, modals, discoveries
  onInteract?: () => void;
  requiredState?: WorldState;
}

export interface Layer {
  id: string;
  mediaAsset: MediaAsset;
  depth: number; // 0 to 1 for parallax
  isForeground?: boolean;
}

export interface AudioTrack {
  id: string;
  src: string;
  type: "ambience" | "foley" | "voice" | "music";
  loop?: boolean;
  volume?: number;
}

export interface SceneConfig {
  id: string;
  identity: {
    name: string;
    era: string;
    region: string;
  };
  rendererType: RendererType;
  layers: Layer[];
  hotspots: Hotspot[];
  audio: AudioTrack[];
}
