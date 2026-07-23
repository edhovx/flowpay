import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments",
  description: "View and manage all your FlowPay payments and invoices.",
};

export default function PaymentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
