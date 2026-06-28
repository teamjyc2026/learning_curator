import Link from "next/link";
import { siteConfig } from "@/shared/config/site";
import { SocialLinks } from "@/shared/ui/social-links";
import { BrandLogo } from "@/shared/ui/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BrandLogo className="size-8" />
            <span className="font-heading text-lg font-extrabold">
              {siteConfig.shortName}
            </span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <SocialLinks />
        </div>

        <nav className="flex flex-col gap-2 text-sm md:items-end">
          <div className="mb-1 font-semibold">바로가기</div>
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
