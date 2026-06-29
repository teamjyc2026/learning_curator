import type { Metadata } from "next";
import { getAllParentQuestions } from "@/entities/parent-question";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { answerParentQuestionAction } from "./actions";

export const metadata: Metadata = { title: "학부모 상담글" };

export default async function AdminParentQuestionsPage() {
  const questions = await getAllParentQuestions();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">학부모 상담글</h1>
      <p className="mt-1 text-muted-foreground">
        학부모가 비공개로 남긴 자녀의 학습 고민입니다. 답변을 등록하면 작성한
        학부모에게 표시됩니다.
      </p>

      <div className="mt-6 space-y-4">
        {questions.length === 0 ? (
          <p className="rounded-xl border border-dashed bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            접수된 상담글이 없습니다.
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
              <p className="mt-1 text-xs text-muted-foreground">
                {q.authorName ?? "학부모"} ·{" "}
                {new Date(q.created_at).toLocaleDateString("ko-KR")}
              </p>
              <p className="mt-2 whitespace-pre-wrap break-keep text-sm text-muted-foreground">
                {q.content}
              </p>

              <form
                action={answerParentQuestionAction}
                className="mt-4 space-y-2 border-t pt-4"
              >
                <input type="hidden" name="id" value={q.id} />
                <Textarea
                  name="answer"
                  rows={3}
                  defaultValue={q.answer ?? ""}
                  placeholder="답변을 입력하세요."
                />
                <Button type="submit" size="sm">
                  {q.answer ? "답변 수정" : "답변 등록"}
                </Button>
              </form>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
