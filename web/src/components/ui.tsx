"use client";

import { clsx } from "@/lib/clsx";
import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
}) {
  const variants = {
    primary: "bg-ink text-white hover:bg-maroon disabled:bg-ink/30",
    secondary: "bg-white text-ink border border-ink hover:bg-ink hover:text-white",
    danger: "bg-sale text-white hover:bg-maroon disabled:bg-sale/40",
    ghost: "text-muted hover:bg-cream normal-case tracking-normal",
  };
  const sizes = { sm: "px-2.5 py-1.5 text-xs", md: "px-4 py-2.5 text-[13px]" };
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 font-semibold uppercase tracking-wide transition disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full border border-line px-3 py-2 text-sm outline-none focus:border-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        "w-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      {children}
      {error && <span className="block text-xs text-sale">{error}</span>}
    </label>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("border border-line bg-white", className)}>{children}</div>;
}

export function Badge({ children, color = "gray" }: { children: React.ReactNode; color?: "gray" | "green" | "amber" | "indigo" | "red" }) {
  const colors = {
    gray: "bg-cream text-ink",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    indigo: "bg-ink/5 text-maroon",
    red: "bg-sale text-white",
  };
  return (
    <span className={clsx("inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", colors[color])}>
      {children}
    </span>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center justify-center p-8 text-muted", className)}>
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-brand-red" />
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="border border-dashed border-line p-10 text-center">
      <p className="font-medium text-ink">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}
