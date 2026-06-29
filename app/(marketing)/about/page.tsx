import type { Metadata } from "next";
import { PageHeader } from "@/shared/ui/page-header";

export const metadata: Metadata = { title: "소개" };

// 홈(러닝 큐레이터 철학)에서 옮겨온 학습 원칙
const principles = [
  {
    title: "정답을 외우는 아이에서, 질문을 던지는 리더로",
    desc: "지식의 학습과 암기가 필요 없어진 시대에서 학습의 진정한 가치는 ‘답을 아는 것’이 아닌 ‘무엇을 모르는지 아는 것’에 있습니다. 질문은 내 지식의 한계를 스스로 대면하고 성찰하게 만드는 메타인지의 시작점이며, 질문을 통해서만 비로소 내가 진짜 채워야 할 학습의 공백을 발견할 수 있습니다.",
  },
  {
    title: "수동적 교육에서 능동적 학습으로",
    desc: "우리는 아이들이 남이 정해둔 정답만을 쫓는 수동적인 학습자에서 벗어나, 질문을 통해 스스로 모르는 것을 찾아내고 그것을 주도적으로 학습해 나가는 단단한 리더로 성장하도록 배움의 여정을 안내합니다.",
  },
  {
    title: "AI를 도구 삼아, 스스로 배움의 지도를 그리는 힘",
    desc: "인공지능 시대의 진정한 경쟁력은 단순히 많은 정보를 머릿속에 담아두는 것이 아니라, AI라는 강력한 도구로 생각을 확장하여 나만의 길을 개척하는 데 있습니다. 미리 짜인 수동적인 교육 패러다임을 넘어, 학생 스스로 배움의 경로를 설계하고 자신만의 지도를 능동적으로 그려가는 학습을 지향합니다.",
  },
  {
    title: "지식을 넘어 메타인지로, 평생 성장의 기초 체력을",
    desc: "인공지능 튜터와의 다정하고 정교한 상호작용 속에서 학생은 자신의 알고 모름을 명확히 인지하며, 질문을 통해 개념과 경험을 논리적으로 연결해 나갑니다. 이처럼 메타인지적 성찰을 통해 스스로 배움의 지도를 완성해 본 경험은 과목별 점수를 넘어, 전 생애에 걸쳐 자신만의 배움의 방식을 찾고 성장해 나갈 수 있는 가장 강력한 무기가 될 것입니다.",
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
