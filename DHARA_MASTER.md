# DHARA MASTER — Project Memory

Short, living memory. Update at end of each work session; don't re-read completed work.

## Current Phase
Phase 0 — Baseline + ownership + security. IN PROGRESS.

## Completed
- Verified repo: Next.js 16.3.4 / React 19.2.8 / TS. `npm install` + `npm run build` succeed (9 routes + 1 API route, all compile clean).
- `git init` done locally.
- `.env.local` already present locally with `GEMINI_API_KEY=` (gitignored, not committed, value not inspected/printed).
- `.env.example` created with placeholder only.
- Ownership: GitHub CLI + Vercel CLI both authenticated as `Swaraj0160`.

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
Finish Phase 0: push initial commit to `Swaraj0160/DHARA-Master`, link Vercel project (no deploy until env key is confirmed working). Then begin Phase 1 (design system) in a following session/turn — this is a large, multi-phase build and will not fit in one pass.
