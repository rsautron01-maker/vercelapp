import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { AlertTriangle, GraduationCap } from "lucide-react";

import { TAJWEED_COURSE, TAJWEED_LEVELS } from "@/data/tajweed-rules";
import { PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/tajwid")({
  head: () => ({
    meta: [
      { title: "Règles de tajwid expliquées — Hifz" },
      {
        name: "description",
        content:
          "Cours de tajwid : madd 6 / 4-5 / 2-4-6 harakât, ghunnah, idghâm, tafkhîm et qalqalah avec conditions, exemples et erreurs fréquentes.",
      },
      { property: "og:title", content: "Règles de tajwid expliquées — Hifz" },
      {
        property: "og:description",
        content: "Toutes les règles essentielles du tajwid, expliquées simplement avec des exemples.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TajweedPage,
});

function TajweedPage() {
  const [family, setFamily] = useState(TAJWEED_COURSE[0].id);
  const current = TAJWEED_COURSE.find((f) => f.id === family) ?? TAJWEED_COURSE[0];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Tajwid — les règles"
        description="Les règles essentielles, leurs conditions d'application, des exemples du Coran et les erreurs à éviter."
      />

      <div className="surface mb-6 flex gap-3 border-gold/40 bg-gold-soft p-4">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold" />
        <p className="text-xs">
          Le tajwid s'apprend <strong>par l'oral</strong>. Ce cours sert de repère écrit : fais
          toujours corriger ta récitation par un enseignant ou un récitateur qualifié.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {TAJWEED_COURSE.map((item) => (
          <Button
            key={item.id}
            size="sm"
            variant={item.id === family ? "default" : "outline"}
            onClick={() => setFamily(item.id)}
          >
            {item.name}
          </Button>
        ))}
      </div>

      <p className="mb-5 text-sm text-muted-foreground">{current.intro}</p>

      <div className="space-y-4">
        {current.rules.map((rule, index) => (
          <motion.article
            key={rule.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="surface p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-lg font-semibold">{rule.title}</h2>
              <span className="arabic text-xl text-gold">{rule.arabic}</span>
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary">
              {rule.duration}
            </p>
            <p className="mt-3 text-sm leading-relaxed">{rule.summary}</p>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Conditions
            </p>
            <ul className="mt-2 space-y-1.5">
              {rule.conditions.map((condition) => (
                <li key={condition} className="flex gap-2 text-sm">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {condition}
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Exemples
            </p>
            <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
              {rule.examples.map((example) => (
                <div key={example.arabic} className="rounded-xl bg-muted p-3.5">
                  <p className="arabic text-right text-xl leading-[2]">{example.arabic}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{example.note}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 rounded-xl bg-destructive/10 p-3 text-xs">
              <strong>Erreur fréquente :</strong> {rule.mistake}
            </p>
          </motion.article>
        ))}
      </div>

      <h2 className="mt-10 mb-4 flex items-center gap-2 font-display text-lg font-semibold">
        <GraduationCap className="size-5 text-primary" /> Par où commencer ?
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {TAJWEED_LEVELS.map((level, index) => (
          <div key={level.level} className={cn("surface p-5", index === 0 && "border-primary/40")}>
            <p className="font-semibold">{level.level}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{level.goal}</p>
            <ul className="mt-3 space-y-1.5">
              {level.focus.map((focus) => (
                <li key={focus} className="text-sm">
                  · {focus}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
