import { Reveal } from "@/shared/ui/motion-primitives";

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
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 md:py-24">
        <Reveal>
          {eyebrow ? (
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-point sm:text-xs">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-4 break-keep text-3xl font-extrabold tracking-tight sm:text-4xl md:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-2xl break-keep text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
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
