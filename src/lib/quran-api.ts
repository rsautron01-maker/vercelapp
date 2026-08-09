import { SURAHS, type Surah } from "@/data/quran";
import { stripTajweed } from "@/lib/tajweed";

export type Ayah = { numberInSurah: number; text: string; number: number };

const caches = new Map<string, Map<number, Ayah[]>>();

function cacheFor(edition: string) {
  let cache = caches.get(edition);
  if (!cache) {
    cache = new Map<number, Ayah[]>();
    caches.set(edition, cache);
  }
  return cache;
}

async function fetchEdition(surah: number, edition: string): Promise<Ayah[]> {
  const cache = cacheFor(edition);
  const cached = cache.get(surah);
  if (cached) return cached;
  const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah}/${edition}`);
  if (!res.ok) throw new Error("Impossible de charger le texte de la sourate");
  const json = (await res.json()) as {
    data: { ayahs: { numberInSurah: number; text: string; number: number }[] };
  };
  const ayahs = json.data.ayahs.map((a) => ({
    numberInSurah: a.numberInSurah,
    text: a.text,
    number: a.number,
  }));
  cache.set(surah, ayahs);
  return ayahs;
}

export function fetchSurahText(surah: number) {
  return fetchEdition(surah, "quran-uthmani");
}

/** Texte annoté avec les règles de tajwid (couleurs). */
export function fetchSurahTajweed(surah: number) {
  return fetchEdition(surah, "quran-tajweed");
}

/** Translittération phonétique (aide, à ne pas utiliser comme référence). */
export function fetchSurahTranslit(surah: number) {
  return fetchEdition(surah, "en.transliteration");
}

/** Texte arabe simple dérivé de l'édition tajwid (annotations retirées). */
export function plainFromTajweed(text: string) {
  return stripTajweed(text);
}


export type VerseRef = { surah: Surah; ayah: number; text: string };

/** Tire un verset au hasard, de préférence parmi les sourates fournies. */
export async function randomVerse(preferSurahs?: number[]): Promise<VerseRef> {
  const pool =
    preferSurahs && preferSurahs.length > 0
      ? preferSurahs
      : SURAHS.filter((s) => s.ayahs <= 30).map((s) => s.number);
  const surahNumber = pool[Math.floor(Math.random() * pool.length)];
  const ayahs = await fetchSurahText(surahNumber);
  const surah = SURAHS[surahNumber - 1];
  // On évite le dernier verset pour que "la suite" existe toujours.
  const maxIndex = Math.max(0, ayahs.length - 6);
  const index = Math.floor(Math.random() * Math.max(1, maxIndex));
  return { surah, ayah: ayahs[index].numberInSurah, text: ayahs[index].text };
}

export async function versesAround(
  surah: number,
  ayah: number,
  after = 5,
  before = 1,
): Promise<{ previous: Ayah[]; next: Ayah[] }> {
  const ayahs = await fetchSurahText(surah);
  const index = ayahs.findIndex((a) => a.numberInSurah === ayah);
  return {
    previous: ayahs.slice(Math.max(0, index - before), index),
    next: ayahs.slice(index + 1, index + 1 + after),
  };
}

/** Masque des mots aléatoires dans un verset (défi « compléter le verset »). */
export function maskWords(text: string, ratio = 0.3) {
  const words = text.split(" ");
  const count = Math.max(1, Math.round(words.length * ratio));
  const hidden = new Set<number>();
  while (hidden.size < count && hidden.size < words.length - 1) {
    hidden.add(1 + Math.floor(Math.random() * (words.length - 1)));
  }
  return {
    masked: words.map((w, i) => (hidden.has(i) ? "ـــــــ" : w)).join(" "),
    answer: [...hidden].sort((a, b) => a - b).map((i) => words[i]),
  };
}

export function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0600-\u06ff ]/g, "")
    .trim();
}

/** Vérifie une réponse « nom de sourate » de façon tolérante. */
export function matchesSurahName(answer: string, surah: Surah) {
  const a = normalize(answer);
  if (!a) return false;
  return [surah.french, surah.translit, surah.arabic].some((name) => {
    const n = normalize(name);
    return n.includes(a) || a.includes(n);
  });
}
