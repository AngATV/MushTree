"use client";

import { usePathname } from "next/navigation";
import ClientSidebar from "@/components/ClientSidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="container py-6">
        {children}
      </div>
    );
  }

  return (
    <div className="container py-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      <ClientSidebar />
      <main>{children}</main>
    </div>
  );
}


