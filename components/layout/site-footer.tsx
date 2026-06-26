import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SocialLinks } from "./social-links";
import { NewsletterForm } from "./newsletter-form";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <span className="font-heading text-lg font-extrabold">
              {siteConfig.shortName}
            </span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
          <SocialLinks />
        </div>

        <nav className="flex flex-col gap-2 text-sm">
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

        <div className="space-y-3">
          <div className="text-sm font-semibold">뉴스레터 구독</div>
          <p className="text-sm text-muted-foreground">
            매주 새 인사이트를 메일로 받아보세요.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
