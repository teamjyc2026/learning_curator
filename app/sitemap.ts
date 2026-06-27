import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/entities/post";
import { getVisibleGames } from "@/entities/game";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/insights",
    "/services",
    "/resources",
    "/games",
    "/membership",
    "/about",
    "/consultation",
  ];

  const routes: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${BASE}${p}`,
  }));

  try {
    const [posts, games] = await Promise.all([
      getPublishedPosts(),
      getVisibleGames(),
    ]);
    for (const p of posts) routes.push({ url: `${BASE}/insights/${p.slug}` });
    for (const g of games) routes.push({ url: `${BASE}/games/${g.slug}` });
  } catch {
    // DB 미연결 시 정적 경로만 반환
  }

  return routes;
}
