"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusColor } from "@/components/status-color";
import { EmptyState } from "@/components/empty-state";
import { useAccount } from "wagmi";
import { usePaymentsByBuyer, usePaymentsBySeller } from "@/hooks/use-escrow";
import { formatAmount } from "@/lib/utils";
import { Plus } from "lucide-react";
import * as React from "react";

const STATUS_NAMES = ["pending", "funded", "delivered", "completed", "disputed", "refunded", "cancelled"];

export default function PaymentsPage() {
  const { address } = useAccount();
  const { data: buyerPayments } = usePaymentsByBuyer(address);
  const { data: sellerPayments } = usePaymentsBySeller(address);

  const allPayments = React.useMemo(() => {
    const buyer = (buyerPayments as any[]) || [];
    const seller = (sellerPayments as any[]) || [];
    const combined = [...buyer, ...seller];
    // Deduplicate by id
    const seen = new Set();
    return combined.filter((p) => {
      const id = p.id.toString();
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [buyerPayments, sellerPayments]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
            <p className="text-muted-foreground">All your payments and invoices.</p>
          </div>
          <Link href="/payments/create" className="cursor-pointer">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Payment
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {allPayments.length === 0 ? (
              <EmptyState
                title="No payments yet"
                description="Create your first payment to get started."
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
                  {allPayments.map((p) => (
                    <TableRow key={p.id.toString()}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>${formatAmount((Number(p.amount) / 1e6).toString())}</TableCell>
                      <TableCell>
                        <StatusColor status={STATUS_NAMES[Number(p.status)] || "pending"} />
                      </TableCell>
                      <TableCell>
                        {new Date(Number(p.fundingDeadline) * 1000).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link href={`/payments/${p.id.toString()}`} className="cursor-pointer">
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
