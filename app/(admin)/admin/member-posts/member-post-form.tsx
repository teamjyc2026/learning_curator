"use client";

import { useActionState } from "react";
import {
  saveMemberPostAction,
  type MemberPostFormState,
} from "./actions";
import type { MemberPost } from "@/lib/queries/member-posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MemberPostForm({ post }: { post?: MemberPost }) {
  const [state, action, pending] = useActionState<MemberPostFormState, FormData>(
    saveMemberPostAction,
    null,
  );

  return (
    <form action={action} className="space-y-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="space-y-1.5">
        <Label htmlFor="title">제목 *</Label>
        <Input id="title" name="title" defaultValue={post?.title ?? ""} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="audience">대상</Label>
          <Select name="audience" defaultValue={post?.audience ?? "all"}>
            <SelectTrigger id="audience">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 회원</SelectItem>
              <SelectItem value="parent">학부모</SelectItem>
              <SelectItem value="student">학생</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="post_type">유형</Label>
          <Select name="post_type" defaultValue={post?.post_type ?? "notice"}>
            <SelectTrigger id="post_type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="notice">공지</SelectItem>
              <SelectItem value="guide">안내</SelectItem>
              <SelectItem value="resource">자료</SelectItem>
              <SelectItem value="assignment">과제</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">상태</Label>
          <Select name="status" defaultValue={post?.status ?? "published"}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">발행</SelectItem>
              <SelectItem value="draft">초안</SelectItem>
              <SelectItem value="archived">보관</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">본문 (Markdown)</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={post?.content ?? ""}
          rows={12}
          className="font-mono text-sm"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="due_at">마감일 (과제, 선택)</Label>
          <Input
            id="due_at"
            name="due_at"
            type="datetime-local"
            defaultValue={post?.due_at ? post.due_at.slice(0, 16) : ""}
          />
        </div>
        <label className="flex items-center gap-2 pt-7 text-sm font-medium">
          <input
            type="checkbox"
            name="pinned"
            defaultChecked={post?.pinned ?? false}
            className="size-4 accent-primary"
          />
          상단 고정
        </label>
      </div>

      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "저장 중…" : "저장"}
      </Button>
    </form>
  );
}
