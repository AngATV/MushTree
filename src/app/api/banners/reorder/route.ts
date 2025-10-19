import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";
import { getAuthUserFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ReorderBody = { ids: string[] };

export async function POST(req: Request) {
  const user = await getAuthUserFromCookies();
  if (!user) return new Response("Unauthorized", { status: 401 });

  await ensureSchema();
  const body: ReorderBody = await req.json().catch(() => ({ ids: [] }));
  if (!body.ids || !Array.isArray(body.ids)) return new Response("Bad Request", { status: 400 });

  // Mettre à jour la position selon l'ordre reçu
  for (let index = 0; index < body.ids.length; index++) {
    const id = body.ids[index];
    await sql`UPDATE banners SET position=${index} WHERE id=${id}`;
  }

  return new Response(null, { status: 204 });
}


