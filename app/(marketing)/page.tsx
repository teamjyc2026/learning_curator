import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Gamepad2,
  CalendarCheck,
  GraduationCap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/layout/section-heading";
import {
  FadeIn,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/motion/motion-primitives";

const features = [
  {
    icon: BookOpen,
    title: "블로그",
    desc: "교육·학습 설계, 입시 소식, 학습법 칼럼을 꾸준히 발행합니다.",
    href: "/insights",
  },
  {
    icon: Gamepad2,
    title: "수학게임",
    desc: "자가진단과 수학 게임을 웹앱으로 바로 즐기고 기록을 남기세요.",
    href: "/games",
  },
  {
    icon: CalendarCheck,
    title: "상담예약",
    desc: "우리 아이에게 맞는 학습 코칭, 온라인으로 간편하게 예약하세요.",
    href: "/consultation",
  },
  {
    icon: Users,
    title: "학부모",
    desc: "공지·안내·자료를 학부모 게시판에서 확인하고 글을 남기세요.",
    href: "/parent",
  },
  {
    icon: GraduationCap,
    title: "학생",
    desc: "과제·공지·학습 게임을 학생 공간 한곳에서.",
    href: "/student",
  },
];

const stats = [
  { k: "5가지", v: "융합 사고 신호 자가진단" },
  { k: "1:1", v: "학생별 맞춤 학습 코칭" },
  { k: "매주", v: "새로운 학습 인사이트" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Learning · Knowledge · Growth
            </p>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h1 className="mt-5 max-w-3xl text-balance text-5xl font-extrabold leading-[1.08] tracking-tight md:text-7xl">
              외우는 공부가 아니라,
              <br />
              연결하고 꺼내 쓰는 학습.
            </h1>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
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
                  <dd className="mt-1.5 text-sm text-muted-foreground">{s.v}</dd>
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
            description="공개 콘텐츠부터 회원 전용 게시판, 학습 게임까지."
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
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold">
                  바로가기
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              지금, 학습 코칭을 시작하세요
            </h2>
            <p className="mt-3 text-muted-foreground">
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
