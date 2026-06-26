"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import type {
  MemberAudience,
  MemberPostType,
  PostStatus,
} from "@/lib/supabase/database.types";

export type MemberPostFormState = { error?: string } | null;

export async function saveMemberPostAction(
  _prev: MemberPostFormState,
  formData: FormData,
): Promise<MemberPostFormState> {
  const { user } = await requireRole("admin");
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "제목을 입력해 주세요." };

  const content = String(formData.get("content") ?? "");
  const audience = String(formData.get("audience") ?? "all") as MemberAudience;
  const post_type = String(
    formData.get("post_type") ?? "notice",
  ) as MemberPostType;
  const status = String(formData.get("status") ?? "published") as PostStatus;
  const pinned = formData.get("pinned") === "on";
  const dueRaw = String(formData.get("due_at") ?? "").trim();
  const due_at = dueRaw ? new Date(dueRaw).toISOString() : null;

  const base = { title, content, audience, post_type, status, pinned, due_at };

  if (id) {
    const { error } = await supabase
      .from("member_posts")
      .update(base)
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("member_posts")
      .insert({ ...base, author_id: user?.id ?? null });
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/member-posts");
  revalidatePath("/parent");
  revalidatePath("/student");
  redirect("/admin/member-posts");
}

export async function deleteMemberPostAction(formData: FormData) {
  await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("member_posts").delete().eq("id", id);
  revalidatePath("/admin/member-posts");
  revalidatePath("/parent");
  revalidatePath("/student");
}
