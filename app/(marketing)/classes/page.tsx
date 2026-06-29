import type { Metadata } from "next";
import Link from "next/link";
import { Plus, MonitorPlay } from "lucide-react";
import {
  getPublishedPosts,
  ONLINE_CLASS_SLUG,
  firstContentImage,
} from "@/entities/post";
import { PageHeader } from "@/shared/ui/page-header";
import { AdminOnly } from "@/features/auth/session";
import { Button } from "@/shared/ui/button";
import {
  Stagger,
  StaggerItem,
  HoverLift,
} from "@/shared/ui/motion-primitives";

export const metadata: Metadata = { title: "온라인수업" };

export default async function ClassesPage() {
  const posts = await getPublishedPosts(ONLINE_CLASS_SLUG);

  return (
    <>
      <PageHeader
        eyebrow="Online Class"
        title="온라인수업"
        description="선생님이 진행하는 온라인 수업 공지입니다."
      />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <AdminOnly>
          <div className="mb-5 flex justify-end">
            <Button
              size="sm"
              render={
                <Link href={`/admin/posts/new?category=${ONLINE_CLASS_SLUG}`} />
              }
            >
              <Plus className="size-4" />수업 공지 작성
            </Button>
          </div>
        </AdminOnly>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/20 p-12 text-center text-muted-foreground">
            아직 등록된 수업 공지가 없습니다.
          </div>
        ) : (
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <StaggerItem key={post.id} className="h-full">
                <HoverLift className="h-full">
                  <Link
                    href={`/insights/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground/30"
                  >
                    {post.cover_image_url ?? firstContentImage(post.content) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          post.cover_image_url ??
                          firstContentImage(post.content) ??
                          undefined
                        }
                        alt=""
                        className="aspect-[16/9] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-muted to-accent">
                        <MonitorPlay className="size-9 text-muted-foreground/60" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="line-clamp-2 break-keep text-lg font-bold tracking-tight">
                        {post.title}
                      </h2>
                      {post.excerpt ? (
                        <p className="mt-2 line-clamp-2 break-keep text-sm text-muted-foreground">
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
            ))}
          </Stagger>
        )}
      </div>
    </>
  );
}
