import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
  description: "Complete history of all your FlowPay on-chain transactions.",
};

export default function TransactionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
