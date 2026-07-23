import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Payment",
  description: "Set up a new escrow payment with split rules, deadlines, and dispute resolution.",
};

export default function CreatePaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
