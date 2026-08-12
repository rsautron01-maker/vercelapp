import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  Layers,
  Trophy,
  ScrollText,
  Sparkles,
  GraduationCap,
  BarChart3,
  UserRound,
  LogOut,
  Moon,
  Sun,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notification-bell";
import { GlobalSearch } from "@/components/global-search";
import { useIsAdmin } from "@/hooks/use-admin";
import { useI18n } from "@/lib/i18n";

const NAV = [
  { to: "/tableau-de-bord", key: "nav.dashboard", icon: LayoutDashboard },
  { to: "/sourates", key: "nav.surahs", icon: BookOpen },
  { to: "/juzz", key: "nav.juz", icon: Layers },
  { to: "/calendrier", key: "nav.calendar", icon: CalendarDays },
  { to: "/defis", key: "nav.challenges", icon: Trophy },
  { to: "/tajwid", key: "nav.tajweed", icon: GraduationCap },
  { to: "/methode", key: "nav.method", icon: Sparkles },
  { to: "/hadith", key: "nav.hadith", icon: ScrollText },
  { to: "/statistiques", key: "nav.stats", icon: BarChart3 },
  { to: "/profil", key: "nav.profile", icon: UserRound },
] as const;

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("hifz-theme", next ? "dark" : "light");
  };
  return { dark, toggle };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { dark, toggle } = useTheme();
  const [openMobile, setOpenMobile] = useState(false);
  const { data: isAdmin } = useIsAdmin();
  const { t } = useI18n();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar px-4 pb-6 text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          openMobile ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 1.5rem)",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
        }}
      >
        <Link to="/tableau-de-bord" className="mb-8 flex items-center gap-3 px-2">
          <span className="flex size-10 items-center justify-center rounded-xl gradient-gold text-lg font-bold text-gold-foreground">
            ﷽
          </span>
          <span>
            <span className="block font-display text-lg font-semibold leading-none">Hifz</span>
            <span className="text-xs text-sidebar-foreground/60">{t("app.tagline")}</span>
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpenMobile(false)}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute left-0 h-6 w-1 rounded-full bg-sidebar-primary"
                  />
                )}
                <item.icon className="size-4" />
                {t(item.key)}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpenMobile(false)}
              className={cn(
                "mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <ShieldCheck className="size-4" /> {t("nav.admin")}
            </Link>
          )}
        </nav>

        <Button variant="ghost" className="justify-start gap-3 text-sidebar-foreground/70" onClick={signOut}>
          <LogOut className="size-4" /> {t("nav.signout")}
        </Button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-8"
          style={{ paddingTop: "env(safe-area-inset-top)", height: "calc(4rem + env(safe-area-inset-top))" }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpenMobile((v) => !v)}
            aria-label={t("app.menu")}
          >
            <Menu className="size-5" />
          </Button>
          <GlobalSearch />
          <div className="ml-auto flex items-center gap-1">
            <NotificationBell />
            <Button variant="ghost" size="icon" onClick={toggle} aria-label={t("app.theme")}>
              {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
