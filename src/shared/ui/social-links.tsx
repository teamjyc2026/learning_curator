import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";

// lucide-react는 브랜드 아이콘(Instagram 등)을 제공하지 않으므로 인라인 SVG 사용.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const iconBtn =
  "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-point/10 hover:text-point";

/**
 * 인스타그램 프로필 / 카카오 채널 링크 버튼.
 * MVP는 환경변수의 링크로만 연결(실제 피드 임베드/카카오 로그인은 추후).
 */
export function SocialLinks({ className }: { className?: string }) {
  const { instagram, kakao } = siteConfig.social;

  if (!instagram && !kakao) return null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {instagram ? (
        <Link
          href={instagram}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="인스타그램"
          className={iconBtn}
        >
          <InstagramIcon className="size-5" />
        </Link>
      ) : null}
      {kakao ? (
        <Link
          href={kakao}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="카카오 채널"
          className={iconBtn}
        >
          <MessageCircle className="size-5" />
        </Link>
      ) : null}
    </div>
  );
}
