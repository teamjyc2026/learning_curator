import type { Metadata } from "next";
import { getCategories } from "@/entities/post";
import { deleteCategoryAction } from "./actions";
import { CategoryForm } from "./category-form";
import { Button } from "@/shared/ui/button";

export const metadata: Metadata = { title: "카테고리 관리" };

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">카테고리</h1>
      <p className="mt-1 text-muted-foreground">
        인사이트 글의 토픽 분류를 관리합니다.
      </p>

      <div className="mt-6 rounded-xl border bg-card p-5">
        <CategoryForm />
      </div>

      <div className="mt-6 divide-y rounded-xl border bg-card">
        {categories.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            카테고리가 없습니다.
          </p>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-4">
              <div className="flex-1">
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">/{c.slug}</p>
              </div>
              <form action={deleteCategoryAction}>
                <input type="hidden" name="id" value={c.id} />
                <Button variant="ghost" size="sm" type="submit">
                  삭제
                </Button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
