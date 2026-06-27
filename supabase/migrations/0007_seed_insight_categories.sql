-- 인사이트(블로그) 교육단계별 카테고리 8개 시드
insert into web.post_categories (slug, name, sort_order) values
  ('elementary', '초등교육', 1),
  ('middle',     '중등교육', 2),
  ('high',       '고등교육', 3),
  ('adult',      '성인교육', 4),
  ('parenting',  '부모되기', 5),
  ('youth',      '청년기 학습', 6),
  ('middle-age', '중장년기 학습', 7),
  ('senior',     '노년기 학습', 8)
on conflict (slug) do nothing;
