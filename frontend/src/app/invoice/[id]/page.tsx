"use client";

import { QRCodeSVG } from "qrcode.react";
import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusColor } from "@/components/status-color";
import { AddressDisplay } from "@/components/address-display";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { formatAmount, getPaymentUrl } from "@/lib/utils";
import { CopyButton } from "@/components/copy-button";
import { usePayment } from "@/hooks/use-escrow";

const STATUS_NAMES = ["pending", "funded", "delivered", "completed", "disputed", "refunded", "cancelled"];

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const paymentId = BigInt(id);
  const { data: payment, isLoading, isError } = usePayment(paymentId);

  if (isLoading) return <AppShell><Loading text="Loading invoice..." /></AppShell>;
  if (isError || !payment) return <AppShell><ErrorState title="Invoice not found" description="This invoice may not exist onchain." /></AppShell>;

  const p = payment as any;
  const status = STATUS_NAMES[Number(p.status)] || "pending";
  const amount = (Number(p.amount) / 1e6).toString();
  const paymentUrl = getPaymentUrl(id);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Invoice</h1>
            <p className="text-muted-foreground">Share this invoice with the payer.</p>
          </div>
          <StatusColor status={status} />
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-6 pt-6">
            <QRCodeSVG value={paymentUrl} size={200} />
            <p className="text-sm text-muted-foreground">Scan to pay</p>
            <div className="flex w-full items-center gap-2">
              <input
                readOnly
                value={paymentUrl}
                className="flex-1 rounded-md border border-input bg-muted px-3 py-2 text-sm"
              />
              <CopyButton text={paymentUrl} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Title</span>
              <span className="font-medium">{p.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">${formatAmount(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Buyer</span>
              <AddressDisplay address={p.buyer} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seller</span>
              <AddressDisplay address={p.seller} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform</span>
              <AddressDisplay address={p.platform} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
