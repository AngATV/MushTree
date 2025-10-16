import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  await ensureSchema();
  const { rows } = await sql`SELECT banner_id AS "bannerId", COUNT(*)::int AS "count" FROM clicks GROUP BY banner_id`;
  return Response.json(rows);
}


