import { getAuthUserFromCookies } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  await ensureSchema();
  const { rows } = await sql`SELECT id, title, image_url AS "imageUrl", link_url AS "linkUrl", featured, category, tags, position, deposit_min AS "depositMin", bonus, cashback, free_spins AS "freeSpins", cta_label AS "ctaLabel", created_at AS "createdAt" FROM banners ORDER BY featured DESC, position ASC, created_at DESC`;
  return Response.json(rows);
}

export async function POST(req: Request) {
  const user = await getAuthUserFromCookies();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const { title, imageUrl, linkUrl, featured = false, category = null, tags = [], position = 0, depositMin = null, bonus = null, cashback = null, freeSpins = null, ctaLabel = null } = await req.json();
  if (!title || !imageUrl || !linkUrl) return new Response("Bad Request", { status: 400 });
  const id = crypto.randomUUID();
  const { rows } = await sql`INSERT INTO banners (id, title, image_url, link_url, featured, category, tags, position, deposit_min, bonus, cashback, free_spins, cta_label) VALUES (${id}, ${title}, ${imageUrl}, ${linkUrl}, ${featured}, ${category}, ${tags}, ${position}, ${depositMin}, ${bonus}, ${cashback}, ${freeSpins}, ${ctaLabel}) RETURNING id, title, image_url AS "imageUrl", link_url AS "linkUrl", featured, category, tags, position, deposit_min AS "depositMin", bonus, cashback, free_spins AS "freeSpins", cta_label AS "ctaLabel", created_at AS "createdAt"`;
  return Response.json(rows[0], { status: 201 });
}


