import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { getSessionContext, primaryRedirect } from "@/lib/auth/roles";
import {
  approvalLabel,
  audienceLabel,
  getMemberPostById,
} from "@/lib/queries/member-posts";
import { deleteMemberPost } from "@/app/(app)/member-actions";
import { RichContent } from "@/components/rich-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const isAuthor = !!ctx.user && post.author_id === ctx.user.id;
  const canSeeAudience =
    post.audience === "all" || ctx.roles.includes(post.audience);

  // 가시성: 관리자/작성자는 항상, 그 외엔 승인 + audience 일치만
  const canView =
    isAdmin ||
    isAuthor ||
    (post.approval_status === "approved" && canSeeAudience);
  if (!canView) notFound();

  const canManage = isAdmin || isAuthor;
  const back = post.audience === "student" ? "/student" : "/parent";
  const writeBase = post.audience === "student" ? "/student" : "/parent";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={ctx.user ? back : primaryRedirect(ctx.roles)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          목록으로
        </Link>
        {canManage ? (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              render={<Link href={`${writeBase}/write?id=${post.id}`} />}
            >
              <Pencil className="size-3.5" />
              수정
            </Button>
            <form action={deleteMemberPost}>
              <input type="hidden" name="id" value={post.id} />
              <Button type="submit" size="sm" variant="ghost">
                삭제
              </Button>
            </form>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{audienceLabel[post.audience]}</Badge>
        {post.approval_status !== "approved" ? (
          <Badge
            variant={
              post.approval_status === "rejected" ? "destructive" : "secondary"
            }
          >
            {approvalLabel[post.approval_status] ?? post.approval_status}
          </Badge>
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
