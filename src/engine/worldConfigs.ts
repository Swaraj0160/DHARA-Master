import { SceneConfig } from "./types";

export const NalandaSceneConfig: SceneConfig = {
  id: "nalanda-dharmaganja",
  identity: {
    name: "Dharmaganja Library",
    era: "7th Century CE",
    region: "Magadha (Bihar)",
  },
  rendererType: "DOM_2_5D",
  layers: [
    {
      id: "sky",
      depth: 1.0,
      mediaAsset: {
        id: "sky-1",
        type: "AI_ATMOSPHERIC",
        src: "/ancient_temple_bg.jpg", // Using existing placeholder
        alt: "Atmospheric sky",
      }
    },
    {
      id: "ruins-mid",
      depth: 0.5,
      mediaAsset: {
        id: "mid-1",
        type: "EVIDENCE_BASED_RECONSTRUCTION",
        src: "/ancient_india_map.jpg", // Reusing map image just for visual layering test
        alt: "Midground ruins",
        attribution: "Test Layer"
      }
    },
    // We would add a foreground layer here when we have sliced art
  ],
  hotspots: [
    {
      id: "hotspot-pillar",
      x: 40,
      y: 60,
      label: "Inspect Ruined Pillar",
      actionPayload: { type: "FRAGMENT", id: "frag-ashoka-inscription" },
      onInteract: () => console.log("Pillar inspected"),
    },
    {
      id: "hotspot-manuscript",
      x: 75,
      y: 80,
      label: "Examine Palm Leaves",
      actionPayload: { type: "FRAGMENT", id: "frag-tala-patra" },
      onInteract: () => console.log("Leaves examined"),
    }
  ],
  audio: [
    {
      id: "amb-wind",
      src: "https://cdn.freesound.org/previews/175/175944_3248244-lq.mp3", // Free placeholder wind
      type: "ambience",
      loop: true,
      volume: 0.3
    }
  ]
};
