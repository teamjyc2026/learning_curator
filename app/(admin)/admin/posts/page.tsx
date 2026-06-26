import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllPosts, getCategories } from "@/lib/queries/posts";
import { deletePostAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "블로그 관리" };

const statusLabel: Record<string, string> = {
  draft: "초안",
  published: "발행",
  archived: "보관",
};

export default async function AdminPostsPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getCategories(),
  ]);
  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">블로그 / 칼럼</h1>
        <Button size="sm" render={<Link href="/admin/posts/new" />}>
          <Plus className="size-4" />새 글
        </Button>
      </div>

      <div className="mt-6 divide-y rounded-xl border bg-card">
        {posts.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            아직 글이 없습니다. 첫 글을 작성해 보세요.
          </p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={post.status === "published" ? "default" : "secondary"}
                  >
                    {statusLabel[post.status]}
                  </Badge>
                  {post.category_id ? (
                    <span className="text-xs text-muted-foreground">
                      {catMap.get(post.category_id)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 truncate font-medium">{post.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  /{post.slug}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                render={<Link href={`/admin/posts/${post.id}/edit`} />}
              >
                편집
              </Button>
              <form action={deletePostAction}>
                <input type="hidden" name="id" value={post.id} />
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
