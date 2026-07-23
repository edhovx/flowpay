import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect Wallet",
  description: "Connect your wallet to start using FlowPay on Arc Testnet.",
};

export default function ConnectWalletLayout({ children }: { children: React.ReactNode }) {
  return children;
}
