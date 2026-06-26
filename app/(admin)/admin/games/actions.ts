"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import { uploadImage } from "@/lib/utils/storage";
import { ensureSlug } from "@/lib/utils/slug";
import type {
  GameType,
  GameVisibility,
  PostStatus,
} from "@/lib/supabase/database.types";

export type GameFormState = { error?: string } | null;

export async function saveGameAction(
  _prev: GameFormState,
  formData: FormData,
): Promise<GameFormState> {
  const { user } = await requireRole("admin");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "제목을 입력해 주세요." };

  const game_type = String(formData.get("game_type") ?? "embed") as GameType;
  const embedUrl = String(formData.get("embed_url") ?? "").trim();
  const internalKey = String(formData.get("internal_key") ?? "").trim();

  if (game_type === "embed" && !embedUrl) {
    return { error: "임베드 URL을 입력해 주세요." };
  }
  if (game_type === "embed" && !/^https:\/\//i.test(embedUrl)) {
    return { error: "임베드 URL은 https:// 로 시작해야 합니다." };
  }

  const slug = ensureSlug(String(formData.get("slug") ?? "") || title, "game");
  const description = String(formData.get("description") ?? "").trim() || null;
  const visibility = String(
    formData.get("visibility") ?? "public",
  ) as GameVisibility;
  const open_in = String(formData.get("open_in") ?? "iframe");
  const status = String(formData.get("status") ?? "published") as PostStatus;
  const sort_order = Number(formData.get("sort_order") ?? 0) || 0;

  const thumb = formData.get("thumbnail");
  let thumbnailUrl: string | undefined;
  if (thumb instanceof File && thumb.size > 0) {
    const url = await uploadImage(supabase, "web-public", thumb, "games");
    if (!url) return { error: "썸네일 업로드에 실패했습니다." };
    thumbnailUrl = url;
  }

  const base = {
    title,
    slug,
    description,
    game_type,
    embed_url: game_type === "embed" ? embedUrl : null,
    internal_key: game_type === "internal" ? internalKey || null : null,
    open_in,
    visibility,
    status,
    sort_order,
    ...(thumbnailUrl ? { thumbnail_url: thumbnailUrl } : {}),
  };

  if (id) {
    const { error } = await supabase.from("games").update(base).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("games")
      .insert({ ...base, created_by: user?.id ?? null });
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/games");
  revalidatePath("/games");
  redirect("/admin/games");
}

export async function deleteGameAction(formData: FormData) {
  await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("games").delete().eq("id", id);
  revalidatePath("/admin/games");
  revalidatePath("/games");
}
