import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin – mushway.bet",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-6">
      {children}
    </div>
  );
}


