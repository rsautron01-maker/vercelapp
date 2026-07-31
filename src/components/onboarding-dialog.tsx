import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, ArrowRight, BookOpen, Check, Languages, Palette } from "lucide-react";

import { useProfile, useUpdateProfile } from "@/hooks/use-hifz";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { TajweedLegend, TajweedText } from "@/components/tajweed-text";
import { cn } from "@/lib/utils";

const SAMPLE = "قُلْ هُوَ [h:8078[ٱ]للَّهُ أَحَ[q[د]ٌ";

type Option = { value: string; label: string; hint: string };

const READS: Option[] = [
  { value: "fluent", label: "Oui, je lis couramment", hint: "Texte arabe seul, sans aide." },
  { value: "slow", label: "Oui, mais lentement", hint: "Arabe avec couleurs de tajwid." },
  { value: "letters", label: "Je connais les lettres", hint: "Arabe + phonétique en soutien." },
  { value: "no", label: "Non, pas encore", hint: "Phonétique le temps d'apprendre." },
];

const LEVELS: Option[] = [
  { value: "beginner", label: "Débutant", hint: "Je découvre les règles de tajwid." },
  { value: "intermediate", label: "Intermédiaire", hint: "Je connais les madd et la ghunnah." },
  { value: "advanced", label: "Avancé", hint: "Je révise pour perfectionner." },
];

function Choice({
  option,
  active,
  onClick,
}: {
  option: Option;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "surface lift w-full p-4 text-left",
        active && "border-primary bg-primary-soft",
      )}
    >
      <p className="flex items-center gap-2 text-sm font-semibold">
        {option.label}
        {active && <Check className="size-4 text-primary" />}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{option.hint}</p>
    </button>
  );
}

/** Questionnaire de bienvenue : niveau de lecture, tajwid, mode d'affichage. */
export function OnboardingDialog() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const [step, setStep] = useState(0);
  const [reads, setReads] = useState("slow");
  const [level, setLevel] = useState("beginner");
  const [scriptMode, setScriptMode] = useState("arabic");
  const [showTajweed, setShowTajweed] = useState(true);

  const open = Boolean(profile) && profile?.onboarding_done === false;

  useEffect(() => {
    if (reads === "no") setScriptMode("phonetic");
    else setScriptMode("arabic");
  }, [reads]);

  function finish() {
    update.mutate({
      reads_arabic: reads,
      tajweed_level: level,
      script_mode: scriptMode,
      show_tajweed: showTajweed,
      onboarding_done: true,
    });
  }

  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl [&>button]:hidden">

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Étape {step + 1} / 3
          </p>

          {step === 0 && (
            <div className="mt-3 space-y-4">
              <h2 className="font-display text-2xl font-semibold">
                <BookOpen className="mr-2 inline size-5 text-primary" />
                Sais-tu lire l'arabe ?
              </h2>
              <p className="text-sm text-muted-foreground">
                On adapte l'affichage des versets à ton niveau réel.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {READS.map((option) => (
                  <Choice
                    key={option.value}
                    option={option}
                    active={reads === option.value}
                    onClick={() => setReads(option.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="mt-3 space-y-4">
              <h2 className="font-display text-2xl font-semibold">
                <Palette className="mr-2 inline size-5 text-primary" />
                Ton niveau en tajwid
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {LEVELS.map((option) => (
                  <Choice
                    key={option.value}
                    option={option}
                    active={level === option.value}
                    onClick={() => setLevel(option.value)}
                  />
                ))}
              </div>
              <div className="surface flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-semibold">Couleurs de tajwid</p>
                  <p className="text-xs text-muted-foreground">
                    Chaque règle est colorée directement dans le texte.
                  </p>
                </div>
                <Switch checked={showTajweed} onCheckedChange={setShowTajweed} />
              </div>
              <TajweedText raw={SAMPLE} colored={showTajweed} className="text-2xl" />
              <TajweedLegend compact />
            </div>
          )}

          {step === 2 && (
            <div className="mt-3 space-y-4">
              <h2 className="font-display text-2xl font-semibold">
                <Languages className="mr-2 inline size-5 text-primary" />
                Mode de lecture
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Choice
                  option={{
                    value: "arabic",
                    label: "Mode arabe (recommandé)",
                    hint: "Texte 'uthmâni coloré selon le tajwid.",
                  }}
                  active={scriptMode === "arabic"}
                  onClick={() => setScriptMode("arabic")}
                />
                <Choice
                  option={{
                    value: "phonetic",
                    label: "Mode phonétique",
                    hint: "Translittération latine en soutien.",
                  }}
                  active={scriptMode === "phonetic"}
                  onClick={() => setScriptMode("phonetic")}
                />
              </div>
              {scriptMode === "phonetic" && (
                <div className="surface flex gap-3 border-gold/40 bg-gold-soft p-4">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold" />
                  <p className="text-xs">
                    La phonétique est <strong>déconseillée</strong> : elle ne restitue pas les
                    lettres ni les règles de tajwid et installe des erreurs de prononciation.
                    Utilise-la comme une béquille temporaire et apprends l'alphabet arabe en
                    parallèle.
                  </p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Tu peux changer ces réglages à tout moment depuis ton profil.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Retour
            </Button>
            {step < 2 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Continuer <ArrowRight className="ml-1.5 size-4" />
              </Button>
            ) : (
              <Button onClick={finish} disabled={update.isPending}>
                Commencer <Check className="ml-1.5 size-4" />
              </Button>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
