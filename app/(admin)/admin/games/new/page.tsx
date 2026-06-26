import type { Metadata } from "next";
import { GameForm } from "../game-form";

export const metadata: Metadata = { title: "새 게임 등록" };

export default function NewGamePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">새 게임 등록</h1>
      <GameForm />
    </div>
  );
}
