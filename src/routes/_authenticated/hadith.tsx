import { createFileRoute } from "@tanstack/react-router";

import { HADITHS, dayIndex } from "@/data/hadiths";
import { DailyHadith } from "@/components/daily-hadith";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/hadith")({
  head: () => ({
    meta: [
      { title: "Hadith authentique du jour — Hifz" },
      {
        name: "description",
        content:
          "Un hadith authentique par jour (Bukhârî, Muslim, Tirmidhî) avec le texte arabe, la traduction, la référence et un conseil pratique.",
      },
      { property: "og:title", content: "Hadith authentique du jour — Hifz" },
      {
        property: "og:description",
        content: "Un hadith sahîh chaque jour, avec sa source et une application concrète.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HadithPage,
});

function HadithPage() {
  const index = dayIndex();
  const previous = Array.from({ length: 6 }, (_, i) => HADITHS[(index - i - 1 + HADITHS.length) % HADITHS.length]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Hadith du jour"
        description="Uniquement des hadiths authentiques (sahîh ou hasan sahîh), avec leur référence."
      />

      <DailyHadith />

      <h2 className="mb-4 mt-8 font-display text-lg font-semibold">Les jours précédents</h2>
      <div className="space-y-3">
        {previous.map((hadith, i) => (
          <article key={`${hadith.source}-${i}`} className="surface p-5">
            <p className="arabic text-right text-xl leading-[2]">{hadith.arabic}</p>
            <p className="mt-3 text-sm">« {hadith.french} »</p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {hadith.source} · {hadith.grade} · {hadith.theme}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
