"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";
import { requireRole } from "@/entities/session";

export type ParentQuestionState = { error?: string; ok?: boolean } | null;

export async function createParentQuestionAction(
  _prev: ParentQuestionState,
  formData: FormData,
): Promise<ParentQuestionState> {
  const { user } = await requireRole("parent");
  if (!user) return { error: "로그인이 필요합니다." };

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title) return { error: "제목을 입력해 주세요." };
  if (!content) return { error: "내용을 입력해 주세요." };

  const supabase = await createClient();
  const { error } = await supabase.from("parent_questions").insert({
    author_id: user.id,
    title,
    content,
  });

  if (error) {
    return { error: "등록에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath("/parent");
  return { ok: true };
}
