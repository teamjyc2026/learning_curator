import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  MonitorPlay,
  Gamepad2,
  CalendarCheck,
  GraduationCap,
  Users,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { SectionHeading } from "@/shared/ui/section-heading";
import {
  FadeIn,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/shared/ui/motion-primitives";

const features = [
  {
    icon: BookOpen,
    title: "인사이트",
    desc: "교육·학습 설계, 입시 소식, 학습법 칼럼을 꾸준히 발행합니다.",
    href: "/insights",
  },
  {
    icon: MonitorPlay,
    title: "온라인수업",
    desc: "선생님이 진행하는 온라인 수업 공지를 확인하세요.",
    href: "/classes",
  },
  {
    icon: Gamepad2,
    title: "학습게임",
    desc: "자가진단과 학습 게임을 웹앱으로 바로 즐기고 기록을 남기세요.",
    href: "/games",
  },
  {
    icon: Users,
    title: "학부모",
    desc: "학원에서 전하는 공지·안내·자료를 학부모 페이지에서 확인합니다.",
    href: "/parent",
  },
  {
    icon: GraduationCap,
    title: "학생",
    desc: "공지·자료·학습 게임을 학생 공간 한곳에서.",
    href: "/student",
  },
  {
    icon: CalendarCheck,
    title: "상담예약",
    desc: "우리 아이에게 맞는 학습 코칭, 온라인으로 간편하게 예약하세요.",
    href: "/consultation",
  },
];

const stats = [
  { k: "5가지", v: "융합 사고 신호 자가진단" },
  { k: "1:1", v: "학생별 맞춤 학습 코칭" },
  { k: "매주", v: "새로운 학습 인사이트" },
];

// 홈에는 핵심 원칙 1개만 노출(박스). 나머지 철학은 소개(/about)로 이동.
const philosophy = [
  {
    title: "수동적 교육에서 능동적 학습으로",
    desc: "남이 정해둔 정답만 쫓는 수동적 학습자에서 벗어나, 질문으로 스스로 모르는 것을 찾아내고 주도적으로 학습하는 단단한 리더로 성장하도록 배움의 여정을 안내합니다.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 md:py-32">
          <FadeIn>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-point sm:text-xs">
              Learning, Thinking, Growth
            </p>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h1 className="mt-4 max-w-3xl break-keep text-balance text-[2rem] font-extrabold leading-[1.15] tracking-tight sm:mt-5 sm:text-5xl sm:leading-[1.08] md:text-7xl">
              외우는 공부가 아닌,
              <br />
              연결하고 재구성하는 학습
            </h1>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="mt-7 max-w-xl break-keep text-lg leading-relaxed text-muted-foreground">
              칼럼·자료·학습 게임·상담을 한곳에서. 학생과 학부모를 위한 학습 코칭
              플랫폼입니다.
            </p>
          </FadeIn>
          <FadeIn delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Button size="lg" render={<Link href="/consultation" />}>
                상담 예약하기
                <ArrowRight className="size-4" />
              </Button>
              <Link
                href="/insights"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground"
              >
                인사이트 읽기
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.26}>
            <dl className="mt-20 grid max-w-2xl grid-cols-1 gap-8 border-t pt-8 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.v}>
                  <dt className="text-3xl font-extrabold tracking-tight">
                    {s.k}
                  </dt>
                  <dd className="mt-1.5 break-keep text-sm text-muted-foreground">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <Reveal>
          <SectionHeading
            index="01"
            eyebrow="What we offer"
            title="무엇을 제공하나요"
            description="인사이트·온라인수업·학습 게임부터 회원 페이지, 상담까지."
          />
        </Reveal>

        <Stagger className="mt-10 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <StaggerItem key={f.href}>
              <Link
                href={f.href}
                className="group flex h-full flex-col bg-background p-7 transition-colors hover:bg-muted/60"
              >
                <f.icon className="size-6 text-foreground" />
                <h3 className="mt-5 text-lg font-bold tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2 flex-1 break-keep text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-point">
                  바로가기
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Philosophy */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Reveal>
            <SectionHeading
              index="02"
              eyebrow="Philosophy"
              title="러닝 큐레이터는 무엇을 하나요?"
            />
          </Reveal>

          <Reveal>
            <p className="mt-10 max-w-4xl break-keep text-2xl font-bold leading-snug tracking-tight md:text-3xl">
              “지식을 전달하는 ‘교육(Education)’을 넘어, 스스로 배움의 지도를
              그리는 ‘학습(Learning)’을 디자인합니다.”
            </p>
            <p className="mt-6 max-w-3xl break-keep leading-relaxed text-muted-foreground">
              러닝 큐레이터는 지식을 일방적으로 주입하고 정답을 가르치는 기존
              ‘교사·강사’의 역할을 넘어섭니다. 미술관의 큐레이터가 수많은 작품 중
              가치 있는 것을 엄선해 관객에게 새로운 시각을 제시하듯, 우리는 배움의
              맥락을 큐레이션해 학생이 스스로 의미를 발견하도록 돕습니다.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-12 grid max-w-3xl gap-px overflow-hidden rounded-lg border bg-border">
              {philosophy.map((p) => (
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
          </Reveal>

          <Reveal>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-point"
            >
              러닝 큐레이터의 철학 더 보기
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <h2 className="break-keep text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              지금, 학습 코칭을 시작하세요
            </h2>
            <p className="mt-3 break-keep text-muted-foreground">
              상담은 무료입니다. 우리 아이에게 맞는 방향을 함께 찾아드립니다.
            </p>
          </Reveal>
          <Button size="lg" render={<Link href="/consultation" />}>
            상담 예약하기
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    </>
  );
}
