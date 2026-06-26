"use server";

import { createClient } from "@/lib/supabase/server";

export type NewsletterState = { error?: string; success?: boolean } | null;

export async function subscribeNewsletterAction(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "올바른 이메일을 입력해 주세요." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email,
    consent: true,
    user_id: user?.id ?? null,
  });

  // 이미 구독한 이메일(unique 위반)도 성공으로 처리
  if (error && error.code !== "23505") {
    return { error: "구독 신청에 실패했습니다. 잠시 후 다시 시도해 주세요." };
  }

  return { success: true };
}
