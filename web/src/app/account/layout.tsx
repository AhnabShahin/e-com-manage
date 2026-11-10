"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { StorefrontHeader } from "@/components/StorefrontHeader";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <StorefrontHeader />
      <div className="mx-auto max-w-4xl px-6 py-8">
        <RequireAuth roles={["customer"]}>{children}</RequireAuth>
      </div>
    </div>
  );
}
