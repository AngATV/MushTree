import BannerCard from "@/components/BannerCard";
import { banners } from "@/data/banners";

export default function Home() {
  const defaultUtm = {
    utm_source: "mushtree",
    utm_medium: "banner",
    utm_campaign: "affiliation",
  } as const;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="sr-only">
        <h1>Offres casino recommandées</h1>
        <p>Découvrez une sélection d’offres. Cliquez sur une bannière pour accéder à la promotion.</p>
      </div>

      {/* Mettre en avant Betify en grand, puis 2 bannières en dessous côte à côte */}
      {banners[0] && (
        <div className="mb-6">
          <BannerCard banner={banners[0]} utm={defaultUtm} variant="lg" />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
        {banners.slice(1, 3).map((b) => (
          <BannerCard key={b.id} banner={b} utm={defaultUtm} variant="md" />
        ))}
      </div>
    </section>
  );
}
