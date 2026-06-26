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
    <div className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {eyebrow ? (
          <p className="text-sm font-bold tracking-[0.14em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function ComingSoon({ note }: { note?: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center">
        <p className="text-lg font-semibold">준비 중입니다</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {note ?? "곧 더 풍성한 콘텐츠로 찾아뵙겠습니다."}
        </p>
      </div>
    </div>
  );
}
