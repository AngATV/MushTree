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
    <aside className="hidden lg:block h-screen sticky top-0 border-r border-white/10 bg-transparent">
      <div className="px-6 py-8 space-y-8">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-white/50 mb-2">{lang === 'en' ? 'Navigation' : 'Navigation'}</div>
          <nav className="grid text-sm">
            <a href={lang ? `/?lang=${encodeURIComponent(lang)}` : '/'} className="px-3 py-2 rounded-lg text-white/85 hover:text-white hover:bg-white/10">
              {lang === 'en' ? 'Casino offers' : 'Offres casino'}
            </a>
            <span className="px-3 py-2 rounded-lg text-white/50">
              {lang === 'en' ? 'Mini games (coming soon)' : 'Mini-jeux (à venir)'}
            </span>
          </nav>
        </div>

        <div className="h-px bg-white/10" />

        {hasAny ? (
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/50 mb-2">{lang === 'en' ? 'Socials' : 'Réseaux'}</div>
            <nav className="grid text-sm">
              {map.youtube ? (
                <a href={map.youtube} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg text-white/85 hover:text-white hover:bg-white/10 inline-flex items-center gap-2">
                  <YouTubeIcon /> <span>Youtube</span>
                </a>
              ) : null}
              {map.x ? (
                <a href={map.x} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg text-white/85 hover:text-white hover:bg-white/10 inline-flex items-center gap-2">
                  <XIcon /> <span>X</span>
                </a>
              ) : null}
              {map.instagram ? (
                <a href={map.instagram} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg text-white/85 hover:text-white hover:bg-white/10 inline-flex items-center gap-2">
                  <InstagramIcon /> <span>Instagram</span>
                </a>
              ) : null}
              {map.telegram ? (
                <a href={map.telegram} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg text-white/85 hover:text-white hover:bg-white/10 inline-flex items-center gap-2">
                  <TelegramIcon /> <span>Telegram</span>
                </a>
              ) : null}
            </nav>
          </div>
        ) : null}

        {hasAny ? <div className="h-px bg-white/10" /> : null}

        <div>
          <div className="text-[11px] uppercase tracking-wider text-white/50 mb-2">{lang === 'en' ? 'Languages' : 'Langues'}</div>
          <div className="flex gap-2">
            <a href="/?lang=fr" className={`px-3 py-1.5 rounded-full border ${lang !== 'en' ? 'bg-white text-black border-white' : 'border-white/20 text-white/85 hover:border-white/40'}`}>FR/CA</a>
            <a href="/?lang=en" className={`px-3 py-1.5 rounded-full border ${lang === 'en' ? 'bg-white text-black border-white' : 'border-white/20 text-white/85 hover:border-white/40'}`}>EN</a>
          </div>
        </div>
      </div>
    </aside>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="2" y="6" width="20" height="12" rx="3" ry="3" fill="currentColor" />
      <polygon points="10,9 16,12 10,15" fill="#0b0e19" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 4 L20 20" />
      <path d="M20 4 L4 20" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.5 3.5L2.5 11.5l6 2 2 6 4-5 5-11z" opacity=".9" />
    </svg>
  );
}


