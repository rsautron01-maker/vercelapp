/**
 * Bootstrap des fonctionnalités natives Capacitor.
 * No-op automatique quand l'app tourne dans un navigateur classique
 * (Capacitor.isNativePlatform() === false), donc safe à appeler partout.
 */
import { Capacitor } from "@capacitor/core";

export async function initNativeApp() {
  if (!Capacitor.isNativePlatform()) return;

  const [{ StatusBar, Style }, { SplashScreen }, { Keyboard }, { App }] = await Promise.all([
    import("@capacitor/status-bar"),
    import("@capacitor/splash-screen"),
    import("@capacitor/keyboard"),
    import("@capacitor/app"),
  ]);

  try {
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === "android") {
      await StatusBar.setBackgroundColor({ color: "#0F5132" });
    }
  } catch {
    /* status bar API indisponible sur certains devices */
  }

  // Le clavier natif pousse le body : on ajuste juste le scroll des inputs actifs.
  Keyboard.addListener("keyboardWillShow", () => {
    const active = document.activeElement as HTMLElement | null;
    active?.scrollIntoView({ block: "center", behavior: "smooth" });
  });

  // Bouton "retour" Android : recule dans l'historique du router, sinon quitte l'app.
  App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });

  await SplashScreen.hide();
}
