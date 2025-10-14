import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased light`}>
        <div className="min-h-dvh flex flex-col">
          {/* En-tête minimal sans marque visible */}
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-black/5" />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-black/5">
            <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-neutral-600 text-center">
              © {new Date().getFullYear()} MushTree
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
