"use client";

import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/shops", label: "Shops" },
  { href: "/admin/products", label: "Catalog" },
  { href: "/admin/users", label: "Staff" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/categories", label: "Categories" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={["admin"]}>
      <AppShell title="Admin panel" nav={nav}>
        {children}
      </AppShell>
    </RequireAuth>
  );
}
