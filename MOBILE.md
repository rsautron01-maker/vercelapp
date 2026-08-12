# Hifz — App mobile (Capacitor)

## Pourquoi ce mode et pas un bundle 100% statique

Ton app est en **TanStack Start (SSR)** avec :
- une route serveur protégée `/api/transcribe` qui utilise une clé secrète (`LOVABLE_API_KEY`) jamais exposée au client,
- un middleware serveur qui attache le token Supabase (`start.ts`, `auth-attacher.ts`),
- `npm run build` génère une sortie **Nitro/Cloudflare Worker** (`.output/`), pas un `dist/client` statique exploitable seul.

Un vrai bundle statique dans la WebView casserait la transcription audio et l'auth serveur. La solution retenue est le pattern officiel Capacitor **"hybrid/remote app"** : l'app native charge ton site déployé (comme une WebView plein écran, sans barre d'adresse), avec les APIs natives en plus (safe areas, status bar, clavier, bouton retour Android, rappels locaux).
**Résultat : zéro réécriture de logique métier, tout fonctionne comme sur le site.**

## ⚠️ Étape obligatoire avant de builder

Édite `capacitor.config.ts` :
```ts
const PRODUCTION_URL = "https://TON-DOMAINE-DEPLOYE.com";
```
Remplace par l'URL de ton déploiement (Lovable Cloud, Vercel, Cloudflare…). Sans ça, l'app ne chargera rien.

## Installation

```bash
npm install
npx cap sync
```

## Lancer / builder

Android (nécessite Android Studio) :
```bash
npx cap open android
# ou en ligne de commande :
cd android && ./gradlew assembleDebug
```

iOS (nécessite Xcode + CocoaPods, macOS uniquement) :
```bash
cd ios/App && pod install && cd ../..
npx cap open ios
```

Après toute modification de `capacitor.config.ts` ou ajout de plugin :
```bash
npx cap sync
```

## Ce qui a été ajouté (natif)

- `@capacitor/status-bar`, `@capacitor/splash-screen`, `@capacitor/keyboard`, `@capacitor/app` (bouton retour Android) — `src/lib/capacitor-native.ts`
- `@capacitor/local-notifications` — rappel quotidien 20h des révisions dues, 100% local, aucun backend requis — `src/lib/local-reminders.ts`
- `@capacitor/preferences`, `@capacitor/share` — installés, prêts à l'emploi si besoin plus tard
- Safe areas iPhone (notch / home indicator) : `src/styles.css` + `app-shell.tsx`
- Permissions : micro (Android `RECORD_AUDIO`, iOS `NSMicrophoneUsageDescription`) pour la récitation, notifications (Android 13+ `POST_NOTIFICATIONS`)
- Meta viewport `viewport-fit=cover`, `theme-color`, désactivation du double-tap zoom

## Limites connues

- **Hors-ligne** : l'app dépend du serveur (auth, données, transcription) comme le site web. Pas de mode hors-ligne réel sans revoir l'architecture (migrer vers Supabase direct + cache local) — dis-moi si tu veux ce chantier.
- **Transcription audio** (`/api/transcribe`) continue de passer par ton serveur — normal et voulu, la clé API ne doit jamais être sur le device.
- Icônes/splash par défaut de Capacitor : remplace `android/app/src/main/res/mipmap-*` et `ios/App/App/Assets.xcassets/AppIcon.appiconset` par tes visuels (ou utilise `@capacitor/assets`).
