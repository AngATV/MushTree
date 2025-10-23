import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await ensureSchema();
    const { rows } = await sql<{ id: string; link_url: string }>`SELECT id, link_url FROM banners WHERE id=${params.id} LIMIT 1`;
    const banner = rows[0];
    if (!banner) return new Response("Not Found", { status: 404 });
    // Collecte minimale de tracking
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || null;
    const id = crypto.randomUUID();
    try {
      await sql`INSERT INTO clicks (id, banner_id, ip, user_agent, country) VALUES (${id}, ${banner.id}, ${ip}, ${userAgent}, ${country})`;
    } catch (e) {
      // Ne bloque pas la redirection si le tracking échoue
    }
    return Response.redirect(banner.link_url, 302);
  } catch (e) {
    // En dernier recours, éviter 500 et indiquer une erreur simple
    return new Response("Redirection error", { status: 302, headers: { Location: "/" } });
  }
}


