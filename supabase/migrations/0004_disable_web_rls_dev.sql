-- =============================================================================
-- ⚠️ 개발 편의용: web 스키마 RLS 비활성화 (사용자 요청).
-- 정책(policy)은 남겨두고 enforcement만 끈다 → 되돌리려면 아래를 enable로:
--   alter table web.<t> enable row level security;
-- 경고: anon 공개 키가 브라우저에 배포되므로, RLS가 꺼진 동안에는 누구나
--       web 테이블(상담 개인정보·user_roles 권한 포함)을 읽고 쓸 수 있다.
--       공개 런칭 전 반드시 재활성화할 것.
-- =============================================================================
alter table web.profiles               disable row level security;
alter table web.user_roles             disable row level security;
alter table web.post_categories        disable row level security;
alter table web.posts                  disable row level security;
alter table web.member_posts           disable row level security;
alter table web.games                  disable row level security;
alter table web.game_results           disable row level security;
alter table web.consultations          disable row level security;
alter table web.newsletter_subscribers disable row level security;
alter table web.attachments            disable row level security;
alter table web.site_settings          disable row level security;
