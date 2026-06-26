# 러닝 큐레이터 — 학원 웹사이트/웹앱

수학 학원용 공개 사이트 + 회원 웹앱. 레퍼런스: andywiki.co.kr.

## 스택
- Next.js 16 (App Router, React 19, TS) · Tailwind v4
- **커스텀 UI 키트**(`components/ui/*`, Tailwind + CVA, shadcn 제거됨) + `@base-ui/react`는 **select/sheet에만** 사용
- **Framer Motion**(`motion`) — `components/motion/motion-primitives.tsx`(FadeIn/Reveal/Stagger/HoverLift)
- 테마: **인디고**(globals.css CSS 변수, primary `#4f46e5`, accent amber). 라이트/다크 토큰.
- Supabase (Postgres + Auth + Storage + RLS), `@supabase/ssr`
- TanStack Query (서버 상태) · Zustand (클라이언트 상태)

## ⚠️ Supabase 핵심 주의사항
- 프로젝트(`iipdlqssbekbssejopcf`)는 **다른 앱(esamath)과 공유**. 우리 앱은 전용 **`web` 스키마**에 격리.
- **`web` 스키마를 API "Exposed schemas"에 추가**해야 런타임 쿼리가 동작 (Dashboard ▸ Settings ▸ API). 미설정 시 모든 web 조회가 빈 결과로 폴백.
- `.env.local`의 `SUPABASE_SERVICE_ROLE_KEY` 필요(아바타 업로드/관리자 작업).
- 기존 `public` 20개 테이블은 RLS 잠금됨(service_role만). esamath 테이블/함수는 **수정 금지**.
- DB 타입은 `lib/supabase/database.types.ts`에 **수기 작성**(web 노출 후 `generate_typescript_types`로 교체 가능). Row 타입은 반드시 `type`(인터페이스 X — supabase-js 제약).

## 실행
- `npm run dev` → **http://localhost:3001** (포트 3000은 esamath 사용)
- `npm run build` (타입체크 포함)

## 구조
- `app/(marketing)/` 공개: 홈·인사이트(블로그)·서비스·자료·게임·멤버십·소개·상담예약
- `app/(auth)/` 로그인·회원가입(역할+아바타+닉네임)
- `app/(app)/` 로그인 필요: account·parent·student·posts/[id]·student/results (세션 가드 layout)
- `app/(admin)/admin/` 관리자: posts·categories·member-posts·games·consultations·users·newsletter (role 가드)
- `lib/supabase/{client,server,middleware,admin}.ts` · `lib/auth/roles.ts` · `lib/queries/*` · `lib/stores/*`
- `proxy.ts` (Next 16 미들웨어 컨벤션) — 세션 갱신 + 보호 라우트 가드
- `supabase/migrations/` — 0001 web 스키마, 0002 기존 테이블 잠금, 0003 버킷 하드닝

## 패턴
- 커스텀 `Button`은 링크로 쓸 때 `render={<Link/>}` (cloneElement Slot, 기본 `type="button"`). `Select`는 @base-ui(`onValueChange`는 `string|null`).
- 테마 변경은 `app/globals.css`의 `:root` CSS 변수만 수정하면 전체 반영(컴포넌트는 `bg-primary` 등 토큰 사용). shadcn/components.json 없음.
- CMS는 Server Component + Server Action(`revalidatePath`) 중심.
- 자가진단 게임: `components/games/fusion-self-check/` (Zustand store), 임베드: `components/games/embedded-game.tsx`.

@AGENTS.md
