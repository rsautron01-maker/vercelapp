import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { toast } from "sonner";

import { JUZ_START, juzRange, surahOf } from "@/data/quran";
import { juzProgressPercent, useJuz, useSaveJuz, useVerses } from "@/hooks/use-hifz";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/juzz")({
  head: () => ({
    meta: [
      { title: "Les 30 Juzz — Hifz" },
      {
        name: "description",
        content: "Suivez votre maîtrise des 30 juzz du Coran et notez votre niveau pour chacun.",
      },
      { property: "og:title", content: "Les 30 Juzz — Hifz" },
      { property: "og:description", content: "Maîtrise et révisions par juzz." },
    ],
  }),
  component: JuzPage,
});

function JuzPage() {
  const { data: verses = [] } = useVerses();
  const { data: juzRows = [] } = useJuz();
  const save = useSaveJuz();

  const masteryOf = useMemo(() => {
    const map = new Map<number, number>();
    juzRows.forEach((row) => map.set(row.juz, row.mastery));
    return map;
  }, [juzRows]);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Les 30 Juzz"
        description="Notez votre maîtrise de chaque juzz pour organiser vos grandes révisions."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {JUZ_START.map((juz, index) => {
          const range = juzRange(juz.number);
          const percent = juzProgressPercent(verses, juz.number);
          const mastery = masteryOf.get(juz.number) ?? 0;
          const lastReview = juzRows.find((r) => r.juz === juz.number)?.last_review;
          return (
            <motion.section
              key={juz.number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(0.3, index * 0.02) }}
              className="surface p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold">Juzz {juz.number}</h2>
                  <p className="text-xs text-muted-foreground">
                    {surahOf(range.start.surah).french} {range.start.ayah} →{" "}
                    {surahOf(range.end.surah).french} {range.end.ayah}
                  </p>
                </div>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/sourates/$id" params={{ id: String(range.start.surah) }}>
                    Ouvrir
                  </Link>
                </Button>
              </div>

              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Versets suivis</span>
                  <span>{Math.round(percent)}%</span>
                </div>
                <Progress value={percent} className="h-1.5" />
              </div>

              <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                  <span>Maîtrise ressentie</span>
                  <span>{mastery}%</span>
                </div>
                <Slider
                  value={[mastery]}
                  max={100}
                  step={5}
                  onValueChange={([value]) => save.mutate({ juz: juz.number, mastery: value })}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {lastReview ? `Révisé le ${lastReview}` : "Jamais révisé"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    save.mutate(
                      { juz: juz.number, mastery, reviewed: true },
                      { onSuccess: () => toast.success(`Juzz ${juz.number} marqué comme révisé.`) },
                    )
                  }
                >
                  Révisé aujourd'hui
                </Button>
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
