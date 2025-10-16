import { getAuthUserFromCookies } from "@/lib/auth";
import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromCookies();
  if (!user) return new Response("Unauthorized", { status: 401 });
  await ensureSchema();
  const { title, imageUrl, linkUrl } = await req.json();
  const { rows } = await sql`UPDATE banners SET title=${title}, image_url=${imageUrl}, link_url=${linkUrl} WHERE id=${params.id} RETURNING id, title, image_url AS "imageUrl", link_url AS "linkUrl", created_at AS "createdAt"`;
  return Response.json(rows[0]);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromCookies();
  if (!user) return new Response("Unauthorized", { status: 401 });
  await ensureSchema();
  await sql`DELETE FROM clicks WHERE banner_id=${params.id}`;
  await sql`DELETE FROM banners WHERE id=${params.id}`;
  return new Response(null, { status: 204 });
}


