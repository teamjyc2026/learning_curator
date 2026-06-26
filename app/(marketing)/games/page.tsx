import type { Metadata } from "next";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { getVisibleGames, visibilityLabel } from "@/lib/queries/games";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "학습게임" };

export default async function GamesPage() {
  const games = await getVisibleGames();

  return (
    <>
      <PageHeader
        eyebrow="GAMES"
        title="학습 게임"
        description="자가진단과 수학 게임을 웹앱으로 바로 즐겨보세요."
      />
      <div className="mx-auto max-w-6xl px-4 py-10">
        {games.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/20 p-12 text-center text-muted-foreground">
            아직 등록된 게임이 없습니다.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((g) => (
              <Link
                key={g.id}
                href={`/games/${g.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/50"
              >
                {g.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.thumbnail_url}
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
                    <Badge variant="secondary">
                      {visibilityLabel[g.visibility]}
                    </Badge>
                  </div>
                  <h2 className="mt-2 text-lg font-bold tracking-tight">
                    {g.title}
                  </h2>
                  {g.description ? (
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                      {g.description}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
