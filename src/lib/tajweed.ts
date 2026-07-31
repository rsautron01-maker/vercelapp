/**
 * Analyse du texte coranique annoté « quran-tajweed » (api.alquran.cloud).
 *
 * Le format renvoyé par l'API est du type : `عَ[g[مّ]َ [h:14239[ٱ][l[لل]...`
 * soit `[code[texte]` où `code` est une lettre (éventuellement suivie de `:id`).
 */

export type TajweedRule =
  | "ham_wasl"
  | "slnt"
  | "laam_shamsiyah"
  | "madda_normal"
  | "madda_permissible"
  | "madda_necessary"
  | "madda_obligatory"
  | "qalaqah"
  | "ghunnah"
  | "ikhafa"
  | "ikhafa_shafawi"
  | "idgham_shafawi"
  | "iqlab"
  | "idgham_ghunnah"
  | "idgham_wo_ghunnah"
  | "idgham_mutajanisayn"
  | "idgham_mutaqaribayn"
  | "tafkheem";

/** Codes lettres utilisés par l'édition quran-tajweed. */
const CODE_TO_RULE: Record<string, TajweedRule> = {
  h: "ham_wasl",
  s: "slnt",
  l: "laam_shamsiyah",
  n: "madda_normal",
  p: "madda_permissible",
  m: "madda_necessary",
  o: "madda_obligatory",
  q: "qalaqah",
  g: "ghunnah",
  f: "ikhafa",
  c: "ikhafa_shafawi",
  w: "idgham_shafawi",
  i: "iqlab",
  a: "idgham_ghunnah",
  u: "idgham_wo_ghunnah",
  d: "idgham_mutajanisayn",
  b: "idgham_mutaqaribayn",
};

/** Groupes de couleurs (identiques à la légende Mu'alim al-Qur'an). */
export type TajweedGroup =
  | "madd6"
  | "madd45"
  | "madd246"
  | "ghunnah"
  | "idgham"
  | "tafkheem"
  | "qalqalah"
  | "ikhfa"
  | "iqlab"
  | "silent"
  | "plain";

const RULE_TO_GROUP: Record<TajweedRule, TajweedGroup> = {
  madda_necessary: "madd6",
  madda_obligatory: "madd45",
  madda_permissible: "madd246",
  madda_normal: "plain",
  ghunnah: "ghunnah",
  idgham_ghunnah: "idgham",
  idgham_wo_ghunnah: "idgham",
  idgham_mutajanisayn: "idgham",
  idgham_mutaqaribayn: "idgham",
  idgham_shafawi: "idgham",
  qalaqah: "qalqalah",
  ikhafa: "ikhfa",
  ikhafa_shafawi: "ikhfa",
  iqlab: "iqlab",
  ham_wasl: "silent",
  slnt: "silent",
  laam_shamsiyah: "silent",
  tafkheem: "tafkheem",
};

export const TAJWEED_LEGEND: {
  group: Exclude<TajweedGroup, "plain">;
  label: string;
  arabic: string;
  hint: string;
  extra?: boolean;
}[] = [
  {
    group: "madd6",
    label: "Al-Madd 6 Harakat",
    arabic: "المد اللازم",
    hint: "Allongement obligatoire de 6 temps.",
  },
  {
    group: "madd45",
    label: "Al-Madd 4-5 Harakat",
    arabic: "المد الواجب",
    hint: "Allongement de 4 à 5 temps.",
  },
  {
    group: "madd246",
    label: "Al-Madd 2-4-6 Harakat",
    arabic: "المد الجائز",
    hint: "Allongement variable de 2, 4 ou 6 temps.",
  },
  {
    group: "ghunnah",
    label: "Ġunnah 2 Harakat",
    arabic: "الغنة",
    hint: "Nasalisation tenue 2 temps sur مّ / نّ.",
  },
  {
    group: "idgham",
    label: "'Idġâm",
    arabic: "الإدغام",
    hint: "Fusion de la lettre dans la suivante.",
  },
  {
    group: "tafkheem",
    label: "Tafkheem",
    arabic: "التفخيم",
    hint: "Lettres emphatiques : خ ص ض ط ظ غ ق.",
  },
  {
    group: "qalqalah",
    label: "Q̇alq̇alah",
    arabic: "القلقلة",
    hint: "Rebond sur ق ط ب ج د avec soukoûn.",
  },
  {
    group: "ikhfa",
    label: "Ikhfâ'",
    arabic: "الإخفاء",
    hint: "Prononciation dissimulée avec nasalisation.",
    extra: true,
  },
  {
    group: "iqlab",
    label: "Iqlâb",
    arabic: "الإقلاب",
    hint: "Le noûn devient un mîm devant ب.",
    extra: true,
  },
  {
    group: "silent",
    label: "Lettre non prononcée",
    arabic: "حرف لا يُنطق",
    hint: "Hamzat al-waṣl, lettre muette, lâm solaire.",
    extra: true,
  },
];

/** Lettres d'isti'lâ' (tafkheem) détectées hors annotation API. */
const TAFKHEEM_LETTERS = new Set(["خ", "ص", "ض", "ط", "ظ", "غ", "ق"]);
const ARABIC_MARKS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/;

export type TajweedSegment = {
  text: string;
  rule: TajweedRule | null;
  group: TajweedGroup;
};

const TOKEN = /\[([a-z])(?::\d+)?\[([^\]]*)\]/g;

/** Découpe une chaîne brute en segments colorables. */
export function parseTajweed(raw: string, withTafkheem = true): TajweedSegment[] {
  const segments: TajweedSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TOKEN.lastIndex = 0;

  const pushPlain = (text: string) => {
    if (!text) return;
    if (!withTafkheem) {
      segments.push({ text, rule: null, group: "plain" });
      return;
    }
    segments.push(...splitTafkheem(text));
  };

  while ((match = TOKEN.exec(raw)) !== null) {
    pushPlain(raw.slice(lastIndex, match.index));
    const rule = CODE_TO_RULE[match[1]];
    if (rule) {
      segments.push({ text: match[2], rule, group: RULE_TO_GROUP[rule] });
    } else {
      pushPlain(match[2]);
    }
    lastIndex = match.index + match[0].length;
  }
  pushPlain(raw.slice(lastIndex));
  return segments;
}

/** Colore les lettres emphatiques restées non annotées. */
function splitTafkheem(text: string): TajweedSegment[] {
  const out: TajweedSegment[] = [];
  let buffer = "";
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (!TAFKHEEM_LETTERS.has(char)) {
      buffer += char;
      continue;
    }
    if (buffer) out.push({ text: buffer, rule: null, group: "plain" });
    buffer = "";
    let chunk = char;
    let j = i + 1;
    while (j < text.length && ARABIC_MARKS.test(text[j])) {
      chunk += text[j];
      j += 1;
    }
    i = j - 1;
    out.push({ text: chunk, rule: "tafkheem", group: "tafkheem" });
  }
  if (buffer) out.push({ text: buffer, rule: null, group: "plain" });
  return out;
}

/** Retire toute annotation pour obtenir un texte arabe simple. */
export function stripTajweed(raw: string) {
  return raw.replace(TOKEN, (_, __, text) => text);
}

/** Compte les règles présentes dans un verset (statistiques d'aide). */
export function countRules(segments: TajweedSegment[]) {
  const counts = new Map<TajweedGroup, number>();
  for (const segment of segments) {
    if (segment.group === "plain") continue;
    counts.set(segment.group, (counts.get(segment.group) ?? 0) + 1);
  }
  return counts;
}
