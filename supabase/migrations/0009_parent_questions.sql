-- 학부모 비밀 상담 게시판: 학부모가 자녀의 학습 고민을 비공개로 작성 → 본인+관리자만 열람, 관리자 답변
create table if not exists web.parent_questions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  answer text,
  answered_at timestamptz,
  answered_by uuid references auth.users(id) on delete set null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists parent_questions_author_idx
  on web.parent_questions(author_id, created_at desc);

-- 개발 단계: web 스키마 전반(0004)과 동일하게 RLS off, 가시성은 앱 쿼리에서 author_id로 필터.
-- 운영 전환 시: RLS enable + (작성자 본인 select/insert/update, 관리자 전체) 정책 추가 필요.
alter table web.parent_questions disable row level security;
