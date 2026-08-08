import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Ear, Headphones, Plus, RotateCcw, Trash2, Volume2 } from "lucide-react";
import { toast } from "sonner";

import { SURAHS, surahOf } from "@/data/quran";
import { METHOD_STEPS, useMethodMutations, useMethodPlans } from "@/hooks/use-method";
import { PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/methode")({
  head: () => ({
    meta: [
      { title: "Méthode de mémorisation en 5 étapes — Hifz" },
      {
        name: "description",
        content:
          "Technique d'apprentissage du Coran : écoute passive, apprentissage actif, récitation sans lire, ancrage par rappel actif et révision espacée.",
      },
      { property: "og:title", content: "Méthode de mémorisation en 5 étapes — Hifz" },
      {
        property: "og:description",
        content: "Un cycle jour par jour qui combine écoute passive et rappel actif.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MethodPage,
});

const STEP_ICONS = [Headphones, Volume2, Ear, Volume2, RotateCcw];

function MethodPage() {
  const { data: plans = [] } = useMethodPlans();
  const { create, advance, reset, remove } = useMethodMutations();

  const [surah, setSurah] = useState("1");
  const [from, setFrom] = useState("1");
  const [to, setTo] = useState("7");

  const active = plans.filter((p) => p.active);

  function addPlan() {
    const number = Math.min(114, Math.max(1, Number(surah) || 1));
    const info = surahOf(number);
    const a = Math.max(1, Number(from) || 1);
    const b = Math.max(a, Number(to) || a);
    create.mutate(
      {
        label: `${info.translit} ${a}-${b}`,
        surah: number,
        ayah_from: a,
        ayah_to: b,
      },
      { onSuccess: () => toast.success("Passage ajouté — commence par l'écoute passive.") },
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Méthode d'apprentissage"
        description="Un cycle simple et éprouvé : on écoute avant d'apprendre, on récite avant de relire, on révise en alternant actif et passif."
      />

      <div className="mb-8 grid gap-4 md:grid-cols-5">
        {METHOD_STEPS.map((item, index) => {
          const Icon = STEP_ICONS[index] ?? Headphones;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              className="surface p-5"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-4" />
              </span>
              <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                {item.day}
              </p>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{item.goal}</p>
              <p className="mt-3 text-xs leading-relaxed">{item.detail}</p>
            </motion.div>
          );
        })}
      </div>

      <section className="surface mb-6 p-6">
        <p className="font-display text-lg font-semibold">Lancer un passage</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Choisis la sourate et les versets : l'application te guide étape par étape.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-xs">
            Sourate
            <select
              value={surah}
              onChange={(e) => setSurah(e.target.value)}
              className="mt-1 block h-10 w-56 rounded-xl border border-border bg-background px-3 text-sm"
            >
              {SURAHS.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.translit}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            Du verset
            <Input
              className="mt-1 w-24"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              inputMode="numeric"
            />
          </label>
          <label className="text-xs">
            Au verset
            <Input
              className="mt-1 w-24"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              inputMode="numeric"
            />
          </label>
          <Button onClick={addPlan}>
            <Plus className="mr-1.5 size-4" /> Ajouter
          </Button>
        </div>
      </section>

      <h2 className="mb-4 font-display text-lg font-semibold">Mes passages en cours</h2>
      {active.length === 0 && (
        <p className="surface p-6 text-sm text-muted-foreground">
          Aucun passage en cours. Ajoute-en un ci-dessus pour démarrer le cycle.
        </p>
      )}
      <div className="space-y-3">
        {active.map((plan) => {
          const step = METHOD_STEPS[Math.min(METHOD_STEPS.length, plan.step) - 1];
          const percent = (plan.step / METHOD_STEPS.length) * 100;
          const done = plan.step >= METHOD_STEPS.length;
          return (
            <article key={plan.id} className={cn("surface p-5", done && "border-primary/40")}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{plan.label}</p>
                  <p className="text-xs text-muted-foreground">
                    Démarré le {plan.start_date}
                    {plan.last_step_date && ` · dernière étape le ${plan.last_step_date}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!done && (
                    <Button size="sm" onClick={() => advance.mutate(plan)}>
                      Étape suivante <ArrowRight className="ml-1.5 size-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => reset.mutate(plan)}>
                    <RotateCcw className="mr-1.5 size-4" /> Recommencer
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove.mutate(plan.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <Progress value={percent} className="mt-4" />
              <p className="mt-3 text-sm font-medium">
                {step.day} — {step.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{step.detail}</p>
            </article>
          );
        })}
      </div>

      <section className="surface mt-8 p-6">
        <p className="font-display text-lg font-semibold">Actif / passif : la règle d'or</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-primary-soft p-4">
            <p className="text-sm font-semibold text-primary">Révision active</p>
            <p className="mt-1.5 text-xs">
              Réciter de mémoire, sans support. Coûteuse mais c'est elle qui fixe le Coran.
              Objectif : 1 juzz ou 1 sourate par jour selon ton niveau.
            </p>
          </div>
          <div className="rounded-xl bg-gold-soft p-4">
            <p className="text-sm font-semibold text-gold">Révision passive</p>
            <p className="mt-1.5 text-xs">
              Écouter ou lire en suivant. Peu coûteuse, elle entretient la mélodie et le tajwid.
              À faire dans les temps morts de la journée.
            </p>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Règle simple : ne jamais ajouter de nouveaux versets un jour où l'ancien n'a pas été
          révisé.
        </p>
      </section>
    </div>
  );
}
