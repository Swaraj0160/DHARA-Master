import { CITIES_DATA } from "@/data/gameContent";
import { REALM_ENTRANCE_DATA } from "@/data/realmEntranceData";

/**
 * Lightweight retrieval for VEDA (Phase 8, Heritage Truth Layer input).
 *
 * No vector DB / embeddings — DHARA's historical content is small and fully
 * enumerable (a handful of cities, a handful of chapters each), so a direct
 * lookup by cityId/chapterId is the right amount of infrastructure. This
 * pulls only the historical statements DHARA's own writers already vetted
 * (chapter puzzle explanations, realm-entrance vista captions) instead of
 * letting the model answer from raw pretrained knowledge it can't cite.
 */

// Nalanda lives outside CITIES_DATA (it's a standalone quest), so its
// grounding facts are kept here — each line traceable to the same claims
// already shown to the player in the Nalanda quest UI.
const NALANDA_FACTS = [
  "Nalanda Mahavihara operated as a residential Buddhist university from c. 427 to 1197 CE in Magadha (modern Bihar).",
  "It attracted students and monks from China, Korea, Japan, Tibet, and Central Asia; the Chinese pilgrim Xuanzang studied and later taught there in the 7th century CE (recorded in his Si-Yu-Ki).",
  "The Dharmaganja library complex housed three multi-storey buildings (including one reputedly nine storeys tall) holding manuscripts on logic, mathematics, astronomy, and medicine.",
  "Manuscripts were written on palm-leaf folios (tala-patra) bound with cord through perforations, the standard medium for long-form scholarly texts in ancient India.",
  "Nalanda hosted open philosophical debate among Buddhist, Vedic, Jain, and secular scholars, covering subjects including logic (Nyaya-Pramana), linguistics, and cosmography.",
];

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

/** Returns a short, citeable grounding block for the given location, or "" if none exists. */
export function getGroundedContext(cityId?: string | null, chapterId?: string | null): string {
  if (!cityId) return "";

  const lines: string[] = [];

  if (cityId === "nalanda") {
    lines.push(...NALANDA_FACTS);
  } else {
    const city = CITIES_DATA.find((c) => c.id === cityId);
    if (city) {
      lines.push(`${city.name} — ${city.subtitle}. ${city.region}, ${city.era}.`);
      lines.push(city.description);

      const chapter = chapterId ? city.chapters.find((ch) => ch.id === chapterId) : null;
      if (chapter) {
        lines.push(`Current location: ${chapter.locationName} — ${chapter.description}`);
        // Pull the correct-answer explanations already written for this chapter's
        // puzzles: these are the specific facts DHARA has already vetted for display.
        for (const puzzle of chapter.puzzles) {
          const correct = puzzle.options.find((o) => o.isCorrect);
          if (correct?.explanation) lines.push(correct.explanation);
        }
      }
    }

    const entrance = REALM_ENTRANCE_DATA[cityId];
    if (entrance) {
      for (const vista of entrance.vistas) {
        lines.push(vista.historicalSignificance);
      }
    }
  }

  if (lines.length === 0) return "";

  // Cap length so the grounding block stays small relative to the model's context.
  return truncate(lines.join("\n- "), 2200);
}
