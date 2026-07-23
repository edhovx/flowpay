"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusColor } from "@/components/status-color";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { usePaymentsByBuyer, usePaymentsBySeller } from "@/hooks/use-escrow";
import { formatAmount } from "@/lib/utils";
import * as React from "react";

const STATUS_NAMES = ["pending", "funded", "delivered", "completed", "disputed", "refunded", "cancelled"];

export default function EscrowPage() {
  const { address } = useAccount();
  const { data: buyerPayments } = usePaymentsByBuyer(address);
  const { data: sellerPayments } = usePaymentsBySeller(address);

  const activeEscrows = React.useMemo(() => {
    const buyer = (buyerPayments as any[]) || [];
    const seller = (sellerPayments as any[]) || [];
    const combined = [...buyer, ...seller];
    const seen = new Set();
    return combined
      .filter((p) => {
        const id = p.id.toString();
        if (seen.has(id)) return false;
        seen.add(id);
        return Number(p.status) === 1 || Number(p.status) === 2; // Funded or Delivered
      })
      .map((p) => ({
        id: p.id.toString(),
        title: p.title,
        amount: (Number(p.amount) / 1e6).toString(),
        status: STATUS_NAMES[Number(p.status)] || "funded",
        fundingDeadline: Number(p.fundingDeadline),
      }));
  }, [buyerPayments, sellerPayments]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Escrow</h1>
          <p className="text-muted-foreground">Active escrow payments with locked funds.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Escrows</CardTitle>
          </CardHeader>
          <CardContent>
            {activeEscrows.length === 0 ? (
              <EmptyState
                title="No active escrows"
                description="Escrow payments will appear here once funded."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Funding Deadline</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeEscrows.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>${formatAmount(p.amount)}</TableCell>
                      <TableCell>
                        <StatusColor status={p.status} />
                      </TableCell>
                      <TableCell>{new Date(p.fundingDeadline * 1000).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Link href={`/payments/${p.id}`} className="cursor-pointer">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
