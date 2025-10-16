import { sql } from "@vercel/postgres";

export async function GET() {
  const { rows } = await sql`SELECT banner_id AS "bannerId", COUNT(*)::int AS "count" FROM clicks GROUP BY banner_id`;
  return Response.json(rows);
}


