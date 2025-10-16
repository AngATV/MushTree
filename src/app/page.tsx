import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import { BannerCard } from "@/components/BannerCard";

export default async function Home() {
  await ensureSchema();
  const { rows: banners } = await sql<{ id: string; title: string; imageUrl: string; linkUrl: string; featured: boolean; category: string | null; tags: string[] | null; position: number; createdAt: string }>`
    SELECT id, title, image_url AS "imageUrl", link_url AS "linkUrl", featured, category, tags, position, created_at AS "createdAt" FROM banners ORDER BY featured DESC, position ASC, created_at DESC
  `;
  const featured = banners.filter(b => b.featured);
  const others = banners.filter(b => !b.featured);
  return (
    <section className="container py-10">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Offres casino</h1>
          <p className="text-white/60">Sélection d’offres mises à jour. Cliquez pour découvrir les promotions.</p>
        </header>

        {/* Section mise en avant */}
        {featured.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2">
              <BannerCard href={`/api/r/${featured[0].id}`} src={featured[0].imageUrl} alt={featured[0].title} priority />
            </div>
            <div className="grid grid-cols-1 gap-6">
              {featured.slice(1, 3).map((b) => (
                <BannerCard key={b.id} href={`/api/r/${b.id}`} src={b.imageUrl} alt={b.title} />
              ))}
            </div>
          </div>
        ) : null}

        {/* Grille des autres offres */}
        {others.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((b) => (
              <BannerCard key={b.id} href={`/api/r/${b.id}`} src={b.imageUrl} alt={b.title} />
            ))}
          </div>
        ) : !featured.length ? (
          <p className="text-white/70">Aucune bannière pour le moment.</p>
        ) : null}
      </div>
    </section>
  );
}


