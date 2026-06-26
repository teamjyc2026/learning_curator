"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/roles";
import type { AppRole } from "@/lib/supabase/database.types";

const ROLES: AppRole[] = ["admin", "parent", "student"];

export async function setUserRoleAction(formData: FormData) {
  const { user } = await requireRole("admin");
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "") as AppRole;
  const op = String(formData.get("op") ?? "");
  if (!userId || !ROLES.includes(role)) return;

  const supabase = await createClient();
  if (op === "add") {
    await supabase
      .from("user_roles")
      .upsert(
        { user_id: userId, role, granted_by: user?.id ?? null },
        { onConflict: "user_id,role", ignoreDuplicates: true },
      );
  } else {
    await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", role);
  }

  revalidatePath("/admin/users");
}
