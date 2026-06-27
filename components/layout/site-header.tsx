"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Menu, ArrowRight, ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site-config";
import { logoutAction } from "@/app/(auth)/actions";
import type { AppRole } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";
import { SocialLinks } from "./social-links";

export interface HeaderSession {
  nickname: string | null;
  avatarUrl: string | null;
  roles: AppRole[];
}

const roleLinks: { role: AppRole; href: string; label: string }[] = [
  { role: "admin", href: "/admin", label: "관리자" },
  { role: "parent", href: "/parent", label: "학부모" },
  { role: "student", href: "/student", label: "학생" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <GraduationCap className="size-5" />
      </span>
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

  const myRoleLinks = roleLinks.filter((r) => session.roles.includes(r.role));

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
        <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg">
          {myRoleLinks.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              {r.label} 페이지
            </Link>
          ))}
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

export function SiteHeader({ session }: { session: HeaderSession | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const myRoleLinks = session
    ? roleLinks.filter((r) => session.roles.includes(r.role))
    : [];

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
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
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
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent"
                  >
                    {item.title}
                  </Link>
                ))}

                <div className="my-2 h-px bg-border" />

                {session ? (
                  <>
                    {myRoleLinks.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent"
                      >
                        {r.label} 페이지
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
              <div className="mt-4 px-4">
                <SocialLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
