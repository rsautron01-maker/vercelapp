import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, RefreshCw, Timer, X } from "lucide-react";

import { SURAHS, surahOf } from "@/data/quran";
import {
  fetchSurahText,
  maskWords,
  matchesSurahName,
  normalize,
  randomVerse,
  versesAround,
  type VerseRef,
} from "@/lib/quran-api";
import { useSaveChallenge } from "@/hooks/use-hifz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type ChallengeMode =
  | "next-verse"
  | "guess-surah"
  | "complete-verse"
  | "verse-number"
  | "order-verses"
  | "first-word"
  | "surah-name"
  | "juz-locate"
  | "chrono"
  | "recite"
  | "quiz-islam"
  | "quiz-prophetes"
  | "quiz-devinette"
  | "quiz-tajweed";


export const CHALLENGES: {
  mode: ChallengeMode;
  title: string;
  description: string;
  prompt: string;
  auto: boolean;
}[] = [
  {
    mode: "next-verse",
    title: "Trouver la suite",
    description: "Un verset s'affiche, récitez ou écrivez le suivant.",
    prompt: "Écrivez le verset suivant (ou récitez, puis vérifiez)",
    auto: false,
  },
  {
    mode: "guess-surah",
    title: "Deviner la sourate",
    description: "Identifiez la sourate à partir d'un verset.",
    prompt: "Nom de la sourate",
    auto: true,
  },
  {
    mode: "complete-verse",
    title: "Compléter le verset",
    description: "Des mots sont masqués, retrouvez-les.",
    prompt: "Les mots manquants",
    auto: false,
  },
  {
    mode: "verse-number",
    title: "Numéro du verset",
    description: "Devinez le numéro du verset affiché.",
    prompt: "Numéro du verset",
    auto: true,
  },
  {
    mode: "order-verses",
    title: "Remettre dans l'ordre",
    description: "Trois versets mélangés à réordonner mentalement.",
    prompt: "Numéros dans l'ordre (ex. 3-1-2)",
    auto: false,
  },
  {
    mode: "first-word",
    title: "Premier mot",
    description: "Seul le premier mot est donné : complétez le verset.",
    prompt: "La suite du verset",
    auto: false,
  },
  {
    mode: "surah-name",
    title: "Sourate → premier verset",
    description: "Un nom de sourate est donné, récitez son premier verset.",
    prompt: "Le premier verset",
    auto: false,
  },
  {
    mode: "juz-locate",
    title: "Situer le juzz",
    description: "Dans quel juzz se trouve ce verset ?",
    prompt: "Numéro du juzz",
    auto: false,
  },
  {
    mode: "chrono",
    title: "Défi chrono 60s",
    description: "Un maximum de sourates identifiées en 60 secondes.",
    prompt: "Nom de la sourate",
    auto: true,
  },
  {
    mode: "recite",
    title: "Récitation libre",
    description: "Récitez le passage à voix haute puis auto-évaluez-vous.",
    prompt: "Notez votre récitation",
    auto: false,
  },
  {
    mode: "quiz-islam",
    title: "Quiz culture islamique",
    description: "Questions à choix multiples sur l'islam et le Coran.",
    prompt: "Choisissez la bonne réponse",
    auto: true,
  },
  {
    mode: "quiz-prophetes",
    title: "Quiz prophètes",
    description: "Reconnaissez les prophètes et leurs histoires.",
    prompt: "Choisissez la bonne réponse",
    auto: true,
  },
  {
    mode: "quiz-devinette",
    title: "Devinettes coraniques",
    description: "« Qui suis-je ? » : devinez la sourate ou le verset.",
    prompt: "Choisissez la bonne réponse",
    auto: true,
  },
  {
    mode: "quiz-tajweed",
    title: "Quiz tajwid",
    description: "Ghunnah, qalqalah, madd, idghâm : testez vos règles.",
    prompt: "Choisissez la bonne réponse",
    auto: true,
  },
];

const QUIZ_MODES: Record<string, QuizCategory> = {
  "quiz-islam": "islam",
  "quiz-prophetes": "prophetes",
  "quiz-devinette": "devinette",
  "quiz-tajweed": "tajweed",
};

type Question = {
  verse?: VerseRef;
  question: string;
  arabic?: string;
  answer: string;
  options?: string[];
  explanation?: string;
  check?: (input: string) => boolean;
};

async function buildQuestion(mode: ChallengeMode): Promise<Question> {
  const category = QUIZ_MODES[mode];
  if (category) {
    const item = randomQuiz(category);
    return {
      question: item.question,
      answer: item.answer,
      options: shuffle(item.options),
      explanation: item.explanation,
      check: (input) => input === item.answer,
    };
  }

  const verse = await randomVerse();

  const surah = verse.surah;

  if (mode === "guess-surah" || mode === "chrono") {
    return {
      verse,
      question: "De quelle sourate provient ce verset ?",
      arabic: verse.text,
      answer: `${surah.number}. ${surah.french} (${surah.translit})`,
      check: (input) => matchesSurahName(input, surah),
    };
  }

  if (mode === "verse-number") {
    return {
      verse,
      question: `Quel est le numéro de ce verset dans ${surah.french} ?`,
      arabic: verse.text,
      answer: String(verse.ayah),
      check: (input) => Number(input) === verse.ayah,
    };
  }

  if (mode === "complete-verse") {
    const { masked, answer } = maskWords(verse.text);
    return {
      verse,
      question: `Complétez ce verset de ${surah.french} (v.${verse.ayah})`,
      arabic: masked,
      answer: answer.join(" · "),
    };
  }

  if (mode === "first-word") {
    return {
      verse,
      question: `${surah.french} v.${verse.ayah} — poursuivez à partir du premier mot`,
      arabic: verse.text.split(" ")[0] + " …",
      answer: verse.text,
    };
  }

  if (mode === "surah-name") {
    const ayahs = await fetchSurahText(surah.number);
    return {
      verse,
      question: `Récitez le premier verset de ${surah.french} (${surah.translit})`,
      answer: ayahs[0].text,
    };
  }

  if (mode === "juz-locate") {
    const { juzOfVerse } = await import("@/hooks/use-hifz");
    return {
      verse,
      question: `Dans quel juzz se trouve ${surah.french} v.${verse.ayah} ?`,
      arabic: verse.text,
      answer: `Juzz ${juzOfVerse(surah.number, verse.ayah)}`,
    };
  }

  if (mode === "order-verses") {
    const { next } = await versesAround(surah.number, verse.ayah, 2, 0);
    const items = [verse.text, ...next.map((a) => a.text)];
    const shuffled = items
      .map((text, index) => ({ text, index }))
      .sort(() => Math.random() - 0.5);
    return {
      verse,
      question: `Remettez ces versets de ${surah.french} dans l'ordre`,
      arabic: shuffled.map((item, i) => `${i + 1}. ${item.text}`).join("\n"),
      answer: shuffled
        .map((item, i) => ({ ...item, position: i + 1 }))
        .sort((a, b) => a.index - b.index)
        .map((item) => item.position)
        .join("-"),
    };
  }

  if (mode === "recite") {
    const { next } = await versesAround(surah.number, verse.ayah, 3, 0);
    return {
      verse,
      question: `Récitez ${surah.french} à partir du verset ${verse.ayah}`,
      answer: [verse.text, ...next.map((a) => a.text)].join(" ﴿﴾ "),
    };
  }

  const { next } = await versesAround(surah.number, verse.ayah, 1, 0);
  return {
    verse,
    question: `Quel verset suit ${surah.french} v.${verse.ayah} ?`,
    arabic: verse.text,
    answer: next[0]?.text ?? "Fin de la sourate",
    check: (input) => normalize(input) === normalize(next[0]?.text ?? ""),
  };
}

export function ChallengeRunner({ mode, onExit }: { mode: ChallengeMode; onExit: () => void }) {
  const config = CHALLENGES.find((c) => c.mode === mode)!;
  const isChrono = mode === "chrono";
  const save = useSaveChallenge();

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [finished, setFinished] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setRevealed(false);
    setInput("");
    try {
      setQuestion(await buildQuestion(mode));
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!isChrono || finished) return;
    const timer = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          clearInterval(timer);
          setFinished(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isChrono, finished]);

  useEffect(() => {
    if (!finished) return;
    save.mutate({
      mode,
      score,
      total: Math.max(total, 1),
      success: score >= Math.ceil(total / 2),
      xp: score * 10,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  function grade(success: boolean) {
    setScore((value) => value + (success ? 1 : 0));
    setTotal((value) => value + 1);
    if (!isChrono) {
      save.mutate({ mode, score: success ? 1 : 0, total: 1, success, xp: success ? 10 : 2 });
    }
    void load();
  }

  function submit() {
    if (!question) return;
    if (config.auto && question.check) {
      const success = question.check(input);
      if (isChrono) {
        grade(success);
        return;
      }
      setRevealed(true);
      setScore((value) => value + (success ? 1 : 0));
      setTotal((value) => value + 1);
      save.mutate({ mode, score: success ? 1 : 0, total: 1, success, xp: success ? 10 : 2 });
      return;
    }
    setRevealed(true);
  }

  if (finished) {
    return (
      <div className="surface p-8 text-center">
        <h2 className="font-display text-2xl font-semibold">Temps écoulé !</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {score} bonne(s) réponse(s) sur {total} tentative(s).
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            onClick={() => {
              setScore(0);
              setTotal(0);
              setSeconds(60);
              setFinished(false);
              void load();
            }}
          >
            Rejouer
          </Button>
          <Button variant="outline" onClick={onExit}>
            Retour aux défis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="surface p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">{config.title}</h2>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {isChrono && (
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary",
                seconds <= 10 && "bg-destructive/10 text-destructive",
              )}
            >
              <Timer className="size-4" /> {seconds}s
            </span>
          )}
          <span className="rounded-full bg-muted px-3 py-1 text-sm">
            {score}/{total}
          </span>
          <Button size="sm" variant="ghost" onClick={onExit}>
            Quitter
          </Button>
        </div>
      </div>

      {loading || !question ? (
        <Skeleton className="h-40 w-full rounded-2xl" />
      ) : (
        <motion.div
          key={question.question + question.arabic}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-medium text-muted-foreground">{question.question}</p>
          {question.arabic && (
            <p className="arabic mt-4 whitespace-pre-line rounded-2xl bg-muted p-5 text-right text-2xl leading-[2.1]">
              {question.arabic}
            </p>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={config.prompt}
            />
            <Button onClick={submit}>{config.auto ? "Valider" : "Voir la réponse"}</Button>
          </div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-5 overflow-hidden"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Réponse
              </p>
              <p className="arabic mt-2 rounded-2xl bg-primary-soft p-4 text-right text-xl leading-[2]">
                {question.answer}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {question.verse.surah.number}. {surahOf(question.verse.surah.number).french} · verset{" "}
                {question.verse.ayah}
              </p>
              {!config.auto && (
                <div className="mt-4 flex gap-2">
                  <Button size="sm" onClick={() => grade(true)}>
                    <Check className="mr-1.5 size-4" /> J'avais juste
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => grade(false)}>
                    <X className="mr-1.5 size-4" /> À revoir
                  </Button>
                </div>
              )}
              {config.auto && (
                <Button size="sm" variant="outline" className="mt-4" onClick={() => void load()}>
                  <RefreshCw className="mr-1.5 size-4" /> Question suivante
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
      <p className="mt-6 text-xs text-muted-foreground">
        {SURAHS.length} sourates disponibles — les questions privilégient les sourates courtes.
      </p>
    </div>
  );
}
