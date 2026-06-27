import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getHeaderSession } from "@/lib/auth/roles";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getHeaderSession();
  return (
    <>
      <SiteHeader session={session} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
