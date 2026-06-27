import "server-only";
import { createClient } from "@/shared/lib/supabase/server";
import type { AppRole, Tables } from "@/shared/lib/supabase/database.types";

export type ProfileWithRoles = Tables<"profiles"> & { roles: AppRole[] };

export async function getUsersWithRoles(): Promise<ProfileWithRoles[]> {
  const supabase = await createClient();
  const [{ data: profiles }, { data: roles }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("user_roles").select("user_id, role"),
  ]);

  const map = new Map<string, AppRole[]>();
  (roles ?? []).forEach((r) => {
    const arr = map.get(r.user_id) ?? [];
    arr.push(r.role);
    map.set(r.user_id, arr);
  });

  return (profiles ?? []).map((p) => ({ ...p, roles: map.get(p.id) ?? [] }));
}
