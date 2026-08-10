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

  // ---------- Tawhid / 'aqîda ----------
  {
    category: "tawhid",
    question: "Combien de catégories de tawhid les savants distinguent-ils ?",
    options: ["2", "3", "4", "5"],
    answer: "3",
    explanation: "Rubûbiyya (seigneurie), Ulûhiyya (adoration) et Asmâ' wa Sifât (noms et attributs).",
  },
  {
    category: "tawhid",
    question: "Quelle sourate est appelée « la sourate du tawhid » ?",
    options: ["Al-Ikhlaas", "Al-Faatiha", "Al-Kawthar", "An-Nasr"],
    answer: "Al-Ikhlaas",
    explanation: "Sourate 112 : « Dis : Il est Allah, l'Unique ».",
  },
  {
    category: "tawhid",
    question: "Que signifie le tawhid al-ulûhiyya ?",
    options: [
      "N'adorer qu'Allah seul",
      "Croire qu'Allah est le créateur",
      "Affirmer Ses noms et attributs",
      "Croire aux anges",
    ],
    answer: "N'adorer qu'Allah seul",
    explanation: "Toute adoration (prière, invocation, sacrifice) est due à Allah seul.",
  },
  {
    category: "tawhid",
    question: "Comment nomme-t-on le fait d'associer quelqu'un à Allah dans l'adoration ?",
    options: ["Shirk", "Kufr al-ni'ma", "Bid'a", "Nifâq"],
    answer: "Shirk",
    explanation: "Le shirk majeur annule les œuvres : « Allah ne pardonne pas qu'on Lui associe » (4:48).",
  },
  {
    category: "tawhid",
    question: "Combien de piliers compte la foi (îmân) ?",
    options: ["5", "6", "7", "3"],
    answer: "6",
    explanation: "Allah, les anges, les Livres, les messagers, le Jour dernier et le décret.",
  },
  {
    category: "tawhid",
    question: "Quel verset est le plus grand verset du Coran, centré sur l'unicité d'Allah ?",
    options: ["Ayat al-Kursî (2:255)", "Al-Baqara 286", "An-Noor 35", "Al-Hashr 22"],
    answer: "Ayat al-Kursî (2:255)",
    explanation: "« Allah ! Point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même ».",
  },
  {
    category: "tawhid",
    question: "Que veut dire « Lâ ilâha illâ Allah » ?",
    options: [
      "Nulle divinité (digne d'adoration) sauf Allah",
      "Allah est grand",
      "Louange à Allah",
      "Allah est unique dans la création",
    ],
    answer: "Nulle divinité (digne d'adoration) sauf Allah",
    explanation: "Négation de toute autre divinité + affirmation exclusive pour Allah.",
  },
  {
    category: "tawhid",
    question: "Le tawhid des noms et attributs impose de les affirmer…",
    options: [
      "Sans déformation, négation, comparaison ni interprétation figurative",
      "En les comparant à la création",
      "En les niant par prudence",
      "Selon l'imagination",
    ],
    answer: "Sans déformation, négation, comparaison ni interprétation figurative",
    explanation: "« Rien ne Lui est semblable, et Il est l'Audient, le Clairvoyant » (42:11).",
  },
  {
    category: "tawhid",
    question: "Le shirk mineur inclut notamment :",
    options: ["Le riyâ' (ostentation)", "Le mensonge", "L'oubli", "Le retard à la prière"],
    answer: "Le riyâ' (ostentation)",
    explanation: "Agir pour être vu des gens diminue la sincérité (ikhlâs).",
  },
  {
    category: "tawhid",
    question: "Quelle est la première obligation du musulman ?",
    options: [
      "Connaître Allah et L'adorer seul",
      "Prier cinq fois",
      "Jeûner Ramadan",
      "Payer la zakât",
    ],
    answer: "Connaître Allah et L'adorer seul",
    explanation: "Le tawhid précède toute autre obligation.",
  },

  // ---------- Sîra du Prophète ﷺ ----------
  {
    category: "seerah",
    question: "En quelle année a eu lieu l'Hégire (hijra) vers Médine ?",
    options: ["610", "622", "630", "632"],
    answer: "622",
    explanation: "Départ de La Mecque vers Yathrib, devenue Médine — début du calendrier hégirien.",
  },
  {
    category: "seerah",
    question: "Où le Prophète ﷺ a-t-il reçu la première révélation ?",
    options: ["Grotte de Hirâ'", "Grotte de Thawr", "Mont Uhud", "Ka'ba"],
    answer: "Grotte de Hirâ'",
    explanation: "Sourate Al-'Alaq : « Lis, au nom de ton Seigneur ».",
  },
  {
    category: "seerah",
    question: "Quelle fut la première bataille de l'islam ?",
    options: ["Badr", "Uhud", "Khandaq", "Khaybar"],
    answer: "Badr",
    explanation: "An 2 de l'Hégire, 313 musulmans face à environ 1000 Quraysh.",
  },
  {
    category: "seerah",
    question: "Qui accompagna le Prophète ﷺ durant l'Hégire ?",
    options: ["Abû Bakr", "'Umar", "'Alî", "Bilâl"],
    answer: "Abû Bakr",
    explanation: "« Le second des deux quand ils étaient dans la grotte » (9:40).",
  },
  {
    category: "seerah",
    question: "Comment s'appelait la nourrice du Prophète ﷺ ?",
    options: ["Halîma as-Sa'diyya", "Âmina", "Khadîja", "Sumayya"],
    answer: "Halîma as-Sa'diyya",
    explanation: "De la tribu des Banû Sa'd.",
  },
  {
    category: "seerah",
    question: "Quel âge avait le Prophète ﷺ au début de la révélation ?",
    options: ["25 ans", "30 ans", "40 ans", "50 ans"],
    answer: "40 ans",
    explanation: "Il vécut 63 ans : 40 avant la prophétie, 23 de mission.",
  },
  {
    category: "seerah",
    question: "Quel événement marque le voyage nocturne et l'ascension ?",
    options: ["Al-Isrâ' wal-Mi'râj", "Hijra", "Fath Makka", "Hudaybiyya"],
    answer: "Al-Isrâ' wal-Mi'râj",
    explanation: "Voyage de La Mecque à Jérusalem puis élévation aux cieux : les 5 prières y furent prescrites.",
  },
  {
    category: "seerah",
    question: "Qui fut le premier muezzin de l'islam ?",
    options: ["Bilâl ibn Rabâh", "Zayd ibn Thâbit", "Anas ibn Mâlik", "Salmân al-Fârisî"],
    answer: "Bilâl ibn Rabâh",
    explanation: "Sa voix appelait à la prière à Médine.",
  },

  // ---------- Fiqh du quotidien ----------
  {
    category: "fiqh",
    question: "Combien de rak'a compte la prière du Maghrib ?",
    options: ["2", "3", "4", "5"],
    answer: "3",
    explanation: "Fajr 2, Dhuhr 4, 'Asr 4, Maghrib 3, 'Ishâ 4.",
  },
  {
    category: "fiqh",
    question: "Quel est le taux de la zakât sur l'argent ?",
    options: ["2,5 %", "5 %", "10 %", "20 %"],
    answer: "2,5 %",
    explanation: "Un quarantième du capital détenu un an au-delà du nisâb.",
  },
  {
    category: "fiqh",
    question: "Quelle sourate est obligatoire dans chaque rak'a ?",
    options: ["Al-Faatiha", "Al-Ikhlaas", "An-Naas", "Al-Kawthar"],
    answer: "Al-Faatiha",
    explanation: "« Pas de prière pour qui ne récite pas l'Ouverture du Livre » (Bukhârî, Muslim).",
  },
  {
    category: "fiqh",
    question: "Qu'est-ce que le tayammum ?",
    options: [
      "La purification avec de la terre pure en l'absence d'eau",
      "Le lavage complet du corps",
      "Le rinçage de la bouche",
      "Une prière surérogatoire",
    ],
    answer: "La purification avec de la terre pure en l'absence d'eau",
    explanation: "Mentionné en 4:43 et 5:6.",
  },
  {
    category: "fiqh",
    question: "Quand se termine le jeûne de la journée ?",
    options: ["Au coucher du soleil", "À l'appel du 'Asr", "Au crépuscule complet", "À minuit"],
    answer: "Au coucher du soleil",
    explanation: "On rompt dès l'entrée du Maghrib.",
  },
  {
    category: "fiqh",
    question: "Combien de fois lave-t-on chaque membre dans les ablutions (sunna) ?",
    options: ["3 fois", "1 fois", "5 fois", "7 fois"],
    answer: "3 fois",
    explanation: "Une fois suffit pour la validité, trois est la sunna.",
  },
  {
    category: "fiqh",
    question: "Quelle prière comporte une récitation à voix haute par l'imam ?",
    options: ["Fajr", "Dhuhr", "'Asr", "Aucune"],
    answer: "Fajr",
    explanation: "Fajr, Maghrib et 'Ishâ sont récitées à voix haute.",
  },
  {
    category: "fiqh",
    question: "Que doit faire celui qui oublie une prosternation obligatoire ?",
    options: [
      "Refaire la rak'a puis les deux prosternations d'oubli",
      "Rien",
      "Recommencer la journée",
      "Jeûner un jour",
    ],
    answer: "Refaire la rak'a puis les deux prosternations d'oubli",
    explanation: "Sujûd as-sahw corrige les oublis dans la prière.",
  },

  // ---------- Sciences du Coran ----------
  {
    category: "coran-sciences",
    question: "Combien de juzz compte le Coran ?",
    options: ["30", "60", "114", "604"],
    answer: "30",
    explanation: "30 juzz, soit 60 hizb (2 hizb par juzz).",
  },
  {
    category: "coran-sciences",
    question: "Combien de hizb compte le Coran ?",
    options: ["60", "30", "120", "240"],
    answer: "60",
    explanation: "Chaque juzz se divise en 2 hizb, chaque hizb en 4 quarts.",
  },
  {
    category: "coran-sciences",
    question: "Quelle est la seule sourate sans « Bismillâh » à son début ?",
    options: ["At-Tawba", "Al-Faatiha", "An-Naml", "Al-Kahf"],
    answer: "At-Tawba",
    explanation: "Sourate 9, la seule à ne pas commencer par la basmala.",
  },
  {
    category: "coran-sciences",
    question: "Quelle est la sourate la plus courte du Coran ?",
    options: ["Al-Kawthar", "Al-Ikhlaas", "An-Nasr", "Al-'Asr"],
    answer: "Al-Kawthar",
    explanation: "3 versets seulement.",
  },
  {
    category: "coran-sciences",
    question: "Sous quel calife le Coran fut-il rassemblé en un seul recueil (mus'haf) ?",
    options: ["Abû Bakr", "'Umar", "'Uthmân", "'Alî"],
    answer: "Abû Bakr",
    explanation: "Rassemblé sous Abû Bakr, unifié et diffusé sous 'Uthmân.",
  },
  {
    category: "coran-sciences",
    question: "Combien de sourates ont un nom de prophète comme titre… par exemple :",
    options: ["Yusuf", "Al-Fajr", "Al-Qadr", "At-Tîn"],
    answer: "Yusuf",
    explanation: "Yûnus, Hûd, Yûsuf, Ibrâhîm, Muhammad, Nûh sont des exemples.",
  },
  {
    category: "coran-sciences",
    question: "Quelle sourate est recommandée le vendredi ?",
    options: ["Al-Kahf", "Al-Baqara", "Yaseen", "Ar-Rahmaan"],
    answer: "Al-Kahf",
    explanation: "Sa lecture illumine le croyant entre les deux vendredis.",
  },
  {
    category: "coran-sciences",
    question: "Que signifie « Makkiyya » pour une sourate ?",
    options: [
      "Révélée avant l'Hégire",
      "Révélée à Médine",
      "Révélée la nuit",
      "Révélée en entier",
    ],
    answer: "Révélée avant l'Hégire",
    explanation: "Les sourates mecquoises insistent sur le tawhid et l'au-delà.",
  },
];


export function randomQuiz(category: QuizCategory): QuizQuestion {
  const pool = QUIZ.filter((q) => q.category === category);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}
