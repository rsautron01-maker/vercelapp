import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CalendarPlus, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { SURAHS } from "@/data/quran";
import { useReviewMutations, useReviews, useSessions, today } from "@/hooks/use-hifz";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/calendrier")({
  head: () => ({
    meta: [
      { title: "Calendrier de révision — Hifz" },
      {
        name: "description",
        content:
          "Un calendrier simple : ce qu'il faut réviser aujourd'hui, demain et cette semaine, en un clic.",
      },
      { property: "og:title", content: "Calendrier de révision — Hifz" },
      { property: "og:description", content: "Vos révisions du Coran, simplement." },
    ],
  }),
  component: CalendarPage,
});

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("sv-SE");
}

function frDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const QUICK = [
  { label: "Aujourd'hui", days: 0 },
  { label: "Demain", days: 1 },
  { label: "Dans 3 jours", days: 3 },
  { label: "Dans 1 semaine", days: 7 },
];

function CalendarPage() {
  const { data: reviews = [] } = useReviews();
  const { data: sessions = [] } = useSessions();
  const { create, complete, remove } = useReviewMutations();
  const [surah, setSurah] = useState("1");

  const todayKey = today();
  const pending = useMemo(() => reviews.filter((r) => !r.done), [reviews]);

  const groups = useMemo(() => {
    const weekEnd = addDays(7);
    return [
      {
        key: "late",
        title: "En retard",
        tone: "destructive" as const,
        items: pending.filter((r) => r.due_date < todayKey),
      },
      {
        key: "today",
        title: "Aujourd'hui",
        tone: "primary" as const,
        items: pending.filter((r) => r.due_date === todayKey),
      },
      {
        key: "week",
        title: "Cette semaine",
        tone: "muted" as const,
        items: pending.filter((r) => r.due_date > todayKey && r.due_date <= weekEnd),
      },
      {
        key: "later",
        title: "Plus tard",
        tone: "muted" as const,
        items: pending.filter((r) => r.due_date > weekEnd),
      },
    ].filter((group) => group.items.length > 0);
  }, [pending, todayKey]);

  const week = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const key = addDays(index);
        return {
          key,
          count: pending.filter((r) => r.due_date === key).length,
          studied: sessions.some((s) => s.session_date === key && s.minutes > 0),
        };
      }),
    [pending, sessions],
  );

  function plan(days: number) {
    const item = SURAHS[Number(surah) - 1];
    create.mutate(
      {
        label: `Réviser ${item.translit}`,
        target_type: "surah",
        surah: item.number,
        due_date: addDays(days),
        interval_days: Math.max(1, days),
      },
      { onSuccess: () => toast.success(`${item.translit} planifiée.`) },
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Calendrier"
        description="Ce que vous avez à réviser, du plus urgent au plus lointain."
      />

      {/* Planification en 2 clics */}
      <section className="surface p-5">
        <h2 className="font-display text-lg font-semibold">Planifier une révision</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choisissez une sourate, puis quand vous voulez la réviser.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={surah} onValueChange={setSurah}>
            <SelectTrigger className="sm:w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {SURAHS.map((item) => (
                <SelectItem key={item.number} value={String(item.number)}>
                  {item.number}. {item.translit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2">
            {QUICK.map((option) => (
              <Button
                key={option.days}
                size="sm"
                variant={option.days === 0 ? "default" : "outline"}
                onClick={() => plan(option.days)}
              >
                <CalendarPlus className="mr-1.5 size-4" /> {option.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Aperçu 7 jours */}
      <section className="surface mt-5 p-5">
        <h2 className="mb-4 font-display text-lg font-semibold">Les 7 prochains jours</h2>
        <div className="grid grid-cols-7 gap-2">
          {week.map((day, index) => (
            <motion.div
              key={day.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              className={cn(
                "rounded-xl border border-border p-2 text-center",
                index === 0 && "border-primary bg-primary-soft",
                day.studied && index !== 0 && "bg-muted",
              )}
            >
              <p className="text-[11px] capitalize text-muted-foreground">
                {new Date(`${day.key}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "short" })}
              </p>
              <p className="text-base font-semibold">{Number(day.key.slice(-2))}</p>
              <p className="text-[11px] text-muted-foreground">
                {day.count > 0 ? `${day.count} rév.` : "—"}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Listes groupées */}
      {groups.length === 0 ? (
        <p className="surface mt-5 p-8 text-center text-sm text-muted-foreground">
          Aucune révision planifiée. Ajoutez-en une ci-dessus.
        </p>
      ) : (
        groups.map((group) => (
          <section key={group.key} className="surface mt-5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2
                className={cn(
                  "font-display text-lg font-semibold",
                  group.tone === "destructive" && "text-destructive",
                  group.tone === "primary" && "text-primary",
                )}
              >
                {group.title}
              </h2>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs">
                {group.items.length}
              </span>
            </div>
            <ul className="space-y-2">
              {group.items.map((review) => (
                <li
                  key={review.id}
                  className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{review.label}</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {frDate(review.due_date)}
                    </p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => complete.mutate(review)}>
                    <Check className="mr-1.5 size-4" /> Fait
                  </Button>
                  <button
                    onClick={() => remove.mutate(review.id)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
