export const siteConfig = {
  name: "러닝 큐레이터",
  shortName: "러닝 큐레이터",
  description:
    "수학을 넘어 생각의 힘을 키우는 학습 코칭 — 칼럼·자료·학습 게임·상담을 한곳에서.",
  url: "https://example.com",
  // 상단/푸터 공통 네비게이션 (andywiki 참고: 인사이트/서비스/자료/멤버십/소개)
  nav: [
    { title: "인사이트", href: "/insights" },
    { title: "서비스", href: "/services" },
    { title: "자료", href: "/resources" },
    { title: "학습게임", href: "/games" },
    { title: "멤버십", href: "/membership" },
    { title: "소개", href: "/about" },
  ],
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    kakao: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? "",
  },
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
