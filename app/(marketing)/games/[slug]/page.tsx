import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getGameBySlug } from "@/entities/game";
import { getUser } from "@/entities/session";
import { FusionSelfCheck } from "@/features/game-self-check";
import { EmbeddedGame } from "@/features/game-embed";
import { Button } from "@/shared/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  return { title: game?.title ?? "게임" };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [game, user] = await Promise.all([getGameBySlug(slug), getUser()]);
  if (!game) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/games"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        학습 게임 목록
      </Link>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
        {game.title}
      </h1>
      {game.description ? (
        <p className="mt-2 text-muted-foreground">{game.description}</p>
      ) : null}

      <div className="mt-6">
        {game.game_type === "internal" &&
        game.internal_key === "fusion-self-check" ? (
          user ? (
            <FusionSelfCheck gameId={game.id} canSave />
          ) : (
            <div className="rounded-xl border border-dashed bg-muted/20 p-12 text-center">
              <p className="font-semibold">로그인 후 이용할 수 있어요</p>
              <p className="mx-auto mt-2 max-w-sm break-keep text-sm text-muted-foreground">
                융합형 사고 자가진단은 로그인한 회원만 진행할 수 있습니다. 결과는
                내 학습기록에 저장돼요.
              </p>
              <Button
                className="mt-5"
                render={
                  <Link href={`/login?redirect=/games/${slug}`} />
                }
              >
                로그인하고 진단 시작하기
              </Button>
            </div>
          )
        ) : game.game_type === "embed" && game.embed_url ? (
          <EmbeddedGame
            url={game.embed_url}
            title={game.title}
            openIn={game.open_in}
          />
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 p-12 text-center text-muted-foreground">
            준비 중인 게임입니다.
          </div>
        )}
      </div>
    </div>
  );
}
