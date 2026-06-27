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
    <div className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <Reveal>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
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
    <div className="mx-auto max-w-6xl px-4 py-20">
      <div className="border-y py-16 text-center">
        <p className="text-lg font-semibold">준비 중입니다</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {note ?? "곧 더 풍성한 콘텐츠로 찾아뵙겠습니다."}
        </p>
      </div>
    </div>
  );
}
