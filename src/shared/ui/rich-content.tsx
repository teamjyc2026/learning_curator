import { Markdown } from "@/shared/ui/markdown";
import { cn } from "@/shared/lib/utils";

/** content_format='html'(에디터 산출물)이면 HTML 렌더, 아니면 마크다운. */
export function RichContent({
  content,
  format,
  className,
}: {
  content: string;
  format?: string | null;
  className?: string;
}) {
  if (format === "html") {
    return (
      <div
        className={cn(
          "prose prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  return <Markdown className={className}>{content}</Markdown>;
}
