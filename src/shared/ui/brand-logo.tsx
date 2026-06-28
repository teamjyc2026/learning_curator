import { cn } from "@/shared/lib/utils";

/**
 * 러닝 큐레이터 심볼 마크 — 열린 링(violet→indigo) + 성장하는 3개 점(coral→amber).
 * 그라데이션 stop을 CSS 변수(--brand-ring-*, --brand-dot-*)로 두어 단일 SVG가
 * 라이트/다크에 자동 반응한다(JS·플리커 없음). 좌표는 reference/brand/symbol.svg와 동일.
 *
 * 헤더/푸터에서 브랜드 텍스트와 함께 쓰이므로 기본은 장식(aria-hidden).
 * 단독 사용 시 `label`을 주면 role="img"로 노출된다.
 */
export function BrandLogo({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 188 188"
      className={cn("size-8", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id="lc-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--brand-ring-from)" />
          <stop offset="1" stopColor="var(--brand-ring-to)" />
        </linearGradient>
        <linearGradient id="lc-dot" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="var(--brand-dot-from)" />
          <stop offset="1" stopColor="var(--brand-dot-to)" />
        </linearGradient>
      </defs>
      <g transform="translate(14,14) scale(1.3333)">
        <path
          d="M 103.04 50.85 A 44.0 44.0 0 1 1 69.15 16.96"
          fill="none"
          stroke="url(#lc-ring)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <circle cx="43.74" cy="76.26" r="3.0" fill="url(#lc-dot)" />
        <circle cx="63.54" cy="56.46" r="4.8" fill="url(#lc-dot)" />
        <circle cx="83.33" cy="36.67" r="7.2" fill="url(#lc-dot)" />
      </g>
    </svg>
  );
}
