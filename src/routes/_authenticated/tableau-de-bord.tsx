import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  BookOpenCheck,
  Flame,
  Clock,
  Layers,
  Plus,
  Target,
  Trash2,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { SURAHS, TOTAL_AYAHS } from "@/data/quran";
import {
  globalStats,
  today,
  useProfile,
  useReviews,
  useReviewMutations,
  useSessions,
  useTaskMutations,
  useTasks,
  useVerses,
} from "@/hooks/use-hifz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader, ProgressRing, StatCard } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/tableau-de-bord")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Hifz" },
      {
        name: "description",
        content: "Votre progression du jour : versets mémorisés, série, objectifs et révisions.",
      },
      { property: "og:title", content: "Tableau de bord — Hifz" },
      { property: "og:description", content: "Progression globale et objectifs quotidiens de hifz." },
    ],
  }),
  component: Dashboard,
});

/** Enregistre le temps passé et met à jour la série de jours. */
function useDailyTracking() {
  useEffect(() => {
    let cancelled = false;

    async function ping(minutes: number) {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user || cancelled) return;

      const { data: session } = await supabase
        .from("study_sessions")
        .select("minutes")
        .eq("user_id", user.id)
        .eq("session_date", today())
        .maybeSingle();

      await supabase.from("study_sessions").upsert(
        {
          user_id: user.id,
          session_date: today(),
          minutes: (session?.minutes ?? 0) + minutes,
        },
        { onConflict: "user_id,session_date" },
      );

      const { data: profile } = await supabase
        .from("profiles")
        .select("streak, last_active_date")
        .eq("id", user.id)
        .maybeSingle();

      if (profile && profile.last_active_date !== today()) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = profile.last_active_date === yesterday.toISOString().slice(0, 10);
        await supabase
          .from("profiles")
          .update({
            streak: isConsecutive ? profile.streak + 1 : 1,
            last_active_date: today(),
          })
          .eq("id", user.id);
      }
    }

    void ping(1);
    const interval = setInterval(() => void ping(1), 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
}

function Dashboard() {
  useDailyTracking();
  const { data: profile } = useProfile();
  const { data: verses = [] } = useVerses();
  const { data: tasks = [] } = useTasks();
  const { data: sessions = [] } = useSessions();
  const { data: reviews = [] } = useReviews();
  const { add, toggle, remove } = useTaskMutations();
  const { complete } = useReviewMutations();
  const [label, setLabel] = useState("");

  const stats = useMemo(() => globalStats(verses), [verses]);
  const todaySession = sessions.find((s) => s.session_date === today());
  const dueToday = reviews.filter((r) => !r.done && r.due_date <= today());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dueTomorrow = reviews.filter(
    (r) => !r.done && r.due_date === tomorrow.toISOString().slice(0, 10),
  );
  const doneTasks = tasks.filter((t) => t.done).length;
  const currentSurah = SURAHS.find((s) => stats.stats.get(s.number)!.status === "progress");
  const nextAyah = currentSurah ? stats.stats.get(currentSurah.number)!.last + 1 : 1;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={`Assalamu alaykum ${profile?.display_name ?? ""}`.trim()}
        description="Voici votre progression et vos objectifs du jour."
      />

      <div className="grid gap-5 lg:grid-cols-[auto_1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="surface flex flex-col items-center justify-center gap-4 p-6"
        >
          <ProgressRing
            percent={stats.percent}
            label={`${stats.percent.toFixed(1)}%`}
            sublabel="du Coran appris"
          />
          <p className="text-center text-sm text-muted-foreground">
            {stats.learned.toLocaleString("fr-FR")} / {TOTAL_AYAHS.toLocaleString("fr-FR")} versets
          </p>
          {currentSurah && (
            <Button asChild variant="outline" size="sm">
              <Link to="/sourates/$id" params={{ id: String(currentSurah.number) }}>
                Continuer : {currentSurah.translit} · v.{nextAyah}
              </Link>
            </Button>
          )}
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={BookOpenCheck}
            label="Versets mémorisés"
            value={stats.learned.toLocaleString("fr-FR")}
            hint={`${stats.finished} sourate(s) terminée(s)`}
            accent
          />
          <StatCard
            icon={Layers}
            label="Sourates commencées"
            value={String(stats.started)}
            hint="sur 114"
            delay={0.05}
          />
          <StatCard
            icon={Flame}
            label="Série de jours"
            value={`${profile?.streak ?? 0} j`}
            hint="jours consécutifs"
            delay={0.1}
          />
          <StatCard
            icon={Clock}
            label="Temps aujourd'hui"
            value={`${todaySession?.minutes ?? 0} min`}
            hint="temps d'étude enregistré"
            delay={0.15}
          />
          <StatCard
            icon={Target}
            label="Objectif hebdo"
            value={`${profile?.weekly_goal ?? 50} v.`}
            hint="versets par semaine"
            delay={0.2}
          />
          <StatCard
            icon={CheckCircle2}
            label="Révisions du jour"
            value={String(dueToday.length)}
            hint="à effectuer"
            delay={0.25}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">To-do du jour</h2>
            <span className="text-sm text-muted-foreground">
              {doneTasks}/{tasks.length}
            </span>
          </div>
          <Progress value={tasks.length ? (doneTasks / tasks.length) * 100 : 0} className="mb-4" />
          <form
            className="mb-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!label.trim()) return;
              add.mutate(label.trim());
              setLabel("");
            }}
          >
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex. Apprendre les versets 26 à 35 de la sourate 2"
            />
            <Button type="submit" size="icon" aria-label="Ajouter une tâche">
              <Plus className="size-4" />
            </Button>
          </form>
          <ul className="space-y-2">
            {tasks.length === 0 && (
              <li className="text-sm text-muted-foreground">Aucune tâche pour aujourd'hui.</li>
            )}
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5"
              >
                <Checkbox checked={task.done} onCheckedChange={() => toggle.mutate(task)} />
                <span className={task.done ? "flex-1 text-sm line-through opacity-60" : "flex-1 text-sm"}>
                  {task.label}
                </span>
                <button
                  onClick={() => remove.mutate(task.id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Supprimer"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="surface p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Révisions planifiées</h2>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Aujourd'hui
          </p>
          <ul className="space-y-2">
            {dueToday.length === 0 && (
              <li className="text-sm text-muted-foreground">Aucune révision prévue.</li>
            )}
            {dueToday.map((review) => (
              <li
                key={review.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-primary-soft px-3 py-2.5"
              >
                <span className="text-sm font-medium">{review.label}</span>
                <Button size="sm" variant="secondary" onClick={() => complete.mutate(review)}>
                  Fait
                </Button>
              </li>
            ))}
          </ul>
          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Demain
          </p>
          <ul className="space-y-2">
            {dueTomorrow.length === 0 && (
              <li className="text-sm text-muted-foreground">Rien de planifié pour demain.</li>
            )}
            {dueTomorrow.map((review) => (
              <li key={review.id} className="rounded-xl border border-border px-3 py-2.5 text-sm">
                {review.label}
              </li>
            ))}
          </ul>
          <Button asChild variant="ghost" className="mt-4 w-full">
            <Link to="/calendrier">Voir tout le calendrier</Link>
          </Button>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <DailyHadith className="lg:col-span-2" />
        <section className="surface p-6">
          <p className="font-display text-lg font-semibold">Aller plus loin</p>
          <div className="mt-4 space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/methode">Méthode d'apprentissage en 5 étapes</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/tajwid">Règles de tajwid expliquées</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/defis">Défis & quiz islamiques</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>

  );
}
