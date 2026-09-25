"use client";

import { SceneConfig, Layer } from "./types";
import Camera from "./Camera";
import Atmosphere from "./Atmosphere";
import MediaRenderer from "./MediaRenderer";
import { useSceneAmbience } from "./AudioArchitecture";
import { motion, AnimatePresence } from "framer-motion";
import { MotionConfigs } from "./MotionSystem";
import { useWorldState } from "./WorldStateStore";

interface SceneManagerProps {
  config: SceneConfig;
  onExit?: () => void;
}

export default function SceneManager({ config, onExit }: SceneManagerProps) {
  // Hook up ambient audio for this scene
  const ambientTrack = config.audio.find(t => t.type === "ambience");
  useSceneAmbience(ambientTrack?.src);

  const { sceneStates, setSceneState, addFragment } = useWorldState();
  const currentState = sceneStates[config.id] || "DISCOVERED";

  // When mounting, if we are in DISCOVERED, move to EXPLORING
  if (currentState === "DISCOVERED") {
    setTimeout(() => setSceneState(config.id, "EXPLORING"), 1000);
  }

  // --- RENDERER ROUTING ---
  
  if (config.rendererType === "DOM_2_5D") {
    return (
      <motion.div 
        className="fixed inset-0 z-[100] bg-earth-950 overflow-hidden select-none"
        {...MotionConfigs.sceneReveal}
      >
        <Camera interactive={true}>
          {/* Background & Parallax Layers */}
          {config.layers.map((layer) => (
            <div 
              key={layer.id} 
              className="absolute inset-[-10%] w-[120%] h-[120%]"
              style={{
                transform: `translateZ(${-layer.depth * 500}px) scale(${1 + layer.depth * 0.5})`,
                transformStyle: "preserve-3d"
              }}
            >
              <MediaRenderer asset={layer.mediaAsset} className="w-full h-full" showBadge={false} />
            </div>
          ))}

          {/* Atmosphere Overlay */}
          <Atmosphere type="dust" />

          {/* Hotspots */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {config.hotspots.map(hotspot => {
              // Hide hotspot if its required state isn't met
              if (hotspot.requiredState && currentState !== hotspot.requiredState) {
                return null;
              }

              return (
                <div 
                  key={hotspot.id}
                  className="absolute pointer-events-auto cursor-pointer group"
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => {
                    // Foley sound
                    const audio = new Audio('/audio/ui_click.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(()=>{});
                    
                    if (hotspot.actionPayload?.type === "FRAGMENT") {
                      addFragment(hotspot.actionPayload.id as string);
                    }
                    hotspot.onInteract?.();
                  }}
                >
                  <div className="w-6 h-6 rounded-full border border-gold-500/50 bg-earth-900/40 backdrop-blur-sm group-hover:scale-125 group-hover:bg-gold-500/30 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-earth-950/90 border border-gold-500/30 px-2 py-1 rounded text-[10px] text-parchment-200 font-mono whitespace-nowrap">
                    {hotspot.label}
                  </div>
                </div>
              );
            })}
          </div>
        </Camera>

        {/* Diegetic UI overlay (Close button, location name) */}
        <div className="absolute top-6 left-6 z-50 pointer-events-none">
          <div className="text-[10px] font-bold tracking-[0.3em] text-gold-400 uppercase drop-shadow-md">
            {config.identity.era} · {config.identity.region}
          </div>
          <h1 className="font-serif text-3xl text-parchment-100 drop-shadow-lg">
            {config.identity.name}
          </h1>
        </div>
        
        {onExit && (
          <button 
            onClick={onExit}
            className="absolute top-6 right-6 z-50 px-4 py-2 bg-earth-900/60 backdrop-blur-md border border-gold-500/30 rounded-full text-xs font-mono text-gold-300 hover:bg-earth-800 transition-colors"
          >
            RETURN TO MAP
          </button>
        )}
      </motion.div>
    );
  }

  // Fallback for unimplemented renderers
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <p className="text-white">Renderer {config.rendererType} not implemented yet.</p>
    </div>
  );
}
