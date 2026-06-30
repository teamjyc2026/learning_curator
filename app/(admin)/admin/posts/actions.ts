"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/server";
import { requireRole } from "@/entities/session";
import { uploadImage } from "@/shared/lib/storage";
import { ensureSlug } from "@/shared/lib/slug";
import type { PostStatus } from "@/shared/lib/supabase/database.types";

export type PostFormState = { error?: string } | null;

export async function savePostAction(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const { user } = await requireRole("admin");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "제목을 입력해 주세요." };

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = ensureSlug(slugInput || title);
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const content_format = String(formData.get("content_format") ?? "html");
  const categoryRaw = String(formData.get("category_id") ?? "").trim();
  const category_id = categoryRaw && categoryRaw !== "none" ? categoryRaw : null;
  // 발행/임시저장 버튼(intent)으로 상태 결정. (구버전 status 셀렉트도 폴백 지원)
  const intent = String(formData.get("intent") ?? "").trim();
  const status = (
    intent === "publish"
      ? "published"
      : intent === "draft"
        ? "draft"
        : String(formData.get("status") ?? "draft")
  ) as PostStatus;
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const cover = formData.get("cover");
  let coverUrl: string | undefined;
  if (cover instanceof File && cover.size > 0) {
    const url = await uploadImage(supabase, "web-public", cover, "posts");
    if (!url) return { error: "커버 이미지 업로드에 실패했습니다." };
    coverUrl = url;
  }

  const base = {
    title,
    slug,
    excerpt,
    content,
    content_format,
    category_id,
    status,
    tags,
    ...(coverUrl ? { cover_image_url: coverUrl } : {}),
  };

  if (id) {
    const { data: existing } = await supabase
      .from("posts")
      .select("published_at")
      .eq("id", id)
      .maybeSingle();
    const published_at =
      status === "published" && !existing?.published_at
        ? new Date().toISOString()
        : existing?.published_at ?? null;

    const { error } = await supabase
      .from("posts")
      .update({ ...base, published_at })
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("posts").insert({
      ...base,
      author_id: user?.id ?? null,
      published_at: status === "published" ? new Date().toISOString() : null,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/posts");
  revalidatePath("/insights");
  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData) {
  await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/admin/posts");
  revalidatePath("/insights");
}
