import { prisma } from "@/lib/prisma";
import { BannerCard } from "@/components/BannerCard";

export default async function Home() {
  const banners = await prisma.banner.findMany({ orderBy: { createdAt: "desc" } });
  const [first, ...rest] = banners;
  return (
    <section className="container py-10">
      <div className="space-y-6">
        {first ? (
          <BannerCard href={`/api/r/${first.id}`} src={first.imageUrl} alt={first.title} priority />
        ) : null}
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


