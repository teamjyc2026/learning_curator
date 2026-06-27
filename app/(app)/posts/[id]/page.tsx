import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSessionContext, primaryRedirect } from "@/entities/session";
import { audienceLabel, getMemberPostById } from "@/entities/member-post";
import { RichContent } from "@/shared/ui/rich-content";
import { Badge } from "@/shared/ui/badge";

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

  const isAdmin = ctx.roles.includes("admin");
  const canSeeAudience =
    post.audience === "all" || ctx.roles.includes(post.audience);
  if (!isAdmin && !(post.status === "published" && canSeeAudience)) {
    notFound();
  }

  const back = post.audience === "student" ? "/student" : "/parent";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href={ctx.user ? back : primaryRedirect(ctx.roles)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        목록으로
      </Link>

      <div className="mt-6">
        <Badge>{audienceLabel[post.audience]}</Badge>
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
