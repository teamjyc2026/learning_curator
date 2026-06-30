"use client";

import { useActionState } from "react";
import { savePostAction, type PostFormState } from "./actions";
import type { Category, Post } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { RichTextEditor } from "@/features/rich-editor";

const statusLabel: Record<string, string> = {
  draft: "임시저장(초안)",
  published: "발행됨",
  archived: "보관",
};

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

      <div className="space-y-1.5">
        <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={(post?.tags ?? []).join(", ")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cover">커버 이미지 {post?.cover_image_url ? "(교체 시에만)" : ""}</Label>
        <Input id="cover" name="cover" type="file" accept="image/*" />
      </div>

      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 border-t pt-5">
        <Button
          type="submit"
          name="intent"
          value="publish"
          disabled={pending}
        >
          {pending ? "저장 중…" : post?.status === "published" ? "발행 반영" : "발행하기"}
        </Button>
        <Button
          type="submit"
          name="intent"
          value="draft"
          variant="outline"
          disabled={pending}
        >
          임시저장
        </Button>
        {post ? (
          <span className="ml-1 text-sm text-muted-foreground">
            현재 상태: {statusLabel[post.status] ?? post.status}
          </span>
        ) : null}
      </div>
    </form>
  );
}
