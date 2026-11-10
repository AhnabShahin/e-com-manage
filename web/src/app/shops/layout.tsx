import { StorefrontHeader } from "@/components/StorefrontHeader";

export default function StorefrontLayout({ children }: LayoutProps<"/shops">) {
  return (
    <div className="min-h-screen">
      <StorefrontHeader />
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
