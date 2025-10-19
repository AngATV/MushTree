import { sql } from "@vercel/postgres";
import { getAuthUserFromCookies } from "@/lib/auth";
import { AdminBannerForm } from "@/components/AdminBannerForm";
import { AdminBannerItem } from "@/components/AdminBannerItem";
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
  const others = banners.filter(b => !b.featured);

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">Administration</h1>
        <h2 className="text-xl font-semibold mb-3">Ajouter une bannière</h2>
        <AdminBannerForm />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Aperçu client</h2>
        {banners.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            <div className="hidden lg:block" />
            <div>
              <BannerCard variant="wide" href="#" src={(featured[0] ?? banners[0]).imageUrl} alt={(featured[0] ?? banners[0]).title} disabled />
            </div>
          </div>
        ) : (
          <p className="text-white/60">Aucune bannière à prévisualiser.</p>
        )}
        {others.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((b) => (
              <BannerCard key={b.id} variant="square" href="#" src={b.imageUrl} alt={b.title} disabled />
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Bannières</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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


