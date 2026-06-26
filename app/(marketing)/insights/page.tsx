import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getPublishedPosts } from "@/lib/queries/posts";
import { PageHeader } from "@/components/layout/page-header";
import { Stagger, StaggerItem, HoverLift } from "@/components/motion/motion-primitives";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "인사이트" };

function chip(active: boolean) {
  return cn(
    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-foreground",
  );
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const [categories, posts] = await Promise.all([
    getCategories(),
    getPublishedPosts(topic),
  ]);
  const catMap = new Map(categories.map((c) => [c.id, c]));

  return (
    <>
      <PageHeader
        eyebrow="INSIGHTS"
        title="인사이트"
        description="교육·학습 설계, 입시 소식, 학습법 칼럼을 발행합니다."
      />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap gap-2">
          <Link href="/insights" className={chip(!topic)}>
            전체
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/insights?topic=${c.slug}`}
              className={chip(topic === c.slug)}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed bg-muted/20 p-12 text-center text-muted-foreground">
            아직 발행된 글이 없습니다.
          </div>
        ) : (
          <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const cat = post.category_id ? catMap.get(post.category_id) : null;
              return (
                <StaggerItem key={post.id} className="h-full">
                <HoverLift className="h-full">
                <Link
                  href={`/insights/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-colors hover:border-primary/50"
                >
                  {post.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image_url}
                      alt=""
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[16/9] w-full bg-gradient-to-br from-muted to-accent" />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    {cat ? (
                      <span className="text-xs font-bold tracking-wide text-primary">
                        {cat.name}
                      </span>
                    ) : null}
                    <h2 className="mt-1 line-clamp-2 text-lg font-bold tracking-tight">
                      {post.title}
                    </h2>
                    {post.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    ) : null}
                    {post.published_at ? (
                      <time className="mt-auto pt-3 text-xs text-muted-foreground">
                        {new Date(post.published_at).toLocaleDateString("ko-KR")}
                      </time>
                    ) : null}
                  </div>
                </Link>
                </HoverLift>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </div>
    </>
  );
}
