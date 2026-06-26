"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 외부 URL(예: Canva 사이트)을 iframe '웹인웹'으로 임베드.
 * 일부 사이트는 X-Frame-Options/CSP로 iframe을 차단하므로 항상 "새 탭" 폴백 제공.
 * open_in='newtab'이면 임베드 대신 새 탭 버튼만.
 */
export function EmbeddedGame({
  url,
  title,
  openIn,
}: {
  url: string;
  title: string;
  openIn: string;
}) {
  if (openIn === "newtab") {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <p className="text-muted-foreground">새 탭에서 게임을 실행하세요.</p>
        <Button className="mt-4" render={<a href={url} target="_blank" rel="noreferrer noopener" />}>
          <ExternalLink className="size-4" />
          게임 열기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="h-[78vh] w-full overflow-hidden rounded-xl border bg-card">
        <iframe
          src={url}
          title={title}
          className="h-full w-full"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
          allow="fullscreen; autoplay; clipboard-write"
          loading="lazy"
        />
      </div>
      <p className="text-center text-sm text-muted-foreground">
        화면이 보이지 않으면{" "}
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-primary hover:underline"
        >
          새 탭에서 열기
        </a>
      </p>
    </div>
  );
}
