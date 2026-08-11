/**
 * Comparaison d'une récitation transcrite avec le texte arabe original.
 * Deux modes : « normal » (diacritiques ignorés) et « strict » (tout compté).
 */

const HARAKAT = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u08F0-\u08F3]/g;
const TATWEEL = /\u0640/g;

/** Nettoie la ponctuation, les chiffres de versets et les espaces multiples. */
export function cleanArabic(text: string) {
  return text
    .replace(/[\u06DD\u06DE\u06E9]/g, " ")
    .replace(/[0-9\u0660-\u0669\u06F0-\u06F9]/g, " ")
    .replace(/[.,،؛؟!:"'()[\]{}«»\-–—*]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Forme comparable d'un mot selon le mode choisi. */
export function normalizeWord(word: string, strict: boolean) {
  let w = word.replace(TATWEEL, "");
  if (!strict) {
    w = w
      .replace(HARAKAT, "")
      .replace(/[\u0622\u0623\u0625\u0627\u0671]/g, "\u0627")
      .replace(/\u0649/g, "\u064A")
      .replace(/\u0629/g, "\u0647")
      .replace(/\u0624/g, "\u0648")
      .replace(/\u0626/g, "\u064A");
  }
  return w;
}

export function words(text: string, strict: boolean) {
  return cleanArabic(text)
    .split(" ")
    .map((w) => ({ raw: w, key: normalizeWord(w, strict) }))
    .filter((w) => w.key.length > 0);
}

export type DiffKind = "ok" | "wrong" | "missing" | "extra";

export type DiffWord = {
  kind: DiffKind;
  /** Mot attendu (original), si présent. */
  expected?: string;
  /** Mot réellement prononcé, si présent. */
  actual?: string;
  /** Différences lettre par lettre pour un mot proche mais inexact. */
  letters?: { char: string; ok: boolean }[];
};

function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  const row = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[n];
}

/** Similarité 0→1 entre deux mots. */
export function wordSimilarity(a: string, b: string) {
  if (!a && !b) return 1;
  const max = Math.max(a.length, b.length);
  return max === 0 ? 1 : 1 - levenshtein(a, b) / max;
}

/** Détail lettre par lettre : marque les caractères qui ne correspondent pas. */
function letterDiff(expected: string, actual: string) {
  const out: { char: string; ok: boolean }[] = [];
  // Alignement simple par programmation dynamique (chemin de coût minimal).
  const m = expected.length;
  const n = actual.length;
  const d: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (expected[i - 1] === actual[j - 1] ? 0 : 1),
      );
  let i = m;
  let j = n;
  while (i > 0) {
    if (j > 0 && d[i][j] === d[i - 1][j - 1] + (expected[i - 1] === actual[j - 1] ? 0 : 1)) {
      out.push({ char: expected[i - 1], ok: expected[i - 1] === actual[j - 1] });
      i--;
      j--;
    } else if (d[i][j] === d[i - 1][j] + 1) {
      out.push({ char: expected[i - 1], ok: false });
      i--;
    } else {
      j--;
    }
  }
  return out.reverse();
}

export type RecitationReport = {
  diff: DiffWord[];
  score: number;
  errors: number;
  counts: { missing: number; extra: number; wrong: number; ok: number };
  expectedCount: number;
};

/**
 * Aligne le verset attendu et la transcription (alignement global type
 * Needleman-Wunsch tolérant : un mot très proche compte comme « presque juste »).
 */
export function compareRecitation(
  original: string,
  spoken: string,
  strict = false,
): RecitationReport {
  const exp = words(original, strict);
  const got = words(spoken, strict);
  const m = exp.length;
  const n = got.length;

  const cost = (i: number, j: number) => 1 - wordSimilarity(exp[i].key, got[j].key);
  const GAP = 1;

  const d: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) d[i][0] = i * GAP;
  for (let j = 1; j <= n; j++) d[0][j] = j * GAP;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(
        d[i - 1][j - 1] + cost(i - 1, j - 1),
        d[i - 1][j] + GAP,
        d[i][j - 1] + GAP,
      );

  const diff: DiffWord[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + cost(i - 1, j - 1)) {
      const e = exp[i - 1];
      const g = got[j - 1];
      if (e.key === g.key) {
        diff.push({ kind: "ok", expected: e.raw, actual: g.raw });
      } else {
        diff.push({
          kind: "wrong",
          expected: e.raw,
          actual: g.raw,
          letters: letterDiff(e.key, g.key),
        });
      }
      i--;
      j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + GAP) {
      diff.push({ kind: "missing", expected: exp[i - 1].raw });
      i--;
    } else {
      diff.push({ kind: "extra", actual: got[j - 1].raw });
      j--;
    }
  }
  diff.reverse();

  const counts = { missing: 0, extra: 0, wrong: 0, ok: 0 };
  diff.forEach((w) => {
    counts[w.kind === "ok" ? "ok" : w.kind]++;
  });

  const errors = counts.missing + counts.extra + counts.wrong;
  const score = m === 0 ? 0 : Math.max(0, Math.round((counts.ok / Math.max(m, n)) * 100));

  return { diff, score, errors, counts, expectedCount: m };
}

/** Repère les répétitions/hésitations : mots consécutifs identiques en trop. */
export function repetitions(diff: DiffWord[]) {
  let count = 0;
  diff.forEach((w, index) => {
    if (w.kind !== "extra") return;
    const prev = diff[index - 1];
    const next = diff[index + 1];
    const key = w.actual ? normalizeWord(w.actual, false) : "";
    const near = [prev, next].some(
      (o) => o && o.actual && normalizeWord(o.actual, false) === key,
    );
    if (near) count++;
  });
  return count;
}
