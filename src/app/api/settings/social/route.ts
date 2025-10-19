import { ensureSchema } from "@/lib/db";
import { sql } from "@vercel/postgres";
import { getAuthUserFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  await ensureSchema();
  const { rows } = await sql<{ platform: string; url: string }>`SELECT platform, url FROM social_links ORDER BY platform ASC`;
  return Response.json({ links: rows });
}

export async function POST(req: Request) {
  await ensureSchema();
  const user = await getAuthUserFromCookies();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const { platform, url } = await req.json();
  if (!platform || !url) return Response.json({ error: "platform et url requis" }, { status: 400 });
  await sql`INSERT INTO social_links (platform, url) VALUES (${platform}, ${url})
            ON CONFLICT (platform) DO UPDATE SET url = EXCLUDED.url`;
  return new Response(null, { status: 204 });
}
