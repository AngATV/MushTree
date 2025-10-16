import { sql } from "@vercel/postgres";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { rows } = await sql<{ id: string; link_url: string }>`SELECT id, link_url FROM banners WHERE id=${params.id} LIMIT 1`;
  const banner = rows[0];
  if (!banner) return new Response("Not Found", { status: 404 });
  // Collecte minimale de tracking
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const id = crypto.randomUUID();
  await sql`INSERT INTO clicks (id, banner_id, ip, user_agent) VALUES (${id}, ${banner.id}, ${ip}, ${userAgent})`;
  return Response.redirect(banner.link_url, 302);
}


