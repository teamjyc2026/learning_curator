import type { Metadata } from "next";
import Link from "next/link";
import { Gamepad2, History } from "lucide-react";
import { getSessionContext } from "@/lib/auth/roles";
import {
  getBoardPosts,
  getMyMemberPosts,
  getPendingMemberPosts,
} from "@/lib/queries/member-posts";
import { MemberBoard } from "@/components/member/member-board";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "학생" };

export default async function StudentHomePage() {
  const ctx = await getSessionContext();
  const isAdmin = ctx.roles.includes("admin");

  const board = await getBoardPosts("student");
  const myPosts = ctx.user ? await getMyMemberPosts(ctx.user.id) : [];
  const pending = isAdmin ? await getPendingMemberPosts("student") : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">
        {ctx.profile?.nickname ?? "학생"}님, 환영합니다
      </h1>
      <p className="mt-1 text-muted-foreground">학생 공간입니다.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/games" className="group">
          <Card className="h-full transition-colors group-hover:border-primary/50">
            <CardHeader>
              <Gamepad2 className="size-6 text-primary" />
              <CardTitle className="mt-1">학습 게임</CardTitle>
              <CardDescription>자가진단·수학 게임을 즐겨보세요.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/student/results" className="group">
          <Card className="h-full transition-colors group-hover:border-primary/50">
            <CardHeader>
              <History className="size-6 text-primary" />
              <CardTitle className="mt-1">내 진단 기록</CardTitle>
              <CardDescription>자가진단 결과 이력을 확인하세요.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div className="mt-8">
        <MemberBoard
          audience="student"
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
