import Link from "next/link";
import { logoutAction } from "@/app/(auth)/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import type { Profile } from "@/lib/auth/roles";
import type { AppRole } from "@/lib/supabase/database.types";

const roleLabel: Record<AppRole, string> = {
  admin: "관리자",
  parent: "학부모",
  student: "학생",
};

const linkCls =
  "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

export function AppHeader({
  profile,
  roles,
}: {
  profile: Profile | null;
  roles: AppRole[];
}) {
  const label = roles.map((r) => roleLabel[r]).join(" · ") || "회원";

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <Link href="/" className="font-heading font-extrabold tracking-tight">
          {siteConfig.shortName}
        </Link>

        <nav className="ml-2 hidden items-center gap-1 sm:flex">
          {roles.includes("admin") && (
            <Link href="/admin" className={linkCls}>
              관리자
            </Link>
          )}
          {roles.includes("parent") && (
            <Link href="/parent" className={linkCls}>
              학부모
            </Link>
          )}
          {roles.includes("student") && (
            <Link href="/student" className={linkCls}>
              학생
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link href="/account" className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={profile?.avatar_url ?? undefined} alt="" />
              <AvatarFallback>
                {(profile?.nickname ?? "회").slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm sm:inline">
              {profile?.nickname ?? "회원"}
              <span className="text-muted-foreground"> · {label}</span>
            </span>
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              로그아웃
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
