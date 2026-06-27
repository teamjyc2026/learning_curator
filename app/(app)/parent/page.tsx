import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getSessionContext } from "@/lib/auth/roles";
import { getVisibleMemberPosts } from "@/lib/queries/member-posts";
import { MemberPostList } from "@/components/member/member-post-list";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "학부모" };

export default async function ParentHomePage() {
  const [{ profile, roles }, posts] = await Promise.all([
    getSessionContext(),
    getVisibleMemberPosts(),
  ]);
  const admin = roles.includes("admin");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {profile?.nickname ?? "학부모"}님, 환영합니다
          </h1>
          <p className="mt-1 text-muted-foreground">
            학부모 전용 공지·안내·자료입니다.
          </p>
        </div>
        {admin ? (
          <Button size="sm" render={<Link href="/admin/member-posts/new" />}>
            <Plus className="size-4" />게시글 작성
          </Button>
        ) : null}
      </div>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-bold">공지 · 안내</h2>
        <MemberPostList
          posts={posts}
          filterTypes={["notice", "guide"]}
          emptyText="등록된 공지가 없습니다."
        />
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-bold">학습 자료</h2>
        <MemberPostList
          posts={posts}
          filterTypes={["resource"]}
          emptyText="등록된 자료가 없습니다."
        />
      </section>
    </div>
  );
}
