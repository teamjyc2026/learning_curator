export const siteConfig = {
  name: "러닝 큐레이터",
  shortName: "러닝 큐레이터",
  description:
    "수학을 넘어 생각의 힘을 키우는 학습 코칭 — 칼럼·자료·학습 게임·상담을 한곳에서.",
  url: "https://example.com",
  // 상단/푸터 공통 네비게이션 — 핵심 4개 스펙(블로그/학부모/학생/수학게임) + 소개/상담예약
  nav: [
    { title: "블로그", href: "/insights" },
    { title: "학부모", href: "/parent" },
    { title: "학생", href: "/student" },
    { title: "수학게임", href: "/games" },
    { title: "소개", href: "/about" },
    { title: "상담예약", href: "/consultation" },
  ],
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    kakao: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? "",
  },
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
