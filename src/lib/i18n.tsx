import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "fr" | "en" | "ar";

export const LANGUAGES: { value: Lang; label: string; native: string }[] = [
  { value: "fr", label: "Français", native: "Français" },
  { value: "en", label: "English", native: "English" },
  { value: "ar", label: "العربية", native: "العربية" },
];

/** Édition de traduction du Coran utilisée selon la langue d'interface. */
export const TRANSLATION_EDITION: Record<Lang, string> = {
  fr: "fr.hamidullah",
  en: "en.sahih",
  ar: "ar.muyassar",
};

type Dict = Record<string, string>;

const FR: Dict = {
  "nav.dashboard": "Tableau de bord",
  "nav.surahs": "Sourates",
  "nav.juz": "Juzz",
  "nav.calendar": "Calendrier",
  "nav.challenges": "Défis",
  "nav.tajweed": "Tajwid",
  "nav.method": "Méthode",
  "nav.hadith": "Hadith du jour",
  "nav.stats": "Statistiques",
  "nav.profile": "Profil",
  "nav.admin": "Administration",
  "nav.signout": "Se déconnecter",
  "app.tagline": "Mémorisation du Coran",
  "app.menu": "Ouvrir le menu",
  "app.theme": "Changer de thème",
  "search.placeholder": "Rechercher une sourate, un numéro…",

  "common.save": "Enregistrer",
  "common.verses": "versets",
  "common.level": "Niveau",
  "common.xp": "XP",
  "common.streak": "série",
  "common.close": "Fermer",
  "common.language": "Langue",
  "common.settings": "Paramètres",
  "common.back": "Retour",

  "surah.all": "Toutes les sourates",
  "surah.recite": "Réciter la sourate",
  "surah.plan": "Planifier une révision",
  "surah.markAll": "Tout marquer appris",
  "surah.unmarkAll": "Tout décocher",
  "surah.arabic": "Arabe",
  "surah.both": "Arabe + phonétique",
  "surah.phonetic": "Phonétique",
  "surah.translation": "Traduction",
  "surah.tajweedColors": "Couleurs tajwid",
  "surah.tajweedRules": "Règles de tajwid",
  "surah.goto": "Aller au verset",
  "surah.gotoPlaceholder": "N° de verset (ex. 150)",
  "surah.go": "Aller",
  "surah.learned": "Appris",
  "surah.review": "À réviser",
  "surah.listen": "Écouter ce verset",
  "surah.reciteVerse": "Réciter ce verset",
  "surah.tracked": "versets suivis",

  "challenge.quit": "Quitter",
  "challenge.validate": "Valider",
  "challenge.showAnswer": "Voir la réponse",
  "challenge.next": "Question suivante",
  "challenge.answer": "Réponse",
  "challenge.right": "J'avais juste",
  "challenge.wrong": "À revoir",
  "challenge.replay": "Rejouer",
  "challenge.backToList": "Retour aux défis",
  "challenge.combo": "Série en cours",
  "challenge.xpGained": "XP gagnés",
  "challenge.nextLevel": "vers le niveau",

  "profile.language": "Langue de l'interface",
  "profile.languageHint":
    "Traduit l'interface du site. Le Coran reste toujours en arabe (ou en phonétique).",
  "profile.translation": "Afficher la traduction des versets",
  "profile.translationHint": "Ajoute la traduction sous chaque verset dans la langue choisie.",
};

const EN: Dict = {
  "nav.dashboard": "Dashboard",
  "nav.surahs": "Surahs",
  "nav.juz": "Juz",
  "nav.calendar": "Calendar",
  "nav.challenges": "Challenges",
  "nav.tajweed": "Tajweed",
  "nav.method": "Method",
  "nav.hadith": "Hadith of the day",
  "nav.stats": "Statistics",
  "nav.profile": "Profile",
  "nav.admin": "Administration",
  "nav.signout": "Sign out",
  "app.tagline": "Qur'an memorisation",
  "app.menu": "Open menu",
  "app.theme": "Toggle theme",
  "search.placeholder": "Search a surah or a number…",

  "common.save": "Save",
  "common.verses": "verses",
  "common.level": "Level",
  "common.xp": "XP",
  "common.streak": "streak",
  "common.close": "Close",
  "common.language": "Language",
  "common.settings": "Settings",
  "common.back": "Back",

  "surah.all": "All surahs",
  "surah.recite": "Recite the surah",
  "surah.plan": "Schedule a review",
  "surah.markAll": "Mark all as learned",
  "surah.unmarkAll": "Clear all",
  "surah.arabic": "Arabic",
  "surah.both": "Arabic + phonetic",
  "surah.phonetic": "Phonetic",
  "surah.translation": "Translation",
  "surah.tajweedColors": "Tajweed colours",
  "surah.tajweedRules": "Tajweed rules",
  "surah.goto": "Go to verse",
  "surah.gotoPlaceholder": "Verse number (e.g. 150)",
  "surah.go": "Go",
  "surah.learned": "Learned",
  "surah.review": "To review",
  "surah.listen": "Listen to this verse",
  "surah.reciteVerse": "Recite this verse",
  "surah.tracked": "verses tracked",

  "challenge.quit": "Quit",
  "challenge.validate": "Check",
  "challenge.showAnswer": "Show answer",
  "challenge.next": "Next question",
  "challenge.answer": "Answer",
  "challenge.right": "I was right",
  "challenge.wrong": "Review it",
  "challenge.replay": "Play again",
  "challenge.backToList": "Back to challenges",
  "challenge.combo": "Current streak",
  "challenge.xpGained": "XP earned",
  "challenge.nextLevel": "to level",

  "profile.language": "Interface language",
  "profile.languageHint":
    "Translates the site interface. The Qur'an always stays in Arabic (or phonetic).",
  "profile.translation": "Show verse translation",
  "profile.translationHint": "Adds the translation under each verse in the chosen language.",
};

const AR: Dict = {
  "nav.dashboard": "لوحة التحكم",
  "nav.surahs": "السور",
  "nav.juz": "الأجزاء",
  "nav.calendar": "التقويم",
  "nav.challenges": "التحديات",
  "nav.tajweed": "التجويد",
  "nav.method": "الطريقة",
  "nav.hadith": "حديث اليوم",
  "nav.stats": "الإحصائيات",
  "nav.profile": "الملف الشخصي",
  "nav.admin": "الإدارة",
  "nav.signout": "تسجيل الخروج",
  "app.tagline": "حفظ القرآن الكريم",
  "app.menu": "فتح القائمة",
  "app.theme": "تغيير المظهر",
  "search.placeholder": "ابحث عن سورة أو رقم…",

  "common.save": "حفظ",
  "common.verses": "آية",
  "common.level": "المستوى",
  "common.xp": "نقاط",
  "common.streak": "تتابع",
  "common.close": "إغلاق",
  "common.language": "اللغة",
  "common.settings": "الإعدادات",
  "common.back": "رجوع",

  "surah.all": "كل السور",
  "surah.recite": "تلاوة السورة",
  "surah.plan": "جدولة مراجعة",
  "surah.markAll": "تحديد الكل كمحفوظ",
  "surah.unmarkAll": "إلغاء تحديد الكل",
  "surah.arabic": "عربي",
  "surah.both": "عربي + نقل صوتي",
  "surah.phonetic": "نقل صوتي",
  "surah.translation": "التفسير الميسّر",
  "surah.tajweedColors": "ألوان التجويد",
  "surah.tajweedRules": "أحكام التجويد",
  "surah.goto": "الانتقال إلى آية",
  "surah.gotoPlaceholder": "رقم الآية (مثال 150)",
  "surah.go": "انتقل",
  "surah.learned": "محفوظة",
  "surah.review": "للمراجعة",
  "surah.listen": "سماع هذه الآية",
  "surah.reciteVerse": "تلاوة هذه الآية",
  "surah.tracked": "آية متابعة",

  "challenge.quit": "خروج",
  "challenge.validate": "تحقق",
  "challenge.showAnswer": "إظهار الجواب",
  "challenge.next": "السؤال التالي",
  "challenge.answer": "الجواب",
  "challenge.right": "كنت مصيبًا",
  "challenge.wrong": "أراجعها",
  "challenge.replay": "إعادة اللعب",
  "challenge.backToList": "العودة إلى التحديات",
  "challenge.combo": "التتابع الحالي",
  "challenge.xpGained": "النقاط المكتسبة",
  "challenge.nextLevel": "للمستوى",

  "profile.language": "لغة الواجهة",
  "profile.languageHint": "تترجم واجهة الموقع. القرآن يبقى دائمًا بالعربية أو بالنقل الصوتي.",
  "profile.translation": "إظهار ترجمة الآيات",
  "profile.translationHint": "يضيف الترجمة تحت كل آية باللغة المختارة.",
};

const DICTS: Record<Lang, Dict> = { fr: FR, en: EN, ar: AR };

const STORAGE_KEY = "hifz-lang";

type Ctx = { lang: Lang; setLang: (lang: Lang) => void; t: (key: string) => string; rtl: boolean };

const I18nContext = createContext<Ctx>({
  lang: "fr",
  setLang: () => {},
  t: (key) => FR[key] ?? key,
  rtl: false,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && DICTS[stored]) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      rtl: lang === "ar",
      setLang: (next) => {
        setLangState(next);
        localStorage.setItem(STORAGE_KEY, next);
      },
      t: (key) => DICTS[lang][key] ?? FR[key] ?? key,
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
