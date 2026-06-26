import Link from "next/link";
import { Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { memberTypeLabel, type MemberPost } from "@/lib/queries/member-posts";

export function MemberPostList({
  posts,
  filterTypes,
  emptyText = "게시글이 없습니다.",
}: {
  posts: MemberPost[];
  filterTypes?: string[];
  emptyText?: string;
}) {
  const list = filterTypes
    ? posts.filter((p) => filterTypes.includes(p.post_type))
    : posts;

  if (list.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="divide-y rounded-xl border bg-card">
      {list.map((p) => (
        <Link
          key={p.id}
          href={`/posts/${p.id}`}
          className="flex items-center gap-3 p-4 transition-colors hover:bg-accent/40"
        >
          {p.pinned ? <Pin className="size-4 shrink-0 text-primary" /> : null}
          <Badge variant="secondary" className="shrink-0">
            {memberTypeLabel[p.post_type]}
          </Badge>
          <span className="min-w-0 flex-1 truncate font-medium">{p.title}</span>
          {p.due_at ? (
            <span className="shrink-0 text-xs font-medium text-destructive">
              마감 {new Date(p.due_at).toLocaleDateString("ko-KR")}
            </span>
          ) : null}
          <time className="hidden shrink-0 text-xs text-muted-foreground sm:block">
            {new Date(p.published_at).toLocaleDateString("ko-KR")}
          </time>
        </Link>
      ))}
    </div>
  );
}
