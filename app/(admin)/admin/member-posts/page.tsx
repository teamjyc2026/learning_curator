import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  approvalLabel,
  audienceLabel,
  getAllMemberPosts,
  getPendingMemberPosts,
} from "@/lib/queries/member-posts";
import {
  approveMemberPostAction,
  deleteMemberPostAction,
  rejectMemberPostAction,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "회원게시글 관리" };

export default async function AdminMemberPostsPage() {
  const [posts, pending] = await Promise.all([
    getAllMemberPosts(),
    getPendingMemberPosts(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">회원게시글</h1>
        <Button size="sm" render={<Link href="/admin/member-posts/new" />}>
          <Plus className="size-4" />새 게시글
        </Button>
      </div>

      {/* 승인 대기 */}
      {pending.length > 0 ? (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-bold text-primary">
            승인 대기 ({pending.length})
          </h2>
          <div className="divide-y rounded-xl border border-primary/30 bg-primary-soft/40">
            {pending.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-3 p-4">
                <Badge variant="secondary">{audienceLabel[p.audience]}</Badge>
                <Link href={`/posts/${p.id}`} className="min-w-0 flex-1 truncate font-medium">
                  {p.title}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {p.authorName ?? "회원"}
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

      <h2 className="mb-2 mt-8 text-sm font-bold text-muted-foreground">
        전체 게시글
      </h2>
      <div className="divide-y rounded-xl border bg-card">
        {posts.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            게시글이 없습니다.
          </p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-4">
              <Badge variant={p.status === "published" ? "default" : "secondary"}>
                {audienceLabel[p.audience]}
              </Badge>
              <Badge
                variant={
                  p.approval_status === "approved"
                    ? "soft"
                    : p.approval_status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
              >
                {approvalLabel[p.approval_status] ?? p.approval_status}
              </Badge>
              <span className="min-w-0 flex-1 truncate font-medium">
                {p.title}
              </span>
              <Button
                variant="outline"
                size="sm"
                render={<Link href={`/admin/member-posts/${p.id}/edit`} />}
              >
                편집
              </Button>
              <form action={deleteMemberPostAction}>
                <input type="hidden" name="id" value={p.id} />
                <Button variant="ghost" size="sm" type="submit">
                  삭제
                </Button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
