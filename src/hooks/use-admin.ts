import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "moderator" | "user";

export type AdminUser = {
  id: string;
  display_name: string | null;
  xp: number;
  level: number;
  streak: number;
  banned: boolean;
  ban_reason: string | null;
  created_at: string;
  last_active_date: string | null;
  roles: AppRole[];
  verses: number;
  minutes: number;
  challenges: number;
  challengeWins: number;
};

/** Le rôle admin est stocké dans user_roles (jamais dans le profil). */
export function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", auth.user.id);
      if (error) return false;
      return (data ?? []).some((r) => r.role === "admin");
    },
    staleTime: 60_000,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<AdminUser[]> => {
      const [profiles, roles, verses, sessions, challenges] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, display_name, xp, level, streak, banned, ban_reason, created_at, last_active_date")
          .order("xp", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("verse_progress").select("user_id").limit(50000),
        supabase.from("study_sessions").select("user_id, minutes").limit(20000),
        supabase.from("challenge_results").select("user_id, success").limit(20000),
      ]);

      if (profiles.error) throw profiles.error;

      const count = (rows: { user_id: string }[] | null) => {
        const map = new Map<string, number>();
        for (const row of rows ?? []) map.set(row.user_id, (map.get(row.user_id) ?? 0) + 1);
        return map;
      };

      const verseCount = count(verses.data);
      const challengeCount = count(challenges.data);
      const minutes = new Map<string, number>();
      for (const row of sessions.data ?? [])
        minutes.set(row.user_id, (minutes.get(row.user_id) ?? 0) + (row.minutes ?? 0));
      const wins = new Map<string, number>();
      for (const row of challenges.data ?? [])
        if (row.success) wins.set(row.user_id, (wins.get(row.user_id) ?? 0) + 1);
      const roleMap = new Map<string, AppRole[]>();
      for (const row of roles.data ?? [])
        roleMap.set(row.user_id, [...(roleMap.get(row.user_id) ?? []), row.role as AppRole]);

      return (profiles.data ?? []).map((profile) => ({
        id: profile.id,
        display_name: profile.display_name,
        xp: profile.xp,
        level: profile.level,
        streak: profile.streak,
        banned: profile.banned,
        ban_reason: profile.ban_reason,
        created_at: profile.created_at,
        last_active_date: profile.last_active_date,
        roles: roleMap.get(profile.id) ?? [],
        verses: verseCount.get(profile.id) ?? 0,
        minutes: minutes.get(profile.id) ?? 0,
        challenges: challengeCount.get(profile.id) ?? 0,
        challengeWins: wins.get(profile.id) ?? 0,
      }));
    },
  });
}

export function useAdminActions() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  const setBan = useMutation({
    mutationFn: async (input: { userId: string; banned: boolean; reason?: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          banned: input.banned,
          ban_reason: input.banned ? (input.reason ?? null) : null,
          banned_at: input.banned ? new Date().toISOString() : null,
        })
        .eq("id", input.userId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const setRole = useMutation({
    mutationFn: async (input: { userId: string; role: AppRole; grant: boolean }) => {
      if (input.grant) {
        const { error } = await supabase
          .from("user_roles")
          .upsert({ user_id: input.userId, role: input.role }, { onConflict: "user_id,role" });
        if (error) throw error;
        return;
      }
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", input.userId)
        .eq("role", input.role);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { setBan, setRole };
}
