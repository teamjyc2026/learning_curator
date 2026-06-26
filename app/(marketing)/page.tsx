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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-muted/40 to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm font-bold tracking-[0.14em] text-primary">
            LEARNING · KNOWLEDGE · GROWTH
          </p>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            외우는 공부가 아니라,
            <br />
            연결하고 꺼내 쓰는 학습.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            칼럼·자료·학습 게임·상담을 한곳에서. 학생과 학부모를 위한 학습 코칭
            플랫폼입니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/insights" />}>
              인사이트 읽기
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/consultation" />}>
              상담 예약하기
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold tracking-tight">무엇을 제공하나요</h2>
        <p className="mt-2 text-muted-foreground">
          공개 콘텐츠부터 회원 전용 페이지, 학습 게임까지.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.href} href={f.href} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader>
                  <f.icon className="size-7 text-primary" />
                  <CardTitle className="mt-2">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                    바로가기
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              지금, 학습 코칭을 시작하세요
            </h2>
            <p className="mt-2 text-muted-foreground">
              상담은 무료입니다. 우리 아이에게 맞는 방향을 함께 찾아드립니다.
            </p>
          </div>
          <Button size="lg" render={<Link href="/consultation" />}>
            상담 예약하기
          </Button>
        </div>
      </section>
    </>
  );
}
