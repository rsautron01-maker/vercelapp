import { useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarPlus,
  Check,
  Palette,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

import { SURAHS, surahOf } from "@/data/quran";
import { fetchSurahTajweed, fetchSurahTranslit } from "@/lib/quran-api";
import { stripTajweed } from "@/lib/tajweed";
import {
  useProfile,
  useReviewMutations,
  useSetVerseStatus,
  useVerses,
  today,
} from "@/hooks/use-hifz";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TajweedText } from "@/components/tajweed-text";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/sourates/$id")({
  head: () => ({
    meta: [
      { title: "Sourate — Hifz" },
      {
        name: "description",
        content:
          "Lisez le texte arabe coloré selon les règles de tajwid et marquez chaque verset comme appris ou à réviser.",
      },
      { property: "og:title", content: "Sourate — Hifz" },
      {
        property: "og:description",
        content: "Texte arabe en couleurs de tajwid, mode phonétique et suivi verset par verset.",
      },
    ],
  }),
  component: SurahDetail,
});

type ReadMode = "arabic" | "phonetic" | "both";

function SurahDetail() {
  const { id } = useParams({ from: "/_authenticated/sourates/$id" });
  const number = Math.min(114, Math.max(1, Number(id) || 1));
  const surah = surahOf(number);
  const { data: verses = [] } = useVerses();
  const { data: profile } = useProfile();
  const setStatus = useSetVerseStatus();
  const { create } = useReviewMutations();

  const [mode, setMode] = useState<ReadMode | null>(null);
  const [colored, setColored] = useState<boolean | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  const readMode: ReadMode =
    mode ?? (profile?.script_mode === "phonetic" ? "both" : "arabic");
  const useColors = colored ?? profile?.show_tajweed !== false;

  const { data: ayahs, isLoading } = useQuery({
    queryKey: ["surah-tajweed", number],
    queryFn: () => fetchSurahTajweed(number),
    staleTime: Infinity,
  });

  const { data: translit } = useQuery({
    queryKey: ["surah-translit", number],
    queryFn: () => fetchSurahTranslit(number),
    staleTime: Infinity,
    enabled: readMode !== "arabic",
  });

  const translitOf = useMemo(() => {
    const map = new Map<number, string>();
    translit?.forEach((a) => map.set(a.numberInSurah, a.text));
    return map;
  }, [translit]);

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
        label: `Réviser ${surah.translit}`,
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
        title={`${surah.number}. ${surah.translit}`}
        description={`${surah.french} · ${surah.ayahs} versets · ${
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

      <div className="surface mb-4 flex items-center gap-4 p-5">
        <span className="arabic text-2xl text-gold">{surah.arabic}</span>
        <div className="flex-1">
          <Progress value={percent} />
          <p className="mt-2 text-xs text-muted-foreground">
            {known} / {surah.ayahs} versets suivis · dernière mise à jour {today()}
          </p>
        </div>
      </div>

      <div className="surface mb-4 flex flex-wrap items-center justify-between gap-4 p-4">
        <Tabs value={readMode} onValueChange={(value) => setMode(value as ReadMode)}>
          <TabsList>
            <TabsTrigger value="arabic">Arabe</TabsTrigger>
            <TabsTrigger value="both">Arabe + phonétique</TabsTrigger>
            <TabsTrigger value="phonetic">Phonétique</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button asChild variant="ghost" size="sm">
          <Link to="/tajwid">
            <BookOpen className="mr-1.5 size-4" /> Règles de tajwid
          </Link>
        </Button>
      </div>

      {readMode !== "arabic" && (
        <div className="surface mb-4 flex gap-3 border-gold/40 bg-gold-soft p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold" />
          <p className="text-xs">
            La phonétique est <strong>déconseillée</strong> : elle déforme la prononciation et ne
            porte aucune règle de tajwid. Garde-la comme aide temporaire et passe au mode arabe dès
            que possible.
          </p>
        </div>
      )}


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

              {readMode !== "phonetic" && (
                <TajweedText
                  raw={ayah.text}
                  colored={useColors}
                  className="text-2xl leading-[2.2]"
                />
              )}
              {readMode !== "arabic" && (
                <p
                  className={cn(
                    "text-sm italic text-muted-foreground",
                    readMode === "both" && "mt-3 border-t border-border pt-3",
                  )}
                >
                  {translitOf.get(ayah.numberInSurah) ?? stripTajweed(ayah.text)}
                </p>
              )}
            </motion.article>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        {number > 1 ? (
          <Button asChild variant="outline">
            <Link to="/sourates/$id" params={{ id: String(number - 1) }}>
              <ArrowLeft className="mr-1.5 size-4" /> {SURAHS[number - 2].translit}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {number < 114 && (
          <Button asChild variant="outline">
            <Link to="/sourates/$id" params={{ id: String(number + 1) }}>
              {SURAHS[number].translit} <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
