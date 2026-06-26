import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type MemberPost = Tables<"member_posts">;

export const memberTypeLabel: Record<string, string> = {
  notice: "공지",
  guide: "안내",
  resource: "자료",
  assignment: "과제",
};

export const audienceLabel: Record<string, string> = {
  parent: "학부모",
  student: "학생",
  all: "전체",
};

/** 현재 사용자가 볼 수 있는 발행된 회원 게시글 (RLS가 audience로 필터). */
export async function getVisibleMemberPosts(): Promise<MemberPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("member_posts")
    .select("*")
    .eq("status", "published")
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getMemberPostById(id: string): Promise<MemberPost | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("member_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ?? null;
}

// 관리자: 전체(초안 포함)
export async function getAllMemberPosts(): Promise<MemberPost[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("member_posts")
    .select("*")
    .order("updated_at", { ascending: false });
  return data ?? [];
}
