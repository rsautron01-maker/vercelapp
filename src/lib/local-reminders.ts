import { Capacitor } from "@capacitor/core";

const REMINDER_ID = 1001;

/**
 * Planifie une notification locale quotidienne (20h) rappelant le nombre de
 * révisions/tâches dues. Purement côté device — aucune infra serveur requise.
 * No-op en dehors d'iOS/Android.
 */
export async function scheduleDailyReviewReminder(dueCount: number) {
  if (!Capacitor.isNativePlatform()) return;

  const { LocalNotifications } = await import("@capacitor/local-notifications");
  const { display } = await LocalNotifications.checkPermissions();
  if (display !== "granted") {
    const req = await LocalNotifications.requestPermissions();
    if (req.display !== "granted") return;
  }

  await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
  if (dueCount <= 0) return;

  const next20h = new Date();
  next20h.setHours(20, 0, 0, 0);
  if (next20h.getTime() <= Date.now()) next20h.setDate(next20h.getDate() + 1);

  await LocalNotifications.schedule({
    notifications: [
      {
        id: REMINDER_ID,
        title: "Hifz — Révision du jour",
        body: `${dueCount} révision${dueCount > 1 ? "s" : ""} t'attend${dueCount > 1 ? "ent" : ""} 🌿`,
        schedule: { at: next20h, repeats: true, every: "day" },
      },
    ],
  });
}
