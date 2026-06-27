import { requireRole } from "@/entities/session";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("parent");
  return <>{children}</>;
}
