// Banques de questions : culture islamique, prophètes, devinettes, tajwid.
export type QuizCategory =
  | "islam"
  | "prophetes"
  | "devinette"
  | "tajweed"
  | "tawhid"
  | "seerah"
  | "fiqh"
  | "coran-sciences";

export type QuizQuestion = {
  category: QuizCategory;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export const QUIZ: QuizQuestion[] = [
  // ---------- Culture islamique ----------
  {
    category: "islam",
    question: "Combien de piliers compte l'islam ?",
    options: ["3", "5", "6", "7"],
    answer: "5",
    explanation: "Shahâda, salât, zakât, sawm (jeûne) et hajj.",
  },
  {
    category: "islam",
    question: "Combien y a-t-il de sourates dans le Coran ?",
    options: ["99", "110", "114", "120"],
    answer: "114",
    explanation: "Le Coran compte 114 sourates et 30 juzz.",
  },
  {
    category: "islam",
    question: "Quelle est la première sourate du Coran ?",
    options: ["Al-Baqara", "Al-Faatiha", "An-Naas", "Yaseen"],
    answer: "Al-Faatiha",
    explanation: "Al-Faatiha, « l'Ouverture », 7 versets, récitée à chaque rak'a.",
  },
  {
    category: "islam",
    question: "Quelle sourate est appelée « le cœur du Coran » ?",
    options: ["Yaseen", "Al-Kahf", "Ar-Rahmaan", "Al-Mulk"],
    answer: "Yaseen",
    explanation: "Sourate Yaseen (36) est traditionnellement nommée ainsi.",
  },
  {
    category: "islam",
    question: "Combien de prières obligatoires par jour ?",
    options: ["3", "5", "6", "7"],
    answer: "5",
    explanation: "Fajr, Dhuhr, 'Asr, Maghrib et 'Ishâ.",
  },
  {
    category: "islam",
    question: "Dans quel mois le Coran a-t-il commencé à être révélé ?",
    options: ["Rajab", "Ramadan", "Muharram", "Sha'bân"],
    answer: "Ramadan",
    explanation: "« Le mois de Ramadan durant lequel le Coran a été descendu » (2:185).",
  },
  {
    category: "islam",
    question: "Quelle est la sourate la plus longue ?",
    options: ["Al-Baqara", "An-Nisaa", "Aal-i-Imraan", "Al-Maaida"],
    answer: "Al-Baqara",
    explanation: "Al-Baqara compte 286 versets.",
  },
  {
    category: "islam",
    question: "Quelle est la sourate la plus courte ?",
    options: ["Al-Ikhlaas", "Al-Kawthar", "An-Nasr", "Al-'Asr"],
    answer: "Al-Kawthar",
    explanation: "Al-Kawthar (108) ne compte que 3 versets.",
  },
  {
    category: "islam",
    question: "Combien de juzz (parties) compte le Coran ?",
    options: ["20", "30", "40", "60"],
    answer: "30",
    explanation: "30 juzz, souvent divisés en 60 hizb.",
  },
  {
    category: "islam",
    question: "Quelle sourate ne commence pas par la basmala ?",
    options: ["At-Tawba", "Al-Fath", "An-Nahl", "Al-Hajj"],
    answer: "At-Tawba",
    explanation: "At-Tawba (9) est la seule sourate sans basmala.",
  },
  {
    category: "islam",
    question: "Vers quelle direction prie-t-on ?",
    options: ["Jérusalem", "La Kaaba à La Mecque", "Médine", "Le Nord"],
    answer: "La Kaaba à La Mecque",
    explanation: "La qibla est orientée vers la Kaaba (2:144).",
  },
  {
    category: "islam",
    question: "Que signifie « hifz » ?",
    options: ["Réciter", "Mémoriser", "Écouter", "Traduire"],
    answer: "Mémoriser",
    explanation: "Le hifz est la mémorisation du Coran ; celui qui l'achève est hâfiz.",
  },

  // ---------- Prophètes ----------
  {
    category: "prophetes",
    question: "Quel prophète a été avalé par un grand poisson ?",
    options: ["Yunus", "Yusuf", "Musa", "Nuh"],
    answer: "Yunus",
    explanation: "Yunus (Jonas) — voir sourate As-Saaffaat 139-148.",
  },
  {
    category: "prophetes",
    question: "Quel prophète a construit l'arche ?",
    options: ["Nuh", "Ibrahim", "Hud", "Salih"],
    answer: "Nuh",
    explanation: "Nuh (Noé) a construit l'arche sur ordre d'Allah.",
  },
  {
    category: "prophetes",
    question: "Quel prophète a été jeté dans un puits par ses frères ?",
    options: ["Yusuf", "Ya'qub", "Ismail", "Ishaq"],
    answer: "Yusuf",
    explanation: "Sourate Yusuf (12) raconte toute son histoire.",
  },
  {
    category: "prophetes",
    question: "À quel prophète le Zabûr (Psaumes) a-t-il été donné ?",
    options: ["Dawud", "Sulayman", "Musa", "'Isa"],
    answer: "Dawud",
    explanation: "Le Zabûr fut révélé à Dawud (David).",
  },
  {
    category: "prophetes",
    question: "Quel prophète comprenait le langage des oiseaux et des fourmis ?",
    options: ["Sulayman", "Dawud", "Idris", "Ayyub"],
    answer: "Sulayman",
    explanation: "Sourate An-Naml (27) évoque Sulayman et la fourmi.",
  },
  {
    category: "prophetes",
    question: "Quel prophète est connu pour son immense patience dans la maladie ?",
    options: ["Ayyub", "Yaqub", "Zakariya", "Lut"],
    answer: "Ayyub",
    explanation: "Ayyub (Job), modèle de sabr.",
  },
  {
    category: "prophetes",
    question: "Quel prophète a fendu la mer avec son bâton ?",
    options: ["Musa", "Harun", "Yusha", "Ilyas"],
    answer: "Musa",
    explanation: "Musa (Moïse), sourate Ash-Shu'araa 63.",
  },
  {
    category: "prophetes",
    question: "Qui est le père des prophètes Ismail et Ishaq ?",
    options: ["Ibrahim", "Nuh", "Adam", "Idris"],
    answer: "Ibrahim",
    explanation: "Ibrahim (Abraham), Khalîl Allah.",
  },
  {
    category: "prophetes",
    question: "Quel prophète est né sans père par la volonté d'Allah ?",
    options: ["'Isa", "Yahya", "Adam", "Musa"],
    answer: "'Isa",
    explanation: "'Isa fils de Maryam — sourate Maryam (19).",
  },
  {
    category: "prophetes",
    question: "Quel est le dernier des prophètes ?",
    options: ["Muhammad ﷺ", "'Isa", "Ibrahim", "Musa"],
    answer: "Muhammad ﷺ",
    explanation: "Il est le « sceau des prophètes » (33:40).",
  },
  {
    category: "prophetes",
    question: "Quel prophète a été envoyé au peuple de Thamûd ?",
    options: ["Salih", "Hud", "Shu'ayb", "Lut"],
    answer: "Salih",
    explanation: "Salih et le signe de la chamelle.",
  },

  // ---------- Devinettes ----------
  {
    category: "devinette",
    question:
      "Je suis récitée dans chaque prière, j'ouvre le Livre et on m'appelle « la mère du Coran ». Qui suis-je ?",
    options: ["Al-Faatiha", "Al-Ikhlaas", "Al-Baqara", "An-Naas"],
    answer: "Al-Faatiha",
    explanation: "Al-Faatiha est surnommée Umm al-Qur'ân.",
  },
  {
    category: "devinette",
    question: "Je vaux le tiers du Coran en récompense et je parle de l'unicité d'Allah. Qui suis-je ?",
    options: ["Al-Ikhlaas", "Al-Falaq", "Al-Kawthar", "Al-'Asr"],
    answer: "Al-Ikhlaas",
    explanation: "Sourate Al-Ikhlaas (112) équivaut au tiers du Coran.",
  },
  {
    category: "devinette",
    question:
      "On me lit le vendredi, je raconte les gens de la caverne et Dhul-Qarnayn. Qui suis-je ?",
    options: ["Al-Kahf", "Al-Anbiyaa", "Al-Qasas", "Maryam"],
    answer: "Al-Kahf",
    explanation: "Sourate Al-Kahf (18).",
  },
  {
    category: "devinette",
    question: "Un verset répète 31 fois « Lequel donc des bienfaits de votre Seigneur nierez-vous ? ». Où ?",
    options: ["Ar-Rahmaan", "Al-Waaqia", "Al-Qamar", "Al-Mulk"],
    answer: "Ar-Rahmaan",
    explanation: "Sourate Ar-Rahmaan (55).",
  },
  {
    category: "devinette",
    question: "Je suis le plus grand verset du Coran, on m'appelle « verset du Trône ». Qui suis-je ?",
    options: ["Al-Baqara 255", "Al-Baqara 286", "Aal-i-Imraan 1", "An-Noor 35"],
    answer: "Al-Baqara 255",
    explanation: "Âyat al-Kursî : Al-Baqara, verset 255.",
  },
  {
    category: "devinette",
    question: "Deux sourates protectrices, on les récite ensemble matin et soir. Lesquelles ?",
    options: ["Al-Falaq et An-Naas", "Al-'Asr et Al-Fil", "Al-Fath et An-Nasr", "Ad-Duha et Ash-Sharh"],
    answer: "Al-Falaq et An-Naas",
    explanation: "Ce sont les Mu'awwidhatân.",
  },
  {
    category: "devinette",
    question: "Je porte le nom d'un insecte qui produit un remède mentionné dans le Coran. Qui suis-je ?",
    options: ["An-Nahl", "An-Naml", "Al-Ankaboot", "Al-Fil"],
    answer: "An-Nahl",
    explanation: "An-Nahl (16), « Les Abeilles », le miel comme guérison.",
  },

  // ---------- Tajwid ----------
  {
    category: "tajweed",
    question: "Quelles sont les lettres de l'idghâm avec ghunnah ?",
    options: ["ي ن م و (ينمو)", "ل ر", "ق ط ب ج د", "ء ه ع ح غ خ"],
    answer: "ي ن م و (ينمو)",
    explanation: "نْ ou tanwîn + ينمو → fusion avec ghunnah de 2 temps.",
  },
  {
    category: "tajweed",
    question: "Quelles lettres donnent un idghâm sans ghunnah ?",
    options: ["ل ر", "ي ن م و", "ب", "ص ض ط ظ"],
    answer: "ل ر",
    explanation: "Ex. مِنْ رَبِّهِمْ, مِنْ لَدُنْهُ — fusion sans nasalisation.",
  },
  {
    category: "tajweed",
    question: "Combien de lettres a la qalqalah ?",
    options: ["3", "5", "6", "15"],
    answer: "5",
    explanation: "ق ط ب ج د, mémorisées par قطب جد.",
  },
  {
    category: "tajweed",
    question: "Quand fait-on l'iqlâb ?",
    options: [
      "نْ ou tanwîn suivi de ب",
      "مْ suivi de ل",
      "madd suivi d'un hamzah",
      "ن avec shaddah",
    ],
    answer: "نْ ou tanwîn suivi de ب",
    explanation: "Le noûn se transforme en mîm caché avec ghunnah.",
  },
  {
    category: "tajweed",
    question: "Combien de temps dure Al-Madd Lâzim ?",
    options: ["2 harakât", "4 harakât", "6 harakât", "2, 4 ou 6"],
    answer: "6 harakât",
    explanation: "Madd suivi d'une shaddah ou d'un soukoûn permanent : toujours 6 temps.",
  },
  {
    category: "tajweed",
    question: "Al-Madd Wâjib Muttasil apparaît quand…",
    options: [
      "un madd est suivi d'un hamzah dans le même mot",
      "un madd est suivi d'un hamzah dans le mot suivant",
      "un ن porte une shaddah",
      "une lettre est en soukoûn",
    ],
    answer: "un madd est suivi d'un hamzah dans le même mot",
    explanation: "Ex. جَاءَ, السَّمَاءِ, سُوءٌ — 4 à 5 temps.",
  },
  {
    category: "tajweed",
    question: "Quelle règle s'applique à إِنَّ et ثُمَّ ?",
    options: ["Ghunnah", "Qalqalah", "Idghâm sans ghunnah", "Madd 6"],
    answer: "Ghunnah",
    explanation: "ن ou م avec shaddah → ghunnah de 2 temps, toujours.",
  },
  {
    category: "tajweed",
    question: "Qu'est-ce que la qalqalah majeure (كبرى) ?",
    options: [
      "La lettre est en fin de mot et on s'arrête dessus",
      "La lettre est au milieu du mot",
      "La lettre porte une shaddah",
      "La lettre est allongée 6 temps",
    ],
    answer: "La lettre est en fin de mot et on s'arrête dessus",
    explanation: "Ex. الْفَلَقْ, أَحَدْ en waqf : le rebond est plus marqué.",
  },
  {
    category: "tajweed",
    question: "Quelles sont les lettres du tafkhîm (isti'lâ') ?",
    options: ["خ ص ض ط ظ غ ق", "ي ر م ل و ن", "ق ط ب ج د", "ا و ي"],
    answer: "خ ص ض ط ظ غ ق",
    explanation: "Elles se prononcent « grasses », la bouche pleine.",
  },
  {
    category: "tajweed",
    question: "Al-Madd Jâ'iz Munfasil, c'est…",
    options: [
      "madd en fin de mot + mot suivant commençant par hamzah",
      "madd + shaddah",
      "نْ + ب",
      "مْ + م",
    ],
    answer: "madd en fin de mot + mot suivant commençant par hamzah",
    explanation: "Ex. فِي أَنفُسِكُمْ, بِمَا أُنزِلَ — 2, 4 ou 6 temps.",
  },
  {
    category: "tajweed",
    question: "Que fait-on quand مْ est suivi de ب ?",
    options: ["Ikhfâ' shafawî avec ghunnah", "Qalqalah", "Idghâm sans ghunnah", "Rien de particulier"],
    answer: "Ikhfâ' shafawî avec ghunnah",
    explanation: "Les lèvres restent légèrement ouvertes, avec nasalisation.",
  },
  {
    category: "tajweed",
    question: "Les 6 lettres de l'idghâm se retiennent avec quel mot ?",
    options: ["يرملون", "قطب جد", "ينمو", "الضالين"],
    answer: "يرملون",
    explanation: "ينمو → avec ghunnah, ل ر → sans ghunnah.",
  },
];

export function randomQuiz(category: QuizCategory): QuizQuestion {
  const pool = QUIZ.filter((q) => q.category === category);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}
