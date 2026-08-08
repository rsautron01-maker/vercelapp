import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { OnboardingDialog } from "@/components/onboarding-dialog";

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

  component: () => (
    <AppShell>
      <OnboardingDialog />
      <Outlet />
    </AppShell>
  ),
});
