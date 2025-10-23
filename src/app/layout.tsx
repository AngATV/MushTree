import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import BgAnimation from "@/components/BgAnimation";

export const metadata: Metadata = {
  title: "Linktree Casino",
  description: "Bannières casinos et tableau admin",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-dvh flex flex-col">
          <BgAnimation />
          {/* Header */}
          <header className="sticky top-0 z-20 bg-gradient-to-r from-amber-200/20 via-rose-200/20 to-fuchsia-200/20 backdrop-blur">
            <div className="container py-3 flex items-center justify-between">
              <div className="text-lg font-semibold bg-gradient-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow">mushway.bet</div>
              <nav className="hidden sm:flex items-center gap-3 text-sm text-white/90">
                <a href="/?lang=fr" aria-label="Français / Canadien" className="hover:text-white text-lg">🇫🇷/🇨🇦</a>
                <a href="/?lang=en" aria-label="English" className="hover:text-white text-lg">🇬🇧</a>
              </nav>
            </div>
          </header>

          {/* Body with sidebar */}
          <div className="flex-1">
            <Suspense fallback={null}>
              <AppShell>{children}</AppShell>
            </Suspense>
          </div>

          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </div>
      </body>
    </html>
  );
}


