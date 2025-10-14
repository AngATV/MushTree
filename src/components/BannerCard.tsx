"use client";

import Image from "next/image";
import { appendUtm, type UTMParams } from "@/lib/utm";
import type { Banner } from "@/data/banners";

export default function BannerCard({
  banner,
  utm,
}: {
  banner: Banner;
  utm: UTMParams;
}) {
  const href = appendUtm(banner.href, utm);
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className="group relative rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden p-4 flex items-center gap-4 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-foreground/20"
      style={{
        // fallback si pas de bg personnalisé
        backgroundImage: undefined,
      }}
    >
      <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${banner.bg ?? "from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800"}`} aria-hidden />
      <div className="shrink-0 rounded-xl bg-white/70 dark:bg-black/30 p-2 backdrop-blur">
        <Image
          src={banner.image.src}
          alt={banner.image.alt}
          width={banner.image.width}
          height={banner.image.height}
          className="object-contain"
        />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold truncate">{banner.title}</h3>
          {banner.badge ? (
            <span className="inline-flex items-center rounded-full bg-black/5 dark:bg-white/10 px-2 py-0.5 text-xs">
              {banner.badge}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-foreground/70 truncate">
          Cliquez pour découvrir l’offre →
        </p>
      </div>
    </a>
  );
}


