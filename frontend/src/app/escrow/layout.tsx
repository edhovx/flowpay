import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Escrow",
  description: "View all active escrow payments and their status.",
};

export default function EscrowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
