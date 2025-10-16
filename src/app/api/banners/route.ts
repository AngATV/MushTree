import { getAuthUserFromCookies } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  await ensureSchema();
  const { rows } = await sql`SELECT id, title, image_url AS "imageUrl", link_url AS "linkUrl", created_at AS "createdAt" FROM banners ORDER BY created_at DESC`;
  return Response.json(rows);
}

export async function POST(req: Request) {
  const user = await getAuthUserFromCookies();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const { title, imageUrl, linkUrl } = await req.json();
  if (!title || !imageUrl || !linkUrl) return new Response("Bad Request", { status: 400 });
  const id = crypto.randomUUID();
  const { rows } = await sql`INSERT INTO banners (id, title, image_url, link_url) VALUES (${id}, ${title}, ${imageUrl}, ${linkUrl}) RETURNING id, title, image_url AS "imageUrl", link_url AS "linkUrl", created_at AS "createdAt"`;
  return Response.json(rows[0], { status: 201 });
}


