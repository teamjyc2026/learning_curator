import type { Metadata } from "next";
import { getCategories } from "@/entities/post";
import { PostForm } from "../post-form";

export const metadata: Metadata = { title: "새 글 작성" };

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categories = await getCategories();
  const defaultCategoryId = category
    ? categories.find((c) => c.slug === category)?.id
    : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">새 글 작성</h1>
      <PostForm categories={categories} defaultCategoryId={defaultCategoryId} />
    </div>
  );
}
