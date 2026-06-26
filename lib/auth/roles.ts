import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Tables } from "@/lib/supabase/database.types";

export type Profile = Tables<"profiles">;

export interface SessionContext {
  user: Awaited<ReturnType<typeof getUser>>;
  profile: Profile | null;
  roles: AppRole[];
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** 로그인 사용자 + 프로필 + 역할 목록을 한 번에 조회. */
export async function getSessionContext(): Promise<SessionContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null, roles: [] };

  const [{ data: profile }, { data: roleRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id),
  ]);

  return {
    user,
    profile: profile ?? null,
    roles: (roleRows ?? []).map((r) => r.role),
  };
}

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

/** 특정 역할(또는 admin)만 허용. 불일치 시 본인 대시보드로 보냄. */
export async function requireRole(role: AppRole): Promise<SessionContext> {
  const ctx = await getSessionContext();
  if (!ctx.user) redirect("/login");
  if (!ctx.roles.includes(role) && !ctx.roles.includes("admin")) {
    redirect(primaryRedirect(ctx.roles));
  }
  return ctx;
}

/** 역할에 따른 로그인 후 기본 랜딩 경로. */
export function primaryRedirect(roles: AppRole[]): string {
  if (roles.includes("admin")) return "/admin";
  if (roles.includes("student")) return "/student";
  if (roles.includes("parent")) return "/parent";
  return "/account";
}
