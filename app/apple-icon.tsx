import { ImageResponse } from "next/og";

// Apple 터치 아이콘 — 빌드 타임 정적 생성(텍스트 없음 → 폰트 불필요).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// reference/brand/app_icon.svg 와 동일한 마크(라운드 사각 그라데이션 + 흰 링 + 점).
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 220 220">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6B5BE6"/><stop offset="1" stop-color="#2E2A78"/>
    </linearGradient>
    <linearGradient id="d" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#FF6A5B"/><stop offset="1" stop-color="#FFB13D"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="220" height="220" rx="51.7" fill="url(#g)"/>
  <g transform="translate(24.20,24.20) scale(1.4300)">
    <path d="M 103.04 50.85 A 44.0 44.0 0 1 1 69.15 16.96" fill="none" stroke="#FFFFFF" stroke-width="11.0" stroke-linecap="round"/>
    <circle cx="43.74" cy="76.26" r="3.0" fill="url(#d)"/>
    <circle cx="63.54" cy="56.46" r="4.8" fill="url(#d)"/>
    <circle cx="83.33" cy="36.67" r="7.2" fill="url(#d)"/>
  </g>
</svg>`;

export default function AppleIcon() {
  const src = `data:image/svg+xml;base64,${Buffer.from(ICON_SVG).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={180} height={180} src={src} alt="" />
      </div>
    ),
    { ...size },
  );
}
