"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusColor } from "@/components/status-color";
import { EmptyState } from "@/components/empty-state";
import { useAccount } from "wagmi";
import { usePaymentsByBuyer, usePaymentsBySeller } from "@/hooks/use-escrow";
import { formatAmount, formatAddress } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const STATUS_NAMES = ["pending", "funded", "delivered", "completed", "disputed", "refunded", "cancelled"];

export default function TransactionsPage() {
  const { address } = useAccount();
  const { data: buyerPayments } = usePaymentsByBuyer(address);
  const { data: sellerPayments } = usePaymentsBySeller(address);
  const [filter, setFilter] = React.useState("all");

  const allPayments = React.useMemo(() => {
    const buyer = (buyerPayments as any[]) || [];
    const seller = (sellerPayments as any[]) || [];
    const combined = [...buyer, ...seller];
    const seen = new Set();
    return combined.filter((p) => {
      const id = p.id.toString();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [buyerPayments, sellerPayments]);

  const filtered = filter === "all" ? allPayments : allPayments.filter((p) => STATUS_NAMES[Number(p.status)] === filter);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">All onchain payment activity.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <EmptyState
                title="No transactions yet"
                description="Your onchain payment history will appear here."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id.toString()}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>${formatAmount((Number(p.amount) / 1e6).toString())}</TableCell>
                      <TableCell>
                        <StatusColor status={STATUS_NAMES[Number(p.status)] || "pending"} />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{formatAddress(p.buyer)}</TableCell>
                      <TableCell className="font-mono text-xs">{formatAddress(p.seller)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(Number(p.createdAt) * 1000).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contract Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href="https://testnet.arcscan.app/address/0x8155221aFF293f4a79e02116E1e47a5885f3294D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
            >
              View FlowPayEscrow on ArcScan <ExternalLink className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
