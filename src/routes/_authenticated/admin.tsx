import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Ban, Search, ShieldCheck, ShieldOff, Users } from "lucide-react";
import { toast } from "sonner";

import { useAdminActions, useAdminUsers, useIsAdmin } from "@/hooks/use-admin";
import { TOTAL_AYAHS } from "@/data/quran";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, StatCard } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Hifz" },
      {
        name: "description",
        content: "Suivi des membres : progression, temps d'étude, défis, rôles et suspensions.",
      },
      { property: "og:title", content: "Administration — Hifz" },
      { property: "og:description", content: "Tableau de bord d'administration des membres." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { data: isAdmin, isLoading: checking } = useIsAdmin();
  const { data: users = [], isLoading } = useAdminUsers();
  const { setBan, setRole } = useAdminActions();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"xp" | "verses" | "minutes">("xp");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => !q || (u.display_name ?? "").toLowerCase().includes(q) || u.id.includes(q))
      .sort((a, b) => b[sort] - a[sort]);
  }, [users, query, sort]);

  const totals = useMemo(
    () => ({
      members: users.length,
      active: users.filter((u) => u.minutes > 0).length,
      banned: users.filter((u) => u.banned).length,
      minutes: users.reduce((sum, u) => sum + u.minutes, 0),
    }),
    [users],
  );

  if (checking) return <Skeleton className="h-64 w-full rounded-2xl" />;

  if (!isAdmin) {
    return (
      <div className="surface mx-auto max-w-lg p-8 text-center">
        <ShieldOff className="mx-auto size-8 text-muted-foreground" />
        <h1 className="mt-4 font-display text-xl font-semibold">Accès réservé</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page est réservée aux administrateurs.
        </p>
        <Button asChild className="mt-6">
          <Link to="/tableau-de-bord">Retour au tableau de bord</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Administration"
        description="Vue d'ensemble des membres, de leur progression et de la modération."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Membres" value={String(totals.members)} />
        <StatCard icon={ShieldCheck} label="Membres actifs" value={String(totals.active)} />
        <StatCard icon={Ban} label="Comptes suspendus" value={String(totals.banned)} />
        <StatCard
          icon={ShieldCheck}
          label="Temps d'étude cumulé"
          value={`${Math.round(totals.minutes / 60)} h`}
        />
      </div>

      <div className="surface p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un membre"
              className="pl-9"
            />
          </div>
          {(
            [
              { value: "xp", label: "XP" },
              { value: "verses", label: "Versets" },
              { value: "minutes", label: "Minutes" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSort(option.value)}
              className={cn(
                "rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors",
                sort === option.value ? "border-primary bg-primary-soft text-primary" : "hover:bg-muted",
              )}
            >
              Trier par {option.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-2xl" />
        ) : (
          <div className="space-y-3">
            {filtered.map((user, index) => {
              const percent = Math.min(100, (user.verses / TOTAL_AYAHS) * 100);
              const isUserAdmin = user.roles.includes("admin");
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(index, 10) * 0.02 }}
                  className={cn(
                    "rounded-2xl border border-border p-4",
                    user.banned && "border-destructive/40 bg-destructive/5",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-medium">
                        {user.display_name ?? "Membre"}
                        {isUserAdmin && (
                          <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-semibold text-gold">
                            admin
                          </span>
                        )}
                        {user.banned && (
                          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                            suspendu
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        Niveau {user.level} · {user.xp} XP · série {user.streak} j · inscrit le{" "}
                        {new Date(user.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setRole.mutate(
                            { userId: user.id, role: "admin", grant: !isUserAdmin },
                            {
                              onSuccess: () =>
                                toast.success(isUserAdmin ? "Rôle admin retiré" : "Rôle admin accordé"),
                              onError: (error) => toast.error(error.message),
                            },
                          )
                        }
                      >
                        {isUserAdmin ? "Retirer admin" : "Nommer admin"}
                      </Button>
                      <Button
                        size="sm"
                        variant={user.banned ? "outline" : "destructive"}
                        onClick={() =>
                          setBan.mutate(
                            {
                              userId: user.id,
                              banned: !user.banned,
                              reason: user.banned ? undefined : "Suspendu par un administrateur",
                            },
                            {
                              onSuccess: () =>
                                toast.success(user.banned ? "Compte réactivé" : "Compte suspendu"),
                              onError: (error) => toast.error(error.message),
                            },
                          )
                        }
                      >
                        {user.banned ? "Réactiver" : "Suspendre"}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 text-xs text-muted-foreground sm:grid-cols-4">
                    <span>{user.verses} verset(s) suivis</span>
                    <span>{user.minutes} min d'étude</span>
                    <span>
                      {user.challenges} défi(s) · {user.challengeWins} réussi(s)
                    </span>
                    <span>
                      Dernière activité :{" "}
                      {user.last_active_date
                        ? new Date(user.last_active_date).toLocaleDateString("fr-FR")
                        : "—"}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                  </div>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">Aucun membre trouvé.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
