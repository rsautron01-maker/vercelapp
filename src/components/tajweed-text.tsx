import { stripTajweed } from "@/lib/tajweed";
import { cn } from "@/lib/utils";

/**
 * Rend un verset en arabe, sans coloration.
 * Les règles de tajwid sont expliquées dans la page dédiée /tajwid.
 */
export function TajweedText({ raw, className }: { raw: string; className?: string }) {
  return <p className={cn("arabic text-right", className)}>{stripTajweed(raw)}</p>;
}
