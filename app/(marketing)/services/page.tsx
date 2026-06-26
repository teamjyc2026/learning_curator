import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "서비스" };

const services = [
  {
    title: "1:1 학습 코칭",
    desc: "학생별 진단을 바탕으로 학습 습관과 사고력을 함께 설계합니다.",
  },
  {
    title: "수학 정규 수업",
    desc: "개념의 연결과 문제 해결력 중심의 커리큘럼을 운영합니다.",
  },
  {
    title: "학부모 리포트",
    desc: "학습 진행 상황과 코칭 피드백을 정기적으로 공유합니다.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="SERVICES"
        title="서비스"
        description="진단 → 코칭 → 성장. 학습의 전 과정을 함께합니다."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}
