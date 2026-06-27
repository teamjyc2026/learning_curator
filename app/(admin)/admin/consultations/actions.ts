"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/shared/lib/supabase/server";
import { requireRole } from "@/entities/session";
import type { ConsultationStatus } from "@/shared/lib/supabase/database.types";

export async function updateConsultationAction(formData: FormData) {
  const { user } = await requireRole("admin");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const status = String(
    formData.get("status") ?? "requested",
  ) as ConsultationStatus;
  const admin_note = String(formData.get("admin_note") ?? "").trim() || null;

  const supabase = await createClient();
  await supabase
    .from("consultations")
    .update({
      status,
      admin_note,
      assigned_admin: user?.id ?? null,
      handled_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/admin/consultations");
}
