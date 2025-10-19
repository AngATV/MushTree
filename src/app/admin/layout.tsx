import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin – mushway.bet",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      <aside className="hidden lg:block h-fit sticky top-16 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold mb-3">Administration</div>
        <nav className="text-sm space-y-2">
          <a href="/admin/dashboard" className="block hover:underline">Bannières</a>
          <a href="/" className="block hover:underline">Retour au site</a>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}


