-- 온라인수업 전용 카테고리(블로그와 분리, /classes 게시판용)
insert into web.post_categories (slug, name, sort_order) values
  ('online-class', '온라인수업', 100)
on conflict (slug) do nothing;
