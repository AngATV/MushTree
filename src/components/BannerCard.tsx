export function BannerCard({ href, src, alt, priority, badge }: { href: string; src: string; alt: string; priority?: boolean; badge?: string }) {
  return (
    <a href={href} target="_blank" rel="nofollow noopener noreferrer" className="block group">
      <div className="w-full h-64 sm:h-72 lg:h-80 flex items-center justify-center rounded-xl overflow-hidden relative">
        {badge ? (
          <span className="absolute left-3 top-3 z-10 px-2.5 py-1 rounded-full text-xs font-semibold text-black" style={{
            backgroundImage: "linear-gradient(135deg,#f5d36c,#f1b84a)", boxShadow: "0 2px 10px rgba(245,211,108,0.35)"
          }}>{badge}</span>
        ) : null}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
          boxShadow: "inset 0 0 80px rgba(16,185,129,0.18), 0 0 40px rgba(245,211,108,0.25)",
          pointerEvents: 'none'
        }} />
        <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className="w-full h-full object-contain" />
      </div>
    </a>
  );
}


