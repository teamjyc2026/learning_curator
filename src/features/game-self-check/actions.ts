"use server";

import { createClient } from "@/shared/lib/supabase/server";
import type { Json } from "@/shared/lib/supabase/database.types";

/** 로그인 사용자의 게임/자가진단 결과 저장. 비로그인 시 no-op. */
export async function saveGameResultAction(input: {
  gameId: string | null;
  internalKey: string;
  result: Json;
}): Promise<{ saved: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { saved: false };

  const { error } = await supabase.from("game_results").insert({
    game_id: input.gameId,
    internal_key: input.internalKey,
    user_id: user.id,
    result: input.result,
  });

  return { saved: !error };
}
