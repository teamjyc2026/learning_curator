"use client";

import { useActionState } from "react";
import { savePostAction, type PostFormState } from "./actions";
import type { Category, Post } from "@/lib/queries/posts";
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
import { RichTextEditor } from "@/components/editor/rich-text-editor";

export function PostForm({
  categories,
  post,
  defaultCategoryId,
}: {
  categories: Category[];
  post?: Post;
  defaultCategoryId?: string;
}) {
  const [state, action, pending] = useActionState<PostFormState, FormData>(
    savePostAction,
    null,
  );

  return (
    <form action={action} className="space-y-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <div className="space-y-1.5">
        <Label htmlFor="title">제목 *</Label>
        <Input id="title" name="title" defaultValue={post?.title ?? ""} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="slug">슬러그 (비우면 자동 생성)</Label>
          <Input id="slug" name="slug" defaultValue={post?.slug ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category_id">카테고리</Label>
          <Select
            name="category_id"
            defaultValue={post?.category_id ?? defaultCategoryId ?? "none"}
            items={{
              none: "선택 안 함",
              ...Object.fromEntries(categories.map((c) => [c.id, c.name])),
            }}
          >
            <SelectTrigger id="category_id">
              <SelectValue placeholder="선택 안 함" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">선택 안 함</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="excerpt">요약</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          rows={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label>본문</Label>
        <RichTextEditor name="content" defaultValue={post?.content ?? ""} />
        <input type="hidden" name="content_format" value="html" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
          <Input
            id="tags"
            name="tags"
            defaultValue={(post?.tags ?? []).join(", ")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">상태</Label>
          <Select
            name="status"
            defaultValue={post?.status ?? "draft"}
            items={{ draft: "초안", published: "발행", archived: "보관" }}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">초안</SelectItem>
              <SelectItem value="published">발행</SelectItem>
              <SelectItem value="archived">보관</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cover">커버 이미지 {post?.cover_image_url ? "(교체 시에만)" : ""}</Label>
        <Input id="cover" name="cover" type="file" accept="image/*" />
      </div>

      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중…" : "저장"}
        </Button>
      </div>
    </form>
  );
}
