export type Lang = "fr" | "en";

export type BannerLabels = {
  deposit: string;
  bonus: string;
  cashback: string;
  freeSpins: string;
  cta: string;
};

export type Dict = {
  heroTitle: string;
  heroSubtitle: string;
  tags: string;
  banner: BannerLabels;
};

const fr: Dict = {
  heroTitle: "Notre sélection pour vous",
  heroSubtitle: "Les meilleurs casinos francophones",
  tags: "Tags:",
  banner: {
    deposit: "Dépôt",
    bonus: "Bonus",
    cashback: "Cashback",
    freeSpins: "Free Spins",
    cta: "Récupérer mon Bonus",
  },
};

const en: Dict = {
  heroTitle: "Casino offers",
  heroSubtitle: "Curated offers. Click to discover the latest promotions.",
  tags: "Tags:",
  banner: {
    deposit: "Deposit",
    bonus: "Bonus",
    cashback: "Cashback",
    freeSpins: "Free Spins",
    cta: "Claim my Bonus",
  },
};

export function getDict(langParam?: string | null): Dict {
  const lang = (langParam === "en" ? "en" : "fr") as Lang;
  return lang === "en" ? en : fr;
}


