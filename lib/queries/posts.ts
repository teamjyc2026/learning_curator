import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type Post = Tables<"posts">;
export type Category = Tables<"post_categories">;

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("post_categories")
    .select("*")
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

/** 공개 발행글 목록. categorySlug 지정 시 해당 카테고리만. */
export async function getPublishedPosts(categorySlug?: string): Promise<Post[]> {
  const supabase = await createClient();
  let categoryId: string | null = null;
  if (categorySlug) {
    const cat = await getCategoryBySlug(categorySlug);
    if (!cat) return [];
    categoryId = cat.id;
  }

  let query = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (categoryId) query = query.eq("category_id", categoryId);

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
