# Détachement de Lovable → déploiement sur Vercel

## Ce qui dépendait vraiment de Lovable (et a été corrigé)

| Élément | Avant | Après |
|---|---|---|
| Build cible | Cloudflare Workers (défaut Lovable) | `nitro: { preset: "vercel" }` dans `vite.config.ts` |
| Connexion Google | `@lovable.dev/cloud-auth-js` → broker OAuth `oauth.lovable.app` (route `/~oauth/initiate` injectée par la plateforme Lovable, n'existe pas ailleurs) | `supabase.auth.signInWithOAuth({ provider: "google" })` — direct, standard Supabase |
| Transcription audio (`/api/transcribe`) | `ai.gateway.lovable.dev` + `LOVABLE_API_KEY` (clé Lovable, ne fonctionne que sur leur plateforme) | API OpenAI directe (`api.openai.com`) + `OPENAI_API_KEY` |
| `src/integrations/lovable/index.ts` | Wrapper OAuth Lovable | Supprimé (plus utilisé) |
| `@lovable.dev/cloud-auth-js` (dépendance) | — | Retirée de `package.json` |

## Ce qui n'a PAS besoin de migrer

- **Supabase** : `SUPABASE_URL=https://wzzrrwarpxkasxyofdmv.supabase.co` est un vrai projet Supabase indépendant (pas hébergé par Lovable). Aucune migration de données nécessaire.
  → Vérifie juste que tu as bien un accès **direct** (compte propriétaire) sur https://supabase.com/dashboard pour ce projet — si le compte a été créé automatiquement par Lovable, tu devras peut-être transférer la propriété ou créer tes propres credentials admin.
- **`@lovable.dev/vite-tanstack-config`** : gardé. Ce n'est qu'un wrapper de config Vite (pas un service réseau) — sa doc dit explicitement supporter le self-hosting et détecte Vercel automatiquement. Aucune raison de le retirer.

## Variables d'environnement à configurer sur Vercel

Dans **Project Settings → Environment Variables** :

```
SUPABASE_URL=https://wzzrrwarpxkasxyofdmv.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_vRLA2jRP-1TxC0Z8Y5D20Q_kJtUkWcL
SUPABASE_SERVICE_ROLE_KEY=<à récupérer sur supabase.com/dashboard/project/wzzrrwarpxkasxyofdmv/settings/api>
VITE_SUPABASE_URL=https://wzzrrwarpxkasxyofdmv.supabase.co
VITE_SUPABASE_PROJECT_ID=wzzrrwarpxkasxyofdmv
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_vRLA2jRP-1TxC0Z8Y5D20Q_kJtUkWcL
OPENAI_API_KEY=<clé créée sur platform.openai.com/api-keys>
```

⚠️ `SUPABASE_SERVICE_ROLE_KEY` n'était pas dans le `.env` fourni — récupère-la dans le dashboard Supabase (elle est nécessaire à `client.server.ts` pour les opérations admin qui bypassent la RLS).

## Config Google OAuth (si tu veux garder "Se connecter avec Google")

Avant, Lovable fournissait un client OAuth Google partagé. Maintenant il te faut le tien :
1. Google Cloud Console → créer un OAuth Client ID (type "Web application").
2. Ajouter comme "Authorized redirect URI" : `https://<ton-projet>.supabase.co/auth/v1/callback`.
3. Dans Supabase Dashboard → Authentication → Providers → Google : coller Client ID + Client Secret, activer.

## Déploiement

```bash
npm i -g vercel        # si pas déjà installé
vercel login
vercel                 # première fois : lie le projet, déploie un preview
vercel --prod          # déploiement production
```
Ou plus simple : connecte le repo GitHub du projet directement sur vercel.com → "Import Project" → Vercel détecte le framework et build automatiquement (le preset `vercel` dans `vite.config.ts` s'en charge).

## Après déploiement

1. Récupère l'URL Vercel (ex: `https://quran-path-master.vercel.app` ou ton domaine perso si tu en connectes un).
2. Mets à jour `capacitor.config.ts` :
   ```ts
   const PRODUCTION_URL = "https://ton-projet.vercel.app";
   ```
3. `npx cap sync android` puis rebuild dans Android Studio.
