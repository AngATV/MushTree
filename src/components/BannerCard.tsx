type Props = {
  href: string;
  src: string;
  alt: string;
  priority?: boolean;
  badge?: string;
  variant?: "wide" | "square"; // square pour la grille, wide pour le hero
  disabled?: boolean; // pour l'aperçu admin sans clic
};

export function BannerCard({ href, src, alt, priority, badge, variant = "wide", disabled = false }: Props) {
  return (
    <a href={disabled ? undefined : href} target={disabled ? undefined : "_blank"} rel={disabled ? undefined : "nofollow noopener noreferrer"} className={`block group ${disabled ? "pointer-events-none" : ""}`}>
      <div className={`w-full ${variant === "square" ? "aspect-square" : "aspect-[21/9]"} flex items-center justify-center rounded-xl overflow-hidden relative`}>
        {badge ? (
          <span className="absolute left-3 top-3 z-10 px-2.5 py-1 rounded-full text-xs font-semibold text-black" style={{
            backgroundImage: "linear-gradient(135deg,#f5d36c,#f1b84a)", boxShadow: "0 2px 10px rgba(245,211,108,0.35)"
          }}>{badge}</span>
        ) : null}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
          boxShadow: "inset 0 0 80px rgba(16,185,129,0.18), 0 0 40px rgba(245,211,108,0.25)",
          pointerEvents: 'none'
        }} />
        <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className={`w-full h-full ${variant === "square" ? "object-cover" : "object-contain"}`} />
      </div>
    </a>
  );
}


