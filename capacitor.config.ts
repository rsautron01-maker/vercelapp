import type { CapacitorConfig } from "@capacitor/cli";

// ⚠️ IMPORTANT — LIS CECI :
// Ton app utilise TanStack Start (SSR) avec des routes serveur protégées
// (ex: /api/transcribe, qui utilise une clé secrète LOVABLE_API_KEY côté
// serveur, jamais exposée au client) + de l'auth Supabase avec middleware
// serveur. Un bundle 100% statique (comme un site Vite/React classique)
// NE PEUT PAS faire tourner ça dans la WebView : il n'y a pas de Node
// serveur sur le téléphone.
//
// => L'app mobile pointe donc vers ton site déployé (pattern officiel
// Capacitor "hybrid/remote app"). Remplace URL_DE_PRODUCTION ci-dessous
// par ton domaine réel (ex: https://hifz.lovable.app ou ton domaine perso).
// Tout le reste (design, fonctionnalités, auth, API, données) continue de
// fonctionner exactement comme sur le site, sans rien réécrire.
const PRODUCTION_URL = "https://REMPLACE-PAR-TON-DOMAINE.example.com";

const config: CapacitorConfig = {
  appId: "com.hifz.app",
  appName: "Hifz",
  webDir: "dist/client",
  server: {
    url: PRODUCTION_URL,
    cleartext: false,
    androidScheme: "https",
    allowNavigation: [new URL(PRODUCTION_URL).hostname, "*.supabase.co"],
  },
  ios: {
    contentInset: "never",
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#0F5132",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    StatusBar: {
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
