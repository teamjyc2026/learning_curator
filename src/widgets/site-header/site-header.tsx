"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowRight, ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { siteConfig } from "@/shared/config/site";
import { logoutAction } from "@/features/auth/actions";
import { useAuthSession } from "@/features/auth/session";
import type { AppRole } from "@/shared/lib/supabase/database.types";
import { cn } from "@/shared/lib/utils";
import { SocialLinks } from "@/shared/ui/social-links";
import { BrandLogo } from "@/shared/ui/brand-logo";
import { ThemeToggle } from "@/shared/ui/theme-toggle";

export interface HeaderSession {
  nickname: string | null;
  avatarUrl: string | null;
  roles: AppRole[];
}

const roleLinks: { role: AppRole; href: string; label: string }[] = [
  { role: "parent", href: "/parent", label: "학부모 페이지" },
  { role: "student", href: "/student", label: "학생 페이지" },
];

// 관리자 메뉴(별도 관리자 페이지 대신 헤더 메뉴 항목으로 추가)
const adminLinks: { href: string; label: string }[] = [
  { href: "/admin/posts", label: "블로그 관리" },
  { href: "/admin/member-posts", label: "회원 게시글" },
  { href: "/admin/parent-questions", label: "학부모 상담글" },
  { href: "/admin/games", label: "학습 게임 관리" },
  { href: "/admin/consultations", label: "상담 예약" },
  { href: "/admin/users", label: "회원·역할" },
];

function menuLinksFor(roles: AppRole[]): { href: string; label: string }[] {
  if (roles.includes("admin")) return adminLinks;
  return roleLinks.filter((r) => roles.includes(r.role));
}

function navLinkCls(active: boolean) {
  return cn(
    "px-3 py-2 text-sm font-medium underline-offset-8 transition-colors",
    active
      ? "text-foreground underline decoration-2"
      : "text-muted-foreground hover:text-foreground",
  );
}

// 메뉴에 노출할 인사이트 카테고리(공개분만). 나머지는 콘텐츠가 쌓이면 공개 전환.
const insightMenu = siteConfig.insightCategories.filter((c) => c.public);

// 데스크톱: 인사이트 — 클릭하면 펼쳐지는 카테고리 드롭다운(기본 접힘)
function InsightsNav({ active, title }: { active: boolean; title: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false); // 라우트 이동 시 닫기
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative flex items-center">
      <Link href="/insights" className={navLinkCls(active)}>
        {title}
      </Link>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="인사이트 카테고리 펼치기"
        aria-expanded={open}
        className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 mt-1 w-40 rounded-lg border bg-popover p-1 shadow-md">
          {insightMenu.map((c) => (
            <Link
              key={c.slug}
              href={`/insights?topic=${c.slug}`}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {c.title}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// 모바일 Sheet: 인사이트 — 클릭하면 펼쳐지는 카테고리(기본 접힘)
function MobileInsights({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href="/insights"
          onClick={onNavigate}
          className="flex-1 rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent"
        >
          인사이트
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="인사이트 카테고리 펼치기"
          aria-expanded={open}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ChevronDown
            className={cn("size-4 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>
      {open
        ? insightMenu.map((c) => (
            <Link
              key={c.slug}
              href={`/insights?topic=${c.slug}`}
              onClick={onNavigate}
              className="block rounded-md py-2 pr-3 pl-7 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {c.title}
            </Link>
          ))
        : null}
    </div>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      aria-label={`${siteConfig.shortName} 홈`}
    >
      <BrandLogo className="size-8" />
      <span className="font-heading text-lg font-extrabold tracking-tight">
        {siteConfig.shortName}
      </span>
    </Link>
  );
}

function UserMenu({ session }: { session: HeaderSession }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const links = menuLinksFor(session.roles);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors hover:bg-accent"
      >
        <Avatar className="size-8">
          <AvatarImage src={session.avatarUrl ?? undefined} alt="" />
          <AvatarFallback>{(session.nickname ?? "회").slice(0, 1)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-24 truncate text-sm font-medium sm:inline">
          {session.nickname ?? "회원"}
        </span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 max-h-[80vh] w-56 overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg">
          {session.roles.includes("admin") ? (
            <p className="px-3 pt-1.5 pb-1 text-xs font-semibold text-muted-foreground">
              관리
            </p>
          ) : null}
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              {l.label}
            </Link>
          ))}
          <div className="my-1 h-px bg-border" />
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            내 계정
          </Link>
          <div className="my-1 h-px bg-border" />
          <form action={logoutAction}>
            <button
              type="submit"
              className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              로그아웃
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader({
  session: initialSession,
}: {
  session: HeaderSession | null;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // 클라이언트에서 로그인 상태를 직접 읽어 로그인/로그아웃 시 헤더가 바로 갱신됨.
  const clientSession = useAuthSession();
  const session = clientSession === undefined ? initialSession : clientSession;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mobileLinks = session ? menuLinksFor(session.roles) : [];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "border-b border-transparent bg-background",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Logo />

        <nav className="ml-4 hidden items-center gap-0.5 md:flex">
          {siteConfig.nav.map((item) => {
            const active = pathname.startsWith(item.href);

            // 인사이트: 교육단계별 카테고리 — 클릭 시 펼쳐지는 드롭다운
            if (item.href === "/insights") {
              return (
                <InsightsNav key={item.href} active={active} title={item.title} />
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkCls(active)}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle className="hidden sm:inline-flex" />

          <Button size="sm" render={<Link href="/consultation" />}>
            상담예약
            <ArrowRight className="size-3.5" />
          </Button>

          {session ? (
            <div className="hidden sm:block">
              <UserMenu session={session} />
            </div>
          ) : (
            <>
              <SocialLinks className="hidden sm:flex" />
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                render={<Link href="/login" />}
              >
                로그인
              </Button>
            </>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="메뉴 열기"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "md:hidden",
              )}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{siteConfig.shortName}</SheetTitle>
              </SheetHeader>
              <nav className="mt-2 flex flex-col gap-1 px-2">
                {siteConfig.nav.map((item) =>
                  item.href === "/insights" ? (
                    <MobileInsights
                      key={item.href}
                      onNavigate={() => setOpen(false)}
                    />
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent"
                    >
                      {item.title}
                    </Link>
                  ),
                )}

                <div className="my-2 h-px bg-border" />

                {session ? (
                  <>
                    {mobileLinks.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent"
                      >
                        {l.label}
                      </Link>
                    ))}
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent"
                    >
                      내 계정
                    </Link>
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full rounded-md px-3 py-2.5 text-left text-base font-medium text-destructive hover:bg-destructive/10"
                      >
                        로그아웃
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent"
                  >
                    로그인
                  </Link>
                )}
              </nav>
              <div className="mt-4 flex items-center justify-between px-4">
                <SocialLinks />
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
