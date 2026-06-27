"use client";

import { useActionState } from "react";
import {
  submitMemberPost,
  type MemberWriteState,
} from "@/app/(app)/member-actions";
import type { MemberPost } from "@/lib/queries/member-posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/editor/rich-text-editor";

export function MemberWriteForm({
  audience,
  post,
}: {
  audience: "parent" | "student";
  post?: MemberPost;
}) {
  const [state, action, pending] = useActionState<MemberWriteState, FormData>(
    submitMemberPost,
    null,
  );

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="audience" value={audience} />
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="space-y-1.5">
        <Label htmlFor="title">제목 *</Label>
        <Input id="title" name="title" defaultValue={post?.title ?? ""} required />
      </div>

      <div className="space-y-1.5">
        <Label>내용</Label>
        <RichTextEditor name="content" defaultValue={post?.content ?? ""} />
      </div>

      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <p className="text-xs text-muted-foreground">
        작성한 글은 관리자 승인 후 게시판에 표시됩니다. (관리자는 즉시 게시)
      </p>

      <Button type="submit" disabled={pending}>
        {pending ? "저장 중…" : post ? "수정 저장" : "등록"}
      </Button>
    </form>
  );
}
