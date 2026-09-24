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
- NEXT (pick up here): (1) tag remaining `historicalContext` strings in `src/data/gameContent.ts` (Pataliputra/Hampi/Varanasi/Konark chapters) with `TruthBadge` levels via each city's chapter-view rendering path — need to check `ChapterView.tsx`/`GameMaster.tsx` for where historicalContext actually renders before wiring badges in. (2) Read `veda/VedaCompanion.tsx` fully — directive explicitly warns against VEDA looking like "a floating AI assistant pasted onto the game"; not yet audited this pass. (3) Then move toward Phase 2 (cinematic opening) only after this realism/truth-layer pass is reasonably thorough — don't jump ahead while known gaps remain.

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
