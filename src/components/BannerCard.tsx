"use client";

import Image from "next/image";
import { appendUtm, type UTMParams } from "@/lib/utm";
import type { Banner } from "@/data/banners";

export default function BannerCard({
  banner,
  utm,
  variant = "md",
}: {
  banner: Banner;
  utm: UTMParams;
  variant?: "md" | "lg";
}) {
  const href = appendUtm(banner.href, utm);
  const isLarge = variant === "lg";
  const isMedium = variant === "md";
  const imageHeightClass = isLarge
    ? "h-44 sm:h-52"
    : isMedium
    ? "h-36 sm:h-40"
    : "h-28 sm:h-32";
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className={
        `group relative block overflow-hidden rounded-xl border border-black/10 dark:border-white/10 ` +
        `shadow-sm hover:shadow-md transition will-change-transform hover:-translate-y-0.5 ` +
        `focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20`
      }
    >
      <Image
        src={banner.image.src}
        alt={banner.image.alt}
        width={banner.image.width}
        height={banner.image.height}
        priority={isLarge}
        sizes="(min-width: 1024px) 960px, 100vw"
        className={`w-full ${imageHeightClass} object-contain bg-transparent transition-transform duration-200 group-hover:scale-[1.01]`}
      />
    </a>
  );
}


