import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameById } from "@/lib/queries/games";
import { GameForm } from "../../game-form";

export const metadata: Metadata = { title: "게임 편집" };

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGameById(id);
  if (!game) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">게임 편집</h1>
      <GameForm game={game} />
    </div>
  );
}
