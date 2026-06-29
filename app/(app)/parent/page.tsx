import type { Metadata } from "next";
import { getSessionContext } from "@/entities/session";
import { getBoardPosts } from "@/entities/member-post";
import { MemberPostList } from "@/entities/member-post";
import { getMyQuestions } from "@/entities/parent-question";
import { Badge } from "@/shared/ui/badge";
import { ParentQuestionForm } from "./parent-question-form";

export const metadata: Metadata = { title: "학부모" };

export default async function ParentHomePage() {
  const { profile } = await getSessionContext();
  const [posts, questions] = await Promise.all([
    getBoardPosts("parent"),
    getMyQuestions(),
  ]);

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

      {/* 자녀의 학습 고민 — 비밀 게시판 */}
      <section className="mt-12 border-t pt-10">
        <h2 className="text-lg font-bold tracking-tight">
          자녀의 학습 고민을 나눠주세요
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          선생님과 1:1로 나누는 비밀 게시판입니다. 작성한 글은 본인과 선생님만 볼
          수 있어요.
        </p>

        <div className="mt-4">
          <ParentQuestionForm />
        </div>

        <div className="mt-6 space-y-3">
          {questions.length === 0 ? (
            <p className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
              아직 작성한 고민글이 없습니다.
            </p>
          ) : (
            questions.map((q) => (
              <article key={q.id} className="rounded-xl border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="break-keep font-bold tracking-tight">
                    {q.title}
                  </h3>
                  <Badge variant={q.answer ? "soft" : "secondary"}>
                    {q.answer ? "답변완료" : "대기중"}
                  </Badge>
                </div>
                <p className="mt-2 whitespace-pre-wrap break-keep text-sm text-muted-foreground">
                  {q.content}
                </p>
                <time className="mt-2 block text-xs text-muted-foreground">
                  {new Date(q.created_at).toLocaleDateString("ko-KR")}
                </time>
                {q.answer ? (
                  <div className="mt-3 rounded-lg border bg-muted/40 p-3">
                    <p className="text-xs font-bold text-primary">선생님 답변</p>
                    <p className="mt-1 whitespace-pre-wrap break-keep text-sm">
                      {q.answer}
                    </p>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
