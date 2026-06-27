/** 제목 등에서 URL 슬러그 생성. 한글/숫자/영문은 보존하고 나머지는 '-'로. */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

/** 비어있으면 랜덤 슬러그로 폴백. */
export function ensureSlug(input: string, prefix = "post"): string {
  const s = slugify(input);
  return s || `${prefix}-${randomSuffix()}`;
}
