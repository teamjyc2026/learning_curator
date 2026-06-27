import type { Metadata } from "next";
import { getSessionContext } from "@/lib/auth/roles";
import {
  getBoardPosts,
  getMyMemberPosts,
  getPendingMemberPosts,
} from "@/lib/queries/member-posts";
import { MemberBoard } from "@/components/member/member-board";

export const metadata: Metadata = { title: "학부모" };

export default async function ParentHomePage() {
  const ctx = await getSessionContext();
  const isAdmin = ctx.roles.includes("admin");

  const board = await getBoardPosts("parent");
  const myPosts = ctx.user ? await getMyMemberPosts(ctx.user.id) : [];
  const pending = isAdmin ? await getPendingMemberPosts("parent") : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">
        {ctx.profile?.nickname ?? "학부모"}님, 환영합니다
      </h1>
      <p className="mt-1 text-muted-foreground">
        학부모 게시판입니다. 글을 남기면 관리자 승인 후 게시됩니다.
      </p>

      <div className="mt-8">
        <MemberBoard
          audience="parent"
          board={board}
          myPosts={myPosts}
          pending={pending}
          isAdmin={isAdmin}
          userId={ctx.user?.id ?? null}
        />
      </div>
    </div>
  );
}
