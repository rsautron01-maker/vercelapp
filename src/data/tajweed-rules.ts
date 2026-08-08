/** Cours de tajwid : règles conservées, explications, conditions et exemples. */

export type TajweedRuleCard = {
  id: string;
  title: string;
  arabic: string;
  duration: string;
  summary: string;
  conditions: string[];
  examples: { arabic: string; note: string }[];
  mistake: string;
};

export type TajweedFamily = {
  id: string;
  name: string;
  intro: string;
  rules: TajweedRuleCard[];
};

export const TAJWEED_COURSE: TajweedFamily[] = [
  {
    id: "madd",
    name: "Al-Madd — les allongements",
    intro:
      "Le madd est l'allongement d'une lettre de prolongation (ا و ي). Sa durée se compte en harakât (une haraka ≈ la durée d'une lettre courte). Trois allongements demandent une durée précise.",
    rules: [
      {
        id: "madd-lazim",
        title: "Al-Madd Lâzim — 6 harakât",
        arabic: "المد اللازم",
        duration: "6 harakât (obligatoire)",
        summary:
          "Une lettre de madd est suivie d'une shaddah ou d'un soukoûn permanent : l'allongement est obligatoirement de 6 temps.",
        conditions: [
          "Lettre de madd : ا، و، ي",
          "Suivie d'une shaddah (madd lâzim mushaddad) ou d'un soukoûn fixe (madd lâzim mukhaffaf)",
          "La durée ne varie jamais : toujours 6 harakât",
        ],
        examples: [
          { arabic: "الضَّالِّينَ", note: "ا suivi de لّ avec shaddah — Al-Fâtiha v.7" },
          { arabic: "الْحَاقَّةُ", note: "ا suivi de قّ — Al-Hâqqa v.1" },
          { arabic: "آلْآنَ", note: "madd lâzim mukhaffaf (soukoûn) — Yûnus v.51" },
        ],
        mistake: "Le raccourcir à 2 ou 4 temps : ici la longueur est fixée, pas au choix.",
      },
      {
        id: "madd-wajib",
        title: "Al-Madd Wâjib Muttasil — 4 à 5 harakât",
        arabic: "المد الواجب المتصل",
        duration: "4 à 5 harakât (obligatoire)",
        summary:
          "Une lettre de madd est suivie d'un hamzah (ء) dans le même mot : l'allongement est obligatoire, entre 4 et 5 temps.",
        conditions: [
          "Le hamzah suit immédiatement la lettre de madd",
          "Les deux se trouvent dans un seul et même mot (« muttasil » = attaché)",
          "Longueur constante dans une même récitation : 4 ou 5 harakât",
        ],
        examples: [
          { arabic: "جَاءَ", note: "ا + ء dans le même mot" },
          { arabic: "السَّمَاءِ", note: "ا + ء — Al-Baqara v.19" },
          { arabic: "سُوءٌ", note: "و + ء" },
          { arabic: "سِيءَ", note: "ي + ء" },
        ],
        mistake: "Le prononcer comme un madd naturel de 2 temps.",
      },
      {
        id: "madd-jaiz",
        title: "Al-Madd Jâ'iz Munfasil — 2, 4 ou 6 harakât",
        arabic: "المد الجائز المنفصل",
        duration: "2, 4 ou 6 harakât (permis)",
        summary:
          "Le madd est à la fin d'un mot et le mot suivant commence par un hamzah : l'allongement est permis (jâ'iz), la durée dépend de la voie de récitation.",
        conditions: [
          "Lettre de madd en fin de mot",
          "Hamzah au début du mot suivant (« munfasil » = séparé)",
          "2, 4 ou 6 harakât — mais garde la même durée pendant toute la récitation",
        ],
        examples: [
          { arabic: "فِي أَنفُسِكُمْ", note: "ي final + أ du mot suivant" },
          { arabic: "قُوا أَنفُسَكُمْ", note: "و final + أ" },
          { arabic: "يَا أَيُّهَا", note: "ا final + أ" },
        ],
        mistake: "Changer de durée d'un verset à l'autre : reste cohérent.",
      },
    ],
  },
  {
    id: "ghunnah",
    name: "Al-Ġunnah — la nasalisation",
    intro:
      "La ghunnah est un son nasal maintenu environ 2 harakât, produit dans le nez. Elle accompagne le nûn et le mîm dans plusieurs situations.",
    rules: [
      {
        id: "ghunnah",
        title: "Ġunnah — 2 harakât",
        arabic: "الغنة",
        duration: "2 harakât",
        summary:
          "Nasalisation complète sur نّ et مّ portant une shaddah, et dans les cas d'assimilation nasale.",
        conditions: [
          "نّ ou مّ avec shaddah : ghunnah complète et obligatoire",
          "Ikhfâ' : nûn/tanwîn suivi d'une des 15 lettres d'ikhfâ' — son voilé et nasalisé",
          "Iqlâb : نْ ou tanwîn suivi de ب — le nûn devient un mîm nasalisé",
          "Ikhfâ' shafawî : مْ suivi de ب — mîm voilé avec ghunnah",
        ],
        examples: [
          { arabic: "إِنَّ", note: "نّ avec shaddah — ghunnah franche" },
          { arabic: "ثُمَّ", note: "مّ avec shaddah" },
          { arabic: "مِنْ شَيْءٍ", note: "ikhfâ' : نْ + ش" },
          { arabic: "مِنْ بَعْدِ", note: "iqlâb : نْ + ب → son de mîm" },
        ],
        mistake: "Écourter la nasalisation ou la produire dans la bouche au lieu du nez.",
      },
    ],
  },
  {
    id: "idgham",
    name: "Al-'Idġâm — la fusion",
    intro:
      "L'idghâm consiste à fondre le nûn en soukoûn (ou un tanwîn) dans la lettre suivante. Les six lettres concernées sont réunies dans le mot يرملون.",
    rules: [
      {
        id: "idgham-ghunnah",
        title: "'Idġâm avec ġunnah",
        arabic: "إدغام بغنة",
        duration: "2 harakât de ghunnah",
        summary:
          "Le nûn en soukoûn ou le tanwîn se fond dans ي ن م و (ينمو) avec une nasalisation de 2 temps.",
        conditions: [
          "نْ ou tanwîn en fin de mot",
          "Lettre suivante : ي، ن، م، و",
          "La fusion se fait entre deux mots (sauf دنيا، بنيان، صنوان، قنوان : idghâm interdit)",
        ],
        examples: [
          { arabic: "مَنْ يَعْمَلْ", note: "نْ + ي — fusion nasalisée" },
          { arabic: "مِنْ وَالٍ", note: "نْ + و" },
          { arabic: "خَيْرٌ مِنْ", note: "tanwîn + م" },
        ],
        mistake: "Prononcer le nûn distinctement au lieu de le fondre.",
      },
      {
        id: "idgham-sans-ghunnah",
        title: "'Idġâm sans ġunnah",
        arabic: "إدغام بغير غنة",
        duration: "Sans nasalisation",
        summary: "Le nûn en soukoûn ou le tanwîn se fond totalement dans ل ou ر, sans ghunnah.",
        conditions: [
          "نْ ou tanwîn en fin de mot",
          "Lettre suivante : ل ou ر",
          "Aucune nasalisation : le nûn disparaît dans la lettre suivante redoublée",
        ],
        examples: [
          { arabic: "مِنْ رَبِّهِمْ", note: "نْ + ر — devient رّ" },
          { arabic: "مِنْ لَدُنْهُ", note: "نْ + ل" },
          { arabic: "هُدًى لِّلْمُتَّقِينَ", note: "tanwîn + ل — Al-Baqara v.2" },
        ],
        mistake: "Ajouter une ghunnah alors qu'il n'y en a pas.",
      },
    ],
  },
  {
    id: "tafkheem",
    name: "At-Tafkhîm — l'emphase",
    intro:
      "Le tafkhîm est l'épaississement du son : la langue se soulève vers le palais et la bouche se remplit du son de la lettre.",
    rules: [
      {
        id: "tafkheem",
        title: "Tafkhîm",
        arabic: "التفخيم",
        duration: "Qualité permanente de la lettre",
        summary:
          "Les sept lettres d'isti'lâ' خ ص ض ط ظ غ ق se prononcent « grasses », jamais fines.",
        conditions: [
          "Lettres d'isti'lâ' : خ، ص، ض، ط، ظ، غ، ق",
          "Emphase maximale avec la fatha et la damma, moindre avec la kasra",
          "Cas particuliers : le ر après fatha/damma, et le lâm de لَفْظ الجلالة (اللَّه) après fatha/damma",
        ],
        examples: [
          { arabic: "الطَّارِقُ", note: "ط emphatique" },
          { arabic: "الصَّمَدُ", note: "ص emphatique" },
          { arabic: "قُلْ", note: "ق emphatique, jamais un « k » fin" },
        ],
        mistake: "Prononcer ط comme un « t » français ou ق comme un « k ».",
      },
    ],
  },
  {
    id: "qalqalah",
    name: "Al-Q̇alq̇alah — le rebond",
    intro:
      "La qalqalah est un léger rebond du son lorsqu'une des cinq lettres قطب جد est en soukoûn.",
    rules: [
      {
        id: "qalqalah",
        title: "Q̇alq̇alah",
        arabic: "القلقلة",
        duration: "Rebond bref",
        summary:
          "Rebond audible sur ق، ط، ب، ج، د en soukoûn, sans ajouter de voyelle.",
        conditions: [
          "Lettres : ق، ط، ب، ج، د (mot-clé : قطب جد)",
          "Qalqalah mineure (صغرى) : la lettre est en soukoûn au milieu du mot",
          "Qalqalah majeure (كبرى) : la lettre est en fin de mot à l'arrêt — rebond plus marqué",
        ],
        examples: [
          { arabic: "يَقْطَعُونَ", note: "qalqalah mineure sur قْ" },
          { arabic: "أَحَدْ", note: "qalqalah majeure à l'arrêt — Al-Ikhlâs v.1" },
          { arabic: "الْفَلَقْ", note: "qalqalah majeure — Al-Falaq v.1" },
        ],
        mistake: "Transformer le rebond en voyelle (« ad-a ») au lieu d'un simple choc.",
      },
    ],
  },
];

export const TAJWEED_LEVELS = [
  {
    level: "Débutant",
    goal: "Reconnaître les lettres et les voyelles, lire lentement sans erreur de lettre.",
    focus: ["Points d'articulation", "Madd naturel 2 temps", "Ghunnah sur نّ / مّ"],
  },
  {
    level: "Intermédiaire",
    goal: "Appliquer les règles du nûn en soukoûn et du tanwîn de façon automatique.",
    focus: ["Idghâm avec et sans ghunnah", "Ikhfâ' et iqlâb", "Qalqalah mineure et majeure"],
  },
  {
    level: "Avancé",
    goal: "Maîtriser les durées et les qualités de lettres à vitesse normale.",
    focus: ["Madd lâzim 6 temps", "Madd muttasil / munfasil", "Tafkhîm et tarqîq du ر et du ل"],
  },
];
