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
  madda_necessary: "madd6", // المد اللازم — 6 harakât
  madda_obligatory: "madd45", // المد الواجب المتصل — 4 à 5 harakât
  madda_permissible: "madd246", // المد الجائز المنفصل — 2, 4 ou 6 harakât
  madda_normal: "plain", // madd naturel : pas de couleur
  // Nasalisation (ghunnah) : shaddah sur ن/م, idghâm bi-ghunnah, ikhfâ', iqlâb, ikhfâ' shafawî
  ghunnah: "ghunnah",
  idgham_ghunnah: "ghunnah",
  ikhafa: "ghunnah",
  ikhafa_shafawi: "ghunnah",
  idgham_shafawi: "ghunnah",
  iqlab: "ghunnah",
  // Idghâm sans nasalisation (ل ر) et idghâm des lettres proches/semblables
  idgham_wo_ghunnah: "idgham",
  idgham_mutajanisayn: "idgham",
  idgham_mutaqaribayn: "idgham",
  // Rebond
  qalaqah: "qalqalah",
  // Emphase
  tafkheem: "tafkheem",
  // Non coloré
  ham_wasl: "plain",
  slnt: "plain",
  laam_shamsiyah: "plain",
};

export const TAJWEED_LEGEND: {
  group: Exclude<TajweedGroup, "plain">;
  label: string;
  arabic: string;
  hint: string;
}[] = [
  {
    group: "madd6",
    label: "Al-Madd Lâzim — 6 harakât",
    arabic: "المد اللازم",
    hint: "Lettre de madd (ا و ي) suivie d'une shaddah ou d'un soukoûn permanent. Ex. الضَّالِّينَ.",
  },
  {
    group: "madd45",
    label: "Al-Madd Wâjib Muttasil — 4-5 harakât",
    arabic: "المد الواجب المتصل",
    hint: "Lettre de madd suivie d'un hamzah dans le même mot. Ex. جَاءَ, السَّمَاءِ, سُوءٌ.",
  },
  {
    group: "madd246",
    label: "Al-Madd Jâ'iz Munfasil — 2/4/6 harakât",
    arabic: "المد الجائز المنفصل",
    hint: "Madd en fin de mot, mot suivant commençant par un hamzah. Ex. فِي أَنفُسِكُمْ.",
  },
  {
    group: "ghunnah",
    label: "Ġunnah — 2 harakât",
    arabic: "الغنة",
    hint: "نّ / مّ avec shaddah, idghâm bi-ghunnah (ينمو), ikhfâ' (15 lettres), iqlâb (نْ + ب), ikhfâ' shafawî (مْ + ب).",
  },
  {
    group: "idgham",
    label: "'Idġâm sans ġunnah",
    arabic: "الإدغام بغير غنة",
    hint: "نْ ou tanwîn suivi de ل ou ر : fusion sans nasalisation. Ex. مِنْ رَبِّهِمْ, مِنْ لَدُنْهُ.",
  },
  {
    group: "tafkheem",
    label: "Tafkhîm",
    arabic: "التفخيم",
    hint: "Lettres emphatiques prononcées « grasses » : خ ص ض ط ظ غ ق.",
  },
  {
    group: "qalqalah",
    label: "Q̇alq̇alah",
    arabic: "القلقلة",
    hint: "Rebond sur قطب جد (ق ط ب ج د) en soukoûn. Mineure au milieu du mot, majeure à l'arrêt.",
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
