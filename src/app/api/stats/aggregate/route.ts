import { ensureSchema } from "@/lib/db";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function parseDate(s?: string | null) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET(req: Request) {
  await ensureSchema();
  const { searchParams } = new URL(req.url);
  const from = parseDate(searchParams.get("from"));
  const to = parseDate(searchParams.get("to"));
  const bannerId = searchParams.get("bannerId");
  const grain = searchParams.get("grain") || "day"; // day|week|month

  let dateTrunc = "day";
  if (grain === "week") dateTrunc = "week";
  if (grain === "month") dateTrunc = "month";

  const rows = (await sql<any>`
    SELECT date_trunc(${dateTrunc}::text, created_at) AS bucket,
           banner_id,
           COUNT(*)::int AS clicks
    FROM clicks
    WHERE (${bannerId}::text IS NULL OR banner_id = ${bannerId})
      AND (${from ? from.toISOString() : null}::timestamptz IS NULL OR created_at >= ${from ? from.toISOString() : null})
      AND (${to ? to.toISOString() : null}::timestamptz IS NULL OR created_at < ${to ? to.toISOString() : null})
    GROUP BY 1, 2
    ORDER BY bucket ASC
  `).rows;

  return Response.json({ rows });
}
