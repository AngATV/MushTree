import BannerCard from "@/components/BannerCard";
import { banners } from "@/data/banners";

export default function Home() {
  const defaultUtm = {
    utm_source: "mushtree",
    utm_medium: "banner",
    utm_campaign: "affiliation",
  } as const;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Offres casino recommandées</h1>
        <p className="text-foreground/70 mt-2">
          Découvrez une sélection d’offres. Cliquez sur une bannière pour accéder à la
          promotion.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((b) => (
          <BannerCard key={b.id} banner={b} utm={defaultUtm} />
        ))}
      </div>
    </section>
  );
}
