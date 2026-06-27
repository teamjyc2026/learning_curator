import type { Metadata } from "next";
import { PageHeader } from "@/shared/ui/page-header";

export const metadata: Metadata = { title: "소개" };

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
    </>
  );
}
