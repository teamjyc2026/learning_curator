import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllGames, visibilityLabel } from "@/entities/game";
import { deleteGameAction } from "./actions";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

export const metadata: Metadata = { title: "게임 관리" };

export default async function AdminGamesPage() {
  const games = await getAllGames();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">학습 게임</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            외부 URL(Canva 등)을 붙여넣어 웹인웹 게임을 등록하세요.
          </p>
        </div>
        <Button size="sm" render={<Link href="/admin/games/new" />}>
          <Plus className="size-4" />새 게임
        </Button>
      </div>

      <div className="mt-6 divide-y rounded-xl border bg-card">
        {games.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            게임이 없습니다.
          </p>
        ) : (
          games.map((g) => (
            <div key={g.id} className="flex items-center gap-3 p-4">
              <Badge variant={g.status === "published" ? "default" : "secondary"}>
                {visibilityLabel[g.visibility]}
              </Badge>
              <Badge variant="secondary">
                {g.game_type === "embed" ? "임베드" : "내장"}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{g.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {g.game_type === "embed" ? g.embed_url : g.internal_key} · /
                  {g.slug}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                render={<Link href={`/admin/games/${g.id}/edit`} />}
              >
                편집
              </Button>
              <form action={deleteGameAction}>
                <input type="hidden" name="id" value={g.id} />
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
