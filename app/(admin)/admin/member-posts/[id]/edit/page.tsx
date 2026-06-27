import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMemberPostById } from "@/entities/member-post";
import { MemberPostForm } from "../../member-post-form";

export const metadata: Metadata = { title: "회원게시글 편집" };

export default async function EditMemberPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getMemberPostById(id);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">회원게시글 편집</h1>
      <MemberPostForm post={post} />
    </div>
  );
}
