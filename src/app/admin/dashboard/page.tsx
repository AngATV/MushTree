import { prisma } from "@/lib/prisma";
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
  const banners = await prisma.banner.findMany({ orderBy: { createdAt: "desc" } });
  const stats = await prisma.clickEvent.groupBy({ by: ["bannerId"], _count: { bannerId: true } });
  const countById = Object.fromEntries(stats.map(s => [s.bannerId, s._count.bannerId]));

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


