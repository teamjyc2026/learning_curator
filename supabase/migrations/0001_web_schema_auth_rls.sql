-- =============================================================================
-- 학원 웹사이트/웹앱 — web 스키마 (auth, content, RLS, storage)
-- 기존 esamath 백오피스(public 스키마)와 완전히 격리됩니다.
-- =============================================================================

-- 1) 스키마 & 권한 -----------------------------------------------------------
create schema if not exists web;

grant usage on schema web to anon, authenticated, service_role;

-- RLS로 행 접근을 통제하므로 테이블/시퀀스/함수 권한은 supabase 기본(public)과 동일하게 부여.
alter default privileges in schema web
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema web
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema web
  grant all on routines to anon, authenticated, service_role;

-- 2) Enums -------------------------------------------------------------------
create type web.app_role            as enum ('admin', 'parent', 'student');
create type web.post_status         as enum ('draft', 'published', 'archived');
create type web.member_audience     as enum ('parent', 'student', 'all');
create type web.member_post_type    as enum ('notice', 'guide', 'resource', 'assignment');
create type web.game_type           as enum ('embed', 'internal');
create type web.game_visibility     as enum ('public', 'student', 'member');
create type web.consultation_status as enum ('requested', 'confirmed', 'completed', 'cancelled', 'no_show');
create type web.attachment_entity   as enum ('post', 'member_post', 'consultation');

-- 3) 공통 함수 ---------------------------------------------------------------
create or replace function web.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 4) 테이블 ------------------------------------------------------------------

-- profiles : auth.users 1:1 미러
create table web.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  nickname    text,
  full_name   text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- user_roles : 역할 진실 공급원
create table web.user_roles (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        web.app_role not null,
  granted_by  uuid references auth.users(id),
  created_at  timestamptz not null default now(),
  unique (user_id, role)
);
create index user_roles_user_id_idx on web.user_roles(user_id);

-- post_categories : 토픽 분류
create table web.post_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- posts : 공개 블로그 (뉴스/소식/칼럼)
create table web.posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  excerpt         text,
  content         text not null default '',
  content_format  text not null default 'markdown',
  cover_image_url text,
  category_id     uuid references web.post_categories(id) on delete set null,
  tags            text[] not null default '{}',
  status          web.post_status not null default 'draft',
  author_id       uuid references auth.users(id) on delete set null,
  required_tier   text,
  published_at    timestamptz,
  view_count      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index posts_status_published_idx on web.posts(status, published_at desc);
create index posts_category_idx on web.posts(category_id);

-- member_posts : 학부모/학생 전용 게시 (audience로 구분)
create table web.member_posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  content         text not null default '',
  content_format  text not null default 'markdown',
  audience        web.member_audience not null,
  post_type       web.member_post_type not null default 'notice',
  status          web.post_status not null default 'published',
  pinned          boolean not null default false,
  due_at          timestamptz,
  author_id       uuid references auth.users(id) on delete set null,
  published_at    timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index member_posts_audience_idx on web.member_posts(audience, status, published_at desc);

-- games : 임베드(외부 URL) + 내장(자가진단 등)
create table web.games (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  description   text,
  thumbnail_url text,
  game_type     web.game_type not null,
  embed_url     text,
  open_in       text not null default 'iframe',
  internal_key  text,
  visibility    web.game_visibility not null default 'student',
  status        web.post_status not null default 'published',
  sort_order    int not null default 0,
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index games_visibility_idx on web.games(visibility, status, sort_order);

-- game_results : 자가진단/게임 결과(로그인 사용자)
create table web.game_results (
  id           uuid primary key default gen_random_uuid(),
  game_id      uuid references web.games(id) on delete set null,
  internal_key text,
  user_id      uuid not null references auth.users(id) on delete cascade,
  result       jsonb not null,
  created_at   timestamptz not null default now()
);
create index game_results_user_idx on web.game_results(user_id, created_at desc);

-- consultations : 학습코칭 상담예약 (비로그인 신청 허용)
create table web.consultations (
  id                uuid primary key default gen_random_uuid(),
  requester_user_id uuid references auth.users(id) on delete set null,
  student_name      text not null,
  parent_name       text,
  phone             text not null,
  email             text,
  grade             text,
  preferred_subject text,
  preferred_at_1    timestamptz,
  preferred_at_2    timestamptz,
  channel           text,
  message           text,
  status            web.consultation_status not null default 'requested',
  privacy_consent   boolean not null,
  assigned_admin    uuid references auth.users(id),
  admin_note        text,
  handled_at        timestamptz,
  source            text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index consultations_status_idx on web.consultations(status, created_at desc);
create index consultations_requester_idx on web.consultations(requester_user_id);

-- newsletter_subscribers
create table web.newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  name            text,
  user_id         uuid references auth.users(id) on delete set null,
  status          text not null default 'subscribed',
  consent         boolean not null default true,
  created_at      timestamptz not null default now(),
  unsubscribed_at timestamptz
);
create unique index newsletter_email_lower_idx on web.newsletter_subscribers (lower(email));

-- attachments : 게시글/자료/상담 첨부 메타데이터
create table web.attachments (
  id          uuid primary key default gen_random_uuid(),
  entity_type web.attachment_entity not null,
  entity_id   uuid not null,
  bucket      text not null,
  path        text not null,
  file_name   text not null,
  mime_type   text,
  size_bytes  bigint,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index attachments_entity_idx on web.attachments(entity_type, entity_id);

-- site_settings : 소셜 링크 등 관리자 편집 설정
create table web.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

-- 5) updated_at 트리거 -------------------------------------------------------
create trigger trg_profiles_updated      before update on web.profiles      for each row execute function web.set_updated_at();
create trigger trg_posts_updated         before update on web.posts         for each row execute function web.set_updated_at();
create trigger trg_member_posts_updated  before update on web.member_posts  for each row execute function web.set_updated_at();
create trigger trg_games_updated         before update on web.games         for each row execute function web.set_updated_at();
create trigger trg_consultations_updated before update on web.consultations for each row execute function web.set_updated_at();
create trigger trg_site_settings_updated before update on web.site_settings for each row execute function web.set_updated_at();

-- 6) 역할 판별 헬퍼 (SECURITY DEFINER → user_roles 셀프참조 재귀 회피) ---------
create or replace function web.has_role(_role web.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from web.user_roles ur
    where ur.user_id = auth.uid() and ur.role = _role
  );
$$;

create or replace function web.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select web.has_role('admin');
$$;

grant execute on function web.has_role(web.app_role) to anon, authenticated;
grant execute on function web.is_admin() to anon, authenticated;

-- 7) 신규 가입 처리 (profiles + user_roles 생성, role 화이트리스트) -----------
create or replace function web.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role web.app_role;
begin
  insert into web.profiles (id, email, nickname, full_name, phone)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data->>'nickname', ''),
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;

  -- parent/student만 자기지정 허용. admin은 절대 메타데이터로 부여 불가.
  if (new.raw_user_meta_data->>'role') in ('parent', 'student') then
    v_role := (new.raw_user_meta_data->>'role')::web.app_role;
    insert into web.user_roles (user_id, role)
    values (new.id, v_role)
    on conflict (user_id, role) do nothing;
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function web.handle_new_user();

-- 8) RLS 활성화 -------------------------------------------------------------
alter table web.profiles              enable row level security;
alter table web.user_roles            enable row level security;
alter table web.post_categories       enable row level security;
alter table web.posts                 enable row level security;
alter table web.member_posts          enable row level security;
alter table web.games                 enable row level security;
alter table web.game_results          enable row level security;
alter table web.consultations         enable row level security;
alter table web.newsletter_subscribers enable row level security;
alter table web.attachments           enable row level security;
alter table web.site_settings         enable row level security;

-- 9) RLS 정책 ---------------------------------------------------------------

-- profiles
create policy "profiles_select_own_or_admin" on web.profiles
  for select using (id = auth.uid() or web.is_admin());
create policy "profiles_update_own_or_admin" on web.profiles
  for update using (id = auth.uid() or web.is_admin())
  with check (id = auth.uid() or web.is_admin());
create policy "profiles_delete_admin" on web.profiles
  for delete using (web.is_admin());

-- user_roles (insert/update/delete는 admin만; 가입 시엔 definer 트리거가 처리)
create policy "user_roles_select_own_or_admin" on web.user_roles
  for select using (user_id = auth.uid() or web.is_admin());
create policy "user_roles_admin_write" on web.user_roles
  for all using (web.is_admin()) with check (web.is_admin());

-- post_categories (공개 읽기)
create policy "categories_public_read" on web.post_categories
  for select using (true);
create policy "categories_admin_write" on web.post_categories
  for all using (web.is_admin()) with check (web.is_admin());

-- posts (published 공개, 그 외 admin)
create policy "posts_public_read" on web.posts
  for select using (status = 'published' or web.is_admin());
create policy "posts_admin_write" on web.posts
  for all using (web.is_admin()) with check (web.is_admin());

-- member_posts (audience 기반)
create policy "member_posts_read" on web.member_posts
  for select using (
    web.is_admin()
    or (status = 'published' and (
      (audience = 'parent'  and web.has_role('parent'))  or
      (audience = 'student' and web.has_role('student')) or
      (audience = 'all'     and auth.uid() is not null)
    ))
  );
create policy "member_posts_admin_write" on web.member_posts
  for all using (web.is_admin()) with check (web.is_admin());

-- games (visibility 기반)
create policy "games_read" on web.games
  for select using (
    web.is_admin()
    or (status = 'published' and (
      visibility = 'public'
      or (visibility = 'student' and web.has_role('student'))
      or (visibility = 'member'  and auth.uid() is not null)
    ))
  );
create policy "games_admin_write" on web.games
  for all using (web.is_admin()) with check (web.is_admin());

-- game_results (본인 + admin)
create policy "game_results_select_own_or_admin" on web.game_results
  for select using (user_id = auth.uid() or web.is_admin());
create policy "game_results_insert_own" on web.game_results
  for insert with check (user_id = auth.uid());
create policy "game_results_delete_own_or_admin" on web.game_results
  for delete using (user_id = auth.uid() or web.is_admin());

-- consultations (비로그인 신청 허용, 조회/변경 제한)
create policy "consultations_insert_anyone" on web.consultations
  for insert to anon, authenticated
  with check (privacy_consent = true);
create policy "consultations_select_own_or_admin" on web.consultations
  for select using (requester_user_id = auth.uid() or web.is_admin());
create policy "consultations_admin_update" on web.consultations
  for update using (web.is_admin()) with check (web.is_admin());
create policy "consultations_admin_delete" on web.consultations
  for delete using (web.is_admin());

-- newsletter_subscribers (구독은 누구나, 관리만 admin)
create policy "newsletter_insert_anyone" on web.newsletter_subscribers
  for insert to anon, authenticated
  with check (consent = true);
create policy "newsletter_admin_read" on web.newsletter_subscribers
  for select using (web.is_admin());
create policy "newsletter_admin_update" on web.newsletter_subscribers
  for update using (web.is_admin()) with check (web.is_admin());
create policy "newsletter_admin_delete" on web.newsletter_subscribers
  for delete using (web.is_admin());

-- attachments (부모 엔티티 가시성 상속)
create policy "attachments_read" on web.attachments
  for select using (
    web.is_admin()
    or (entity_type = 'post' and exists (
      select 1 from web.posts p
      where p.id = entity_id and p.status = 'published'
    ))
    or (entity_type = 'member_post' and exists (
      select 1 from web.member_posts m
      where m.id = entity_id and m.status = 'published' and (
        (m.audience = 'parent'  and web.has_role('parent'))  or
        (m.audience = 'student' and web.has_role('student')) or
        (m.audience = 'all'     and auth.uid() is not null)
      )
    ))
  );
create policy "attachments_admin_write" on web.attachments
  for all using (web.is_admin()) with check (web.is_admin());

-- site_settings (공개 읽기, 관리 admin)
create policy "site_settings_public_read" on web.site_settings
  for select using (true);
create policy "site_settings_admin_write" on web.site_settings
  for all using (web.is_admin()) with check (web.is_admin());

-- 10) Storage 버킷 & 정책 ----------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('web-public',        'web-public',        true),
  ('web-avatars',       'web-avatars',       true),
  ('web-parent-files',  'web-parent-files',  false),
  ('web-student-files', 'web-student-files', false)
on conflict (id) do nothing;

-- web-public : 공개 읽기 / admin 쓰기
create policy "web_public_read" on storage.objects
  for select using (bucket_id = 'web-public');
create policy "web_public_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'web-public' and web.is_admin());
create policy "web_public_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'web-public' and web.is_admin());
create policy "web_public_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'web-public' and web.is_admin());

-- web-avatars : 공개 읽기 / 본인 폴더(uid) 또는 admin 쓰기
create policy "web_avatars_read" on storage.objects
  for select using (bucket_id = 'web-avatars');
create policy "web_avatars_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'web-avatars'
    and (web.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );
create policy "web_avatars_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'web-avatars'
    and (web.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );
create policy "web_avatars_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'web-avatars'
    and (web.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );

-- web-parent-files : parent/admin 읽기 / admin 쓰기
create policy "web_parent_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'web-parent-files' and (web.has_role('parent') or web.is_admin()));
create policy "web_parent_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'web-parent-files' and web.is_admin());
create policy "web_parent_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'web-parent-files' and web.is_admin());
create policy "web_parent_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'web-parent-files' and web.is_admin());

-- web-student-files : student/admin 읽기 / admin 쓰기
create policy "web_student_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'web-student-files' and (web.has_role('student') or web.is_admin()));
create policy "web_student_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'web-student-files' and web.is_admin());
create policy "web_student_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'web-student-files' and web.is_admin());
create policy "web_student_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'web-student-files' and web.is_admin());
