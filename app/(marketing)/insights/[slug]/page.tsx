import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { getPublishedPostBySlug } from "@/lib/queries/posts";
import { createClient } from "@/lib/supabase/server";
import { RichContent } from "@/components/rich-content";
import { AdminOnly } from "@/components/auth/session";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "글을 찾을 수 없음" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  // 카테고리 이름 조회(별도 — 임베드 미사용)
  let categoryName: string | null = null;
  if (post.category_id) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("post_categories")
      .select("name")
      .eq("id", post.category_id)
      .maybeSingle();
    categoryName = data?.name ?? null;
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/insights"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          인사이트 목록
        </Link>
        <AdminOnly>
          <Button
            size="sm"
            variant="outline"
            render={<Link href={`/admin/posts/${post.id}/edit`} />}
          >
            <Pencil className="size-3.5" />
            수정
          </Button>
        </AdminOnly>
      </div>

      <header className="mt-6">
        {categoryName ? (
          <span className="text-sm font-bold tracking-wide text-primary">
            {categoryName}
          </span>
        ) : null}
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
          {post.title}
        </h1>
        {post.published_at ? (
          <time className="mt-3 block text-sm text-muted-foreground">
            {new Date(post.published_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        ) : null}
      </header>

      {post.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt=""
          className="mt-6 aspect-[16/9] w-full rounded-xl object-cover"
        />
      ) : null}

      <div className="mt-8">
        <RichContent content={post.content} format={post.content_format} />
      </div>
    </article>
  );
}
