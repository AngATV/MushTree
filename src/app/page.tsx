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

      {/* 3 colonnes sur desktop, 1 colonne sur mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {banners.map((b) => (
          <BannerCard key={b.id} banner={b} utm={defaultUtm} variant="md" />
        ))}
      </div>
    </section>
  );
}
