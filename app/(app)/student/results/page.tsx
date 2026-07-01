import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getMyGameResults } from "@/entities/game";

export const metadata: Metadata = { title: "내 학습기록 및 진단 보고서" };

type ResultShape = {
  total?: number;
  topKo?: string;
  lowKo?: string;
};

export default async function StudentResultsPage() {
  const results = await getMyGameResults();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/student"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        학생 홈
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        내 학습기록 및 진단 보고서
      </h1>

      <div className="mt-6 divide-y rounded-xl border bg-card">
        {results.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            아직 진단 기록이 없습니다.{" "}
            <Link href="/games" className="text-primary hover:underline">
              자가진단 하러 가기
            </Link>
          </p>
        ) : (
          results.map((r) => {
            const data = (r.result ?? {}) as ResultShape;
            return (
              <div key={r.id} className="flex items-center gap-3 p-4">
                <div className="flex-1">
                  <p className="font-medium">
                    융합형 사고 자가진단
                    {typeof data.total === "number" ? (
                      <span className="ml-2 text-sm text-muted-foreground">
                        총점 {data.total}/40
                      </span>
                    ) : null}
                  </p>
                  {data.topKo && data.lowKo ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      강점 {data.topKo} · 보완 {data.lowKo}
                    </p>
                  ) : null}
                </div>
                <time className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString("ko-KR")}
                </time>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
