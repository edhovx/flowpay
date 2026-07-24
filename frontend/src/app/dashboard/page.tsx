"use client";

import { AppShell } from "@/components/layout/app-shell";
import { StatusColor } from "@/components/status-color";
import { EmptyState } from "@/components/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAccount } from "wagmi";
import { usePaymentsByBuyer } from "@/hooks/use-escrow";
import { formatAmount } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const STATUS_NAMES = ["pending", "funded", "delivered", "completed", "disputed", "refunded", "cancelled"];

export default function DashboardPage() {
  const { address } = useAccount();
  const { data: payments } = usePaymentsByBuyer(address);

  const paymentList = (payments as any[]) || [];
  const totalVolume = paymentList.reduce((sum, p) => sum + Number(p.amount), 0) / 1e6;
  const activeCount = paymentList.filter((p) => Number(p.status) <= 2).length;
  const completedCount = paymentList.filter((p) => Number(p.status) === 3).length;
  const escrowValue = paymentList.filter((p) => Number(p.status) === 1).reduce((sum, p) => sum + Number(p.amount), 0) / 1e6;

  const stats = [
    { label: "Total Volume", value: `$${formatAmount(totalVolume.toString())}` },
    { label: "Active", value: activeCount },
    { label: "In Escrow", value: `$${formatAmount(escrowValue.toString())}` },
    { label: "Completed", value: completedCount },
  ];

  const recentPayments = paymentList.slice(0, 5).map((p) => ({
    id: p.id.toString(),
    title: p.title,
    amount: (Number(p.amount) / 1e6).toString(),
    status: STATUS_NAMES[Number(p.status)] || "pending",
    buyer: p.buyer as string,
  }));

  return (
    <AppShell>
      <div className="space-y-16 p-8 lg:p-12">
        {/* Header */}
        <div className="flex items-end justify-between stagger-in">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#d8b15f]">Overview</p>
            <h1 className="mt-2 text-4xl font-medium tracking-tight">Dashboard</h1>
          </div>
          <Link href="/payments/create">
            <span className="inline-flex cursor-pointer items-center gap-1.5 bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-80">
              New Payment
            </span>
          </Link>
        </div>

        {/* Stats — minimal, no cards */}
        <div className="grid grid-cols-2 gap-px border-t border-border lg:grid-cols-4 stagger-in" style={{ animationDelay: "100ms" }}>
          {stats.map((stat) => (
            <div key={stat.label} className="py-6 pr-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              <p className="mt-3 text-2xl font-medium tracking-tight text-cream">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Payments */}
        <div className="stagger-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-lg font-medium">Recent Payments</h2>
            <Link href="/payments" className="cursor-pointer text-xs text-muted-foreground hover:text-[#d8b15f]">
              View all →
            </Link>
          </div>
          <div className="mt-6">
            {recentPayments.length === 0 ? (
              <EmptyState title="No payments yet" description="Create your first payment to get started." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Title</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Amount</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-muted-foreground">Explorer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((p) => (
                    <TableRow key={p.id} className="border-border hover:bg-accent/30">
                      <TableCell className="font-medium text-cream">
                        <Link href={`/payments/${p.id}`} className="cursor-pointer hover:text-[#d8b15f]">
                          {p.title}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">${formatAmount(p.amount)}</TableCell>
                      <TableCell><StatusColor status={p.status} /></TableCell>
                      <TableCell>
                        <a
                          href={`https://testnet.arcscan.app/address/${p.buyer}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer text-muted-foreground hover:text-[#d8b15f]"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="stagger-in" style={{ animationDelay: "300ms" }}>
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-medium">Status Breakdown</h2>
          </div>
          <div className="mt-6 space-y-3">
            {STATUS_NAMES.map((status, i) => {
              const count = paymentList.filter((p) => Number(p.status) === i).length;
              if (count === 0) return null;
              const pct = paymentList.length > 0 ? (count / paymentList.length) * 100 : 0;
              return (
                <div key={status} className="flex items-center justify-between border-b border-border py-3">
                  <StatusColor status={status} />
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-cream">{count}</span>
                    <div className="h-px w-24 bg-border">
                      <div className="h-full bg-[#d8b15f]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
            {paymentList.length === 0 && (
              <p className="py-6 text-sm text-muted-foreground">No data yet</p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
