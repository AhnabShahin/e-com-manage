"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "@/lib/clsx";

export interface NavItem {
  href: string;
  label: string;
}

export function AppShell({ title, nav, children }: { title: string; nav: NavItem[]; children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-col border-r border-line bg-white sm:flex">
        <div className="border-b border-line px-5 py-5">
          <Link href="/" className="block font-serif text-xl font-bold tracking-[0.15em] text-brand-red">
            SHOPHUB
          </Link>
          <p className="text-[9px] font-semibold uppercase tracking-wide text-muted">by CSN Bangladesh Ltd.</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">{title}</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "block border-l-2 px-3 py-2 text-[13px] font-semibold uppercase tracking-wide transition",
                  active ? "border-brand-red bg-cream text-maroon" : "border-transparent text-muted hover:bg-cream",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-3">
          <Link href="/shops" className="block px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-muted hover:bg-cream">
            View storefront →
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-white px-6 py-3">
          <div className="flex gap-3 sm:hidden">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-xs font-semibold uppercase tracking-wide text-brand-red">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-ink">{user?.name}</p>
              <p className="text-xs text-muted">{user?.role_label}</p>
            </div>
            <button
              onClick={handleLogout}
              className="border border-ink px-3 py-1.5 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-ink hover:text-white"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
