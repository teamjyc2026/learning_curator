import { Reveal } from "@/components/motion/motion-primitives";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_80%_at_15%_0%,var(--primary-soft),transparent_70%)]" />
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <Reveal>
          {eyebrow ? (
            <p className="text-sm font-bold tracking-[0.18em] text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
              {description}
            </p>
          ) : null}
        </Reveal>
      </div>
    </div>
  );
}

export function ComingSoon({ note }: { note?: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-2xl border border-dashed bg-muted/30 p-12 text-center">
        <p className="text-lg font-semibold">준비 중입니다</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {note ?? "곧 더 풍성한 콘텐츠로 찾아뵙겠습니다."}
        </p>
      </div>
    </div>
  );
}
