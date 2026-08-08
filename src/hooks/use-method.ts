import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { today } from "@/hooks/use-hifz";

export type MethodPlan = {
  id: string;
  label: string;
  surah: number | null;
  ayah_from: number | null;
  ayah_to: number | null;
  start_date: string;
  step: number;
  last_step_date: string | null;
  active: boolean;
};

/** Les 5 étapes du cycle : écoute passive → apprentissage → récitation active → ancrage → révision. */
export const METHOD_STEPS = [
  {
    step: 1,
    day: "Jour 1",
    title: "Écoute passive",
    goal: "Écouter 10 à 15 fois le passage que tu apprendras demain, sans chercher à retenir.",
    detail:
      "Mets la récitation d'un même récitateur en fond (trajet, ménage, avant de dormir) et suis le texte des yeux au moins 3 fois. L'oreille mémorise la mélodie et le tajwid avant la mémoire consciente.",
  },
  {
    step: 2,
    day: "Jour 2",
    title: "Apprentissage actif",
    goal: "Mémoriser le passage verset par verset, en boucle de 3.",
    detail:
      "Lis un verset 5 fois en regardant, 3 fois sans regarder, puis enchaîne avec le verset précédent. Tous les 3 versets, récite le bloc entier. Termine par le passage complet 3 fois.",
  },
  {
    step: 3,
    day: "Jour 3 — matin",
    title: "Récitation sans regarder",
    goal: "Réciter le passage de mémoire, à jeun de lecture.",
    detail:
      "Au réveil, récite sans ouvrir le Coran. Si un blocage survient, note le verset, revois-le puis reprends depuis le début. Réussi ? Le passage passe en révision et tu attaques le passage suivant.",
  },
  {
    step: 4,
    day: "Jour 4",
    title: "Ancrage (rappel actif)",
    goal: "Réciter à voix haute devant quelqu'un ou en t'enregistrant.",
    detail:
      "Le rappel actif (se tester) ancre 2 fois mieux que la relecture. Enregistre-toi, réécoute et corrige le tajwid et les fins de versets.",
  },
  {
    step: 5,
    day: "Ensuite",
    title: "Révision espacée",
    goal: "Revoir le passage à J+1, J+3, J+7, J+15, J+30.",
    detail:
      "Alterne révision active (réciter de mémoire) et révision passive (écouter / lire). Une seule journée sans révision de l'ancien coûte plus cher qu'une journée sans nouveau.",
  },
];

export function useMethodPlans() {
  return useQuery({
    queryKey: ["method-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("method_plans")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as MethodPlan[];
    },
  });
}

export function useMethodMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["method-plans"] });

  const create = useMutation({
    mutationFn: async (input: {
      label: string;
      surah?: number | null;
      ayah_from?: number | null;
      ayah_to?: number | null;
    }) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Non connecté");
      const { error } = await supabase.from("method_plans").insert({
        user_id: auth.user.id,
        label: input.label,
        surah: input.surah ?? null,
        ayah_from: input.ayah_from ?? null,
        ayah_to: input.ayah_to ?? null,
        start_date: today(),
        step: 1,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const advance = useMutation({
    mutationFn: async (plan: MethodPlan) => {
      const next = Math.min(METHOD_STEPS.length, plan.step + 1);
      const { error } = await supabase
        .from("method_plans")
        .update({ step: next, last_step_date: today() })
        .eq("id", plan.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const reset = useMutation({
    mutationFn: async (plan: MethodPlan) => {
      const { error } = await supabase
        .from("method_plans")
        .update({ step: 1, last_step_date: null, start_date: today() })
        .eq("id", plan.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const archive = useMutation({
    mutationFn: async (plan: MethodPlan) => {
      const { error } = await supabase
        .from("method_plans")
        .update({ active: false })
        .eq("id", plan.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("method_plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { create, advance, reset, archive, remove };
}
