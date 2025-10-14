import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MushTree - Offres d’affiliation casino",
  description: "Sélection de bannières et offres d’affiliation casino.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"),
  openGraph: {
    title: "MushTree - Offres d’affiliation casino",
    description: "Découvrez des offres sélectionnées, mises à jour et prêtes à convertir.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "MushTree - Offres d’affiliation casino",
    description: "Sélection d’offres d’affiliation casino.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <div className="min-h-dvh flex flex-col">
            <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-black/5 dark:border-white/10">
              <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <div className="text-base font-semibold tracking-tight">MushTree</div>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-black/5 dark:border-white/10">
              <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-foreground/70">
                © {new Date().getFullYear()} MushTree
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
