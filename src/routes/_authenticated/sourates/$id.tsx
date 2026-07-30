import { useMemo } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, CalendarPlus, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { SURAHS, surahOf } from "@/data/quran";
import { fetchSurahText } from "@/lib/quran-api";
import { useReviewMutations, useSetVerseStatus, useVerses, today } from "@/hooks/use-hifz";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/sourates/$id")({
  head: () => ({
    meta: [
      { title: "Sourate — Hifz" },
      {
        name: "description",
        content: "Lisez le texte arabe et marquez chaque verset comme appris ou à réviser.",
      },
      { property: "og:title", content: "Sourate — Hifz" },
      { property: "og:description", content: "Texte arabe et suivi verset par verset." },
    ],
  }),
  component: SurahDetail,
});

function SurahDetail() {
  const { id } = useParams({ from: "/_authenticated/sourates/$id" });
  const number = Math.min(114, Math.max(1, Number(id) || 1));
  const surah = surahOf(number);
  const { data: verses = [] } = useVerses();
  const setStatus = useSetVerseStatus();
  const { create } = useReviewMutations();

  const { data: ayahs, isLoading } = useQuery({
    queryKey: ["surah-text", number],
    queryFn: () => fetchSurahText(number),
    staleTime: Infinity,
  });

  const statusOf = useMemo(() => {
    const map = new Map<number, string>();
    verses.filter((v) => v.surah === number).forEach((v) => map.set(v.ayah, v.status));
    return map;
  }, [verses, number]);

  const known = [...statusOf.values()].filter((s) => s !== "todo").length;
  const percent = (known / surah.ayahs) * 100;

  function planReview() {
    const due = new Date();
    due.setDate(due.getDate() + 1);
    create.mutate(
      {
        label: `Réviser ${surah.french}`,
        target_type: "surah",
        surah: number,
        due_date: due.toISOString().slice(0, 10),
        interval_days: 1,
      },
      { onSuccess: () => toast.success("Révision planifiée pour demain.") },
    );
  }

  function markAll() {
    ayahs?.forEach((ayah) =>
      setStatus.mutate({ surah: number, ayah: ayah.numberInSurah, status: "learned" }),
    );
    toast.success("Sourate marquée comme apprise.");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link to="/sourates">
          <ArrowLeft className="mr-1 size-4" /> Toutes les sourates
        </Link>
      </Button>

      <PageHeader
        title={`${surah.number}. ${surah.french}`}
        description={`${surah.translit} · ${surah.ayahs} versets · ${
          surah.revelation === "Meccan" ? "Mecquoise" : "Médinoise"
        }`}
      >
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={planReview}>
            <CalendarPlus className="mr-1.5 size-4" /> Planifier une révision
          </Button>
          <Button size="sm" onClick={markAll}>
            <Check className="mr-1.5 size-4" /> Tout marquer appris
          </Button>
        </div>
      </PageHeader>

      <div className="surface mb-6 flex items-center gap-4 p-5">
        <span className="arabic text-2xl text-gold">{surah.arabic}</span>
        <div className="flex-1">
          <Progress value={percent} />
          <p className="mt-2 text-xs text-muted-foreground">
            {known} / {surah.ayahs} versets suivis · dernière mise à jour {today()}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-2xl" />
          ))}

        {ayahs?.map((ayah, index) => {
          const status = statusOf.get(ayah.numberInSurah);
          return (
            <motion.article
              key={ayah.numberInSurah}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(0.3, index * 0.015) }}
              className={cn(
                "surface p-5",
                status === "learned" && "border-primary/40 bg-primary-soft",
                status === "review" && "border-gold/40 bg-gold-soft",
              )}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-xs font-semibold">
                  {ayah.numberInSurah}
                </span>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant={status === "learned" ? "default" : "outline"}
                    onClick={() =>
                      setStatus.mutate({
                        surah: number,
                        ayah: ayah.numberInSurah,
                        status: status === "learned" ? null : "learned",
                      })
                    }
                  >
                    <Check className="mr-1 size-3.5" /> Appris
                  </Button>
                  <Button
                    size="sm"
                    variant={status === "review" ? "secondary" : "outline"}
                    onClick={() =>
                      setStatus.mutate({
                        surah: number,
                        ayah: ayah.numberInSurah,
                        status: status === "review" ? null : "review",
                      })
                    }
                  >
                    <RotateCcw className="mr-1 size-3.5" /> À réviser
                  </Button>
                </div>
              </div>
              <p className="arabic text-right text-2xl leading-[2.2]">{ayah.text}</p>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        {number > 1 ? (
          <Button asChild variant="outline">
            <Link to="/sourates/$id" params={{ id: String(number - 1) }}>
              <ArrowLeft className="mr-1.5 size-4" /> {SURAHS[number - 2].french}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {number < 114 && (
          <Button asChild variant="outline">
            <Link to="/sourates/$id" params={{ id: String(number + 1) }}>
              {SURAHS[number].french} <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
