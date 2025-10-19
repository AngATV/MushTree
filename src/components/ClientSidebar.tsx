"use client";

import { usePathname } from "next/navigation";
import useSWR from "swr";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function ClientSidebar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const { data } = useSWR("/api/settings/social", fetcher, { revalidateOnFocus: false });
  const map: Record<string, string> = {};
  (data?.links || []).forEach((l: any) => { map[l.platform] = l.url; });

  const Item = ({ href, label, pending }: { href?: string; label: string; pending?: boolean }) => (
    <a href={href || "#"} target={href ? "_blank" : undefined} className="block px-3 py-2 rounded-lg hover:bg-white/10 border border-white/10">
      <div className="flex items-center justify-between gap-2">
        <span>{label}</span>
        {pending ? <span className="text-xs text-white/50">à venir</span> : null}
      </div>
    </a>
  );

  return (
    <aside className="hidden lg:block h-fit sticky top-16 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="text-sm font-semibold mb-3 text-white/80">Menu</div>
      <div className="grid gap-2 text-sm">
        <Item href="/" label="Offres casino" />
        <Item label="Mini-jeux" pending />
      </div>
      <div className="mt-4 text-sm font-semibold mb-2 text-white/80">Réseaux</div>
      <div className="grid gap-2 text-sm">
        <Item href={map.youtube} label="Youtube" />
        <Item href={map.x} label="X" />
        <Item href={map.instagram} label="Instagram" />
        <Item href={map.telegram} label="Telegram" />
      </div>
    </aside>
  );
}


