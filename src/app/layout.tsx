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
          {null}

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


