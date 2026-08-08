import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { globalStats, useProfile, useUpdateProfile, useVerses } from "@/hooks/use-hifz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/profil")({
  head: () => ({
    meta: [
      { title: "Profil — Hifz" },
      {
        name: "description",
        content: "Gérez votre prénom, vos objectifs de mémorisation et votre session.",
      },
      { property: "og:title", content: "Profil — Hifz" },
      { property: "og:description", content: "Objectifs personnels et paramètres du compte." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data: profile } = useProfile();
  const { data: verses = [] } = useVerses();
  const updateProfile = useUpdateProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [monthlyGoal, setMonthlyGoal] = useState(200);
  const [weeklyGoal, setWeeklyGoal] = useState(50);

  useEffect(() => {
    if (!profile) return;
    setName(profile.display_name ?? "");
    setMonthlyGoal(profile.monthly_goal ?? 200);
    setWeeklyGoal(profile.weekly_goal ?? 50);
  }, [profile]);

  const stats = globalStats(verses);

  async function save() {
    if (!profile) return;
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name, monthly_goal: monthlyGoal, weekly_goal: weeklyGoal })
      .eq("id", profile.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Profil mis à jour.");
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Profil" description="Vos informations et objectifs de mémorisation." />

      <section className="surface p-6">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl gradient-emerald font-display text-xl font-semibold text-primary-foreground">
            {(name || "H").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <p className="font-display text-lg font-semibold">{name || "Étudiant"}</p>
            <p className="text-sm text-muted-foreground">
              Niveau {profile?.level ?? 1} · {profile?.xp ?? 0} XP · série {profile?.streak ?? 0} j
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Prénom affiché</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly">Objectif mensuel (versets)</Label>
            <Input
              id="monthly"
              type="number"
              min={1}
              value={monthlyGoal}
              onChange={(e) => setMonthlyGoal(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weekly">Objectif hebdomadaire (versets)</Label>
            <Input
              id="weekly"
              type="number"
              min={1}
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(Number(e.target.value))}
            />
          </div>
        </div>

        <Button className="mt-5" onClick={save}>
          Enregistrer
        </Button>
      </section>

      <section className="surface mt-5 grid gap-4 p-6 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Versets suivis</p>
          <p className="mt-1 font-display text-2xl font-semibold">{stats.learned}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Sourates terminées</p>
          <p className="mt-1 font-display text-2xl font-semibold">{stats.finished}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Progression</p>
          <p className="mt-1 font-display text-2xl font-semibold">{stats.percent.toFixed(1)}%</p>
        </div>
      </section>

      <section className="surface mt-5 p-6">
        <p className="font-display text-lg font-semibold">Lecture & tajwid</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ces réglages définissent l'affichage par défaut des versets.
        </p>

        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Rappels de tajwid</p>
              <p className="text-xs text-muted-foreground">
                Affiche des rappels de règles pendant la lecture.
              </p>
            </div>
            <Switch
              checked={profile?.show_tajweed !== false}
              onCheckedChange={(checked) => updateProfile.mutate({ show_tajweed: checked })}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Mode d'affichage</p>
              <p className="text-xs text-muted-foreground">
                La phonétique est déconseillée : elle installe des erreurs de prononciation.
              </p>
            </div>
            <div className="flex gap-2">
              {(
                [
                  ["arabic", "Arabe"],
                  ["phonetic", "Phonétique"],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={value}
                  size="sm"
                  variant={profile?.script_mode === value ? "default" : "outline"}
                  onClick={() => updateProfile.mutate({ script_mode: value })}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Button asChild variant="outline" size="sm" className="mt-5">
          <Link to="/tajwid">Voir le cours de tajwid</Link>
        </Button>

      </section>

      <Button variant="outline" className="mt-5" onClick={signOut}>

        <LogOut className="mr-1.5 size-4" /> Se déconnecter
      </Button>
    </div>
  );
}
