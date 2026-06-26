import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSessionContext, primaryRedirect } from "@/lib/auth/roles";
import {
  audienceLabel,
  getMemberPostById,
  memberTypeLabel,
} from "@/lib/queries/member-posts";
import { RichContent } from "@/components/rich-content";
import { Badge } from "@/components/ui/badge";

export default async function MemberPostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, ctx] = await Promise.all([
    getMemberPostById(id),
    getSessionContext(),
  ]);
  if (!post) notFound();

  const back = primaryRedirect(ctx.roles);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href={back}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        목록으로
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge>{memberTypeLabel[post.post_type]}</Badge>
        <Badge variant="secondary">{audienceLabel[post.audience]}</Badge>
        {post.due_at ? (
          <span className="text-sm font-medium text-destructive">
            마감 {new Date(post.due_at).toLocaleString("ko-KR")}
          </span>
        ) : null}
      </div>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{post.title}</h1>
      <time className="mt-2 block text-sm text-muted-foreground">
        {new Date(post.published_at).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>

      <div className="mt-8">
        <RichContent content={post.content} format={post.content_format} />
      </div>
    </div>
  );
}
