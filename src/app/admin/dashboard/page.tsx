import { sql } from "@vercel/postgres";
import { getAuthUserFromCookies } from "@/lib/auth";
import { AdminBannerForm } from "@/components/AdminBannerForm";

export default async function DashboardPage() {
  const user = await getAuthUserFromCookies();
  if (!user) {
    return (
      <div className="container py-10">
        <p>Accès refusé. <a className="underline" href="/admin">Connectez-vous</a>.</p>
      </div>
    );
  }
  const { rows: banners } = await sql<{ id: string; title: string; imageUrl: string; linkUrl: string; createdAt: string }>`
    SELECT id, title, image_url AS "imageUrl", link_url AS "linkUrl", created_at AS "createdAt" FROM banners ORDER BY created_at DESC`;
  const { rows: stats } = await sql<{ bannerId: string; count: number }>`
    SELECT banner_id AS "bannerId", COUNT(*)::int AS "count" FROM clicks GROUP BY banner_id`;
  const countById = Object.fromEntries(stats.map(s => [s.bannerId, s.count]));

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-3">Ajouter une bannière</h1>
        {/* Client form */}
        <AdminBannerForm onCreated={() => location.reload()} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Bannières</h2>
        <ul className="space-y-3">
          {banners.map(b => (
            <li key={b.id} className="p-3 rounded bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="font-medium">{b.title}</div>
                <div className="text-sm text-white/60">{b.linkUrl}</div>
              </div>
              <div className="text-sm">{countById[b.id] ?? 0} clics</div>
              <form action={`/api/banners/${b.id}`} method="post" className="ml-4">
                <input type="hidden" name="_method" value="DELETE" />
                {/* Fallback sans JS si on implémente une route POST method override */}
              </form>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


