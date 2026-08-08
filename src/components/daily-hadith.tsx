import { motion } from "motion/react";
import { BookMarked, Sparkles } from "lucide-react";

import { hadithOfDay } from "@/data/hadiths";
import { cn } from "@/lib/utils";

/** Hadith authentique du jour (même hadith pour toute la journée). */
export function DailyHadith({ className }: { className?: string }) {
  const hadith = hadithOfDay();
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("surface p-6", className)}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <BookMarked className="size-4 text-primary" /> Hadith du jour
        </p>
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
          {hadith.grade}
        </span>
      </div>
      <p className="arabic text-right text-2xl leading-[2.1]">{hadith.arabic}</p>
      <p className="mt-4 text-sm leading-relaxed">« {hadith.french} »</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {hadith.source} · thème : {hadith.theme}
      </p>
      <p className="mt-4 flex items-start gap-2 rounded-xl bg-gold-soft p-3 text-xs">
        <Sparkles className="mt-0.5 size-3.5 shrink-0 text-gold" />
        <span>{hadith.benefit}</span>
      </p>
    </motion.section>
  );
}
