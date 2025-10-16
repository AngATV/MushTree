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
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/10">
            <div className="container py-6 text-center text-sm text-white/60">© 2025</div>
          </footer>
        </div>
      </body>
    </html>
  );
}


