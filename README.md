<<<<<<< HEAD
# CoinTube (Local Full Site)

Projet Next.js (App Router, TypeScript) avec un backend local **fichier JSON** + upload de fichiers dans `public/videos`.
Conçu pour tourner **en local** sans base de données externe.

## Prérequis
- Node.js >= 18.17
- npm >= 9

## Installation & Démarrage
```bash
npm install
npm run dev
```
Puis ouvre: http://localhost:3000

### Comptes de test
- Tu peux créer un compte via **/signup** puis te connecter sur **/login**.
- Une fois connecté: upload via **/upload** (MP4, JPG/PNG autorisés).

## Notes importantes
- Pas de `"type": "module"` dans `package.json` pour éviter l’erreur `module is not defined` vue auparavant.
- Dépendances critiques incluses: `bcryptjs`, `lucide-react`, `uuid`, `zod`, `cookie`.
- API et pages intégrées: `/api/register`, `/api/login`, `/api/logout`, `/api/me`, `/api/videos`, `/api/likes` + pages `/login`, `/signup`, `/upload`, `/watch/[id]`, `/profile`, `/disclaimer`.
- Stockage local: `data/db.json` (créé automatiquement au premier lancement si absent).
- Fichiers uploadés: `public/videos/*`.
- Exemple d’asset fourni: `public/videos/demo.jpg` (image placeholder utilisée comme miniature).

## Scripts utiles
```bash
npm run dev      # Dev server Next.js
npm run build    # Build de production
npm run start    # Lance le build
npm run reset    # Réinitialise la base locale (data/db.json)
```

## Astuces
- Si tu vois encore une erreur liée à ES modules/CommonJS, supprime `node_modules` et `package-lock.json`, puis réinstalle (`npm install`). 
- Si `bcryptjs` manquait avant, il est maintenant présent dans `package.json`.
- Les expressions TypeScript/Javascript utilisent `&&` et `||` (et non `and`/`or`). Ce repo est corrigé.
```
---

## AGENTS
Consulte **AGENTS.md** pour les règles Codex (lint/typecheck/test/CI, conventions, etc.).

### PNPM
Le projet est compatible `pnpm` :
```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
=======
# cointube1
>>>>>>> 5b63053d94c309d88bf085a3a9bfbb213174c843
