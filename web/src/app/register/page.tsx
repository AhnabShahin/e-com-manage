"use client";

import { Button, Field, Input } from "@/components/ui";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { roleHome } from "@/lib/roles";
import { clsx } from "@/lib/clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SignupRole = "customer" | "shop_owner";

export default function RegisterPage() {
  const { user, register } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<SignupRole>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace(roleHome(user.role));
  }, [user, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSubmitting(true);
    try {
      const u = await register({ name, email, password, password_confirmation: passwordConfirm, role });
      router.replace(roleHome(u.role));
    } catch (err) {
      setError(err instanceof ApiError ? (err.first() ?? err.message) : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-6 block text-center text-2xl font-bold text-indigo-600">ShopHub</Link>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Create account</h1>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["customer", "shop_owner"] as SignupRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={clsx(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition",
                  role === r ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-300 text-gray-600 hover:bg-gray-50",
                )}
              >
                {r === "customer" ? "Customer" : "Shop owner"}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {role === "customer" ? "Shop and place orders." : "Create products and manage shop listings."}
          </p>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            <Field label="Name">
              <Input value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
            </Field>
            <Field label="Email">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            <Field label="Password">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
            <Field label="Confirm password">
              <Input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required />
            </Field>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Creating…" : "Create account"}
            </Button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
