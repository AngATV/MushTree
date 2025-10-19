import { ensureSchema } from "@/lib/db";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TrackingsPage() {
  await ensureSchema();
  const { rows: counts } = await sql<{ id: string; title: string; clicks: number }>`
    SELECT b.id, b.title, COALESCE(COUNT(c.id),0) AS clicks
    FROM banners b
    LEFT JOIN clicks c ON c.banner_id = b.id
    GROUP BY b.id, b.title
    ORDER BY clicks DESC, b.title ASC
  `;
  const { rows: recent } = await sql<{ id: string; title: string; created_at: string }>`
    SELECT c.id, b.title, c.created_at
    FROM clicks c
    LEFT JOIN banners b ON b.id = c.banner_id
    ORDER BY c.created_at DESC
    LIMIT 50
  `;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Trackings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="font-medium mb-3">Clicks par bannière</div>
          <div className="space-y-2 text-sm">
            {counts.map(c => (
              <div key={c.id} className="flex justify-between gap-3">
                <span className="truncate">{c.title}</span>
                <span className="font-semibold">{Number(c.clicks)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="font-medium mb-3">50 derniers clics</div>
          <div className="space-y-2 text-sm">
            {recent.map(r => (
              <div key={r.id} className="flex justify-between gap-3">
                <span className="truncate">{r.title ?? '—'}</span>
                <span className="text-white/70">{new Date(r.created_at).toLocaleString("fr-FR")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
