import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";
import { getDict } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import { BannerCard } from "@/components/BannerCard";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function Home({ searchParams }: { searchParams?: SearchParams }) {
  await ensureSchema();
  const langParam = typeof searchParams?.lang === 'string' ? (searchParams!.lang as string) : null;
  const dict = getDict(langParam);
  const tag = typeof searchParams?.tag === "string" ? searchParams!.tag : null;

  const { rows: tagRows } = await sql<{ tag: string }>`SELECT DISTINCT unnest(tags) AS tag FROM banners WHERE tags IS NOT NULL AND array_length(tags,1) > 0 ORDER BY tag ASC`;

  const { rows: banners } = await sql<{
    id: string; title: string; imageUrl: string; linkUrl: string;
    featured: boolean; category: string | null; tags: string[] | null; position: number; createdAt: string;
    depositMin: string | null; bonus: string | null; cashback: string | null; freeSpins: string | null; ctaLabel: string | null; bannerType: string | null
  }>`
    SELECT id, title, image_url AS "imageUrl", link_url AS "linkUrl", featured, category, tags, position,
           deposit_min AS "depositMin", bonus, cashback, free_spins AS "freeSpins", cta_label AS "ctaLabel", banner_type AS "bannerType",
           created_at AS "createdAt"
    FROM banners
    WHERE (${tag}::text IS NULL OR ${tag} = ANY(tags))
    ORDER BY featured DESC, position ASC, created_at DESC
  `;
  const featured = banners.filter(b => b.featured);
  const others = banners.filter(b => !b.featured);
  const tags = tagRows.map(r => r.tag);
  const isActive = (k: string, v: string) => (searchParams?.[k] === v);

  return (
    <section className="container py-10 space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{dict.heroTitle}</h1>
        <p className="text-white/70">{dict.heroSubtitle}</p>
      </header>

      {/* Tags retirés */}

      {featured.length ? (
        <div className="grid grid-cols-1 gap-6 items-stretch">
          <div className="mx-auto max-w-5xl w-full">
            <BannerCard
              variant={featured[0].bannerType === 'portrait' ? 'square' : 'wide'}
              href={`/api/r/${featured[0].id}`}
              src={featured[0].imageUrl}
              alt={featured[0].title}
              priority
              badge="Offre mise en avant"
              depositMin={featured[0].depositMin}
              bonus={featured[0].bonus}
              cashback={featured[0].cashback}
              freeSpins={featured[0].freeSpins}
              ctaLabel={featured[0].ctaLabel}
              labels={dict.banner}
            />
          </div>
        </div>
      ) : null}

      {others.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {others.map((b) => (
            <BannerCard key={b.id} variant={b.bannerType === 'landscape' ? 'wide' : b.bannerType === 'portrait' ? 'square' : 'square'} href={`/api/r/${b.id}`} src={b.imageUrl} alt={b.title}
              depositMin={b.depositMin} bonus={b.bonus} cashback={b.cashback} freeSpins={b.freeSpins} ctaLabel={b.ctaLabel} labels={dict.banner} />
          ))}
        </div>
      ) : (!featured.length ? (
        <p className="text-white/70">Aucune bannière pour le moment.</p>
      ) : null)}
    </section>
  );
}


