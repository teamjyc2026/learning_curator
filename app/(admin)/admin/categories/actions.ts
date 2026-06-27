"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";
import { requireRole } from "@/entities/session";
import { ensureSlug } from "@/shared/lib/slug";

export type CategoryState = { error?: string; success?: boolean } | null;

export async function createCategoryAction(
  _prev: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  await requireRole("admin");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "이름을 입력해 주세요." };
  const slug = ensureSlug(String(formData.get("slug") ?? "") || name, "cat");

  const supabase = await createClient();
  const { error } = await supabase
    .from("post_categories")
    .insert({ name, slug });
  if (error) return { error: error.message };

  revalidatePath("/admin/categories");
  revalidatePath("/insights");
  return { success: true };
}

export async function deleteCategoryAction(formData: FormData) {
  await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("post_categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/insights");
}
