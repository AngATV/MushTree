import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin – mushway.bet",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-6 lg:col-span-2">
      <div className="mb-6 flex items-center gap-3 text-sm">
        <a href="/admin/dashboard" className="px-3 py-1.5 rounded border border-white/20 hover:border-white/40">Bannières</a>
        <a href="/admin/social" className="px-3 py-1.5 rounded border border-white/20 hover:border-white/40">Réseaux</a>
        <a href="/admin/trackings" className="px-3 py-1.5 rounded border border-white/20 hover:border-white/40">Trackings</a>
      </div>
      {children}
    </div>
  );
}


