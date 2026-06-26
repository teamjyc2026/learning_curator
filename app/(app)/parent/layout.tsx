import { requireRole } from "@/lib/auth/roles";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("parent");
  return <>{children}</>;
}
