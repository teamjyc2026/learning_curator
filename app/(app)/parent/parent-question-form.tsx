"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createParentQuestionAction,
  type ParentQuestionState,
} from "./actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";

export function ParentQuestionForm() {
  const [state, action, pending] = useActionState<ParentQuestionState, FormData>(
    createParentQuestionAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="space-y-3 rounded-xl border bg-card p-5"
    >
      <div className="space-y-1.5">
        <Label htmlFor="pq-title">제목</Label>
        <Input
          id="pq-title"
          name="title"
          required
          placeholder="예: 우리 아이 수학 학습 고민"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="pq-content">내용</Label>
        <Textarea
          id="pq-content"
          name="content"
          rows={5}
          required
          placeholder="자녀의 학습 상황과 고민을 자유롭게 적어 주세요. 작성한 글은 본인과 선생님만 볼 수 있어요."
        />
      </div>

      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      {state?.ok ? (
        <p className="text-sm text-primary">
          등록되었습니다. 선생님이 확인 후 답변드릴게요.
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "등록 중…" : "비밀글 등록"}
      </Button>
    </form>
  );
}
