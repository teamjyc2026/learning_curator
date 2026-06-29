import type { Metadata } from "next";
import { PageHeader } from "@/shared/ui/page-header";

export const metadata: Metadata = { title: "소개" };

// 홈(러닝 큐레이터 철학)에서 옮겨온 학습 원칙
const principles = [
  {
    title: "AI를 도구 삼아, 스스로 배움의 지도를",
    desc: "AI 시대의 경쟁력은 많은 정보를 머릿속에 담는 것이 아니라, AI라는 강력한 도구로 생각을 확장해 나만의 길을 개척하는 데 있습니다. 학생이 스스로 배움의 경로를 설계하도록 합니다.",
  },
  {
    title: "지식을 넘어 메타인지로",
    desc: "AI 튜터와의 다정하고 정교한 상호작용 속에서 자신이 무엇을 알고 무엇을 모르는지(메타인지)를 또렷이 인식하고, 평생 성장의 기초 체력을 기릅니다.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="ABOUT"
        title="소개"
        description="외우는 공부를 넘어, 스스로 연결하고 사고하는 힘을 기릅니다."
      />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-pretty leading-relaxed text-muted-foreground">
        <p>
          저희는 수학을 도구 삼아 ‘생각하는 힘’을 키우는 학습 코칭을 지향합니다.
          단순 문제 풀이가 아니라, 개념과 개념을 잇고 실제 문제에 적용하는
          융합형 사고를 학생들과 함께 훈련합니다.
        </p>
        <p>
          이 사이트에서는 학습 칼럼과 자료를 공개하고, 학생·학부모를 위한 전용
          페이지와 학습 게임, 그리고 학습코칭 상담 예약을 제공합니다.
        </p>
      </div>

      <section className="mx-auto max-w-5xl px-4 pb-20">
        <h2 className="break-keep text-xl font-extrabold tracking-tight">
          우리의 학습 철학
        </h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="flex h-full flex-col bg-background p-7">
              <h3 className="break-keep text-lg font-bold tracking-tight">
                {p.title}
              </h3>
              <p className="mt-3 break-keep text-sm leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
