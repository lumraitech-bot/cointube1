# AGENTS.md — Règles Codex pour CoinTube

## Objectif
Expédier rapidement des features Next.js/TypeScript, propres, testées, accessibles, SEO-friendly.

## Commandes à respecter
- Install: `pnpm install` (ou `npm ci`)
- Lint: `pnpm lint`
- Type-check: `pnpm typecheck` (tsc --noEmit)
- Test: `pnpm test` (vitest/jest)
- Build: `pnpm build`
- Dev: `pnpm dev`

## Contraintes code
- TypeScript strict, ESLint + Prettier
- Next.js App Router, a11y (ARIA), SSR/ISR selon page
- Sécurité: jamais de secrets en clair; utiliser variables d'env
- Perf: images optimisées, lazy imports, RUM léger

## Conventions
- Commits: Conventional Commits (feat/fix/chore…)
- PR: inclure description, checklist, screenshots UI si visuel
- i18n: FR/EN structure prête (si présent)
- Accessibilité: contrastes, focus states, labels

## Stratégie test
- Unitaires: composants & utils
- Integration: API routes (msw/supertest)
- E2E (optionnel): Playwright déclenché si présent

## Ce que l’agent doit faire
1. Exécuter `lint`, `typecheck`, `test` avant PR.
2. Ne JAMAIS compromettre `.env*` ni secrets.
3. Proposer un plan bref au début de chaque tâche.
4. Produire un diff propre + notes de migration si besoin.
