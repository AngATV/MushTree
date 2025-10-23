import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
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
          <header className="sticky top-0 z-20 bg-white/5 backdrop-blur-md relative overflow-hidden">
            {/* gradient + texture comme la sidebar */}
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0.02) 100%)` }} />
            <div aria-hidden className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: `repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 12px)` }} />
            <div className="py-3 px-6 flex items-center justify-between relative">
              <div className="text-lg font-semibold bg-gradient-to-r from-amber-300 via-rose-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow">mushway.bet</div>
            </div>
          </header>

          {/* Body with sidebar */}
          <div className="flex-1">
            <Suspense fallback={null}>
              <AppShell>{children}</AppShell>
            </Suspense>
          </div>

          {null}
        </div>
      </body>
    </html>
  );
}


