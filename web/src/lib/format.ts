export function money(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export function priceRange(from: string | number | null, to: string | number | null): string {
  const f = money(from);
  const t = money(to);
  return f === t ? f : `${f} – ${t}`;
}
