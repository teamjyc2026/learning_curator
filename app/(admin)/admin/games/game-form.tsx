"use client";

import { useActionState, useState } from "react";
import { saveGameAction, type GameFormState } from "./actions";
import type { Game } from "@/lib/queries/games";
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

export function GameForm({ game }: { game?: Game }) {
  const [state, action, pending] = useActionState<GameFormState, FormData>(
    saveGameAction,
    null,
  );
  const [gameType, setGameType] = useState<string>(game?.game_type ?? "embed");

  return (
    <form action={action} className="space-y-5">
      {game ? <input type="hidden" name="id" value={game.id} /> : null}

      <div className="space-y-1.5">
        <Label htmlFor="title">제목 *</Label>
        <Input id="title" name="title" defaultValue={game?.title ?? ""} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="slug">슬러그 (비우면 자동)</Label>
          <Input id="slug" name="slug" defaultValue={game?.slug ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="game_type">유형</Label>
          <Select
            name="game_type"
            value={gameType}
            onValueChange={(v) => setGameType(v ?? "embed")}
          >
            <SelectTrigger id="game_type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="embed">외부 URL 임베드 (웹인웹)</SelectItem>
              <SelectItem value="internal">내장 게임</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {gameType === "embed" ? (
        <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
          <div className="space-y-1.5">
            <Label htmlFor="embed_url">임베드 URL (https://) *</Label>
            <Input
              id="embed_url"
              name="embed_url"
              type="url"
              placeholder="https://mathmind-calplus.my.canva.site/multiply"
              defaultValue={game?.embed_url ?? ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="open_in">열기 방식</Label>
            <Select name="open_in" defaultValue={game?.open_in ?? "iframe"}>
              <SelectTrigger id="open_in" className="min-w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iframe">페이지 안(iframe)</SelectItem>
                <SelectItem value="newtab">새 탭</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="internal_key">내장 게임 키</Label>
          <Input
            id="internal_key"
            name="internal_key"
            placeholder="fusion-self-check"
            defaultValue={game?.internal_key ?? ""}
          />
          <p className="text-xs text-muted-foreground">
            예: <code>fusion-self-check</code> (융합형 사고 자가진단)
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="description">설명</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={game?.description ?? ""}
          rows={3}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="visibility">공개 범위</Label>
          <Select name="visibility" defaultValue={game?.visibility ?? "public"}>
            <SelectTrigger id="visibility">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">전체 공개</SelectItem>
              <SelectItem value="student">학생 전용</SelectItem>
              <SelectItem value="member">회원 전용</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">상태</Label>
          <Select name="status" defaultValue={game?.status ?? "published"}>
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
        <div className="space-y-1.5">
          <Label htmlFor="sort_order">정렬 순서</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={game?.sort_order ?? 0}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="thumbnail">
          썸네일 {game?.thumbnail_url ? "(교체 시에만)" : ""}
        </Label>
        <Input id="thumbnail" name="thumbnail" type="file" accept="image/*" />
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
