import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Search } from "lucide-react";

import { SURAHS } from "@/data/quran";
import { globalStats, useVerses } from "@/hooks/use-hifz";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/sourates/")({
  head: () => ({
    meta: [
      { title: "Les 114 sourates — Hifz" },
      {
        name: "description",
        content: "Parcourez les 114 sourates du Coran et suivez votre progression sur chacune.",
      },
      { property: "og:title", content: "Les 114 sourates — Hifz" },
      { property: "og:description", content: "Progression détaillée sourate par sourate." },
    ],
  }),
  component: SurahList,
});

const FILTERS = [
  { key: "all", label: "Toutes" },
  { key: "progress", label: "En cours" },
  { key: "done", label: "Terminées" },
  { key: "todo", label: "À commencer" },
] as const;

function SurahList() {
  const { data: verses = [] } = useVerses();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const stats = useMemo(() => globalStats(verses), [verses]);

  const list = SURAHS.filter((surah) => {
    const entry = stats.stats.get(surah.number)!;
    if (filter !== "all" && entry.status !== filter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      surah.french.toLowerCase().includes(q) ||
      surah.translit.toLowerCase().includes(q) ||
      surah.arabic.includes(query) ||
      String(surah.number) === query.trim()
    );
  });

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Les 114 sourates"
        description={`${stats.finished} terminée(s) · ${stats.started} commencée(s)`}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une sourate…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map((item) => (
            <Button
              key={item.key}
              size="sm"
              variant={filter === item.key ? "default" : "outline"}
              onClick={() => setFilter(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((surah, index) => {
          const entry = stats.stats.get(surah.number)!;
          const known = entry.learned + entry.review;
          const percent = (known / surah.ayahs) * 100;
          return (
            <motion.div
              key={surah.number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(0.2, index * 0.01) }}
            >
              <Link
                to="/sourates/$id"
                params={{ id: String(surah.number) }}
                className="surface lift block p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-primary">
                      {surah.number}
                    </span>
                    <div>
                      <p className="font-medium leading-tight">{surah.french}</p>
                      <p className="text-xs text-muted-foreground">
                        {surah.translit} · {surah.ayahs} versets ·{" "}
                        {surah.revelation === "Meccan" ? "Mecquoise" : "Médinoise"}
                      </p>
                    </div>
                  </div>
                  <span className="arabic text-lg text-gold">{surah.arabic}</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Progress value={percent} className="h-1.5" />
                  <span className="w-12 shrink-0 text-right text-xs text-muted-foreground">
                    {Math.round(percent)}%
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      {list.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">Aucune sourate trouvée.</p>
      )}
    </div>
  );
}
