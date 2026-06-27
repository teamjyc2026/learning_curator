import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getPostById } from "@/entities/post";
import { PostForm } from "../../post-form";

export const metadata: Metadata = { title: "글 편집" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getPostById(id),
    getCategories(),
  ]);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">글 편집</h1>
      <PostForm categories={categories} post={post} />
    </div>
  );
}
