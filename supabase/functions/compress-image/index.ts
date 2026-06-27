import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import decodePng from "https://esm.sh/@jsquash/png@3/decode";
import encodeAvif from "https://esm.sh/@jsquash/avif@1/encode";

// 클라이언트(에디터)가 캔버스로 만든 PNG 바이트를 받아 AVIF로 압축 →
// web-public 버킷에 업로드 → public URL 반환. 관리자만 허용.
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

    // 2) PNG 입력 → AVIF 인코딩
    const input = new Uint8Array(await req.arrayBuffer());
    if (!input.length) return json({ error: "empty body" }, 400);

    const imageData = await decodePng(input);
    const avif = await encodeAvif(imageData, { quality: 55, speed: 6 });
    const avifBytes = new Uint8Array(avif);

    // 3) web-public 버킷 업로드(서비스 롤) → public URL
    const admin = createClient(url, service);
    const path = `editor/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.avif`;
    const { error: upErr } = await admin.storage
      .from("web-public")
      .upload(path, avifBytes, { contentType: "image/avif", upsert: false });
    if (upErr) return json({ error: upErr.message }, 500);

    const {
      data: { publicUrl },
    } = admin.storage.from("web-public").getPublicUrl(path);

    return json({ url: publicUrl, bytes: avifBytes.length });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
