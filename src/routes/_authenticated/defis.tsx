import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Play, Trophy } from "lucide-react";

import { CHALLENGES, ChallengeRunner, type ChallengeMode } from "@/components/challenges";
import { useChallengeResults } from "@/hooks/use-hifz";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/defis")({
  head: () => ({
    meta: [
      { title: "Défis de mémorisation — Hifz" },
      {
        name: "description",
        content: "Dix modes de défi pour tester votre mémorisation : suite du verset, chrono 60s et plus.",
      },
      { property: "og:title", content: "Défis de mémorisation — Hifz" },
      { property: "og:description", content: "Dix modes de jeu pour ancrer votre hifz." },
    ],
  }),
  component: ChallengesPage,
});

function ChallengesPage() {
  const [active, setActive] = useState<ChallengeMode | null>(null);
  const { data: results = [] } = useChallengeResults();

  const wins = results.filter((r) => r.success).length;

  if (active) {
    return (
      <div className="mx-auto max-w-3xl">
        <ChallengeRunner mode={active} onExit={() => setActive(null)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Défis"
        description={`${results.length} défi(s) joué(s) · ${wins} réussi(s)`}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CHALLENGES.map((challenge, index) => {
          const played = results.filter((r) => r.mode === challenge.mode).length;
          return (
            <motion.article
              key={challenge.mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              className="surface lift flex flex-col p-5"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-gold-soft text-gold">
                <Trophy className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">{challenge.title}</h2>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{challenge.description}</p>
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

      {results.length > 0 && (
        <section className="surface mt-6 p-5">
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
