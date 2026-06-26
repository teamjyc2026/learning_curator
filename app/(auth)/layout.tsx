import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="mb-6 font-heading text-xl font-extrabold tracking-tight"
      >
        {siteConfig.shortName}
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
