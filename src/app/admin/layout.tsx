import type { Metadata } from "next";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin – mushway.bet",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <AdminSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}


