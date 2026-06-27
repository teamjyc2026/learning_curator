import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getGameBySlug } from "@/entities/game";
import { getUser } from "@/entities/session";
import { FusionSelfCheck } from "@/features/game-self-check";
import { EmbeddedGame } from "@/features/game-embed";

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
          <FusionSelfCheck gameId={game.id} canSave={!!user} />
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
