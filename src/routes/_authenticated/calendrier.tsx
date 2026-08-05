import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CalendarPlus, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/calendrier")({
  head: () => ({
    meta: [
      { title: "Calendrier de révision — Hifz" },
      {
        name: "description",
        content: "Planifiez vos révisions du Coran avec la répétition espacée et visualisez votre mois.",
      },
      { property: "og:title", content: "Calendrier de révision — Hifz" },
      { property: "og:description", content: "Vue mensuelle et planification des révisions." },
    ],
  }),
  component: CalendarPage,
});

const DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const days: (string | null)[] = Array.from({ length: offset }, () => null);
  const total = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= total; day += 1) {
    days.push(new Date(year, month, day).toLocaleDateString("sv-SE"));
  }
  return days;
}

function CalendarPage() {
  const { data: reviews = [] } = useReviews();
  const { data: sessions = [] } = useSessions();
  const { create, complete, remove } = useReviewMutations();
  const [cursor, setCursor] = useState(() => new Date());
  const [surah, setSurah] = useState("1");
  const [date, setDate] = useState(today());

  const days = useMemo(() => monthMatrix(cursor.getFullYear(), cursor.getMonth()), [cursor]);
  const byDate = useMemo(() => {
    const map = new Map<string, typeof reviews>();
    reviews
      .filter((r) => !r.done)
      .forEach((review) => {
        map.set(review.due_date, [...(map.get(review.due_date) ?? []), review]);
      });
    return map;
  }, [reviews]);
  const studied = useMemo(
    () => new Set(sessions.filter((s) => s.minutes > 0).map((s) => s.session_date)),
    [sessions],
  );

  const upcoming = reviews.filter((r) => !r.done).slice(0, 12);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Calendrier"
        description="Vos révisions planifiées et vos jours d'étude."
      />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold capitalize">
              {cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              >
                Précédent
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              >
                Suivant
              </Button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-xs text-muted-foreground">
            {DAY_LABELS.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((day, index) => {
              if (!day) return <span key={`empty-${index}`} />;
              const dayReviews = byDate.get(day) ?? [];
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.005 }}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center rounded-xl border border-border text-sm",
                    day === today() && "border-primary bg-primary-soft font-semibold",
                    studied.has(day) && day !== today() && "bg-muted",
                  )}
                  title={dayReviews.map((r) => r.label).join(", ")}
                >
                  {Number(day.slice(-2))}
                  {dayReviews.length > 0 && (
                    <span className="mt-0.5 size-1.5 rounded-full bg-gold" />
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-gold" /> révision prévue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded bg-muted" /> jour étudié
            </span>
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Planifier une révision</h2>
          <div className="space-y-3">
            <Select value={surah} onValueChange={setSurah}>
              <SelectTrigger>
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
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Button
              className="w-full"
              onClick={() =>
                create.mutate(
                  {
                    label: `Réviser ${SURAHS[Number(surah) - 1].translit}`,
                    target_type: "surah",
                    surah: Number(surah),
                    due_date: date,
                    interval_days: 1,
                  },
                  { onSuccess: () => toast.success("Révision ajoutée au calendrier.") },
                )
              }
            >
              <CalendarPlus className="mr-1.5 size-4" /> Ajouter
            </Button>
          </div>

          <h3 className="mb-3 mt-6 font-display text-base font-semibold">À venir</h3>
          <ul className="space-y-2">
            {upcoming.length === 0 && (
              <li className="text-sm text-muted-foreground">Aucune révision planifiée.</li>
            )}
            {upcoming.map((review) => (
              <li
                key={review.id}
                className="flex items-center gap-2 rounded-xl border border-border px-3 py-2"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{review.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.due_date} · intervalle {review.interval_days} j
                  </p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => complete.mutate(review)}>
                  Fait
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
      </div>
    </div>
  );
}
