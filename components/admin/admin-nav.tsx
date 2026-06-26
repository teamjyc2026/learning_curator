"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/posts", label: "블로그" },
  { href: "/admin/categories", label: "카테고리" },
  { href: "/admin/member-posts", label: "회원게시글" },
  { href: "/admin/games", label: "게임" },
  { href: "/admin/consultations", label: "상담예약" },
  { href: "/admin/users", label: "회원" },
  { href: "/admin/newsletter", label: "뉴스레터" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="border-b bg-background">
      <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
        {items.map((it) => {
          const active =
            it.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
