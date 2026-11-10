import { StorefrontHeader } from "@/components/StorefrontHeader";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <StorefrontHeader />
      <div className="mx-auto max-w-3xl px-6 py-8">{children}</div>
    </div>
  );
}
