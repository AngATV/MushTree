import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import { BannerCard } from "@/components/BannerCard";

export default async function Home() {
  await ensureSchema();
  const { rows: banners } = await sql<{ id: string; title: string; imageUrl: string; linkUrl: string; createdAt: string }>`
    SELECT id, title, image_url AS "imageUrl", link_url AS "linkUrl", created_at AS "createdAt" FROM banners ORDER BY created_at DESC
  `;
  const [first, ...rest] = banners;
  return (
    <section className="container py-10">
      <div className="space-y-6">
        {first ? (
          <BannerCard href={`/api/r/${first.id}`} src={first.imageUrl} alt={first.title} priority />
        ) : (
          <p className="text-white/70">Aucune bannière pour le moment.</p>
        )}
        {rest.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rest.slice(0, 2).map((b) => (
              <BannerCard key={b.id} href={`/api/r/${b.id}`} src={b.imageUrl} alt={b.title} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}


