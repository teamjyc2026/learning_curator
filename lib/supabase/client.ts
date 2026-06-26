import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * 브라우저(Client Component)용 Supabase 클라이언트.
 * 모든 신규 테이블은 `web` 스키마에 격리되어 있습니다.
 */
export function createClient() {
  return createBrowserClient<Database, "web">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "web" } },
  );
}
