"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/lib/auth/roles";
import type { MemberAudience } from "@/lib/supabase/database.types";

export type MemberWriteState = { error?: string } | null;

function destFor(audience: MemberAudience) {
  return audience === "student" ? "/student" : "/parent";
}

/** 회원/관리자의 게시판 글 작성·수정. 회원 글은 승인 대기, 관리자 글은 즉시 게시. */
export async function submitMemberPost(
  _prev: MemberWriteState,
  formData: FormData,
): Promise<MemberWriteState> {
  const ctx = await getSessionContext();
  if (!ctx.user) return { error: "로그인이 필요합니다." };
  const isAdmin = ctx.roles.includes("admin");

  const audience = String(formData.get("audience") ?? "") as MemberAudience;
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");

  if (audience !== "parent" && audience !== "student") {
    return { error: "잘못된 게시판입니다." };
  }
  if (!title) return { error: "제목을 입력해 주세요." };
  if (!isAdmin && !ctx.roles.includes(audience)) {
    return { error: "이 게시판에 글을 쓸 권한이 없습니다." };
  }

  const supabase = await createClient();
  const approval_status = isAdmin ? "approved" : "pending";

  if (id) {
    const { data: existing } = await supabase
      .from("member_posts")
      .select("author_id")
      .eq("id", id)
      .maybeSingle();
    if (!existing) return { error: "글을 찾을 수 없습니다." };
    if (!isAdmin && existing.author_id !== ctx.user.id) {
      return { error: "본인 글만 수정할 수 있습니다." };
    }
    const { error } = await supabase
      .from("member_posts")
      .update({ title, content, content_format: "html", approval_status })
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("member_posts").insert({
      title,
      content,
      content_format: "html",
      audience,
      post_type: "notice",
      status: "published",
      approval_status,
      author_id: ctx.user.id,
    });
    if (error) return { error: error.message };
  }

  revalidatePath(destFor(audience));
  redirect(destFor(audience));
}

/** 작성자 또는 관리자만 삭제 */
export async function deleteMemberPost(formData: FormData) {
  const ctx = await getSessionContext();
  if (!ctx.user) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("member_posts")
    .select("author_id")
    .eq("id", id)
    .maybeSingle();
  if (!existing) return;
  const isAdmin = ctx.roles.includes("admin");
  if (!isAdmin && existing.author_id !== ctx.user.id) return;

  await supabase.from("member_posts").delete().eq("id", id);
  revalidatePath("/parent");
  revalidatePath("/student");
}
