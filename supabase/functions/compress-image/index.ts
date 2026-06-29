import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import decodePng from "https://esm.sh/@jsquash/png@3/decode";
import encodeWebp from "https://esm.sh/@jsquash/webp@1/encode";

// 클라이언트(에디터)가 캔버스로 만든 PNG 바이트를 받아 WebP로 압축 →
// web-public 버킷에 업로드 → public URL 반환. 관리자/회원만 허용.
// (AVIF 인코딩은 WASM 메모리 사용량이 커 큰 이미지에서 워커 한도(546)를
//  초과하므로, 가볍고 빠른 WebP로 인코딩한다.)
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";

    // 1) 로그인 사용자 확인(회원도 게시글 이미지 업로드 가능)
    const userClient = createClient(url, anon, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
    } = await userClient.auth.getUser();
    if (!user) return json({ error: "unauthorized" }, 401);

    // 2) PNG 입력 → WebP 인코딩
    const input = new Uint8Array(await req.arrayBuffer());
    if (!input.length) return json({ error: "empty body" }, 400);

    const imageData = await decodePng(input);
    const webp = await encodeWebp(imageData, { quality: 80 });
    const webpBytes = new Uint8Array(webp);

    // 3) web-public 버킷 업로드(서비스 롤) → public URL
    const admin = createClient(url, service);
    const path = `editor/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.webp`;
    const { error: upErr } = await admin.storage
      .from("web-public")
      .upload(path, webpBytes, { contentType: "image/webp", upsert: false });
    if (upErr) return json({ error: upErr.message }, 500);

    const {
      data: { publicUrl },
    } = admin.storage.from("web-public").getPublicUrl(path);

    return json({ url: publicUrl, bytes: webpBytes.length });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
