/**
 * Analyse du texte coranique annoté « quran-tajweed » (api.alquran.cloud).
 *
 * Le format renvoyé par l'API est du type : `عَ[g[مّ]َ [h:14239[ٱ][l[لل]...`
 * soit `[code[texte]` où `code` est une lettre (éventuellement suivie de `:id`).
 *
 * Couleurs conservées (comme sur un mushaf coloré) :
 * madd 6 · madd 4-5 · madd 2-4-6 · ghunnah · idghâm · tafkhîm · qalqalah.
 * Toutes les autres annotations sont rendues en couleur du texte normal.
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

/** Les 7 groupes de couleurs du mushaf coloré. */
export type TajweedGroup =
  | "madd6"
  | "madd45"
  | "madd246"
  | "ghunnah"
  | "idgham"
  | "tafkheem"
  | "qalqalah"
  | "plain";

const RULE_TO_GROUP: Record<TajweedRule, TajweedGroup> = {
  // Allongements
  madda_necessary: "madd6", // rouge — 6 temps
  madda_obligatory: "madd45", // rose — 4 temps
  madda_permissible: "madd246", // orange — 2/4/6 temps
  madda_normal: "plain", // madd naturel : pas de couleur
  // Vert : rounna / ghunnah
  ghunnah: "ghunnah",
  idgham_ghunnah: "ghunnah",
  ikhafa: "ghunnah",
  ikhafa_shafawi: "ghunnah",
  idgham_shafawi: "ghunnah",
  iqlab: "ghunnah",
  // Gris : lettres non prononcées / fusionnées
  idgham_wo_ghunnah: "idgham",
  idgham_mutajanisayn: "idgham",
  idgham_mutaqaribayn: "idgham",
  slnt: "idgham",
  laam_shamsiyah: "idgham",
  // Bleu marine
  qalaqah: "qalqalah",
  // Bleu foncé
  tafkheem: "tafkheem",
  // Non coloré
  ham_wasl: "plain",
};

export const TAJWEED_LEGEND: {
  group: Exclude<TajweedGroup, "plain">;
  label: string;
  arabic: string;
  hint: string;
}[] = [
  {
    group: "madd6",
    label: "Rouge — allongement 6 temps",
    arabic: "المد اللازم",
    hint: "Allongement obligatoire de 6 harakât (ex. fin de la sourate Al-Fâtiha : الضَّالِّينَ).",
  },
  {
    group: "madd45",
    label: "Rose — allongement 4 (à 5) temps",
    arabic: "المد الواجب المتصل",
    hint: "Lettre de madd suivie d'un hamzah dans le même mot. Ex. جَاءَ, السَّمَاءِ.",
  },
  {
    group: "madd246",
    label: "Orange — allongement 2, 4 ou 6 temps",
    arabic: "المد الجائز المنفصل",
    hint: "Allongement souple, souvent en fin de verset ou avant un mot commençant par hamzah. Ex. فِي أَنفُسِكُمْ.",
  },
  {
    group: "ghunnah",
    label: "Vert — rounna (nasillement), 2 temps",
    arabic: "الغنة",
    hint: "Le son sort par le nez pendant 2 temps : نّ / مّ, idghâm bi-ghunnah, ikhfâ', iqlâb.",
  },
  {
    group: "idgham",
    label: "Gris — lettre non prononcée",
    arabic: "الإدغام / الحرف الساكت",
    hint: "On lit comme si la lettre n'existait pas : lettres muettes, lâm solaire, idghâm sans ghunnah (ل ر).",
  },
  {
    group: "qalqalah",
    label: "Bleu marine — qalqalah",
    arabic: "القلقلة",
    hint: "Vibration explosive sur ق ط ب ج د en soukoûn ou à l'arrêt. Ex. « Ibrahim » → « i-beu-rôhîm ».",
  },
  {
    group: "tafkheem",
    label: "Bleu foncé — emphatisation",
    arabic: "التفخيم",
    hint: "Le fond de la langue remonte au palais : خ ص ض ط ظ غ ق, et اللَّه → « A-LLOOH ».",
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
    if (rule && RULE_TO_GROUP[rule] !== "plain") {
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
