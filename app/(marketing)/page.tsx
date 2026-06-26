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
import { FadeIn, Reveal, Stagger, StaggerItem, HoverLift } from "@/components/motion/motion-primitives";

const features = [
  {
    icon: BookOpen,
    title: "인사이트 & 칼럼",
    desc: "교육·학습 설계, 입시 소식, 학습법 칼럼을 꾸준히 발행합니다.",
    href: "/insights",
  },
  {
    icon: Gamepad2,
    title: "학습 게임",
    desc: "자가진단과 수학 게임을 웹앱으로 바로 즐기고 기록을 남기세요.",
    href: "/games",
  },
  {
    icon: CalendarCheck,
    title: "학습코칭 상담예약",
    desc: "우리 아이에게 맞는 학습 코칭, 온라인으로 간편하게 예약하세요.",
    href: "/consultation",
  },
  {
    icon: Users,
    title: "학부모 전용",
    desc: "공지·안내·학습 리포트를 학부모 회원 페이지에서 확인합니다.",
    href: "/parent",
  },
  {
    icon: GraduationCap,
    title: "학생 전용",
    desc: "과제·공지·학습 게임을 학생 회원 페이지 한곳에서.",
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
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_20%_0%,var(--primary-soft),transparent_70%)]" />
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-32">
          <FadeIn delay={0}>
            <p className="text-sm font-bold tracking-[0.18em] text-primary">
              LEARNING · KNOWLEDGE · GROWTH
            </p>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
              외우는 공부가 아니라,
              <br />
              <span className="text-primary">연결하고 꺼내 쓰는</span> 학습.
            </h1>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              칼럼·자료·학습 게임·상담을 한곳에서. 학생과 학부모를 위한 학습 코칭
              플랫폼입니다.
            </p>
          </FadeIn>
          <FadeIn delay={0.18}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" render={<Link href="/insights" />}>
                인사이트 읽기
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/consultation" />}
              >
                상담 예약하기
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.26}>
            <dl className="mt-16 grid max-w-2xl grid-cols-1 gap-6 border-t pt-8 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.v}>
                  <dt className="text-3xl font-extrabold tracking-tight text-primary">
                    {s.k}
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <p className="text-sm font-bold tracking-[0.14em] text-muted-foreground">
            01 — WHAT WE OFFER
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
            무엇을 제공하나요
          </h2>
          <p className="mt-2 text-muted-foreground">
            공개 콘텐츠부터 회원 전용 페이지, 학습 게임까지.
          </p>
        </Reveal>

        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <StaggerItem key={f.href}>
              <HoverLift className="h-full">
                <Link
                  href={f.href}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
                >
                  <span className="flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                    {f.desc}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    바로가기
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary-soft/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                지금, 학습 코칭을 시작하세요
              </h2>
              <p className="mt-2 text-muted-foreground">
                상담은 무료입니다. 우리 아이에게 맞는 방향을 함께 찾아드립니다.
              </p>
            </div>
            <Button size="lg" render={<Link href="/consultation" />}>
              상담 예약하기
              <ArrowRight className="size-4" />
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
