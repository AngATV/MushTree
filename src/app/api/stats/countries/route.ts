import { ensureSchema } from "@/lib/db";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  await ensureSchema();
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const bannerId = searchParams.get("bannerId");

  const rows = (await sql<{ country: string | null; clicks: number }>`
    SELECT country, COUNT(*)::int AS clicks
    FROM clicks
    WHERE (${bannerId}::text IS NULL OR banner_id = ${bannerId})
      AND (${from}::timestamptz IS NULL OR created_at >= ${from})
      AND (${to}::timestamptz IS NULL OR created_at < ${to})
    GROUP BY country
    ORDER BY clicks DESC
  `).rows;

  return Response.json({ rows });
}
