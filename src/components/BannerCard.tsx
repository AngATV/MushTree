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
  variant?: "sm" | "md" | "lg" | "xl";
}) {
  const href = appendUtm(banner.href, utm);
  const isLarge = variant === "lg";
  const isMedium = variant === "md";
  const isXL = variant === "xl";
  // Tailles relevées pour plus de présence visuelle
  const imageHeightClass = isXL
    ? "h-[26rem] lg:h-[30rem]"
    : isLarge
    ? "h-80 lg:h-96"
    : isMedium
    ? "h-72 lg:h-80"
    : "h-56 lg:h-64";
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className={
        `group relative block overflow-hidden transition will-change-transform hover:-translate-y-0.5 ` +
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


