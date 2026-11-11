"use client";

import { Button, Field, Input } from "@/components/ui";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { roleHome } from "@/lib/roles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DEMO = [
  { label: "Admin", email: "admin@example.com" },
  { label: "Owner · Alice", email: "alice@example.com" },
  { label: "Customer · Carol", email: "carol@example.com" },
];

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = () => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("redirect");
  };

  useEffect(() => {
    if (user) router.replace(redirectTo() || roleHome(user.role));
  }, [user, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSubmitting(true);
    try {
      const u = await login(email, password);
      router.replace(redirectTo() || roleHome(u.role));
    } catch (err) {
      setError(err instanceof ApiError ? (err.first() ?? err.message) : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 block text-center font-serif text-3xl font-bold tracking-[0.2em] text-brand-red">
          SHOPHUB
        </Link>
        <div className="border border-line bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-muted">Admin &amp; shop-owner access.</p>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            {error && <div className="bg-sale/5 px-3 py-2 text-sm text-maroon">{error}</div>}
            <Field label="Email">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            </Field>
            <Field label="Password">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-5 border-t border-cream pt-4">
            <p className="text-xs font-medium text-muted">Quick demo login (password: password)</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DEMO.map((d) => (
                <button
                  key={d.email}
                  onClick={() => fillDemo(d.email)}
                  className="border border-line px-2.5 py-1 text-xs text-muted hover:bg-cream"
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/register" className="text-brand-red hover:underline">
            Create an account
          </Link>
        </p>
        <p className="mt-1 text-center text-sm text-muted">
          <Link href="/shops" className="text-brand-red hover:underline">
            Continue as guest →
          </Link>
        </p>
      </div>
    </div>
  );
}
