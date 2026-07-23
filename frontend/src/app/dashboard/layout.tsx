import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your FlowPay payment activity, statistics, and recent transactions.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
