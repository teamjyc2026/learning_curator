import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type Consultation = Tables<"consultations">;

export const consultationStatusLabel: Record<string, string> = {
  requested: "신청",
  confirmed: "확정",
  completed: "완료",
  cancelled: "취소",
  no_show: "노쇼",
};

export const channelLabel: Record<string, string> = {
  visit: "방문",
  phone: "전화",
  online: "온라인",
};

export async function getAllConsultations(): Promise<Consultation[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultations")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
