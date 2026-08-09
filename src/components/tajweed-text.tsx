import { parseTajweed, stripTajweed, TAJWEED_LEGEND, type TajweedGroup } from "@/lib/tajweed";
import { cn } from "@/lib/utils";

const GROUP_CLASS: Record<Exclude<TajweedGroup, "plain">, string> = {
  madd6: "tj-madd6",
  madd45: "tj-madd45",
  madd246: "tj-madd246",
  ghunnah: "tj-ghunnah",
  idgham: "tj-idgham",
  tafkheem: "tj-tafkheem",
  qalqalah: "tj-qalqalah",
};

/**
 * Rend un verset en arabe avec les couleurs de tajwid
 * (mêmes couleurs que les mushafs colorés / tajwid-online.com).
 */
export function TajweedText({
  raw,
  className,
  colored = true,
}: {
  raw: string;
  className?: string;
  colored?: boolean;
}) {
  if (!colored) {
    return <p className={cn("arabic text-right", className)}>{stripTajweed(raw)}</p>;
  }
  const segments = parseTajweed(raw);
  return (
    <p className={cn("arabic text-right", className)}>
      {segments.map((segment, index) => (
        <span
          key={index}
          className={segment.group === "plain" ? undefined : GROUP_CLASS[segment.group]}
        >
          {segment.text}
        </span>
      ))}
    </p>
  );
}

/** Légende des couleurs. */
export function TajweedLegend({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-2 sm:grid-cols-2", className)}>
      {TAJWEED_LEGEND.map((item) => (
        <div key={item.group} className="flex items-start gap-2 text-xs">
          <span
            className="mt-1 size-3 shrink-0 rounded-full"
            style={{ background: `var(--tj-${item.group})` }}
            aria-hidden
          />
          <span>
            <span className={cn("font-semibold", GROUP_CLASS[item.group])}>{item.label}</span>{" "}
            <span className="arabic">{item.arabic}</span>
            <span className="block text-muted-foreground">{item.hint}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
