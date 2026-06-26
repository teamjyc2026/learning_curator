import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  audienceLabel,
  getAllMemberPosts,
  memberTypeLabel,
} from "@/lib/queries/member-posts";
import { deleteMemberPostAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "회원게시글 관리" };

export default async function AdminMemberPostsPage() {
  const posts = await getAllMemberPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">회원게시글</h1>
        <Button size="sm" render={<Link href="/admin/member-posts/new" />}>
          <Plus className="size-4" />새 게시글
        </Button>
      </div>

      <div className="mt-6 divide-y rounded-xl border bg-card">
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
              <Badge variant="secondary">{memberTypeLabel[p.post_type]}</Badge>
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
