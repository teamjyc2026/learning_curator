"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { primaryRedirect } from "@/lib/auth/roles";

export type AuthState = { error?: string } | null;

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "");

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해 주세요." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  if (redirectTo.startsWith("/")) redirect(redirectTo);

  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id);

  redirect(primaryRedirect((roleRows ?? []).map((r) => r.role)));
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nickname = String(formData.get("nickname") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const role = String(formData.get("role") ?? "");
  const avatar = formData.get("avatar");

  if (role !== "parent" && role !== "student") {
    return { error: "회원 유형(학부모/학생)을 선택해 주세요." };
  }
  if (!nickname) return { error: "닉네임을 입력해 주세요." };
  if (!email) return { error: "이메일을 입력해 주세요." };
  if (password.length < 8) {
    return { error: "비밀번호는 8자 이상이어야 합니다." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role, nickname, phone } },
  });

  if (error) {
    return { error: error.message };
  }

  const userId = data.user?.id;

  // 아바타는 service_role 관리자 클라이언트로 업로드(이메일 확인 on/off 무관).
  // 서비스 키 미설정 등으로 실패해도 가입 자체는 막지 않는다.
  if (userId && avatar instanceof File && avatar.size > 0) {
    try {
      const admin = createAdminClient();
      const ext = (avatar.name.split(".").pop() || "png").toLowerCase();
      const path = `${userId}/avatar.${ext}`;
      const bytes = new Uint8Array(await avatar.arrayBuffer());
      const { error: upErr } = await admin.storage
        .from("web-avatars")
        .upload(path, bytes, { contentType: avatar.type, upsert: true });
      if (!upErr) {
        const {
          data: { publicUrl },
        } = admin.storage.from("web-avatars").getPublicUrl(path);
        await admin.from("profiles").update({ avatar_url: publicUrl }).eq("id", userId);
      }
    } catch {
      // 아바타 업로드 실패는 무시(가입 성공 유지)
    }
  }

  // 이메일 확인이 꺼져 있으면 세션이 바로 생성됨 → 대시보드로.
  if (data.session) {
    redirect(role === "student" ? "/student" : "/parent");
  }
  // 이메일 확인 필요 → 안내와 함께 로그인 페이지로.
  redirect("/login?registered=1");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
