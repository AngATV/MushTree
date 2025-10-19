import type { Metadata } from "next";
import "./globals.css";
import ClientSidebar from "@/components/ClientSidebar";

export const metadata: Metadata = {
  title: "Linktree Casino",
  description: "Bannières casinos et tableau admin",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-dvh flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07161b]/70 backdrop-blur">
            <div className="container py-3 flex items-center justify-between">
              <div className="text-lg font-semibold bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">mushway.bet</div>
              <nav className="hidden sm:flex gap-4 text-sm text-white/80">
                <a href="/" className="hover:text-white">Offres</a>
              </nav>
            </div>
          </header>

          {/* Body with sidebar */}
          <div className="flex-1">
            <div className="container py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
              <ClientSidebar />
              <main>{children}</main>
            </div>
          </div>

          <footer className="border-t border-white/10">
            <div className="container py-8 text-sm text-white/70 grid gap-6 md:grid-cols-3">
              <div>
                <div className="font-semibold mb-2">mushway.bet</div>
              </div>
              <div>
                <div className="font-semibold mb-2">Liens</div>
                <ul className="space-y-1">
                  <li><a href="/" className="hover:underline">Offres</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-2">Légal</div>
                <ul className="space-y-1">
                  <li><a href="/mentions-legales" className="hover:underline">Mentions légales</a></li>
                </ul>
              </div>
              <div className="md:col-span-3 text-center text-white/50">© 2025</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}


