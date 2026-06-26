-- =============================================================================
-- 보안 잠금: 기존 esamath 백오피스(public 스키마) 20개 테이블 RLS 활성화.
-- 정책을 추가하지 않으므로 anon/authenticated는 전면 차단되고,
-- service_role(서버 전용)만 우회합니다. 되돌리려면 각 테이블에 대해
--   alter table public.<t> disable row level security;
-- 를 실행하세요.
-- =============================================================================
alter table public.responses                 enable row level security;
alter table public.sources                   enable row level security;
alter table public.source_chunks             enable row level security;
alter table public.problems                  enable row level security;
alter table public.student_attempts          enable row level security;
alter table public.student_levels            enable row level security;
alter table public.agent_conversations       enable row level security;
alter table public.agent_messages            enable row level security;
alter table public.admin_users               enable row level security;
alter table public.agent_memories            enable row level security;
alter table public.schools                   enable row level security;
alter table public.students                  enable row level security;
alter table public.workbench_jobs            enable row level security;
alter table public.workbench_boxes           enable row level security;
alter table public.workbench_attachments     enable row level security;
alter table public.exam_scopes               enable row level security;
alter table public.exam_scope_sources        enable row level security;
alter table public.workbench_folders         enable row level security;
alter table public.problems_archive_20260615 enable row level security;
alter table public.exam_scope_problems       enable row level security;
