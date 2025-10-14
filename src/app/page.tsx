import BannerCard from "@/components/BannerCard";
import { banners } from "@/data/banners";

export default function Home() {
  const defaultUtm = {
    utm_source: "mushtree",
    utm_medium: "banner",
    utm_campaign: "affiliation",
  } as const;

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="sr-only">
        <h1>Offres casino recommandées</h1>
        <p>Découvrez une sélection d’offres. Cliquez sur une bannière pour accéder à la promotion.</p>
      </div>

      {/* 1ère bannière en grand */}
      {banners[0] && (
        <div className="mb-4">
          <BannerCard banner={banners[0]} utm={defaultUtm} variant="md" />
        </div>
      )}

      {/* 2 suivantes côte à côte sur grand écran */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
        {banners.slice(1, 3).map((b) => (
          <BannerCard key={b.id} banner={b} utm={defaultUtm} />
        ))}
      </div>
    </section>
  );
}
