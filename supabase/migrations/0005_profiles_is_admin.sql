-- profiles에 admin 플래그 추가 → 관리자 분기를 profiles 기준으로 단순화.
alter table web.profiles add column if not exists is_admin boolean not null default false;

-- 기존 user_roles의 admin을 profiles.is_admin으로 동기화
update web.profiles p
set is_admin = true
from web.user_roles ur
where ur.user_id = p.id and ur.role = 'admin';
