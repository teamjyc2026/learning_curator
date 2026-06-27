import type { Metadata } from "next";
import Link from "next/link";
import { Gamepad2, History } from "lucide-react";
import { getSessionContext } from "@/lib/auth/roles";
import { getBoardPosts } from "@/lib/queries/member-posts";
import { MemberPostList } from "@/components/member/post-list";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "학생" };

export default async function StudentHomePage() {
  const { profile } = await getSessionContext();
  const posts = await getBoardPosts("student");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">
        {profile?.nickname ?? "학생"}님, 환영합니다
      </h1>
      <p className="mt-1 text-muted-foreground">학습 공지·자료와 학습 게임 공간입니다.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/games" className="group">
          <Card className="h-full transition-colors group-hover:border-foreground/30">
            <CardHeader>
              <Gamepad2 className="size-6 text-foreground" />
              <CardTitle className="mt-1">학습 게임</CardTitle>
              <CardDescription>자가진단·수학 게임을 즐겨보세요.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/student/results" className="group">
          <Card className="h-full transition-colors group-hover:border-foreground/30">
            <CardHeader>
              <History className="size-6 text-foreground" />
              <CardTitle className="mt-1">내 진단 기록</CardTitle>
              <CardDescription>자가진단 결과 이력을 확인하세요.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-bold">공지 · 자료</h2>
        <MemberPostList posts={posts} emptyText="등록된 공지·자료가 없습니다." />
      </div>
    </div>
  );
}
