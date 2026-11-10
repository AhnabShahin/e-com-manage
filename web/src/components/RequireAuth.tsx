"use client";

import { useAuth } from "@/lib/auth";
import { roleHome } from "@/lib/roles";
import type { Role } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "./ui";

/** Client-side route guard. Redirects to /login when unauthenticated or wrong role. */
export function RequireAuth({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (!roles.includes(user.role)) {
      router.replace(roleHome(user.role));
    }
  }, [user, loading, roles, router]);

  if (loading || !user || !roles.includes(user.role)) {
    return <Spinner className="min-h-screen" />;
  }

  return <>{children}</>;
}
