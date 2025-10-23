"use client";

import { usePathname, useSearchParams } from "next/navigation";
import useSWR from "swr";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function ClientSidebar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const sp = useSearchParams();
  const lang = sp?.get("lang") ?? (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('lang') : null);
  const pendingText = lang === 'en' ? 'coming soon' : 'à venir';
  const { data } = useSWR("/api/settings/social", fetcher, { revalidateOnFocus: false });
  const map: Record<string, string> = {};
  (data?.links || []).forEach((l: any) => { map[l.platform] = l.url; });

  const Item = ({ href, label, pending }: { href?: string; label: string; pending?: boolean }) => (
    <a href={href || "#"} target={href && href.startsWith('http') ? "_blank" : undefined} rel={href && href.startsWith('http') ? "noopener noreferrer" : undefined} className="block px-3 py-2 rounded-lg hover:bg-white/10 border border-white/10">
      <div className="flex items-center justify-between gap-2">
        <span>{label}</span>
        {pending ? <span className="text-xs text-white/50">{pendingText}</span> : null}
      </div>
    </a>
  );

  const hasAny = !!(map.youtube || map.x || map.instagram || map.telegram);

  return (
    <aside className="hidden lg:block h-full pr-4 border-r border-white/10">
      <div className="text-sm font-semibold mb-3 text-white/80">{lang === 'en' ? 'Menu' : 'Menu'}</div>
      <nav className="grid gap-1 text-sm">
        <a href={lang ? `/?lang=${encodeURIComponent(lang)}` : '/'} className="px-2 py-1.5 rounded hover:text-white text-white/80">{lang === 'en' ? 'Casino offers' : 'Offres casino'}</a>
        <span className="px-2 py-1.5 rounded text-white/50">{lang === 'en' ? 'Mini games (coming soon)' : 'Mini-jeux (à venir)'}</span>
      </nav>
      {hasAny ? (
        <>
          <div className="mt-5 text-sm font-semibold mb-2 text-white/80">{lang === 'en' ? 'Socials' : 'Réseaux'}</div>
          <nav className="grid gap-1 text-sm">
            {map.youtube ? <a href={map.youtube} target="_blank" rel="noopener noreferrer" className="px-2 py-1.5 rounded hover:text-white text-white/80">Youtube</a> : null}
            {map.x ? <a href={map.x} target="_blank" rel="noopener noreferrer" className="px-2 py-1.5 rounded hover:text-white text-white/80">X</a> : null}
            {map.instagram ? <a href={map.instagram} target="_blank" rel="noopener noreferrer" className="px-2 py-1.5 rounded hover:text-white text-white/80">Instagram</a> : null}
            {map.telegram ? <a href={map.telegram} target="_blank" rel="noopener noreferrer" className="px-2 py-1.5 rounded hover:text-white text-white/80">Telegram</a> : null}
          </nav>
        </>
      ) : null}
    </aside>
  );
}


