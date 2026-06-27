export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  const label = [index, eyebrow].filter(Boolean).join(" · ");
  return (
    <div className="border-b pb-5">
      {label ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-point">
          {label}
        </p>
      ) : null}
      <h2 className="mt-3 break-keep text-2xl font-extrabold tracking-tight md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl break-keep text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
