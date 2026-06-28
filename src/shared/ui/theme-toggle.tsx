"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 서버/클라이언트 테마가 다를 수 있어 마운트 후에만 아이콘 렌더 → 하이드레이션 불일치 방지
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-label="테마 전환"
      title={mounted ? (isDark ? "라이트 모드로" : "다크 모드로") : "테마 전환"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )
      ) : (
        // 마운트 전 placeholder(레이아웃 시프트 방지)
        <span className={cn("size-4")} aria-hidden />
      )}
    </Button>
  );
}
