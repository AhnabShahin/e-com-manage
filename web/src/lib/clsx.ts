type ClassValue = string | number | null | false | undefined;

/** Minimal className combiner. */
export function clsx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
