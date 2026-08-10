import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { BookOpenCheck, Play, Sparkles, Target, Trophy } from "lucide-react";

import {
  CHALLENGES,
  ChallengeRunner,
  type ChallengeFamily,
  type ChallengeMode,
} from "@/components/challenges";
import { useChallengeResults } from "@/hooks/use-hifz";
import { hizbRangeOf, juzRangeOf, rangeLabel, type Scope } from "@/data/scope";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/defis")({
  head: () => ({
    meta: [
      { title: "Défis de mémorisation et quiz — Hifz" },
      {
        name: "description",
        content:
          "Défiez-vous sur un juzz ou un hizb précis, et testez vos connaissances : tawhid, sîra, fiqh, tajwid et sciences du Coran.",
      },
      { property: "og:title", content: "Défis de mémorisation et quiz — Hifz" },
      {
        property: "og:description",
        content: "Défis coraniques ciblés par juzz ou hizb, plus des quiz tawhid, sîra et fiqh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChallengesPage,
});

type ScopeKind = "all" | "juz" | "hizb";

function ChallengesPage() {
  const [active, setActive] = useState<ChallengeMode | null>(null);
  const [kind, setKind] = useState<ScopeKind>("all");
  const [juz, setJuz] = useState(1);
  const [hizb, setHizb] = useState(1);
  const { data: results = [] } = useChallengeResults();

  const scope = useMemo<Scope>(() => {
    if (kind === "juz") return { kind: "juz", value: juz };
    if (kind === "hizb") return { kind: "hizb", value: hizb };
    return { kind: "all" };
  }, [kind, juz, hizb]);

  const scopeDetail =
    kind === "juz" ? rangeLabel(juzRangeOf(juz)) : kind === "hizb" ? rangeLabel(hizbRangeOf(hizb)) : null;

  const wins = results.filter((r) => r.success).length;
  const successRate = results.length ? Math.round((wins / results.length) * 100) : 0;

  if (active) {
    return (
      <div className="mx-auto max-w-3xl">
        <ChallengeRunner mode={active} scope={scope} onExit={() => setActive(null)} />
      </div>
    );
  }

  const families: { key: ChallengeFamily; title: string; hint: string; icon: typeof Trophy }[] = [
    {
      key: "coran",
      title: "Défis coraniques",
      hint: "Ciblés sur le périmètre choisi ci-dessus",
      icon: BookOpenCheck,
    },
    {
      key: "connaissances",
      title: "Quiz connaissances",
      hint: "Tawhid, sîra, fiqh, tajwid, sciences du Coran",
      icon: Sparkles,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Défis"
        description={`${results.length} défi(s) joué(s) · ${wins} réussi(s) · ${successRate}% de réussite`}
      />

      <section className="surface mb-6 p-5">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-primary" />
          <h2 className="font-display text-lg font-semibold">Sur quoi voulez-vous être défié ?</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Choisissez tout le Coran, un juzz (30) ou un hizb (60). Les défis coraniques tirent alors
          uniquement des versets de ce passage.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              { value: "all", label: "Tout le Coran" },
              { value: "juz", label: "Un juzz" },
              { value: "hizb", label: "Un hizb" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setKind(option.value)}
              className={cn(
                "rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors",
                kind === option.value
                  ? "border-primary bg-primary-soft text-primary"
                  : "hover:bg-muted",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {kind !== "all" && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: kind === "juz" ? 30 : 60 }, (_, i) => i + 1).map((n) => {
                const selected = kind === "juz" ? juz === n : hizb === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => (kind === "juz" ? setJuz(n) : setHizb(n))}
                    className={cn(
                      "size-9 rounded-lg border border-border text-sm font-medium transition-colors",
                      selected ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            {scopeDetail && (
              <p className="mt-3 text-xs text-muted-foreground">
                {kind === "juz" ? `Juzz ${juz}` : `Hizb ${hizb}`} : {scopeDetail}
              </p>
            )}
          </div>
        )}
      </section>

      {families.map((family) => {
        const list = CHALLENGES.filter((c) => c.family === family.key);
        return (
          <section key={family.key} className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <family.icon className="size-4 text-gold" />
              <h2 className="font-display text-lg font-semibold">{family.title}</h2>
              <span className="text-xs text-muted-foreground">— {family.hint}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {list.map((challenge, index) => {
                const played = results.filter((r) => r.mode === challenge.mode).length;
                return (
                  <motion.article
                    key={challenge.mode}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="surface lift flex flex-col p-5"
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl bg-gold-soft text-gold">
                      <Trophy className="size-5" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold">{challenge.title}</h3>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground">
                      {challenge.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{played} partie(s)</span>
                      <Button size="sm" onClick={() => setActive(challenge.mode)}>
                        <Play className="mr-1.5 size-4" /> Jouer
                      </Button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>
        );
      })}

      {results.length > 0 && (
        <section className="surface p-5">
          <h2 className="mb-4 font-display text-lg font-semibold">Derniers résultats</h2>
          <ul className="divide-y divide-border">
            {results.slice(0, 10).map((result) => (
              <li key={result.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-medium">
                  {CHALLENGES.find((c) => c.mode === result.mode)?.title ?? result.mode}
                </span>
                <span className="text-muted-foreground">
                  {result.score}/{result.total} ·{" "}
                  {new Date(result.created_at).toLocaleDateString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
