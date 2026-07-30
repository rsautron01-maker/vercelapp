import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { BookOpen, CalendarCheck, Trophy, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TOTAL_AYAHS } from "@/data/quran";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hifz — Mémoriser le Coran avec méthode" },
      {
        name: "description",
        content:
          "Suivez votre mémorisation du Coran : 114 sourates, révisions espacées, 10 défis et statistiques détaillées.",
      },
      { property: "og:title", content: "Hifz — Mémoriser le Coran avec méthode" },
      {
        property: "og:description",
        content: "Suivez votre mémorisation du Coran : 114 sourates, révisions espacées, 10 défis et statistiques détaillées.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: BookOpen,
    title: "114 sourates suivies",
    text: "Marquez chaque verset appris, à réviser ou à commencer. La progression se calcule instantanément.",
  },
  {
    icon: CalendarCheck,
    title: "Révisions espacées",
    text: "Le calendrier planifie automatiquement vos révisions pour que rien ne s'oublie.",
  },
  {
    icon: Trophy,
    title: "10 modes de défi",
    text: "Trouver la suite, deviner la sourate, compléter le verset, défi chrono de 60 secondes…",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl gradient-gold font-bold text-gold-foreground">
            ﷽
          </span>
          <span className="font-display text-lg font-semibold">Hifz</span>
        </span>
        <Button asChild variant="ghost">
          <Link to="/auth">Se connecter</Link>
        </Button>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-10 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-gold" /> {TOTAL_AYAHS.toLocaleString("fr-FR")} versets, un
            plan clair
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] lg:text-6xl">
            Mémorisez le Coran,
            <span className="block text-gold-gradient">verset après verset.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground lg:text-lg">
            Hifz réunit le suivi de vos sourates, la planification de vos révisions et des défis
            intelligents pour ancrer durablement ce que vous apprenez.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/auth">Commencer maintenant</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth">J'ai déjà un compte</Link>
            </Button>
          </div>
        </motion.div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="surface lift p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <feature.icon className="size-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{feature.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Hifz — outil personnel de mémorisation du Coran.
      </footer>
    </div>
  );
}
