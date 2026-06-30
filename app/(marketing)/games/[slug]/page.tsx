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
            <div className="relative">
              {/* 질문지 윗부분만 미리보기 — 아래로 갈수록 흐려짐, 조작 불가 */}
              <div
                aria-hidden
                className="pointer-events-none max-h-[380px] select-none overflow-hidden [mask-image:linear-gradient(to_bottom,black_0%,black_30%,transparent_95%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_30%,transparent_95%)]"
              >
                <FusionSelfCheck gameId={game.id} canSave={false} />
              </div>
              {/* 흐려진 영역 위 로그인 안내 */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-4 pb-2 text-center">
                <p className="text-lg font-extrabold tracking-tight">
                  로그인 후 진단을 시작할 수 있어요
                </p>
                <p className="max-w-sm break-keep text-sm text-muted-foreground">
                  융합형 사고 자가진단은 로그인한 회원만 진행할 수 있어요. 결과는
                  내 학습기록에 저장됩니다.
                </p>
                <Button
                  render={<Link href={`/login?redirect=/games/${slug}`} />}
                >
                  로그인하고 진단 시작하기
                </Button>
              </div>
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
