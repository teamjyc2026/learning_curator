"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";
import { requireRole } from "@/entities/session";

export async function answerParentQuestionAction(formData: FormData) {
  const { user } = await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const answer = String(formData.get("answer") ?? "").trim();
  const supabase = await createClient();
  await supabase
    .from("parent_questions")
    .update({
      answer: answer || null,
      answered_at: answer ? new Date().toISOString() : null,
      answered_by: answer ? (user?.id ?? null) : null,
      status: answer ? "answered" : "open",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/parent-questions");
}

export async function deleteParentQuestionAction(formData: FormData) {
  await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("parent_questions").delete().eq("id", id);

  revalidatePath("/admin/parent-questions");
}
