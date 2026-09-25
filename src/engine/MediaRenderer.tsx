"use client";

import Image from "next/image";
import { MediaAsset } from "./types";
import TruthBadge, { TruthLevel } from "@/components/ui/TruthBadge";

interface MediaRendererProps {
  asset: MediaAsset;
  className?: string;
  showBadge?: boolean;
}

// Maps our Engine MediaType to the existing UI TruthLevel
const getTruthLevel = (type: MediaAsset["type"]): TruthLevel | null => {
  switch (type) {
    case "REAL":
    case "ARCHIVAL":
    case "VERIFIED_PLAN":
      return "verified";
    case "EVIDENCE_BASED_RECONSTRUCTION":
      return "reconstruction";
    case "AI_ATMOSPHERIC":
    case "GAMEPLAY_FICTION":
      return "fiction";
    default:
      return null;
  }
};

export default function MediaRenderer({ asset, className = "", showBadge = false }: MediaRendererProps) {
  const truthLevel = getTruthLevel(asset.type);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {asset.isVideo ? (
        <video 
          src={asset.src}
          poster={asset.poster}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          aria-label={asset.alt}
        />
      ) : (
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority={asset.type === "REAL" || asset.type === "ARCHIVAL"} 
        />
      )}
      
      {showBadge && truthLevel && (
        <div className="absolute top-3 left-3 z-10">
          <TruthBadge level={truthLevel} />
        </div>
      )}
      
      {asset.attribution && (
        <div className="absolute bottom-2 right-2 z-10 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[8px] text-white/70 font-mono">
          Source: {asset.attribution}
        </div>
      )}
    </div>
  );
}
