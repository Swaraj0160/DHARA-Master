import { ShieldCheck, BookMarked, Hammer, Wand2 } from "lucide-react";

/**
 * Heritage Truth Layer classification. Core DHARA rule: no verified source,
 * no historical claim — every historicalContext string shown to the player
 * must be tagged with one of these, never left ambiguous.
 */
export type TruthLevel =
  | "verified" // documented fact — ASI/UNESCO/IGNCA/NDLI/academic source
  | "source-qualified" // supported by a source, with caveats (e.g. a single traveller's account)
  | "reconstruction" // evidence-based interpretation where direct record is incomplete
  | "fiction"; // gameplay fiction — NPC dialogue, invented puzzle framing, never presented as fact

const CONFIG: Record<TruthLevel, { label: string; icon: typeof ShieldCheck; className: string }> = {
  verified: {
    label: "Verified Fact",
    icon: ShieldCheck,
    className: "bg-forest-800/60 border-forest-700 text-parchment-200",
  },
  "source-qualified": {
    label: "Source-Qualified",
    icon: BookMarked,
    className: "bg-stone-800/60 border-stone-700 text-parchment-200",
  },
  reconstruction: {
    label: "Evidence-Based Reconstruction",
    icon: Hammer,
    className: "bg-terracotta-700/40 border-terracotta-600 text-parchment-200",
  },
  fiction: {
    label: "Gameplay Fiction",
    icon: Wand2,
    className: "bg-indigo-900/50 border-indigo-900 text-parchment-300",
  },
};

export default function TruthBadge({ level, className = "" }: { level: TruthLevel; className?: string }) {
  const { label, icon: Icon, className: colorClassName } = CONFIG[level];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-wider uppercase ${colorClassName} ${className}`}
    >
      <Icon className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}
