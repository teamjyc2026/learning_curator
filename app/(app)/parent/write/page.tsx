import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth/roles";
import { getMemberPostById } from "@/lib/queries/member-posts";
import { MemberWriteForm } from "@/components/member/member-write-form";

export const metadata: Metadata = { title: "학부모 글쓰기" };

export default async function ParentWritePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const ctx = await getSessionContext();

  let post = null;
  if (id) {
    post = await getMemberPostById(id);
    if (!post || post.audience !== "parent") notFound();
    const isAdmin = ctx.roles.includes("admin");
    if (!isAdmin && post.author_id !== ctx.user?.id) redirect("/parent");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">
        {post ? "글 수정" : "학부모 글쓰기"}
      </h1>
      <MemberWriteForm audience="parent" post={post ?? undefined} />
    </div>
  );
}
