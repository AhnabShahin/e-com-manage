"use client";

import { AppShell } from "@/components/AppShell";
import { RequireAuth } from "@/components/RequireAuth";

const nav = [
  { href: "/dashboard", label: "My shops" },
  { href: "/dashboard/catalog", label: "Browse catalog" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={["shop_owner", "admin"]}>
      <AppShell title="Shop owner" nav={nav}>
        {children}
      </AppShell>
    </RequireAuth>
  );
}
