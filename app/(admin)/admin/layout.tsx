import { requireRole } from "@/lib/auth/roles";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await requireRole("admin");
  const session = {
    nickname: ctx.profile?.nickname ?? null,
    avatarUrl: ctx.profile?.avatar_url ?? null,
    roles: ctx.roles,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader session={session} />
      <AdminNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
