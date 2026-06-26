import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * 서버(Server Component / Server Action / Route Handler)용 Supabase 클라이언트.
 * 요청마다 새로 생성해야 합니다(쿠키 컨텍스트가 요청별로 다름).
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database, "web">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "web" },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component에서 호출된 경우 set이 불가하지만,
            // 미들웨어(updateSession)가 세션을 갱신하므로 무시해도 안전합니다.
          }
        },
      },
    },
  );
}
