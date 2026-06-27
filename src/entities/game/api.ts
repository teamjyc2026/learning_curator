import "server-only";
import { createClient } from "@/shared/lib/supabase/server";
import type { Tables } from "@/shared/lib/supabase/database.types";

export type Game = Tables<"games">;
export type GameResult = Tables<"game_results">;

export const visibilityLabel: Record<string, string> = {
  public: "전체 공개",
  student: "학생 전용",
  member: "회원 전용",
};

/** 공개적으로 볼 수 있는 게임(RLS가 visibility로 필터). */
export async function getVisibleGames(): Promise<Game[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("status", "published")
    .order("sort_order")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

export async function getAllGames(): Promise<Game[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select("*")
    .order("sort_order")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getGameById(id: string): Promise<Game | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data ?? null;
}

export async function getMyGameResults(): Promise<GameResult[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("game_results")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
