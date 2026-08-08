/**
 * Recueil de hadiths authentiques (sahîh) — Bukhârî, Muslim, Tirmidhî (hasan sahîh).
 * Un hadith par jour, choisi de façon déterministe à partir de la date.
 */

export type Hadith = {
  arabic: string;
  french: string;
  source: string;
  grade: "Sahîh" | "Hasan sahîh";
  theme: string;
  benefit: string;
};

export const HADITHS: Hadith[] = [
  {
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    french:
      "Les actes ne valent que par les intentions, et chacun n'obtient que ce qu'il a eu l'intention d'obtenir.",
    source: "Bukhârî 1 · Muslim 1907",
    grade: "Sahîh",
    theme: "Intention",
    benefit: "Renouvelle ton intention avant chaque séance de mémorisation.",
  },
  {
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    french: "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.",
    source: "Bukhârî 5027",
    grade: "Sahîh",
    theme: "Mérite du Coran",
    benefit: "Partage ce que tu apprends : enseigner consolide ta mémorisation.",
  },
  {
    arabic:
      "مَثَلُ الَّذِي يَقْرَأُ الْقُرْآنَ وَهُوَ حَافِظٌ لَهُ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ، وَمَثَلُ الَّذِي يَقْرَأُ الْقُرْآنَ وَهُوَ يَتَعَاهَدُهُ وَهُوَ عَلَيْهِ شَدِيدٌ فَلَهُ أَجْرَانِ",
    french:
      "Celui qui récite le Coran et le mémorise est avec les nobles anges scribes ; celui qui le récite avec difficulté tout en s'y appliquant en obtient deux récompenses.",
    source: "Bukhârî 4937 · Muslim 798",
    grade: "Sahîh",
    theme: "Mémorisation",
    benefit: "La difficulté ressentie est elle-même récompensée : continue.",
  },
  {
    arabic: "تَعَاهَدُوا الْقُرْآنَ، فَإِنَّهُ أَشَدُّ تَفَصِّيًا مِنْ صُدُورِ الرِّجَالِ",
    french:
      "Révisez assidûment le Coran, car il s'échappe des poitrines plus vite qu'un chameau détaché.",
    source: "Muslim 791",
    grade: "Sahîh",
    theme: "Révision",
    benefit: "Une révision quotidienne, même courte, vaut mieux qu'une longue rare.",
  },
  {
    arabic: "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    french: "L'acte le plus aimé d'Allah est le plus constant, même s'il est peu.",
    source: "Bukhârî 6464 · Muslim 783",
    grade: "Sahîh",
    theme: "Régularité",
    benefit: "Fixe un objectif petit mais tenu chaque jour.",
  },
  {
    arabic: "مَنْ سَلَكَ طَرِيقًا يَطْلُبُ فِيهِ عِلْمًا سَلَكَ اللَّهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    french:
      "Quiconque emprunte un chemin en quête de science, Allah lui facilite un chemin vers le Paradis.",
    source: "Muslim 2699",
    grade: "Sahîh",
    theme: "Science",
    benefit: "Apprendre le tajwid fait partie de cette quête.",
  },
  {
    arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ",
    french: "La purification est la moitié de la foi.",
    source: "Muslim 223",
    grade: "Sahîh",
    theme: "Purification",
    benefit: "Récite en état de pureté : cela installe le respect du texte.",
  },
  {
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    french:
      "Nul d'entre vous n'est croyant tant qu'il n'aime pas pour son frère ce qu'il aime pour lui-même.",
    source: "Bukhârî 13 · Muslim 45",
    grade: "Sahîh",
    theme: "Fraternité",
    benefit: "Encourage un proche à mémoriser avec toi.",
  },
  {
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    french:
      "Que celui qui croit en Allah et au Jour dernier dise du bien, ou bien qu'il se taise.",
    source: "Bukhârî 6018 · Muslim 47",
    grade: "Sahîh",
    theme: "Parole",
    benefit: "Occupe ta langue par le dhikr et la récitation.",
  },
  {
    arabic: "الدُّعَاءُ مُخُّ الْعِبَادَةِ",
    french: "L'invocation est l'essence de l'adoration.",
    source: "Tirmidhî 3371",
    grade: "Hasan sahîh",
    theme: "Invocation",
    benefit: "Demande à Allah la facilité avant chaque mémorisation.",
  },
  {
    arabic: "مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا",
    french:
      "Quiconque lit une lettre du Livre d'Allah obtient une bonne action, et une bonne action est multipliée par dix.",
    source: "Tirmidhî 2910",
    grade: "Hasan sahîh",
    theme: "Récompense",
    benefit: "Même une seule ligne lue aujourd'hui compte.",
  },
  {
    arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    french:
      "Le musulman est celui dont les autres musulmans sont préservés de la langue et de la main.",
    source: "Bukhârî 10",
    grade: "Sahîh",
    theme: "Comportement",
    benefit: "Le Coran doit transformer le caractère, pas seulement la mémoire.",
  },
  {
    arabic: "بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ",
    french: "L'islam est bâti sur cinq piliers.",
    source: "Bukhârî 8 · Muslim 16",
    grade: "Sahîh",
    theme: "Piliers",
    benefit: "La prière est le cadre naturel de la révision.",
  },
  {
    arabic: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ",
    french: "Crains Allah où que tu sois.",
    source: "Tirmidhî 1987",
    grade: "Hasan sahîh",
    theme: "Piété",
    benefit: "La crainte d'Allah est le premier fruit du Coran.",
  },
  {
    arabic: "لَا يَشْكُرُ اللَّهَ مَنْ لَا يَشْكُرُ النَّاسَ",
    french: "Celui qui ne remercie pas les gens ne remercie pas Allah.",
    source: "Tirmidhî 1954",
    grade: "Hasan sahîh",
    theme: "Gratitude",
    benefit: "Remercie ton enseignant ou celui qui t'écoute réciter.",
  },
  {
    arabic: "زَيِّنُوا الْقُرْآنَ بِأَصْوَاتِكُمْ",
    french: "Embellissez le Coran par vos voix.",
    source: "Ibn Mâjah 1342",
    grade: "Sahîh",
    theme: "Récitation",
    benefit: "Soigne le tajwid : la beauté vient de la justesse.",
  },
  {
    arabic: "إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
    french:
      "Allah ne regarde pas vos apparences ni vos biens, mais Il regarde vos cœurs et vos actes.",
    source: "Muslim 2564",
    grade: "Sahîh",
    theme: "Sincérité",
    benefit: "Mémorise pour Allah, pas pour être vu.",
  },
  {
    arabic: "الصَّلَاةُ نُورٌ",
    french: "La prière est une lumière.",
    source: "Muslim 223 (sens)",
    grade: "Sahîh",
    theme: "Prière",
    benefit: "Récite ce que tu apprends dans tes prières surérogatoires.",
  },
  {
    arabic: "أَفْضَلُ الصِّيَامِ بَعْدَ رَمَضَانَ شَهْرُ اللَّهِ الْمُحَرَّمُ",
    french: "Le meilleur jeûne après Ramadan est celui du mois d'Allah : Muharram.",
    source: "Muslim 1163",
    grade: "Sahîh",
    theme: "Jeûne",
    benefit: "Les jours de jeûne sont excellents pour réviser.",
  },
  {
    arabic: "مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا",
    french:
      "Quiconque prie sur moi une fois, Allah priera sur lui dix fois.",
    source: "Muslim 408",
    grade: "Sahîh",
    theme: "Prophète ﷺ",
    benefit: "Commence ta séance par la salât sur le Prophète ﷺ.",
  },
  {
    arabic: "الْجَنَّةُ أَقْرَبُ إِلَى أَحَدِكُمْ مِنْ شِرَاكِ نَعْلِهِ",
    french: "Le Paradis est plus proche de l'un de vous que la lanière de sa sandale.",
    source: "Bukhârî 6488",
    grade: "Sahîh",
    theme: "Espoir",
    benefit: "Chaque petit effort rapproche du but.",
  },
  {
    arabic: "لَا تَحْقِرَنَّ مِنَ الْمَعْرُوفِ شَيْئًا",
    french: "Ne méprise aucun bien, aussi petit soit-il.",
    source: "Muslim 2626",
    grade: "Sahîh",
    theme: "Bonnes actions",
    benefit: "Cinq minutes de révision restent une bonne action.",
  },
  {
    arabic: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ",
    french: "Le croyant fort est meilleur et plus aimé d'Allah que le croyant faible.",
    source: "Muslim 2664",
    grade: "Sahîh",
    theme: "Force",
    benefit: "Dors et mange correctement : la mémoire suit le corps.",
  },
  {
    arabic: "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ",
    french:
      "Lisez le Coran, car il viendra au Jour de la Résurrection intercéder pour ses compagnons.",
    source: "Muslim 804",
    grade: "Sahîh",
    theme: "Intercession",
    benefit: "Sois un « compagnon du Coran » par la constance.",
  },
  {
    arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    french: "Le meilleur des hommes est le plus utile aux autres.",
    source: "Tirmidhî (sens) · Tabarânî",
    grade: "Hasan sahîh",
    theme: "Utilité",
    benefit: "Corrige gentiment la récitation d'un ami.",
  },
  {
    arabic: "الْحَيَاءُ شُعْبَةٌ مِنَ الإِيمَانِ",
    french: "La pudeur est une branche de la foi.",
    source: "Bukhârî 9 · Muslim 35",
    grade: "Sahîh",
    theme: "Foi",
    benefit: "Le Coran enseigne la pudeur avant la performance.",
  },
  {
    arabic: "إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ",
    french: "Allah aime que lorsque l'un de vous accomplit un acte, il le fasse avec excellence.",
    source: "Bayhaqî (hasan)",
    grade: "Hasan sahîh",
    theme: "Excellence",
    benefit: "Mieux vaut peu de versets parfaits que beaucoup d'approximatifs.",
  },
  {
    arabic: "مَنْ لَمْ يَرْحَمْ صَغِيرَنَا وَلَمْ يُوَقِّرْ كَبِيرَنَا فَلَيْسَ مِنَّا",
    french:
      "Celui qui n'est pas miséricordieux envers nos jeunes et ne respecte pas nos anciens n'est pas des nôtres.",
    source: "Tirmidhî 1919",
    grade: "Hasan sahîh",
    theme: "Respect",
    benefit: "Respecte celui qui t'enseigne, sois doux avec le débutant.",
  },
  {
    arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    french: "Une bonne parole est une aumône.",
    source: "Bukhârî 2989 (sens)",
    grade: "Sahîh",
    theme: "Parole",
    benefit: "Encourage : un mot juste peut relancer une mémorisation.",
  },
  {
    arabic: "مَنْ حَفِظَ عَشْرَ آيَاتٍ مِنْ أَوَّلِ سُورَةِ الْكَهْفِ عُصِمَ مِنَ الدَّجَّالِ",
    french:
      "Quiconque mémorise dix versets du début de la sourate Al-Kahf sera protégé du Dajjâl.",
    source: "Muslim 809",
    grade: "Sahîh",
    theme: "Protection",
    benefit: "Objectif concret : les 10 premiers versets d'Al-Kahf.",
  },
];

/** Numéro de jour stable (UTC) pour choisir le hadith du jour. */
export function dayIndex(date = new Date()) {
  const days = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return ((days % HADITHS.length) + HADITHS.length) % HADITHS.length;
}

export function hadithOfDay(date = new Date()) {
  return HADITHS[dayIndex(date)];
}
