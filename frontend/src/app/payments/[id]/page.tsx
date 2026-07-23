"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusColor } from "@/components/status-color";
import { AddressDisplay } from "@/components/address-display";
import { Loading } from "@/components/loading";
import { ErrorState } from "@/components/error-state";
import { formatAmount, getArcScanTxUrl } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import {
  useFundPayment,
  useMarkDelivered,
  useConfirmReceipt,
  useOpenDispute,
  useExecuteAutoRelease,
  usePayment,
} from "@/hooks/use-escrow";
import { useAccount } from "wagmi";
import { useApproveUSDC } from "@/hooks/use-escrow";
import { ESCROW_CONTRACT_ADDRESS } from "@/lib/contracts";
import { useToast } from "@/components/ui/use-toast";
import { parseUnits } from "viem";

const STATUS_NAMES = ["pending", "funded", "delivered", "completed", "disputed", "refunded", "cancelled"];

export default function PaymentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const paymentId = BigInt(id);
  const { address } = useAccount();
  const { toast } = useToast();

  const { data: payment, isLoading, isError } = usePayment(paymentId);
  const { fundPayment, isPending: isFunding } = useFundPayment();
  const { markDelivered, isPending: isMarking } = useMarkDelivered();
  const { confirmReceipt, isPending: isConfirming } = useConfirmReceipt();
  const { openDispute, isPending: isDisputing } = useOpenDispute();
  const { executeAutoRelease, isPending: isReleasing } = useExecuteAutoRelease();
  const { approve, isPending: isApproving } = useApproveUSDC();

  if (isLoading) return <AppShell><Loading text="Loading payment..." /></AppShell>;
  if (isError || !payment) return <AppShell><ErrorState title="Payment not found" description="This payment may not exist onchain." /></AppShell>;

  const p = payment as any;
  const status = STATUS_NAMES[Number(p.status)] || "pending";
  const amount = (Number(p.amount) / 1e6).toString();
  const isBuyer = address?.toLowerCase() === p.buyer.toLowerCase();
  const isSeller = address?.toLowerCase() === p.seller.toLowerCase();

  const handleFund = () => {
    approve(ESCROW_CONTRACT_ADDRESS, parseUnits(amount, 6));
    fundPayment(paymentId);
    toast({ title: "Funding payment...", description: "Confirm the transaction in your wallet." });
  };

  const handleAction = (action: () => void, label: string) => {
    action();
    toast({ title: `${label} submitted`, description: "Confirm the transaction in your wallet." });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{p.title}</h1>
            <p className="text-muted-foreground">Payment ID: {id}</p>
          </div>
          <StatusColor status={status} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
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
                <span className="text-muted-foreground">Supplier</span>
                <AddressDisplay address={p.supplier} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform</span>
                <AddressDisplay address={p.platform} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Arbiter</span>
                <AddressDisplay address={p.arbiter} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Split Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seller</span>
                <span>{p.sellerPercentage.toString()}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Supplier</span>
                <span>{p.supplierPercentage.toString()}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform</span>
                <span>{p.platformPercentage.toString()}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(Number(p.createdAt) * 1000).toLocaleString()}</span>
            </div>
            {Number(p.fundedAt) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Funded</span>
                <span>{new Date(Number(p.fundedAt) * 1000).toLocaleString()}</span>
              </div>
            )}
            {Number(p.completedAt) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span>{new Date(Number(p.completedAt) * 1000).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Funding Deadline</span>
              <span>{new Date(Number(p.fundingDeadline) * 1000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Deadline</span>
              <span>{new Date(Number(p.deliveryDeadline) * 1000).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auto Release</span>
              <span>{new Date(Number(p.autoReleaseTime) * 1000).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contract</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Escrow Contract</span>
              <AddressDisplay address={ESCROW_CONTRACT_ADDRESS} />
            </div>
            <a
              href={`https://testnet.arcscan.app/address/${ESCROW_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
            >
              View on ArcScan <ExternalLink className="h-4 w-4" />
            </a>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          {isBuyer && status === "pending" && (
            <Button onClick={handleFund} isLoading={isFunding || isApproving}>
              Fund Payment
            </Button>
          )}
          {isSeller && status === "funded" && (
            <Button onClick={() => handleAction(() => markDelivered(paymentId), "Mark delivered")} isLoading={isMarking}>
              Mark Delivered
            </Button>
          )}
          {isBuyer && status === "delivered" && (
            <Button onClick={() => handleAction(() => confirmReceipt(paymentId), "Confirm receipt")} isLoading={isConfirming}>
              Confirm Receipt
            </Button>
          )}
          {isBuyer && (status === "funded" || status === "delivered") && (
            <Button variant="destructive" onClick={() => handleAction(() => openDispute(paymentId), "Open dispute")} isLoading={isDisputing}>
              Open Dispute
            </Button>
          )}
          {status === "delivered" && (
            <Button variant="outline" onClick={() => handleAction(() => executeAutoRelease(paymentId), "Auto release")} isLoading={isReleasing}>
              Execute Auto Release
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
