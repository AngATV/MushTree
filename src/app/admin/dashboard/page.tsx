import { sql } from "@vercel/postgres";
import { getAuthUserFromCookies } from "@/lib/auth";
import { AdminBannerForm } from "@/components/AdminBannerForm";
import { AdminBannerItem } from "@/components/AdminBannerItem";
import { AdminBannerGrid } from "@/components/AdminBannerGrid";
import { BannerCard } from "@/components/BannerCard";

export default async function DashboardPage() {
  const user = await getAuthUserFromCookies();
  if (!user) {
    return (
      <div className="container py-10">
        <p>Accès refusé. <a className="underline" href="/admin">Connectez-vous</a>.</p>
      </div>
    );
  }
  const { rows: banners } = await sql<{ id: string; title: string; imageUrl: string; linkUrl: string; featured: boolean; category: string | null; tags: string[] | null; position: number; createdAt: string }>`
    SELECT id, title, image_url AS "imageUrl", link_url AS "linkUrl", featured, category, tags, position, created_at AS "createdAt" FROM banners ORDER BY featured DESC, position ASC, created_at DESC`;
  const { rows: stats } = await sql<{ bannerId: string; count: number }>`
    SELECT banner_id AS "bannerId", COUNT(*)::int AS "count" FROM clicks GROUP BY banner_id`;
  const countById = Object.fromEntries(stats.map(s => [s.bannerId, s.count]));
  const featured = banners.filter(b => b.featured);
  const top = featured[0] ?? banners[0];
  const others = banners.filter(b => !top || b.id !== top.id);
  const { rows: totalClicksRows } = await sql<{ count: number }>`SELECT COUNT(*)::int AS count FROM clicks`;
  const { rows: todayClicksRows } = await sql<{ count: number }>`SELECT COUNT(*)::int AS count FROM clicks WHERE created_at::date = CURRENT_DATE`;
  const { rows: totalBannersRows } = await sql<{ count: number }>`SELECT COUNT(*)::int AS count FROM banners`;
  const totalClicks = totalClicksRows[0]?.count ?? 0;
  const todayClicks = todayClicksRows[0]?.count ?? 0;
  const totalBanners = totalBannersRows[0]?.count ?? 0;

  return (
    <div className="space-y-8">
      {/* Tuiles stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Bannières</div>
          <div className="text-2xl font-semibold">{totalBanners}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Clics (au total)</div>
          <div className="text-2xl font-semibold">{totalClicks}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-white/60">Clics (aujourd'hui)</div>
          <div className="text-2xl font-semibold">{todayClicks}</div>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Bannières</h1>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-medium mb-3">Ajouter une bannière</h2>
          <AdminBannerForm />
        </div>
      </div>

      {null}

      <div>
        <h2 className="text-xl font-semibold mb-3">Bannières</h2>
        <AdminBannerGrid initial={banners} />
      </div>
    </div>
  );
}


