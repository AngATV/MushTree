import { sql } from "@vercel/postgres";
import { getAuthUserFromCookies } from "@/lib/auth";
import { AdminBannerForm } from "@/components/AdminBannerForm";
import { AdminBannerItem } from "@/components/AdminBannerItem";

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

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-3">Ajouter une bannière</h1>
        {/* Client form */}
        <AdminBannerForm />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Bannières</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {banners.map(b => (
            <div key={b.id} className="space-y-1">
              <AdminBannerItem banner={b} />
              <div className="text-xs text-white/50">{countById[b.id] ?? 0} clics</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


