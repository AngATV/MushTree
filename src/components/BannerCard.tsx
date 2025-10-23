type Props = {
  href: string;
  src: string;
  alt: string;
  priority?: boolean;
  badge?: string;
  variant?: "wide" | "square"; // square pour la grille, wide pour le hero
  disabled?: boolean; // pour l'aperçu admin sans clic
  depositMin?: string | null;
  bonus?: string | null;
  cashback?: string | null;
  freeSpins?: string | null;
  ctaLabel?: string | null;
  labels?: { deposit: string; bonus: string; cashback: string; freeSpins: string; cta: string };
};

export function BannerCard({ href, src, alt, priority, badge, variant = "wide", disabled = false, depositMin, bonus, cashback, freeSpins, ctaLabel, labels }: Props) {
  const hasDeposit = !!(depositMin && depositMin.trim());
  const hasBonus = !!(bonus && bonus.trim());
  const hasCashback = !!(cashback && cashback.trim());
  const hasSpins = !!(freeSpins && freeSpins.trim());
  const hasAnyInfo = hasDeposit || hasBonus || hasCashback || hasSpins;

  return (
    <a href={disabled ? undefined : href} target={disabled ? undefined : "_blank"} rel={disabled ? undefined : "nofollow noopener noreferrer"} className={`block group ${disabled ? "pointer-events-none" : ""}`}>
      <div className={`w-full ${variant === "square" ? "aspect-square" : "h-[20vh] md:h-[24vh] lg:h-[28vh]"} flex items-center justify-center rounded-xl overflow-hidden relative group` }>
        {/* bouton info */}
        <button type="button" className="absolute top-2 right-2 z-10 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-black text-sm shadow hover:scale-105 transition" onClick={(e) => { e.preventDefault(); const dlg = (e.currentTarget.parentElement?.querySelector('.banner-info-dialog') as HTMLDialogElement|null); dlg?.showModal(); }} aria-label="Infos">
          i
        </button>
        {badge ? (
          <span className="absolute left-3 top-3 z-10 px-2.5 py-1 rounded-full text-xs font-semibold text-black" style={{
            backgroundImage: "linear-gradient(135deg,#f5d36c,#f1b84a)", boxShadow: "0 2px 10px rgba(245,211,108,0.35)"
          }}>{badge}</span>
        ) : null}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
          boxShadow: "inset 0 0 80px rgba(244,114,182,0.25), 0 0 50px rgba(251,191,36,0.35)",
          pointerEvents: 'none'
        }} />
        <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className={`w-full h-full ${variant === "square" ? "object-cover" : "object-contain"} transition-transform duration-300 ease-out group-hover:scale-[1.03]`} />
      </div>
      {/* dialog infos */}
      <dialog className="banner-info-dialog rounded-xl border border-white/10 bg-[#0b1216] text-white/90 p-0 w-[min(92vw,560px)]">
        <form method="dialog" className="p-3 border-b border-white/10 flex items-center justify-between">
          <div className="font-semibold text-sm">{alt}</div>
          <button className="text-white/70 hover:text-white">✕</button>
        </form>
        <div className="p-4 grid grid-cols-2 gap-3 text-sm">
          {hasDeposit ? (<div className="rounded-lg border border-white/10 px-3 py-2">{labels?.deposit ?? 'Dépôt'}: <span className="text-white">{depositMin}</span></div>) : null}
          {hasBonus ? (<div className="rounded-lg border border-white/10 px-3 py-2">{labels?.bonus ?? 'Bonus'}: <span className="text-white">{bonus}</span></div>) : null}
          {hasCashback ? (<div className="rounded-lg border border-white/10 px-3 py-2">{labels?.cashback ?? 'Cashback'}: <span className="text-white">{cashback}</span></div>) : null}
          {hasSpins ? (<div className="rounded-lg border border-white/10 px-3 py-2">{labels?.freeSpins ?? 'Free Spins'}: <span className="text-white">{freeSpins}</span></div>) : null}
        </div>
        {(ctaLabel && ctaLabel.trim()) ? (
          <div className="p-3 border-t border-white/10">
            <a className="inline-flex items-center justify-center w-full rounded-lg bg-gradient-to-r from-amber-300 via-rose-400 to-fuchsia-500 text-black font-semibold px-4 py-2.5 shadow-[0_6px_24px_rgba(251,191,36,0.25)] transform transition-transform duration-300 ease-out hover:scale-[1.03]" href={href}>
              {ctaLabel}
            </a>
          </div>
        ) : null}
      </dialog>
      {/* Strip infos + CTA (affichée si au moins une info ou CTA) */}
      {(hasAnyInfo || (ctaLabel && ctaLabel.trim())) && (
        <div className={`mt-2 grid ${variant === 'square' ? 'grid-cols-2' : 'grid-cols-2'} sm:grid-cols-2 gap-3 text-sm text-white/80`}>
          {hasDeposit && (
            <div className="rounded-lg border border-white/10 px-3 py-2">{labels?.deposit ?? 'Dépôt'}: <span className="text-white">{depositMin}</span></div>
          )}
          {hasBonus && (
            <div className="rounded-lg border border-white/10 px-3 py-2">{labels?.bonus ?? 'Bonus'}: <span className="text-white">{bonus}</span></div>
          )}
          {hasCashback && (
            <div className="rounded-lg border border-white/10 px-3 py-2">{labels?.cashback ?? 'Cashback'}: <span className="text-white">{cashback}</span></div>
          )}
          {hasSpins && (
            <div className="rounded-lg border border-white/10 px-3 py-2">{labels?.freeSpins ?? 'Free Spins'}: <span className="text-white">{freeSpins}</span></div>
          )}
          {(ctaLabel && ctaLabel.trim()) && (
            <a className="col-span-2 mt-1 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-300 via-rose-400 to-fuchsia-500 text-black font-semibold px-4 py-2.5 shadow-[0_6px_24px_rgba(251,191,36,0.25)] transform transition-transform duration-300 ease-out group-hover:scale-[1.03] hover:scale-[1.05]" href={href}>
              {ctaLabel || labels?.cta || 'Récupérer mon Bonus'}
            </a>
          )}
        </div>
      )}
    </a>
  );
}


