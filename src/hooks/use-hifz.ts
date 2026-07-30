import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SURAHS, TOTAL_AYAHS, JUZ_START } from "@/data/quran";

export type VerseStatus = "learned" | "review" | "todo";

export type VerseRow = { surah: number; ayah: number; status: VerseStatus };
export type TaskRow = {
  id: string;
  label: string;
  done: boolean;
  task_date: string;
};
export type ReviewRow = {
  id: string;
  label: string;
  target_type: string;
  surah: number | null;
  juz: number | null;
  ayah_from: number | null;
  ayah_to: number | null;
  due_date: string;
  interval_days: number;
  done: boolean;
};
export type JuzRow = { juz: number; mastery: number; last_review: string | null };
export type SessionRow = {
  session_date: string;
  minutes: number;
  verses_learned: number;
  reviews_done: number;
};
export type ChallengeRow = {
  id: string;
  mode: string;
  score: number;
  total: number;
  success: boolean;
  created_at: string;
};

export const today = () => new Date().toISOString().slice(0, 10);

async function currentUserId() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Non connecté");
  return data.user.id;
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const userId = await currentUserId();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      if (data) return data;
      const { data: created, error: insertError } = await supabase
        .from("profiles")
        .insert({ id: userId })
        .select()
        .single();
      if (insertError) throw insertError;
      return created;
    },
  });
}

export function useVerses() {
  return useQuery({
    queryKey: ["verses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verse_progress")
        .select("surah, ayah, status")
        .order("surah")
        .order("ayah");
      if (error) throw error;
      return (data ?? []) as VerseRow[];
    },
  });
}

export function useSetVerseStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { surah: number; ayah: number; status: VerseStatus | null }) => {
      const userId = await currentUserId();
      if (input.status === null) {
        const { error } = await supabase
          .from("verse_progress")
          .delete()
          .eq("user_id", userId)
          .eq("surah", input.surah)
          .eq("ayah", input.ayah);
        if (error) throw error;
        return;
      }
      const { error } = await supabase.from("verse_progress").upsert(
        {
          user_id: userId,
          surah: input.surah,
          ayah: input.ayah,
          status: input.status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,surah,ayah" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verses"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useTasks(date = today()) {
  return useQuery({
    queryKey: ["tasks", date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, label, done, task_date")
        .eq("task_date", date)
        .order("created_at");
      if (error) throw error;
      return (data ?? []) as TaskRow[];
    },
  });
}

export function useTaskMutations(date = today()) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["tasks", date] });

  const add = useMutation({
    mutationFn: async (label: string) => {
      const userId = await currentUserId();
      const { error } = await supabase
        .from("tasks")
        .insert({ user_id: userId, label, task_date: date });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const toggle = useMutation({
    mutationFn: async (task: TaskRow) => {
      const { error } = await supabase
        .from("tasks")
        .update({ done: !task.done })
        .eq("id", task.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { add, toggle, remove };
}

export function useJuz() {
  return useQuery({
    queryKey: ["juz"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("juz_progress")
        .select("juz, mastery, last_review");
      if (error) throw error;
      return (data ?? []) as JuzRow[];
    },
  });
}

export function useSaveJuz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { juz: number; mastery: number; reviewed?: boolean }) => {
      const userId = await currentUserId();
      const { error } = await supabase.from("juz_progress").upsert(
        {
          user_id: userId,
          juz: input.juz,
          mastery: input.mastery,
          last_review: input.reviewed ? today() : undefined,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,juz" },
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["juz"] }),
  });
}

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("due_date")
        .limit(300);
      if (error) throw error;
      return (data ?? []) as ReviewRow[];
    },
  });
}

export function useReviewMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
    queryClient.invalidateQueries({ queryKey: ["sessions"] });
  };

  const create = useMutation({
    mutationFn: async (input: Partial<ReviewRow> & { label: string }) => {
      const userId = await currentUserId();
      const { error } = await supabase.from("reviews").insert({
        user_id: userId,
        label: input.label,
        target_type: input.target_type ?? "surah",
        surah: input.surah ?? null,
        juz: input.juz ?? null,
        ayah_from: input.ayah_from ?? null,
        ayah_to: input.ayah_to ?? null,
        due_date: input.due_date ?? today(),
        interval_days: input.interval_days ?? 1,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  /** Répétition espacée : intervalle x2 (max 60 jours) à chaque réussite. */
  const complete = useMutation({
    mutationFn: async (review: ReviewRow) => {
      const userId = await currentUserId();
      const nextInterval = Math.min(60, Math.max(1, review.interval_days) * 2);
      const nextDue = new Date();
      nextDue.setDate(nextDue.getDate() + nextInterval);
      const { error } = await supabase
        .from("reviews")
        .update({ done: true })
        .eq("id", review.id);
      if (error) throw error;
      const { error: insertError } = await supabase.from("reviews").insert({
        user_id: userId,
        label: review.label,
        target_type: review.target_type,
        surah: review.surah,
        juz: review.juz,
        ayah_from: review.ayah_from,
        ayah_to: review.ayah_to,
        due_date: nextDue.toISOString().slice(0, 10),
        interval_days: nextInterval,
      });
      if (insertError) throw insertError;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { create, complete, remove };
}

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("study_sessions")
        .select("session_date, minutes, verses_learned, reviews_done")
        .order("session_date", { ascending: false })
        .limit(90);
      if (error) throw error;
      return (data ?? []) as SessionRow[];
    },
  });
}

export function useTrackTime() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (minutes: number) => {
      const userId = await currentUserId();
      const { data } = await supabase
        .from("study_sessions")
        .select("minutes")
        .eq("user_id", userId)
        .eq("session_date", today())
        .maybeSingle();
      const { error } = await supabase.from("study_sessions").upsert(
        {
          user_id: userId,
          session_date: today(),
          minutes: (data?.minutes ?? 0) + minutes,
        },
        { onConflict: "user_id,session_date" },
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
  return useCallback((minutes: number) => mutation.mutate(minutes), [mutation]);
}

export function useChallengeResults() {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenge_results")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as ChallengeRow[];
    },
  });
}

export function useSaveChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      mode: string;
      score: number;
      total: number;
      success: boolean;
      xp?: number;
    }) => {
      const userId = await currentUserId();
      const { error } = await supabase.from("challenge_results").insert({
        user_id: userId,
        mode: input.mode,
        score: input.score,
        total: input.total,
        success: input.success,
      });
      if (error) throw error;
      if (input.xp) {
        const { data } = await supabase
          .from("profiles")
          .select("xp")
          .eq("id", userId)
          .maybeSingle();
        const xp = (data?.xp ?? 0) + input.xp;
        await supabase
          .from("profiles")
          .update({ xp, level: 1 + Math.floor(xp / 500) })
          .eq("id", userId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useBadges() {
  return useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      const { data, error } = await supabase.from("badges").select("code, earned_at");
      if (error) throw error;
      return (data ?? []) as { code: string; earned_at: string }[];
    },
  });
}

/* ---------------------- Dérivations de statistiques ---------------------- */

export function surahStats(verses: VerseRow[]) {
  const map = new Map<
    number,
    { learned: number; review: number; last: number; status: "todo" | "progress" | "done" }
  >();
  for (const surah of SURAHS) {
    map.set(surah.number, { learned: 0, review: 0, last: 0, status: "todo" });
  }
  for (const verse of verses) {
    const entry = map.get(verse.surah);
    if (!entry) continue;
    if (verse.status === "learned") entry.learned += 1;
    if (verse.status === "review") entry.review += 1;
    if (verse.status !== "todo") entry.last = Math.max(entry.last, verse.ayah);
  }
  for (const surah of SURAHS) {
    const entry = map.get(surah.number)!;
    const known = entry.learned + entry.review;
    entry.status = known === 0 ? "todo" : known >= surah.ayahs ? "done" : "progress";
  }
  return map;
}

export function globalStats(verses: VerseRow[]) {
  const stats = surahStats(verses);
  let learned = 0;
  let started = 0;
  let finished = 0;
  for (const surah of SURAHS) {
    const entry = stats.get(surah.number)!;
    learned += entry.learned + entry.review;
    if (entry.status !== "todo") started += 1;
    if (entry.status === "done") finished += 1;
  }
  return {
    learned,
    started,
    finished,
    percent: (learned / TOTAL_AYAHS) * 100,
    stats,
  };
}

export function juzOfVerse(surah: number, ayah: number) {
  let juz = 1;
  JUZ_START.forEach((ref) => {
    if (surah > ref.surah || (surah === ref.surah && ayah >= ref.ayah)) juz = ref.number;
  });
  return juz;
}

export function juzProgressPercent(verses: VerseRow[], juz: number) {
  const inJuz = verses.filter((v) => juzOfVerse(v.surah, v.ayah) === juz);
  // ~ 208 versets par juz en moyenne
  return Math.min(100, (inJuz.length / 208) * 100);
}
