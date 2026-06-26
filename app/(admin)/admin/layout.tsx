import { requireRole } from "@/lib/auth/roles";
import { AppHeader } from "@/components/layout/app-header";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await requireRole("admin");
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader profile={ctx.profile} roles={ctx.roles} />
      <AdminNav />
      <main className="flex-1 bg-muted/20">{children}</main>
    </div>
  );
}
