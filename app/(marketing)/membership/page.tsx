import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Check } from "lucide-react";

export const metadata: Metadata = { title: "멤버십" };

const tiers = [
  {
    name: "무료",
    desc: "공개 칼럼과 자가진단 게임을 자유롭게.",
    perks: ["대표 칼럼 열람", "자가진단 게임", "뉴스레터"],
  },
  {
    name: "회원",
    desc: "회원가입 시 학습 게임 기록과 회원 전용 콘텐츠까지.",
    perks: ["진단 결과 저장", "회원 전용 자료", "상담 예약 내역"],
    highlighted: true,
  },
  {
    name: "수강생",
    desc: "학원 수강생을 위한 과제·공지·리포트.",
    perks: ["학생/학부모 전용 페이지", "과제·공지", "학습 리포트"],
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHeader
        eyebrow="MEMBERSHIP"
        title="멤버십"
        description="필요에 맞춰 단계적으로 더 많은 콘텐츠를 제공합니다."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`rounded-xl border bg-card p-6 ${
              t.highlighted ? "ring-2 ring-primary" : ""
            }`}
          >
            <h3 className="text-xl font-bold">{t.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {t.perks.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Check className="size-4 text-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
