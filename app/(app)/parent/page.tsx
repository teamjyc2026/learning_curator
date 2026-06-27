import type { Metadata } from "next";
import { getSessionContext } from "@/entities/session";
import { getBoardPosts } from "@/entities/member-post";
import { MemberPostList } from "@/entities/member-post";

export const metadata: Metadata = { title: "학부모" };

export default async function ParentHomePage() {
  const { profile } = await getSessionContext();
  const posts = await getBoardPosts("parent");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">
        {profile?.nickname ?? "학부모"}님, 환영합니다
      </h1>
      <p className="mt-1 text-muted-foreground">
        학원에서 전하는 공지·안내·자료입니다.
      </p>

      <div className="mt-8">
        <MemberPostList posts={posts} emptyText="등록된 공지·자료가 없습니다." />
      </div>
    </div>
  );
}
