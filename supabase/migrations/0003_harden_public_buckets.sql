-- 공개 버킷(web-public, web-avatars)은 public URL로 객체 접근이 가능하므로
-- storage.objects의 SELECT 정책이 불필요하며, 오히려 전체 파일 목록 조회(list)를
-- 허용해 노출면을 넓힌다. 해당 read 정책을 제거한다.
drop policy if exists "web_public_read" on storage.objects;
drop policy if exists "web_avatars_read" on storage.objects;
