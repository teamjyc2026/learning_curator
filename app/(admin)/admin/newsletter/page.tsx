import type { Metadata } from "next";
import { getSubscribers } from "@/lib/queries/admin-users";

export const metadata: Metadata = { title: "뉴스레터 구독자" };

export default async function AdminNewsletterPage() {
  const subs = await getSubscribers();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">뉴스레터 구독자</h1>
      <p className="mt-1 text-muted-foreground">총 {subs.length}명</p>

      <div className="mt-6 divide-y rounded-xl border bg-card">
        {subs.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            구독자가 없습니다.
          </p>
        ) : (
          subs.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-4">
              <span className="flex-1 truncate text-sm">{s.email}</span>
              <span className="text-xs text-muted-foreground">{s.status}</span>
              <time className="text-xs text-muted-foreground">
                {new Date(s.created_at).toLocaleDateString("ko-KR")}
              </time>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
