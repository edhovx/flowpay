"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusColor } from "@/components/status-color";
import { AddressDisplay } from "@/components/address-display";
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
import { Wallet, Clock, Shield, Scale, TrendingUp, Activity, Link2, ExternalLink, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const STATUS_NAMES = ["pending", "funded", "delivered", "completed", "disputed", "refunded", "cancelled"];

export default function DashboardPage() {
  const { address } = useAccount();
  const { data: payments } = usePaymentsByBuyer(address);

  const paymentList = (payments as any[]) || [];
  const totalVolume = paymentList.reduce((sum, p) => sum + Number(p.amount), 0) / 1e6;
  const activeCount = paymentList.filter((p) => Number(p.status) <= 2).length;
  const escrowValue = paymentList.filter((p) => Number(p.status) === 1).reduce((sum, p) => sum + Number(p.amount), 0) / 1e6;
  const completedCount = paymentList.filter((p) => Number(p.status) === 3).length;
  const disputeCount = paymentList.filter((p) => Number(p.status) === 4).length;

  const stats = [
    { label: "Total Volume", value: `$${formatAmount(totalVolume.toString())}`, icon: Wallet, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", glow: "shadow-indigo-500/20" },
    { label: "Active", value: activeCount, icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-blue-500/20" },
    { label: "In Escrow", value: `$${formatAmount(escrowValue.toString())}`, icon: Shield, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", glow: "shadow-purple-500/20" },
    { label: "Completed", value: completedCount, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-emerald-500/20" },
  ];

  const statusBreakdown = STATUS_NAMES.map((status, i) => ({
    status,
    count: paymentList.filter((p) => Number(p.status) === i).length,
  })).filter((s) => s.count > 0);

  const recentPayments = paymentList.slice(0, 5).map((p) => ({
    id: p.id.toString(),
    title: p.title,
    amount: (Number(p.amount) / 1e6).toString(),
    status: STATUS_NAMES[Number(p.status)] || "pending",
    fundingDeadline: Number(p.fundingDeadline),
    buyer: p.buyer as string,
    seller: p.seller as string,
  }));

  return (
    <AppShell>
      <div className="space-y-6 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between stagger-in">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Overview of your FlowPay activity</p>
          </div>
          <Link href="/payments/create">
            <span className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:brightness-110">
              <Link2 className="h-4 w-4" /> New Payment
            </span>
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card card-glow stagger-in rounded-2xl p-5"
              style={{ animationDelay: `${i * 80 + 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.border} border stat-icon`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Recent payments */}
          <div
            className="glass-card card-glow stagger-in rounded-2xl lg:col-span-2"
            style={{ animationDelay: "450ms" }}
          >
            <div className="flex items-center justify-between border-b border-border/40 p-5 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-base font-semibold">Recent Payments</h3>
              </div>
              <Link href="/payments" className="flex cursor-pointer items-center gap-1 text-xs font-medium text-primary hover:underline">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="p-5">
              {recentPayments.length === 0 ? (
                <EmptyState
                  title="No payments yet"
                  description="Create your first payment to get started."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40">
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">Title</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">Amount</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider text-muted-foreground">Explorer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPayments.map((p) => (
                      <TableRow key={p.id} className="border-border/40 transition-colors hover:bg-accent/50">
                        <TableCell className="font-medium">
                          <Link href={`/payments/${p.id}`} className="cursor-pointer hover:text-primary transition-colors">
                            {p.title}
                          </Link>
                        </TableCell>
                        <TableCell className="font-mono text-sm">${formatAmount(p.amount)}</TableCell>
                        <TableCell><StatusColor status={p.status} /></TableCell>
                        <TableCell>
                          <a
                            href={`https://testnet.arcscan.app/address/${p.buyer}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border/60 px-2 py-1 text-[10px] font-medium text-primary transition-colors hover:bg-accent hover:border-primary/30"
                          >
                            View <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          {/* Status breakdown */}
          <div
            className="glass-card card-glow stagger-in rounded-2xl"
            style={{ animationDelay: "550ms" }}
          >
            <div className="flex items-center gap-2 border-b border-border/40 p-5 pb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-base font-semibold">Status Breakdown</h3>
            </div>
            <div className="space-y-4 p-5">
              {statusBreakdown.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-sm text-muted-foreground">No data yet</p>
                </div>
              ) : (
                statusBreakdown.map((s) => {
                  const pct = paymentList.length > 0 ? (s.count / paymentList.length) * 100 : 0;
                  return (
                    <div key={s.status} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <StatusColor status={s.status} />
                        <span className="text-sm font-bold">{s.count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
