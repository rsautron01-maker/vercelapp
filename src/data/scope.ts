// Périmètres de défi : tout le Coran, un juzz (30) ou un hizb (60).
import { SURAHS, JUZ_START, surahOf } from "@/data/quran";

export type AyahRef = { surah: number; ayah: number };
export type Range = { start: AyahRef; end: AyahRef };

/** Index global du verset (1 = Al-Faatiha v.1). */
const OFFSETS: number[] = (() => {
  const offsets: number[] = [0];
  let total = 0;
  for (const surah of SURAHS) {
    total += surah.ayahs;
    offsets.push(total);
  }
  return offsets;
})();

export const TOTAL_VERSES = OFFSETS[OFFSETS.length - 1];

export function globalIndex(surah: number, ayah: number) {
  return OFFSETS[surah - 1] + ayah;
}

export function fromGlobalIndex(index: number): AyahRef {
  const clamped = Math.min(Math.max(1, index), TOTAL_VERSES);
  for (let surah = 1; surah <= 114; surah += 1) {
    if (clamped <= OFFSETS[surah]) {
      return { surah, ayah: clamped - OFFSETS[surah - 1] };
    }
  }
  return { surah: 114, ayah: 6 };
}

export function juzRangeOf(juz: number): Range {
  const start = JUZ_START[juz - 1];
  const next = JUZ_START[juz];
  const startIndex = globalIndex(start.surah, start.ayah);
  const endIndex = next ? globalIndex(next.surah, next.ayah) - 1 : TOTAL_VERSES;
  return { start: fromGlobalIndex(startIndex), end: fromGlobalIndex(endIndex) };
}

/** Les 60 hizb : chaque juzz est coupé en deux moitiés égales en versets. */
export function hizbRangeOf(hizb: number): Range {
  const juz = Math.ceil(hizb / 2);
  const range = juzRangeOf(juz);
  const startIndex = globalIndex(range.start.surah, range.start.ayah);
  const endIndex = globalIndex(range.end.surah, range.end.ayah);
  const middle = startIndex + Math.floor((endIndex - startIndex) / 2);
  return hizb % 2 === 1
    ? { start: fromGlobalIndex(startIndex), end: fromGlobalIndex(middle) }
    : { start: fromGlobalIndex(middle + 1), end: fromGlobalIndex(endIndex) };
}

export type Scope =
  | { kind: "all" }
  | { kind: "juz"; value: number }
  | { kind: "hizb"; value: number }
  | { kind: "surah"; value: number };

export function scopeRange(scope: Scope): Range | null {
  if (scope.kind === "juz") return juzRangeOf(scope.value);
  if (scope.kind === "hizb") return hizbRangeOf(scope.value);
  if (scope.kind === "surah")
    return {
      start: { surah: scope.value, ayah: 1 },
      end: { surah: scope.value, ayah: surahOf(scope.value).ayahs },
    };
  return null;
}

export function scopeLabel(scope: Scope) {
  if (scope.kind === "all") return "Tout le Coran (sourates courtes)";
  if (scope.kind === "juz") return `Juzz ${scope.value}`;
  if (scope.kind === "hizb") return `Hizb ${scope.value}`;
  return `Sourate ${surahOf(scope.value).translit}`;
}

export function rangeLabel(range: Range) {
  return `${surahOf(range.start.surah).translit} ${range.start.ayah} → ${
    surahOf(range.end.surah).translit
  } ${range.end.ayah}`;
}

/** Sourates (au moins partiellement) contenues dans un périmètre. */
export function rangeSurahs(range: Range) {
  const list: { surah: number; from: number; to: number }[] = [];
  for (let surah = range.start.surah; surah <= range.end.surah; surah += 1) {
    const from = surah === range.start.surah ? range.start.ayah : 1;
    const to = surah === range.end.surah ? range.end.ayah : surahOf(surah).ayahs;
    if (to >= from) list.push({ surah, from, to });
  }
  return list;
}
