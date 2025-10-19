import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import { BannerCard } from "@/components/BannerCard";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function Home({ searchParams }: { searchParams?: SearchParams }) {
  await ensureSchema();
  const category = typeof searchParams?.category === "string" ? searchParams!.category : null;
  const tag = typeof searchParams?.tag === "string" ? searchParams!.tag : null;

  const { rows: categoryRows } = await sql<{ category: string }>`SELECT DISTINCT category FROM banners WHERE category IS NOT NULL ORDER BY category ASC`;
  const { rows: tagRows } = await sql<{ tag: string }>`SELECT DISTINCT unnest(tags) AS tag FROM banners WHERE tags IS NOT NULL AND array_length(tags,1) > 0 ORDER BY tag ASC`;

  const { rows: banners } = await sql<{
    id: string; title: string; imageUrl: string; linkUrl: string;
    featured: boolean; category: string | null; tags: string[] | null; position: number; createdAt: string
  }>`
    SELECT id, title, image_url AS "imageUrl", link_url AS "linkUrl", featured, category, tags, position, created_at AS "createdAt"
    FROM banners
    WHERE (${category}::text IS NULL OR category = ${category})
      AND (${tag}::text IS NULL OR ${tag} = ANY(tags))
    ORDER BY featured DESC, position ASC, created_at DESC
  `;
  const featured = banners.filter(b => b.featured);
  const others = banners.filter(b => !b.featured);
  const categories = categoryRows.map(r => r.category);
  const tags = tagRows.map(r => r.tag);
  const isActive = (k: string, v: string) => (searchParams?.[k] === v);

  return (
    <section className="container py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Offres casino</h1>
        <p className="text-white/60">Sélection d’offres mises à jour. Cliquez pour découvrir les promotions.</p>
      </header>

      <div className="sticky top-16 z-10 rounded-xl border border-white/10 bg-[#07161b]/70 backdrop-blur px-3 py-3 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-white/60 mr-1">Catégories:</span>
          <a href="/" className={`px-3 py-1.5 rounded-full text-sm border ${!category ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/40'}`}>Toutes</a>
          {categories.map((c) => (
            <a key={c} href={`/?category=${encodeURIComponent(c)}${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`} className={`px-3 py-1.5 rounded-full text-sm border ${isActive('category', c) ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/40'}`}>{c}</a>
          ))}
        </div>
        {tags.length ? (
          <div className="flex gap-2 items-center overflow-x-auto no-scrollbar py-1">
            <span className="text-sm text-white/60 mr-1">Tags:</span>
            <a href={`/${category ? `?category=${encodeURIComponent(category)}` : ''}`} className={`px-3 py-1.5 rounded-full text-sm border ${!tag ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/40'}`}>Tous</a>
            {tags.map((t) => (
              <a key={t} href={`/?${category ? `category=${encodeURIComponent(category)}&` : ''}tag=${encodeURIComponent(t)}`} className={`px-3 py-1.5 rounded-full text-sm border ${isActive('tag', t) ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/40'}`}>{t}</a>
            ))}
          </div>
        ) : null}
      </div>

      {featured.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-stretch">
          {/* Menu flottant à gauche (sidebar est déjà dans layout); ici on le masque pour garder la structure du hero */}
          <div className="hidden lg:block" />
          <div>
            <BannerCard variant="wide" href={`/api/r/${featured[0].id}`} src={featured[0].imageUrl} alt={featured[0].title} priority badge="Offre mise en avant" />
          </div>
        </div>
      ) : null}

      {others.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {others.map((b) => (
            <BannerCard key={b.id} variant="square" href={`/api/r/${b.id}`} src={b.imageUrl} alt={b.title} />
          ))}
        </div>
      ) : (!featured.length ? (
        <p className="text-white/70">Aucune bannière pour le moment.</p>
      ) : null)}
    </section>
  );
}


