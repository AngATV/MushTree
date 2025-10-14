export type Banner = {
  id: string;
  title: string;
  href: string; // lien d'affiliation complet (sans UTM par défaut)
  image: {
    src: string; // chemin public/ ou URL complète
    alt: string;
    width: number;
    height: number;
  };
  badge?: string; // ex: "Bonus 100%"
  bg?: string; // classes Tailwind (ex: "from-emerald-500 to-emerald-600")
};

// Exemple: remplacez ces entrées par vos bannières réelles
export const banners: Banner[] = [
  {
    id: "betify",
    title: "Betify",
    href:
      "https://record.betify.partners/_wLXf-tvyWLvqaEn2LeVpkWNd7ZgqdRLk/1/",
    image: { src: "/betify.jpg", alt: "Betify", width: 300, height: 90 },
    bg: "from-indigo-500 to-violet-600",
  },
  {
    id: "simsino",
    title: "Simsino",
    href:
      "https://record.simsinopartners.com/_docpt5G90-Ud2bMnnkYwymNd7ZgqdRLk/1/",
    image: { src: "/simsinos.jpg", alt: "Simsino", width: 300, height: 90 },
    bg: "from-emerald-500 to-teal-600",
  },
  {
    id: "fast-slots",
    title: "Fast Slots",
    href:
      "https://record.discasinoaffiliates.com/_WBdsD-Dyk6PFtc80AfYPBGNd7ZgqdRLk/1/",
    image: { src: "/fastslots.jpg", alt: "Fast Slots", width: 300, height: 90 },
    bg: "from-amber-500 to-orange-600",
  },
];


