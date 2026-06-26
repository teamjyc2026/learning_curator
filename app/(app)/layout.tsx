import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth/roles";
import { AppHeader } from "@/components/layout/app-header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getSessionContext();
  if (!ctx.user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader profile={ctx.profile} roles={ctx.roles} />
      <main className="flex-1 bg-muted/20">{children}</main>
    </div>
  );
}
