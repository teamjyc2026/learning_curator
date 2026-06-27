import "server-only";
import { createClient } from "@/shared/lib/supabase/server";
import type { Tables } from "@/shared/lib/supabase/database.types";

export type Post = Tables<"posts">;
export type Category = Tables<"post_categories">;

/** 온라인수업 전용 카테고리 — 블로그 목록/칩에서는 제외하고 /classes에서만 사용 */
export const ONLINE_CLASS_SLUG = "online-class";

/** 전체 카테고리(관리자 작성 폼 셀렉트용 — 온라인수업 포함) */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("post_categories")
    .select("*")
    .order("sort_order")
    .order("name");
  return data ?? [];
}

/** 블로그 칩용 카테고리(온라인수업 제외) */
export async function getBlogCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("post_categories")
    .select("*")
    .neq("slug", ONLINE_CLASS_SLUG)
    .order("sort_order")
    .order("name");
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("post_categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

/** 공개 발행글 목록. categorySlug 지정 시 해당 카테고리만; 없으면 블로그 전체(온라인수업 제외). */
export async function getPublishedPosts(categorySlug?: string): Promise<Post[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (categorySlug) {
    const cat = await getCategoryBySlug(categorySlug);
    if (!cat) return [];
    query = query.eq("category_id", cat.id);
  } else {
    // 블로그 전체: 온라인수업 카테고리는 제외
    const oc = await getCategoryBySlug(ONLINE_CLASS_SLUG);
    if (oc) query = query.or(`category_id.is.null,category_id.neq.${oc.id}`);
  }

  const { data } = await query;
  return data ?? [];
}

/** 공개 발행글 상세(slug). */
export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data ?? null;
}

// ---- 관리자용 (RLS: is_admin 이면 draft 포함 전체 접근) ----
export async function getAllPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ?? null;
}
