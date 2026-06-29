import "server-only";
import { createClient } from "@/shared/lib/supabase/server";
import type { Tables } from "@/shared/lib/supabase/database.types";

export type ParentQuestion = Tables<"parent_questions">;
export type ParentQuestionWithAuthor = ParentQuestion & {
  authorName: string | null;
};

/** 비밀 게시판: 로그인한 본인이 작성한 고민글만. (RLS off이므로 author_id로 직접 필터) */
export async function getMyQuestions(): Promise<ParentQuestion[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("parent_questions")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

/** 관리자: 전체 상담글 + 작성자 닉네임. 미답변(open) 먼저. */
export async function getAllParentQuestions(): Promise<
  ParentQuestionWithAuthor[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("parent_questions")
    .select("*")
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });
  const rows = data ?? [];

  const ids = [...new Set(rows.map((r) => r.author_id))];
  const map = new Map<string, string>();
  if (ids.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, nickname")
      .in("id", ids);
    for (const p of profiles ?? []) map.set(p.id, p.nickname ?? "학부모");
  }
  return rows.map((r) => ({ ...r, authorName: map.get(r.author_id) ?? null }));
}
