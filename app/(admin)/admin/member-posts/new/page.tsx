import type { Metadata } from "next";
import { MemberPostForm } from "../member-post-form";

export const metadata: Metadata = { title: "새 회원게시글" };

export default function NewMemberPostPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">새 회원게시글</h1>
      <MemberPostForm />
    </div>
  );
}
