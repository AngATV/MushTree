import type { Metadata } from "next";
import "./globals.css";

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
          <header className="sticky top-0 z-20 border-b border-white/10 bg-black/60 backdrop-blur">
            <div className="container py-3 flex items-center justify-between">
              <div className="text-lg font-semibold">MushTree</div>
              <nav className="hidden sm:flex gap-4 text-sm text-white/80">
                <a href="/" className="hover:text-white">Offres</a>
              </nav>
            </div>
          </header>

          {/* Body with sidebar */}
          <div className="flex-1">
            <div className="container py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
              {/* Sidebar */}
              <aside className="hidden lg:block border border-white/10 rounded-xl p-4 h-fit sticky top-[72px]">
                <div className="text-sm font-medium mb-3 text-white/70">Navigation</div>
                <ul className="space-y-2 text-sm">
                  <li><a href="/" className="hover:underline">Toutes les offres</a></li>
                </ul>
              </aside>

              {/* Main content */}
              <main>{children}</main>
            </div>
          </div>

          <footer className="border-t border-white/10">
            <div className="container py-8 text-sm text-white/70 grid gap-6 md:grid-cols-3">
              <div>
                <div className="font-semibold mb-2">MushTree</div>
                <p className="text-white/60">Offres casino sélectionnées. Suivi des clics et tableau admin.</p>
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
                  <li><a href="#" className="hover:underline">Mentions légales</a></li>
                  <li><a href="#" className="hover:underline">Contact</a></li>
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


