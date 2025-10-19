"use client";

import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  if (!pathname.startsWith("/admin")) return null;

  const Item = ({ href, label }: { href: string; label: string }) => (
    <a href={href} className="block px-3 py-2 rounded-lg hover:bg-white/10 border border-white/10">
      {label}
    </a>
  );

  return (
    <aside className="hidden lg:block h-fit sticky top-16 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="text-sm font-semibold mb-3 text-white/80">Administration</div>
      <div className="grid gap-2 text-sm">
        <Item href="/admin/dashboard" label="Bannières" />
        <Item href="/admin/social" label="Réseaux" />
        <Item href="/admin/trackings" label="Trackings" />
      </div>
    </aside>
  );
}


