"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AppRole } from "@/lib/supabase/database.types";

export interface ClientSession {
  nickname: string | null;
  avatarUrl: string | null;
  roles: AppRole[];
}

/**
 * 브라우저에서 로그인 사용자/역할을 직접 조회(로그인 본인은 RLS상 자기 역할을 읽을 수 있음).
 * undefined = 로딩중, null = 비로그인.
 */
export function useAuthSession(): ClientSession | null | undefined {
  const [session, setSession] = useState<ClientSession | null | undefined>(
    undefined,
  );

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (active) setSession(null);
        return;
      }
      const [{ data: profile }, { data: roleRows }] = await Promise.all([
        supabase
          .from("profiles")
          .select("nickname, avatar_url, is_admin")
          .eq("id", user.id)
          .maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);
      if (!active) return;
      const roles = (roleRows ?? []).map((r) => r.role as AppRole);
      // 관리자 여부는 profiles.is_admin 으로 분기
      if (profile?.is_admin && !roles.includes("admin")) roles.push("admin");
      setSession({
        nickname: profile?.nickname ?? null,
        avatarUrl: profile?.avatar_url ?? null,
        roles,
      });
    }

    void load();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void load();
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return session;
}

/** 클라이언트에서 관리자일 때만 children 렌더(공개 페이지 인라인 관리 버튼용). */
export function AdminOnly({ children }: { children: React.ReactNode }) {
  const session = useAuthSession();
  if (!session || !session.roles.includes("admin")) return null;
  return <>{children}</>;
}
