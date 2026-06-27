import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * service_role 키를 사용하는 관리자 클라이언트. **서버 전용**.
 * RLS를 우회하므로 절대 브라우저로 노출하지 마세요(역할 부여, 게스트 상담 후처리,
 * 가입 시 아바타 업로드 등 신뢰된 서버 로직에서만 사용).
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY 가 설정되지 않았습니다. .env.local 을 확인하세요.",
    );
  }

  return createClient<Database, "web">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      db: { schema: "web" },
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}
