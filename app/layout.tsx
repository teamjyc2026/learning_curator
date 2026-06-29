import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/app/providers";
import { siteConfig } from "@/shared/config/site";

// og:url 등 절대 URL 기준. 우선순위: 명시 env → (Vercel 배포면) 확정 도메인 → 로컬.
// (미설정 시 og:url이 localhost로 박혀 카톡 등 링크 미리보기가 깨지므로 폴백 보강)
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL ? siteConfig.url : "http://localhost:3001");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} — 생각의 힘을 키우는 학습 코칭`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName,
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

// Next 16: themeColor/colorScheme는 metadata가 아니라 viewport에 둔다.
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#15131f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
