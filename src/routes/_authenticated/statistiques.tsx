import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BookOpenCheck, Clock, Flame, Trophy } from "lucide-react";

import { SURAHS, TOTAL_AYAHS } from "@/data/quran";
import {
  globalStats,
  useChallengeResults,
  useProfile,
  useSessions,
  useVerses,
} from "@/hooks/use-hifz";
import { PageHeader, StatCard } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/statistiques")({
  head: () => ({
    meta: [
      { title: "Statistiques — Hifz" },
      {
        name: "description",
        content: "Graphiques de progression, temps d'étude et résultats de défis sur les 30 derniers jours.",
      },
      { property: "og:title", content: "Statistiques — Hifz" },
      { property: "og:description", content: "Analysez votre régularité et votre progression." },
    ],
  }),
  component: StatsPage,
});

function StatsPage() {
  const { data: profile } = useProfile();
  const { data: verses = [] } = useVerses();
  const { data: sessions = [] } = useSessions();
  const { data: results = [] } = useChallengeResults();

  const stats = useMemo(() => globalStats(verses), [verses]);

  const timeSeries = useMemo(() => {
    const days: { day: string; minutes: number }[] = [];
    for (let index = 29; index >= 0; index -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - index);
      const key = date.toLocaleDateString("sv-SE");
      days.push({
        day: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
        minutes: sessions.find((s) => s.session_date === key)?.minutes ?? 0,
      });
    }
    return days;
  }, [sessions]);

  const topSurahs = useMemo(
    () =>
      SURAHS.map((surah) => {
        const entry = stats.stats.get(surah.number)!;
        return {
          name: surah.translit,
          versets: entry.learned + entry.review,
        };
      })
        .filter((item) => item.versets > 0)
        .sort((a, b) => b.versets - a.versets)
        .slice(0, 8),
    [stats],
  );

  const distribution = [
    { name: "Terminées", value: stats.finished, color: "var(--primary)" },
    { name: "En cours", value: stats.started - stats.finished, color: "var(--gold)" },
    { name: "À commencer", value: 114 - stats.started, color: "var(--muted)" },
  ];

  const totalMinutes = sessions.reduce((sum, s) => sum + s.minutes, 0);
  const wins = results.filter((r) => r.success).length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Statistiques" description="Votre régularité sur les 30 derniers jours." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpenCheck}
          label="Versets suivis"
          value={stats.learned.toLocaleString("fr-FR")}
          hint={`${((stats.learned / TOTAL_AYAHS) * 100).toFixed(1)}% du Coran`}
          accent
        />
        <StatCard
          icon={Clock}
          label="Temps total"
          value={`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`}
          hint="depuis le début"
          delay={0.05}
        />
        <StatCard
          icon={Flame}
          label="Série actuelle"
          value={`${profile?.streak ?? 0} j`}
          hint={`niveau ${profile?.level ?? 1} · ${profile?.xp ?? 0} XP`}
          delay={0.1}
        />
        <StatCard
          icon={Trophy}
          label="Défis réussis"
          value={`${wins}/${results.length}`}
          hint="taux de réussite"
          delay={0.15}
        />
      </div>

      <section className="surface mt-6 p-5">
        <h2 className="mb-4 font-display text-lg font-semibold">Minutes d'étude par jour</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeries}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} interval={4} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#grad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Sourates les plus travaillées</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSurahs} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tick={{ fontSize: 11 }}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="versets" fill="var(--primary)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {topSurahs.length === 0 && (
            <p className="text-sm text-muted-foreground">Commencez une sourate pour voir ce graphique.</p>
          )}
        </section>

        <section className="surface p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Répartition des 114 sourates</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {distribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
            {distribution.map((entry) => (
              <li key={entry.name} className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ background: entry.color }} />
                {entry.name} ({entry.value})
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
