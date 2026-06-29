export const siteConfig = {
  name: "러닝 큐레이터",
  shortName: "러닝 큐레이터",
  description:
    "수학을 넘어 생각의 힘을 키우는 학습 코칭 — 칼럼·자료·학습 게임·상담을 한곳에서.",
  url: "https://learningcurator.ai.kr",
  // 상단/푸터 공통 네비게이션 — 핵심 4개 스펙(인사이트/학부모/학생/학습게임) + 소개/상담예약
  nav: [
    { title: "인사이트", href: "/insights" },
    { title: "온라인수업", href: "/classes" },
    { title: "학습게임", href: "/games" },
    { title: "학부모", href: "/parent" },
    { title: "학생", href: "/student" },
    { title: "소개", href: "/about" },
    { title: "상담예약", href: "/consultation" },
  ],
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    kakao: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? "",
  },
  // 인사이트 교육단계별 카테고리 — 헤더 드롭다운/필터용 (web.post_categories와 slug 일치)
  // public:true 만 메뉴에 노출. 나머지는 콘텐츠가 쌓이면 공개 전환.
  insightCategories: [
    { title: "유치교육", slug: "preschool", public: false },
    { title: "초등교육", slug: "elementary", public: true },
    { title: "중등교육", slug: "middle", public: true },
    { title: "고등교육", slug: "high", public: true },
    { title: "성인교육", slug: "adult", public: false },
    { title: "부모되기", slug: "parenting", public: false },
    { title: "청년기 학습", slug: "youth", public: false },
    { title: "중장년기 학습", slug: "middle-age", public: false },
    { title: "노년기 학습", slug: "senior", public: false },
  ],
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
