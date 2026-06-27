import type { Metadata } from "next";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export const metadata: Metadata = { title: "관리자" };

const sections = [
  { title: "블로그 / 칼럼", desc: "인사이트 글 작성·발행 (Phase 4)" },
  { title: "회원 게시글", desc: "학부모/학생 공지·자료 (Phase 5)" },
  { title: "학습 게임", desc: "외부 URL 임베드 게임 등록 (Phase 6)" },
  { title: "상담 예약", desc: "예약 접수·상태 관리 (Phase 7)" },
  { title: "회원 / 역할", desc: "역할 부여·관리 (Phase 3+)" },
  { title: "뉴스레터", desc: "구독자 관리 (Phase 8)" },
];

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">관리자 대시보드</h1>
      <p className="mt-1 text-muted-foreground">콘텐츠와 회원, 예약을 관리합니다.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle>{s.title}</CardTitle>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
