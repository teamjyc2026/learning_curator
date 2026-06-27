import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { MemberAudience, Tables } from "@/lib/supabase/database.types";

export type MemberPost = Tables<"member_posts">;
export type MemberPostWithAuthor = MemberPost & { authorName: string | null };

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

export const approvalLabel: Record<string, string> = {
  pending: "검토중",
  approved: "게시됨",
  rejected: "반려",
};

/** author_id 목록 → {id: nickname} 맵 */
async function authorNameMap(
  ids: (string | null)[],
): Promise<Map<string, string>> {
  const unique = [...new Set(ids.filter((v): v is string => !!v))];
  if (unique.length === 0) return new Map();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, nickname")
    .in("id", unique);
  return new Map((data ?? []).map((p) => [p.id, p.nickname ?? "회원"]));
}

async function withAuthors(posts: MemberPost[]): Promise<MemberPostWithAuthor[]> {
  const map = await authorNameMap(posts.map((p) => p.author_id));
  return posts.map((p) => ({
    ...p,
    authorName: p.author_id ? (map.get(p.author_id) ?? null) : null,
  }));
}

/** 게시판: 해당 audience(+all)의 승인·발행된 글. RLS off이므로 audience를 직접 필터. */
export async function getBoardPosts(
  audience: MemberAudience,
): Promise<MemberPostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("member_posts")
    .select("*")
    .eq("status", "published")
    .eq("approval_status", "approved")
    .in("audience", [audience, "all"])
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false });
  return withAuthors(data ?? []);
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

// 관리자: 전체(초안/대기 포함)
export async function getAllMemberPosts(): Promise<MemberPostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("member_posts")
    .select("*")
    .order("updated_at", { ascending: false });
  return withAuthors(data ?? []);
}
