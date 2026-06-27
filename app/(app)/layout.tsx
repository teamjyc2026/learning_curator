import { redirect } from "next/navigation";
import { getSessionContext } from "@/entities/session";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getSessionContext();
  if (!ctx.user) redirect("/login");

  const session = {
    nickname: ctx.profile?.nickname ?? null,
    avatarUrl: ctx.profile?.avatar_url ?? null,
    roles: ctx.roles,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader session={session} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
