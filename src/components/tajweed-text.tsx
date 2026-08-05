import { useMemo } from "react";

import { TAJWEED_LEGEND, parseTajweed, type TajweedGroup } from "@/lib/tajweed";
import { cn } from "@/lib/utils";

const GROUP_CLASS: Record<TajweedGroup, string> = {
  madd6: "tj-madd6",
  madd45: "tj-madd45",
  madd246: "tj-madd246",
  ghunnah: "tj-ghunnah",
  idgham: "tj-idgham",
  tafkheem: "tj-tafkheem",
  qalqalah: "tj-qalqalah",
  plain: "",
};

/** Rend un verset annoté avec les couleurs du tajwid. */
export function TajweedText({
  raw,
  colored = true,
  className,
}: {
  raw: string;
  colored?: boolean;
  className?: string;
}) {
  const segments = useMemo(() => parseTajweed(raw, colored), [raw, colored]);
  return (
    <p className={cn("arabic text-right", className)}>
      {segments.map((segment, index) => (
        <span
          key={index}
          className={colored ? GROUP_CLASS[segment.group] : undefined}
          title={colored && segment.rule ? segment.rule : undefined}
        >
          {segment.text}
        </span>
      ))}
    </p>
  );
}

/** Légende des couleurs, identique à celle des mushafs colorés. */
export function TajweedLegend({ className }: { className?: string }) {
  return (
    <div className={cn("surface p-5", className)}>
      <p className="mb-3 text-sm font-semibold">Signification des couleurs :</p>
      <div className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {TAJWEED_LEGEND.map((item) => (
          <div key={item.group} className="flex items-start gap-2.5">
            <span
              className={cn("mt-1 size-3 shrink-0 rounded-full bg-current", GROUP_CLASS[item.group])}
            />
            <div className="min-w-0">
              <p className={cn("text-sm font-medium", GROUP_CLASS[item.group])}>{item.label}</p>
              <p className="text-xs text-muted-foreground">
                <span className="arabic inline-block align-middle">{item.arabic}</span> · {item.hint}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
