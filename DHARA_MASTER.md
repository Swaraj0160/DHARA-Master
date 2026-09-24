# DHARA MASTER — Project Memory

Short, living memory. Update at end of each work session; don't re-read completed work.

## Current Phase
Phase 1/7 overlap — Realism pass + Heritage Truth Layer foundation. IN PROGRESS.
- Added stone/charcoal/forest token ramps to `src/app/globals.css` (existing earth/parchment/gold/terracotta palette was already close to the realism target — extended, not replaced. Button.tsx/Card.tsx/Navigation.tsx already restrained, gold used only as accent — audited, no change needed).
- Built `src/components/ui/TruthBadge.tsx` (Phase 7 Heritage Truth Layer: verified / source-qualified / reconstruction / fiction) — real component, not a stub.
- Wired `truthLevel` prop into `DiscoveryReveal.tsx` and used it on the one real call site (`quest/nalanda/page.tsx` Nalanda discovery — tagged `source-qualified`, citing Xuanzang/Si-Yu-Ki per deck's own reference list).
- Toned down `DiscoveryReveal.tsx` glow/shadow effects (removed 40-80px gold blur-glows, pulsing halo) — was the clearest "fantasy game UI" violation of the realism rule found so far.
- Build verified clean after each change.
- DONE: batch-replaced `shadow-[0_0_Npx_rgba(212,175,55,x)]` gold glow across 18 files with `shadow-xl` (mechanical, build-verified). 5 files still carry non-gold rarity-color glows (blue/purple/legendary) — left as-is, lower priority than the gold-everywhere pattern.
## Macro feature: Real Geographic Heritage Map — DONE
User redirected execution strategy: stop micro-fixes, build whole features. First macro feature shipped:
- `src/components/game/HeritageWorldMap.tsx` (new) — real react-leaflet map, real OSM tiles, antique color-grade filter, restrained divIcon markers (no glow/pulse). Real verified [lat,lng] added to `City` interface + all 5 cities in `gameContent.ts` (Pataliputra→Patna 25.6127,85.1228 · Hampi 15.3350,76.4600 · Varanasi 25.3176,82.9739 · Madurai 9.9252,78.1198 · Konark 19.8876,86.0945) + Nalanda 25.1358,85.4429 as its own marker (not a City record).
- Replaced the old fantasy Atlas view in `WorldMap.tsx` (illustrated image + percentage-position `CityNode` pins — real cartography violation) with this component. `CityNode.tsx`/`ancient_india_map.jpg` now unused/orphaned, left in place (not deleted this pass).
- IMPORTANT GOTCHA for future leaflet work: `import L from "leaflet"` runs browser-sniffing at module-import time and crashes static prerendering ("window is not defined") if pulled into any statically-generated page's import graph — even inside an unrendered ternary branch, because ESM imports are eager. Fix: `next/dynamic(() => import("./Component"), { ssr: false })` — a REAL dynamic import, not `dynamic(() => Promise.resolve(AlreadyImportedComponent))` (that still imports eagerly, does nothing). `src/components/game/LivingBoard.tsx` is a second, more advanced real-geography Leaflet component (India board with placed artifacts + connection lines, `WORLD_SLOTS` in `gameState.ts`) that is currently **dead code — never imported anywhere**. It looks like unshipped work for the Cultural Connections / Heritage Constellation feature (directive §31) — investigate and likely wire it in rather than rebuilding equivalent functionality from scratch.
- Build verified + visually verified in real browser (screenshot-checked): real Bihar/Karnataka/Odisha/UP geography renders correctly, locked-site click shows the existing modal, markers are legible.

## Correction: Phase 3/4 were already much more built than earlier audits found
Live browser testing (not just code reading) revealed the "Discovery" report and earlier session both UNDER-stated what exists:
- `RealmEntranceAnimation.tsx` + `src/data/realmEntranceData.ts` = a real, good, already-wired "World Preview" system: per-city multi-vista carousel (4 vistas each for Pataliputra/Hampi/Varanasi/Konark/Madurai) with real photos, era labels, historicalSignificance captions citing Megasthenes/Arthashastra/etc. Triggered automatically via `enteringCityId` in `page.tsx`. This IS Phase 4's "World Preview" ask — already built, do not rebuild.
- Confirmed full pipeline works live: World Map marker → (now) camera travel → vista carousel → `CityMap` chapter nodes → chapter gameplay. Screenshot-verified for Pataliputra.
- Added this session: `TravelCamera` in `HeritageWorldMap.tsx` — flyTo animation (900ms) before handoff, using the same technique as the unused `LivingBoard.tsx`.
- LESSON: verify claims about "what's missing" by opening the real app, not just grepping/reading files — this session's own earlier reports were wrong twice (missed RealmEntranceAnimation's quality, missed LivingBoard entirely).

## Real issues found this pass (not yet fixed — flagged, not fabricated over)
1. **Possible image/site mismatch**: Pataliputra's vista 1 ("The Grand Torana Gate") shows `/chapter_torana.jpg`, a carved stone gateway with elephant/rider reliefs that visually resembles Sanchi Stupa's Great Torana (Madhya Pradesh) — a DIFFERENT, famous, distinct monument, not Pataliputra (Patna, Bihar). Not confirmed with certainty from a screenshot alone. NEEDS VERIFICATION before either relabeling the caption or treating this as a i mislabeled-evidence problem (directive's "no beautiful misinformation" rule). Do not fix by guessing — check the actual source/provenance of `public/chapter_torana.jpg` and the other stock-looking site photos first.
2. ~~VEDA mascot inconsistency~~ — FALSE ALARM, corrected: the blue cartoon-genie IS `Hello.png`, one of the real 47 emotion sprites (`VedaCompanion.tsx` correctly maps emotions to `/veda/*.png` via `EMOTION_FILE_MAP`/`resolveVedaImage`). No bug here — I just didn't recognize the art style from a screenshot. Lesson: don't flag a finding as confirmed off one glance; this one should have been "unconfirmed" not asserted.
3. **VEDA overlays the cinematic intro** — FIXED this session. Added `hasSeenIntro` (already existed in `gameState.ts`, was unused) as a gate in `VedaCompanion.tsx` (`if (!mounted || !hasSeenIntro) return null;`), and wired `setHasSeenIntro(true)` into `page.tsx`'s `enterExperience()` helper (replaces the old bare `setHasEntered(true)` in both the skip button and the 12s auto-timer). Build verified. Note: `hasSeenIntro` persists, so on a second+ visit VEDA will appear immediately once the (still-always-replaying) intro reaches its own timers — that replay-every-time intro behavior is pre-existing and out of scope for this fix.

## Phase 5+6+7 block: Nalanda + Truth Layer — assessment + real progress
Live-played the full Nalanda quest chain this pass (Arrive → Explore → Scholar → screenshot-verified). Finding: **Nalanda's gameplay (Phase 6) is already substantially good** — real inspect/deduce mechanics (`ManuscriptHunt`), real hotspot exploration (`NalandaMap` campus survey, 5 hotspots with real architectural-sector descriptions like "Dharmaganja (The Mountain of Truth)"), a real riddle-based admission trial (`ScholarChallenge`, cites Pingala/Hemachandra correctly), a real branching cultural choice (`CulturalDecision`). This is NOT "click card → answer question → next screen" — it already has the INSPECT/DEDUCE/CHOOSE variety the directive asked for. Don't rebuild this; it's good.
- Shipped this pass: `TruthBadge` wired into `ManuscriptHunt.tsx` (verified), `ScholarChallenge.tsx` (source-qualified, replaced ad-hoc bold-text label), `CulturalDecision.tsx` (source-qualified). `FinalSynthesisChallenge.tsx` deliberately left alone (pure matching mechanic, no natural claim to tag).
- SCOPE REALITY CHECK for future iterations: the directive's Phase 5 ask ("realistic environmental depth, archaeological architecture, courtyards, realistic lighting, environmental movement, NPC presence") describes a level of visual/environmental production (real 3D or richly art-directed 2D scenes, ambient sound, animated NPCs) that requires actual art/audio assets this repo does not have and that cannot be conjured by editing code alone without either (a) sourcing real licensed heritage imagery (requires explicit per-download user approval, not yet given) or (b) commissioning/generating new visual assets (risks the "no fabricated historical imagery" rule if done carelessly). Do not fake this with generic gradients/emoji and call it "environmental depth" — that would be exactly the "beautiful misinformation" the directive prohibits. This is a real, structural limitation to flag to the user, not something to route around with more CSS.

## Phase 8: VEDA grounding — DONE
- New `src/lib/vedaGrounding.ts`: `getGroundedContext(cityId, chapterId)` — direct lookup (no vector DB, content is small/enumerable), pulls chapter puzzle correct-answer explanations + realm-entrance vista captions for CITIES_DATA cities, or a small hand-written `NALANDA_FACTS` array for Nalanda (which lives outside CITIES_DATA).
- Wired into `api/veda/chat/route.ts`: injected as a `[VERIFIED CONTEXT: ...]` block in the prompt, plus a new system-instruction section telling VEDA to base location facts only on it and admit gaps in character rather than fabricate.
- **Live-tested against the real Gemini API** (not just build-checked): confirmed for both the Nalanda special-case path and the CITIES_DATA path (Pataliputra) — responses correctly surfaced injected facts (Dharmaganja library, Kumhrar pillars, Jaladurga). Confirmed the honesty guard: asked for an exact 700 CE monk census (not in the grounding data) → VEDA correctly declined with "the chronicles I carry do not preserve that detail" instead of inventing a number.
- Note: candidate models are `gemini-3.5-flash` / `gemini-3.6-flash` / `gemini-flash-latest` (pre-existing code) — occasionally hit transient 503 "high demand" from Google's side; the 3-model fallback chain already handles this, confirmed by testing (first call 503'd all three, retry succeeded).

## MAJOR FIX this pass: the entire progression/Living Board pipeline was silently broken
Two compounding bugs, found only by actually playing the game and checking raw localStorage (not by reading code):
1. `completeQuest` in `gameState.ts` only ever called `addXP` — badge/item/dnaDeltas args were silently dropped. `addToInventory`/`markPlaced`/`placeNode`/`addConnection`/`updateDNA` were all no-op stubs (`() => {}` / `() => true`) despite full type signatures and a fully-built consuming UI (`LivingBoard.tsx`, `DiscoveryReveal.tsx`).
2. The persist `partialize` whitelist only kept `player`, `chapterProgress`, `currentCityId` — badges/inventory/placedNodes/connections/heritageDNA/completedQuests/questProgress/unlocked*/choices/**hasSeenIntro** were all dropped on every save and reset on reload.
FIXED both. Verified live end-to-end: played real Nalanda quest to completion, confirmed badge+item survive a hard reload, placed the real item on the newly-wired Living Board and watched the marker change from available(+) to placed(🏛️).
Also fixed: `chapter_torana.jpg` mislabeled as Pataliputra (it's actually Sanchi) — recaptioned honestly, no image swap needed.
Also wired: `LivingBoard.tsx` into `WorldMap.tsx` as a third "Living Board" tab (gated on having ≥1 inventory item, so it's not empty on first visit).

## Follow-up fixed same pass
XP mismatch fixed: both `completeQuest()`'s call and `DiscoveryReveal`'s `rewards.xp` in `quest/nalanda/page.tsx` now use `totalScore || 450` instead of a hardcoded 450, matching what `QuestComplete.tsx` already displayed (780 for a full correct run).

## VEDA grounding + city unlock — verified across ALL cities this pass
Test method: set every `chapterProgress` entry to `{completed:true, stars:3}` via localStorage (legitimate test shortcut — bypasses grinding stars, not a code change) to unlock all 5 cities at once, since Konark alone needs 40 global stars.
- Hampi: entered live via UI, chapter map renders correctly (5/5 chapters, "REALM MASTERED" banner), VEDA's proactive greeting fired, and a live chat question ("what makes the architecture special?") returned a response directly echoing the injected CITIES_DATA description (aqueducts/bazaars/monolithic granite) plus accurate supplementary knowledge (Vittala stone chariot).
- Varanasi, Madurai, Konark: verified via direct `/api/veda/chat` calls (real Gemini API, not mocked) — all three returned specific, accurate, city-grounded answers (Varanasi: Ganga/Adi Shankara/silk weaving; Madurai: 985-pillar hall/Meenakshi Temple; Konark: khondalite stone/24 wheels/Ganga dynasty/Odissi). Grounding generalizes correctly across all cities, not just the two previously tested.
- Did NOT deep-test each city's individual MCQ chapter gameplay (ChapterView/GameMaster) this pass — that path was already working before this session's fixes (stars/XP accrual predates the store bugs found last iteration, which were specific to Nalanda's `completeQuest`/Living-Board pipeline). Lower risk, not yet independently re-verified.

## Investigated, NOT implemented: bridging MCQ cities to the Living Board
Tried to add a second `WORLD_SLOT` (e.g. Pataliputra) to make `addConnection`'s Sangam-pairing testable. Stopped before implementing: **the 5 MCQ-based cities (all except Nalanda) never call `completeQuest`/`addToInventory` at all** — they only track `chapterProgress`/stars and unlock a computed `isCityPassportUnlocked()` boolean (see `PassportModal.tsx`). There is currently no placeable inventory item for any city except Nalanda, so a new `WORLD_SLOT` for e.g. Hampi would be a dead slot nothing could ever fill — would have been exactly the kind of half-wired feature to avoid.
**Real design for next time**: add a `checkAndGrantPassportRewards()` (or fold into the existing chapter-completion path) that, the moment `isCityPassportUnlocked(cityId)` newly becomes true, calls `addToInventory` with a city-specific monument item, and add a matching `WORLD_SLOT` per city (real lat/lng already exist on each `City` record — just copy them over). Also note `WORLD_SLOTS` is a static const array checked via a static `status` field (`LivingBoard.tsx`'s `isAvailable = slot.status === 'unlocked' || 'available'`) — that check would need to become dynamic (call `isCityPassportUnlocked`) rather than a fixed status, since slots must go from locked→available as the player actually progresses.

## Next major feature (pick up here)
(1) Implement the passport→inventory→WORLD_SLOT bridge designed above — this is the real way to make Sangam connections a genuine, playable feature rather than a Nalanda-only dead end. (2) Spot-check one MCQ chapter's actual play-through (not just completion-state injection) to confirm `submitPuzzleAnswer`/`addXP` still work correctly end to end post-fixes. (3) Return to visual/design-system work (Phase 1) or cinematic intro depth (Phase 2) — those haven't been revisited since early sessions and may have their own undiscovered issues, per this session's repeated lesson that live-testing finds real bugs code-reading misses.

## Phase 0
DONE — see below, do not redo.

## Completed
- Verified repo: Next.js 16.3.4 / React 19.2.8 / TS. `npm install` + `npm run build` succeed (9 routes + 1 API route, all compile clean).
- `git init` done locally; initial commit (118 files) pushed to `Swaraj0160/DHARA-Master` (private) as `main`.
- `.env.local` present locally with `GEMINI_API_KEY=` (gitignored, not committed, value not inspected/printed — not yet confirmed as a *working* key).
- `.env.example` created with placeholder only.
- Vercel project `swaraj0160s-projects/dhara-master` created and linked to the GitHub repo (auto-deploy on push now active). `GEMINI_API_KEY` NOT yet set in Vercel env — VEDA chat will fail on deployed site until added.
- Ownership confirmed: GitHub CLI + Vercel CLI both authenticated as `Swaraj0160`. Zero contact with `HerelsKrishna/DHARA`.

## Architecture (as-is)
- Next.js App Router. Routes: `/`, `/classroom`, `/dashboard`, `/games`, `/historian`, `/map`, `/profile`, `/quest/nalanda`, `/settings`, API `/api/veda/chat`.
- State: Zustand (`src/store/gameState.ts` — XP/level/passport, `src/store/vedaStore.ts` — VEDA UI state), persisted to localStorage.
- Content: static TS data (`src/data/gameContent.ts` — Pataliputra/Hampi/Varanasi/Konark chapters; `src/data/vedaDialogues.ts`).
- Nalanda: fully separate, most complete quest (`src/app/quest/nalanda/page.tsx` + `src/components/quest/*`).
- VEDA: `src/components/veda/VedaCompanion.tsx` + `src/app/api/veda/chat/route.ts` — real Gemini call (`@google/genai`), 47 emotion sprites in `public/veda/`. NOT yet grounded/RAG — plain system-prompted chat.
- No DB, no Phaser, no 3D, no PWA manifest, no voice (STT/TTS) yet.

## Key Decisions
- CONTINUE existing codebase (not rebuild) — confirmed sound in prior discovery report.
- Own repo: `Swaraj0160/DHARA-Master` on GitHub, own Vercel project — independent from `HerelsKrishna/DHARA`.
- Avoid heavy infra (Neo4j/Redis) — lightweight retrieval for VEDA grounding is enough for now.

## Known Problems / Blockers
- `GEMINI_API_KEY` value not verified as a *working* key (only confirmed the variable name exists locally) — VEDA chat should be smoke-tested once dev server runs.
- No PWA manifest, no tests, no CI yet.

## Next Action
Confirm `GEMINI_API_KEY` is a real working key (smoke-test `/api/veda/chat` via `npm run dev`), then set the same key in Vercel project env vars. After that, begin Phase 1 (realistic design system) — this is a large, multi-phase build and will proceed incrementally across sessions, not in one pass.
