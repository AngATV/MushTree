"use client";

import { useSearchParams } from "next/navigation";
import { getDict } from "@/lib/i18n";

export default function Footer() {
  const sp = useSearchParams();
  const lang = sp.get("lang");
  const dict = getDict(lang);

  const linksLabel = lang === "en" ? "Links" : "Liens";
  const legalLabel = lang === "en" ? "Legal" : "Légal";
  const offersLabel = lang === "en" ? "Offers" : "Offres";
  const mentionsLabel = lang === "en" ? "Legal notice" : "Mentions légales";
  const hrefOffers = lang ? `/?lang=${encodeURIComponent(lang)}` : "/";
  const hrefMentions = lang ? `/mentions-legales?lang=${encodeURIComponent(lang)}` : "/mentions-legales";

  return (
    <footer className="border-t border-white/10">
      <div className="container py-8 text-sm text-white/70 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold mb-2">mushway.bet</div>
        </div>
        <div>
          <div className="font-semibold mb-2">{linksLabel}</div>
          <ul className="space-y-1">
            <li><a href={hrefOffers} className="hover:underline">{offersLabel}</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">{legalLabel}</div>
          <ul className="space-y-1">
            <li><a href={hrefMentions} className="hover:underline">{mentionsLabel}</a></li>
          </ul>
        </div>
        <div className="md:col-span-3 text-center text-white/50">© 2025</div>
      </div>
    </footer>
  );
}


