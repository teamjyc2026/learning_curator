import type { Metadata } from "next";
import Link from "next/link";
import {
  Gamepad2,
  ClipboardCheck,
  ArrowRight,
  ExternalLink,
  Plus,
} from "lucide-react";
import { getVisibleGames, visibilityLabel, type Game } from "@/entities/game";
import { Button } from "@/shared/ui/button";
import { AdminOnly } from "@/features/auth/session";
import { PageHeader } from "@/shared/ui/page-header";
import {
  Stagger,
  StaggerItem,
  HoverLift,
  Reveal,
} from "@/shared/ui/motion-primitives";
import { Badge } from "@/shared/ui/badge";

export const metadata: Metadata = { title: "학습 게임 · 자가진단" };

function GameCard({ game }: { game: Game }) {
  const newtab = game.game_type === "embed" && game.open_in === "newtab";
  const inner = (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-foreground/30">
      {game.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={game.thumbnail_url}
          alt=""
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent">
          <Gamepad2 className="size-10 text-primary/60" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{visibilityLabel[game.visibility]}</Badge>
          {newtab ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ExternalLink className="size-3" />새 탭
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 text-lg font-bold tracking-tight">{game.title}</h3>
        {game.description ? (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {game.description}
          </p>
        ) : null}
      </div>
    </div>
  );

  return newtab && game.embed_url ? (
    <a href={game.embed_url} target="_blank" rel="noreferrer noopener" className="h-full">
      {inner}
    </a>
  ) : (
    <Link href={`/games/${game.slug}`} className="h-full">
      {inner}
    </Link>
  );
}

export default async function GamesPage() {
  const games = await getVisibleGames();
  const diagnostics = games.filter((g) => g.game_type === "internal");
  const playGames = games.filter((g) => g.game_type === "embed");

  return (
    <>
      <PageHeader
        eyebrow="GAMES & DIAGNOSIS"
        title="학습 게임 · 자가진단"
        description="자가진단으로 나를 점검하고, 학습 게임으로 즐겁게 연습하세요."
      />

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">
        <AdminOnly>
          <div className="flex justify-end">
            <Button size="sm" render={<Link href="/admin/games/new" />}>
              <Plus className="size-4" />게임 추가
            </Button>
          </div>
        </AdminOnly>

        {/* 자가진단 (게임과 분리) */}
        {diagnostics.length > 0 ? (
          <section>
            <Reveal>
              <p className="text-sm font-bold tracking-[0.14em] text-primary">
                자가진단
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
                나를 점검하는 진단
              </h2>
            </Reveal>
            <Stagger className="mt-6 grid gap-5 md:grid-cols-2">
              {diagnostics.map((g) => (
                <StaggerItem key={g.id} className="h-full">
                  <HoverLift className="h-full">
                    <Link
                      href={`/games/${g.slug}`}
                      className="group flex h-full items-start gap-4 rounded-xl border border-primary/30 bg-primary-soft/60 p-6 transition-colors hover:border-primary/60"
                    >
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <ClipboardCheck className="size-6" />
                      </span>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold tracking-tight">
                          {g.title}
                        </h3>
                        {g.description ? (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {g.description}
                          </p>
                        ) : null}
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                          진단 시작하기
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  </HoverLift>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        ) : null}

        {/* 학습 게임 (외부 게임) */}
        <section>
          <Reveal>
            <p className="text-sm font-bold tracking-[0.14em] text-muted-foreground">
              학습 게임
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">
              즐기면서 익히는 학습 게임
            </h2>
          </Reveal>
          {playGames.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed bg-muted/20 p-12 text-center text-muted-foreground">
              아직 등록된 게임이 없습니다.
            </div>
          ) : (
            <Stagger className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {playGames.map((g) => (
                <StaggerItem key={g.id} className="h-full">
                  <HoverLift className="h-full">
                    <GameCard game={g} />
                  </HoverLift>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </section>
      </div>
    </>
  );
}
