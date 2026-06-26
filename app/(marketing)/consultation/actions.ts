"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ConsultationState = { error?: string } | null;

function toIso(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export async function createConsultationAction(
  _prev: ConsultationState,
  formData: FormData,
): Promise<ConsultationState> {
  // 허니팟(봇 차단): 사람은 비워둠
  if (String(formData.get("company") ?? "").trim()) {
    redirect("/consultation/complete");
  }

  const student_name = String(formData.get("student_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const consent = formData.get("privacy_consent") === "on";

  if (!student_name) return { error: "학생 이름을 입력해 주세요." };
  if (!phone) return { error: "연락처를 입력해 주세요." };
  if (!consent) return { error: "개인정보 수집·이용에 동의해 주세요." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("consultations").insert({
    requester_user_id: user?.id ?? null,
    student_name,
    parent_name: String(formData.get("parent_name") ?? "").trim() || null,
    phone,
    email: String(formData.get("email") ?? "").trim() || null,
    grade: String(formData.get("grade") ?? "").trim() || null,
    preferred_subject:
      String(formData.get("preferred_subject") ?? "").trim() || null,
    preferred_at_1: toIso(String(formData.get("preferred_at_1") ?? "")),
    preferred_at_2: toIso(String(formData.get("preferred_at_2") ?? "")),
    channel: String(formData.get("channel") ?? "").trim() || null,
    message: String(formData.get("message") ?? "").trim() || null,
    privacy_consent: true,
    source: "web",
  });

  if (error) {
    return { error: "신청에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  redirect("/consultation/complete");
}
