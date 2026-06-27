"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";

export type ProfileState = { error?: string; success?: boolean } | null;

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const nickname = String(formData.get("nickname") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const avatar = formData.get("avatar");

  if (!nickname) return { error: "닉네임을 입력해 주세요." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "로그인이 필요합니다." };

  let avatarUrl: string | undefined;

  // 본인 폴더(uid/...)는 storage RLS로 업로드 허용됨.
  if (avatar instanceof File && avatar.size > 0) {
    const ext = (avatar.name.split(".").pop() || "png").toLowerCase();
    const path = `${user.id}/avatar.${ext}`;
    const bytes = new Uint8Array(await avatar.arrayBuffer());
    const { error: upErr } = await supabase.storage
      .from("web-avatars")
      .upload(path, bytes, { contentType: avatar.type, upsert: true });
    if (upErr) return { error: "아바타 업로드에 실패했습니다." };
    const {
      data: { publicUrl },
    } = supabase.storage.from("web-avatars").getPublicUrl(path);
    // 캐시 무력화를 위해 버전 쿼리 추가
    avatarUrl = `${publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      nickname,
      phone: phone || null,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    })
    .eq("id", user.id);

  if (error) return { error: "프로필 저장에 실패했습니다." };

  revalidatePath("/account");
  return { success: true };
}
