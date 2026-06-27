import { requireRole } from "@/entities/session";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("student");
  return <>{children}</>;
}
