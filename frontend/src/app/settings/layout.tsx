import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your FlowPay preferences, wallet, and display settings.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
