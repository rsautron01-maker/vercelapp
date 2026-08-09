import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Pause, Play, Repeat, SkipBack, SkipForward, Square } from "lucide-react";

import {
  DEFAULT_RECITER,
  RECITERS,
  ayahAudioUrl,
  reciterLabel,
  surahAudioUrl,
} from "@/lib/reciters";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "hifz-reciter";

export function useReciter() {
  const [reciter, setReciter] = useState(DEFAULT_RECITER);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setReciter(stored);
  }, []);

  const update = useCallback((value: string) => {
    setReciter(value);
    localStorage.setItem(STORAGE_KEY, value);
  }, []);

  return { reciter, setReciter: update };
}

export function ReciterSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-[240px]", className)} aria-label="Choisir le récitateur">
        <SelectValue placeholder="Récitateur" />
      </SelectTrigger>
      <SelectContent>
        {RECITERS.map((r) => (
          <SelectItem key={r.id} value={r.id}>
            {reciterLabel(r.id)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export type AudioTrack = { globalNumber: number; numberInSurah: number };

/**
 * Lecteur audio du Coran : sourate complète ou verset par verset,
 * avec récitateur au choix, répétition et lecture continue.
 */
export function useQuranAudio(surah: number, tracks: AudioTrack[]) {
  const { reciter, setReciter } = useReciter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [playingSurah, setPlayingSurah] = useState(false);
  const [loading, setLoading] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const order = useMemo(() => tracks.map((t) => t.numberInSurah), [tracks]);

  const getAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    return audioRef.current;
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    setCurrentAyah(null);
    setPlayingSurah(false);
    setLoading(false);
  }, []);

  const playAyah = useCallback(
    (numberInSurah: number) => {
      const track = tracks.find((t) => t.numberInSurah === numberInSurah);
      if (!track) return;
      const audio = getAudio();
      setPlayingSurah(false);
      setCurrentAyah(numberInSurah);
      setLoading(true);
      audio.src = ayahAudioUrl(track.globalNumber, reciter);
      void audio.play().catch(() => setLoading(false));
    },
    [getAudio, reciter, tracks],
  );

  const playSurah = useCallback(() => {
    const audio = getAudio();
    setCurrentAyah(null);
    setPlayingSurah(true);
    setLoading(true);
    audio.src = surahAudioUrl(surah, reciter);
    void audio.play().catch(() => setLoading(false));
  }, [getAudio, reciter, surah]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) {
      playSurah();
      return;
    }
    if (audio.paused) void audio.play();
    else audio.pause();
  }, [playSurah]);

  const step = useCallback(
    (delta: number) => {
      if (currentAyah == null) return;
      const index = order.indexOf(currentAyah);
      const next = order[index + delta];
      if (next != null) playAyah(next);
    },
    [currentAyah, order, playAyah],
  );

  // Enchaînement automatique verset par verset.
  useEffect(() => {
    const audio = getAudio();
    const onEnded = () => {
      if (playingSurah) {
        stop();
        return;
      }
      if (currentAyah == null) return;
      if (repeat) {
        playAyah(currentAyah);
        return;
      }
      const next = order[order.indexOf(currentAyah) + 1];
      if (next != null) playAyah(next);
      else stop();
    };
    const onPlaying = () => setLoading(false);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("playing", onPlaying);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("playing", onPlaying);
    };
  }, [currentAyah, getAudio, order, playAyah, playingSurah, repeat, stop]);

  useEffect(() => stop, [stop]);

  const isActive = currentAyah != null || playingSurah;

  const bar = (
    <div className="surface flex flex-wrap items-center gap-3 p-4">
      <ReciterSelect value={reciter} onChange={setReciter} />
      <div className="flex items-center gap-1.5">
        <Button size="sm" variant="outline" onClick={() => step(-1)} disabled={currentAyah == null}>
          <SkipBack className="size-4" />
        </Button>
        <Button size="sm" onClick={toggle}>
          {loading ? (
            <Loader2 className="mr-1.5 size-4 animate-spin" />
          ) : isActive ? (
            <Pause className="mr-1.5 size-4" />
          ) : (
            <Play className="mr-1.5 size-4" />
          )}
          {isActive ? "Pause" : "Écouter la sourate"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => step(1)} disabled={currentAyah == null}>
          <SkipForward className="size-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={stop} disabled={!isActive}>
          <Square className="size-4" />
        </Button>
        <Button
          size="sm"
          variant={repeat ? "secondary" : "outline"}
          onClick={() => setRepeat((r) => !r)}
          title="Répéter le verset"
        >
          <Repeat className="size-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {playingSurah
          ? "Sourate complète"
          : currentAyah != null
            ? `Verset ${currentAyah}${repeat ? " · en boucle" : " · lecture continue"}`
            : "Choisis un récitateur puis lance la lecture"}
      </p>
    </div>
  );

  return { bar, playAyah, currentAyah, stop, reciter };
}
