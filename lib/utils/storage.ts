import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { randomSuffix } from "./slug";

/**
 * 이미지 파일을 버킷에 업로드하고 public URL을 반환. 실패 시 null.
 * web-public 버킷은 admin RLS(authenticated + is_admin)로 쓰기 허용됨.
 */
export async function uploadImage(
  supabase: SupabaseClient<Database, "web">,
  bucket: string,
  file: File,
  prefix: string,
): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `${prefix}/${Date.now()}-${randomSuffix()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) return null;
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}
