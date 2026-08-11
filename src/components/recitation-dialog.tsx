import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, Mic, Square, RotateCcw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { startRecording, transcribe, type Recorder } from "@/lib/recorder";
import { compareRecitation, repetitions, type DiffWord } from "@/lib/recitation";
import { cn } from "@/lib/utils";

type Phase = "idle" | "recording" | "checking" | "result" | "error";

function DiffWordChip({ word }: { word: DiffWord }) {
  if (word.kind === "ok") {
    return <span className="arabic text-emerald-600 dark:text-emerald-400">{word.expected}</span>;
  }
  if (word.kind === "missing") {
    return (
      <span
        className="arabic rounded-md border border-dashed border-destructive/60 bg-destructive/10 px-1.5 text-destructive"
        title="Mot oublié"
      >
        {word.expected}
      </span>
    );
  }
  if (word.kind === "extra") {
    return (
      <span
        className="arabic rounded-md bg-gold-soft px-1.5 text-gold line-through"
        title="Mot ajouté"
      >
        {word.actual}
      </span>
    );
  }
  return (
    <span className="arabic rounded-md bg-destructive/10 px-1.5 text-destructive" title={`Prononcé : ${word.actual}`}>
      {word.letters?.length
        ? word.letters.map((l, i) => (
            <span key={i} className={l.ok ? "text-foreground/70" : "underline decoration-2"}>
              {l.char}
            </span>
          ))
        : word.expected}
    </span>
  );
}

export function RecitationDialog({
  open,
  onOpenChange,
  title,
  reference,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Texte arabe attendu (verset ou sourate complète). */
  reference: string;
}) {
  const [strict, setStrict] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [spoken, setSpoken] = useState("");
  const [message, setMessage] = useState("");
  const recorderRef = useRef<Recorder | null>(null);

  const reset = useCallback(() => {
    recorderRef.current?.cancel();
    recorderRef.current = null;
    setPhase("idle");
    setSpoken("");
    setMessage("");
    setSeconds(0);
    setLevel(0);
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (phase !== "recording") return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  async function begin() {
    setMessage("");
    setSpoken("");
    setSeconds(0);
    try {
      recorderRef.current = await startRecording(setLevel);
      setPhase("recording");
    } catch {
      setPhase("error");
      setMessage("Accès au microphone refusé. Autorise le micro puis réessaie.");
    }
  }

  async function finish() {
    const recorder = recorderRef.current;
    if (!recorder) return;
    setPhase("checking");
    try {
      const blob = await recorder.stop();
      recorderRef.current = null;
      if (blob.size < 4096) {
        setPhase("error");
        setMessage("Enregistrement trop court ou micro silencieux. Réessaie.");
        return;
      }
      const text = await transcribe(blob);
      if (!text) {
        setPhase("error");
        setMessage("Aucune parole détectée. Récite un peu plus fort.");
        return;
      }
      setSpoken(text);
      setPhase("result");
    } catch (error) {
      setPhase("error");
      setMessage(error instanceof Error ? error.message : "Erreur inattendue.");
    }
  }

  const report = phase === "result" ? compareRecitation(reference, spoken, strict) : null;
  const repeats = report ? repetitions(report.diff) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Réciter · {title}</DialogTitle>
          <DialogDescription>
            Récite à voix haute, puis arrête l'enregistrement pour comparer avec le texte original.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={strict ? "strict" : "normal"} onValueChange={(v) => setStrict(v === "strict")}>
            <TabsList>
              <TabsTrigger value="normal">Mode normal</TabsTrigger>
              <TabsTrigger value="strict">Mode strict</TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">
            {strict
              ? "Harakât et caractères comparés précisément."
              : "Comparaison sur les mots et lettres, vocalisation ignorée."}
          </p>
        </div>

        <div className="surface p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Texte original
          </p>
          <p dir="rtl" className="arabic text-xl leading-[2.1]">
            {reference}
          </p>
        </div>

        {phase === "recording" && (
          <div className="surface flex items-center gap-4 p-4">
            <span className="relative flex size-3">
              <span className="absolute inline-flex size-3 animate-ping rounded-full bg-destructive/70" />
              <span className="inline-flex size-3 rounded-full bg-destructive" />
            </span>
            <div className="flex-1">
              <Progress value={Math.min(100, level * 250)} />
              <p className="mt-2 text-xs text-muted-foreground">
                Enregistrement… {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </p>
            </div>
          </div>
        )}

        {phase === "checking" && (
          <div className="surface flex items-center gap-3 p-4 text-sm">
            <Loader2 className="size-4 animate-spin" /> Analyse de ta récitation…
          </div>
        )}

        {(phase === "error" || message) && phase !== "result" && (
          <div className="surface flex gap-3 border-destructive/40 bg-destructive/10 p-4">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-xs">{message}</p>
          </div>
        )}

        {report && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="surface p-4">
                <p className="text-2xl font-semibold">{report.score} %</p>
                <p className="text-xs text-muted-foreground">de correspondance</p>
              </div>
              <div className="surface p-4">
                <p className="text-2xl font-semibold">{report.errors}</p>
                <p className="text-xs text-muted-foreground">
                  erreur{report.errors > 1 ? "s" : ""} détectée{report.errors > 1 ? "s" : ""}
                </p>
              </div>
              <div className="surface p-4 text-xs text-muted-foreground">
                <p>{report.counts.missing} mot(s) oublié(s)</p>
                <p>{report.counts.extra} mot(s) ajouté(s)</p>
                <p>{report.counts.wrong} mot(s) différent(s)</p>
                {repeats > 0 && <p>{repeats} répétition(s) / hésitation(s)</p>}
              </div>
            </div>

            <div className="surface p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Comparaison mot par mot
              </p>
              <p dir="rtl" className="flex flex-wrap-reverse justify-end gap-x-2 gap-y-3 text-xl leading-[2.1]">
                {report.diff.map((word, index) => (
                  <DiffWordChip key={index} word={word} />
                ))}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400">● correct</span>
                <span className="text-destructive">● différent / lettre incorrecte</span>
                <span className="text-destructive">▢ mot oublié</span>
                <span className="text-gold">● mot ajouté</span>
              </div>
            </div>

            <div className="surface p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Ta transcription
              </p>
              <p dir="rtl" className="arabic text-lg leading-[2]">
                {spoken}
              </p>
            </div>

            <div className="surface flex gap-3 border-gold/40 bg-gold-soft p-4">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold" />
              <p className="text-xs">
                La transcription automatique peut se tromper (accent, bruit, débit rapide). Une
                différence signalée n'est pas forcément une erreur de récitation : écoute-toi et
                vérifie avec le texte avant de conclure.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {phase === "recording" ? (
            <Button onClick={finish}>
              <Square className="mr-1.5 size-4" /> Terminer et vérifier
            </Button>
          ) : (
            <Button onClick={begin} disabled={phase === "checking"}>
              {phase === "checking" ? (
                <Loader2 className="mr-1.5 size-4 animate-spin" />
              ) : (
                <Mic className="mr-1.5 size-4" />
              )}
              {phase === "result" || phase === "error" ? "Réessayer" : "Commencer la récitation"}
            </Button>
          )}
          {phase === "result" && (
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="mr-1.5 size-4" /> Effacer le résultat
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
