"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { createCategoryAction, type CategoryState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoryForm() {
  const [state, action, pending] = useActionState<CategoryState, FormData>(
    createCategoryAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success("카테고리가 추가되었습니다.");
      formRef.current?.reset();
    }
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-wrap items-end gap-2">
      <div className="flex-1 space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          카테고리 이름
        </label>
        <Input id="name" name="name" placeholder="예: 학습법" required />
      </div>
      <div className="flex-1 space-y-1.5">
        <label htmlFor="slug" className="text-sm font-medium">
          슬러그 (선택)
        </label>
        <Input id="slug" name="slug" placeholder="study-tips" />
      </div>
      <Button type="submit" disabled={pending}>
        추가
      </Button>
    </form>
  );
}
