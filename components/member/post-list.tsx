import Link from "next/link";
import { Pin } from "lucide-react";
import {
  memberTypeLabel,
  type MemberPostWithAuthor,
} from "@/lib/queries/member-posts";
import { Badge } from "@/components/ui/badge";

export function MemberPostList({
  posts,
  emptyText = "등록된 게시글이 없습니다.",
}: {
  posts: MemberPostWithAuthor[];
  emptyText?: string;
}) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }
  return (
    <div className="divide-y rounded-lg border bg-card">
      {posts.map((p) => (
        <Link
          key={p.id}
          href={`/posts/${p.id}`}
          className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
        >
          {p.pinned ? <Pin className="size-3.5 shrink-0 text-foreground" /> : null}
          <Badge>{memberTypeLabel[p.post_type] ?? "글"}</Badge>
          <span className="min-w-0 flex-1 truncate font-medium">{p.title}</span>
          <time className="shrink-0 text-xs text-muted-foreground">
            {new Date(p.published_at).toLocaleDateString("ko-KR")}
          </time>
        </Link>
      ))}
    </div>
  );
}
