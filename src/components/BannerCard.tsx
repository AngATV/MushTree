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
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className={
        `group relative block rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden ` +
        `transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-foreground/20`
      }
    >
      <Image
        src={banner.image.src}
        alt={banner.image.alt}
        width={banner.image.width}
        height={banner.image.height}
        priority={isLarge}
        sizes="100vw"
        className={`${isLarge ? "w-full" : "w-full"} h-auto object-contain`}
      />
    </a>
  );
}


