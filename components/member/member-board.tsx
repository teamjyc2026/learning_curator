import Link from "next/link";
import { Plus, Pin } from "lucide-react";
import {
  approvalLabel,
  type MemberPost,
  type MemberPostWithAuthor,
} from "@/lib/queries/member-posts";
import {
  approveMemberPostAction,
  rejectMemberPostAction,
} from "@/app/(admin)/admin/member-posts/actions";
import { deleteMemberPost } from "@/app/(app)/member-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function fmt(v: string) {
  return new Date(v).toLocaleDateString("ko-KR");
}

export function MemberBoard({
  audience,
  board,
  myPosts,
  pending,
  isAdmin,
  userId,
}: {
  audience: "parent" | "student";
  board: MemberPostWithAuthor[];
  myPosts: MemberPost[];
  pending: MemberPostWithAuthor[] | null;
  isAdmin: boolean;
  userId: string | null;
}) {
  const label = audience === "parent" ? "학부모" : "학생";
  const writeHref = `/${audience}/write`;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{label} 게시판</h2>
        <Button size="sm" render={<Link href={writeHref} />}>
          <Plus className="size-4" />
          {label} 글쓰기
        </Button>
      </div>

      {/* 관리자: 승인 대기 */}
      {isAdmin && pending && pending.length > 0 ? (
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-primary">
            승인 대기 ({pending.length})
          </h3>
          <div className="divide-y rounded-xl border border-primary/30 bg-primary-soft/40">
            {pending.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-3 p-4">
                <Link href={`/posts/${p.id}`} className="min-w-0 flex-1">
                  <span className="font-medium">{p.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {p.authorName ?? "회원"} · {fmt(p.created_at)}
                  </span>
                </Link>
                <form action={approveMemberPostAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <Button type="submit" size="sm">
                    승인
                  </Button>
                </form>
                <form action={rejectMemberPostAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <Button type="submit" size="sm" variant="outline">
                    반려
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* 게시판(승인글) */}
      <div className="divide-y rounded-xl border bg-card">
        {board.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            아직 게시글이 없습니다.
          </p>
        ) : (
          board.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-4">
              <Link href={`/posts/${p.id}`} className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 font-medium">
                  {p.pinned ? <Pin className="size-3.5 text-primary" /> : null}
                  <span className="truncate">{p.title}</span>
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {p.authorName ?? "회원"} · {fmt(p.published_at)}
                </span>
              </Link>
              {isAdmin || p.author_id === userId ? (
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    render={<Link href={`${writeHref}?id=${p.id}`} />}
                  >
                    수정
                  </Button>
                  <form action={deleteMemberPost}>
                    <input type="hidden" name="id" value={p.id} />
                    <Button type="submit" size="sm" variant="ghost">
                      삭제
                    </Button>
                  </form>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>

      {/* 내 게시글 */}
      {myPosts.length > 0 ? (
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-muted-foreground">내 게시글</h3>
          <div className="divide-y rounded-xl border bg-card">
            {myPosts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-4">
                <Link href={`/posts/${p.id}`} className="min-w-0 flex-1">
                  <span className="truncate font-medium">{p.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {fmt(p.created_at)}
                  </span>
                </Link>
                <Badge
                  variant={
                    p.approval_status === "approved"
                      ? "default"
                      : p.approval_status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {approvalLabel[p.approval_status] ?? p.approval_status}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  render={<Link href={`${writeHref}?id=${p.id}`} />}
                >
                  수정
                </Button>
                <form action={deleteMemberPost}>
                  <input type="hidden" name="id" value={p.id} />
                  <Button type="submit" size="sm" variant="ghost">
                    삭제
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
