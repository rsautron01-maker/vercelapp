import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ShieldOff } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { I18nProvider } from "@/lib/i18n";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // On lit d'abord la session locale : au rafraîchissement elle est déjà en
    // mémoire/localStorage, ce qui évite de déconnecter en cas de réseau lent.
    const { data: session } = await supabase.auth.getSession();
    if (session.session?.user) return { user: session.session.user };
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },

  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { data: ban } = useQuery({
    queryKey: ["ban-status"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("banned, ban_reason")
        .eq("id", auth.user.id)
        .maybeSingle();
      return data ?? null;
    },
    staleTime: 30_000,
  });

  if (ban?.banned) return <BannedScreen reason={ban.ban_reason} />;

  return (
    <I18nProvider>
      <AppShell>
        <OnboardingDialog />
        <Outlet />
      </AppShell>
    </I18nProvider>
  );
}

function BannedScreen({ reason }: { reason: string | null }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="surface max-w-md p-8 text-center">
        <ShieldOff className="mx-auto size-9 text-destructive" />
        <h1 className="mt-4 font-display text-xl font-semibold">Compte suspendu</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {reason ?? "Votre accès a été suspendu par un administrateur."}
        </p>
        <Button variant="outline" className="mt-6" onClick={signOut}>
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
