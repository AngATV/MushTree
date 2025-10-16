export function BannerCard({ href, src, alt, priority }: { href: string; src: string; alt: string; priority?: boolean }) {
  return (
    <a href={href} target="_blank" rel="nofollow noopener noreferrer" className="block">
      <div className="w-full h-64 sm:h-72 lg:h-80 flex items-center justify-center">
        <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className="w-full h-full object-contain" />
      </div>
    </a>
  );
}


