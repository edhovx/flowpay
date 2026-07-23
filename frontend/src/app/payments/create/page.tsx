"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { paymentSchema, PaymentSchemaType } from "@/lib/validations";
import { useAccount } from "wagmi";
import { zeroAddress } from "viem";
import { useCreatePayment, useUSDCBalance } from "@/hooks/use-escrow";
import { useQueryClient } from "@tanstack/react-query";
import { IS_CONFIGURED } from "@/lib/contracts";
import { ConnectPrompt } from "@/components/wallet/connect-prompt";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Zap, Calendar, CheckCircle2, XCircle, Loader2 } from "lucide-react";

type PaymentMode = "instant" | "scheduled";
type TxStatus = "idle" | "pending" | "success" | "failed";

export default function CreatePaymentPage() {
  const { address, isConnected } = useAccount();
  const { balance } = useUSDCBalance();
  const { createPayment, isPending: isCreating, isSuccess, error } = useCreatePayment();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [paymentMode, setPaymentMode] = React.useState<PaymentMode>("instant");
  const [txStatus, setTxStatus] = React.useState<TxStatus>("idle");
  const [txError, setTxError] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentSchemaType>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      sellerPercentage: 90,
      supplierPercentage: 0,
      platformPercentage: 10,
      supplier: zeroAddress,
    },
  });

  const amount = watch("amount");
  const isConfigured = IS_CONFIGURED;

  // Track success
  React.useEffect(() => {
    if (isSuccess && txStatus === "pending") {
      setTxStatus("success");
      // Force refresh all onchain data
      queryClient.invalidateQueries();
      toast({
        title: "✅ Payment Created Successfully",
        description: "Your payment has been created onchain.",
      });
      setTimeout(() => router.push("/payments"), 1500);
    }
  }, [isSuccess, txStatus, toast, router, queryClient]);

  // Track error
  React.useEffect(() => {
    if (error && txStatus === "pending") {
      setTxStatus("failed");
      setTxError(error.message || "Transaction failed");
      toast({
        title: "❌ Transaction Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, txStatus, toast]);

  const onSubmit = async (data: PaymentSchemaType) => {
    if (!isConfigured) {
      toast({
        title: "Contract not configured",
        description: "Set NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS to create real payments.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields manually for instant mode
    if (!data.seller || !data.seller.startsWith("0x")) {
      toast({ title: "Missing field", description: "Seller address is required.", variant: "destructive" });
      return;
    }
    if (!data.platform || !data.platform.startsWith("0x")) {
      toast({ title: "Missing field", description: "Platform address is required.", variant: "destructive" });
      return;
    }
    if (!data.amount || Number(data.amount) <= 0) {
      toast({ title: "Missing field", description: "Amount must be greater than 0.", variant: "destructive" });
      return;
    }
    if (!data.title || data.title.length < 3) {
      toast({ title: "Missing field", description: "Title must be at least 3 characters.", variant: "destructive" });
      return;
    }

    // Validate scheduled mode deadlines
    if (paymentMode === "scheduled") {
      if (!data.fundingDeadline || !data.deliveryDeadline || !data.autoReleaseDeadline) {
        toast({ title: "Missing field", description: "All deadline dates are required for scheduled payments.", variant: "destructive" });
        return;
      }
    }

    setTxStatus("pending");
    setTxError("");

    const supplier = data.supplier || zeroAddress;
    const platform = data.platform || address!;
    const arbiter = data.platform || address!;

    const toTimestamp = (iso: string) => Math.floor(new Date(iso).getTime() / 1000);

    let fundingDeadline: number;
    let deliveryDeadline: number;
    let autoReleaseTime: number;

    if (paymentMode === "instant") {
      const now = Math.floor(Date.now() / 1000);
      fundingDeadline = now + 3600;
      deliveryDeadline = now + 86400 * 7;
      autoReleaseTime = now + 86400 * 14;
    } else {
      fundingDeadline = toTimestamp(data.fundingDeadline!);
      deliveryDeadline = toTimestamp(data.deliveryDeadline!);
      autoReleaseTime = toTimestamp(data.autoReleaseDeadline!);
    }

    // Validate split
    const split = Number(data.sellerPercentage) + Number(data.supplierPercentage) + Number(data.platformPercentage);
    if (split !== 100) {
      toast({ title: "Invalid split", description: `Percentages must total 100% (currently ${split}%)`, variant: "destructive" });
      setTxStatus("idle");
      return;
    }

    try {
      createPayment({
        title: data.title,
        description: data.description || "",
        seller: data.seller as `0x${string}`,
        supplier: supplier as `0x${string}`,
        platform: platform as `0x${string}`,
        arbiter: arbiter as `0x${string}`,
        amount: data.amount.toString(),
        sellerPercentage: Number(data.sellerPercentage),
        supplierPercentage: Number(data.supplierPercentage),
        platformPercentage: Number(data.platformPercentage),
        fundingDeadline,
        deliveryDeadline,
        autoReleaseTime,
      });
    } catch (e: any) {
      setTxStatus("failed");
      setTxError(e.message || "Transaction failed");
      toast({
        title: "❌ Transaction Failed",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  if (!isConnected) {
    return (
      <AppShell>
        <ConnectPrompt message="Connect your wallet to create a payment." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Create Payment</h1>
          <p className="text-muted-foreground">Set up a new escrow payment with split rules.</p>
          <p className="text-sm text-muted-foreground">
            USDC Balance: {Number(balance).toFixed(6)} USDC
          </p>
        </div>

        {/* Payment Mode Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMode("instant")}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
              paymentMode === "instant"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              paymentMode === "instant" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              <Zap className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Instant</p>
              <p className="text-xs text-muted-foreground">Send right now</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMode("scheduled")}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
              paymentMode === "scheduled"
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              paymentMode === "scheduled" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              <Calendar className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Scheduled</p>
              <p className="text-xs text-muted-foreground">Pick dates manually</p>
            </div>
          </button>
        </div>

        {/* Transaction Status Banner */}
        {txStatus === "pending" && (
          <div className="flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
            <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Processing transaction...</p>
              <p className="text-xs text-muted-foreground">Confirm in your wallet and wait for onchain confirmation.</p>
            </div>
          </div>
        )}

        {txStatus === "success" && (
          <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Payment created successfully!</p>
              <p className="text-xs text-muted-foreground">Redirecting to payments list...</p>
            </div>
          </div>
        )}

        {txStatus === "failed" && (
          <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <XCircle className="h-5 w-5 text-destructive" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Transaction failed</p>
              <p className="text-xs text-muted-foreground">{txError}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => { setTxStatus("idle"); setTxError(""); }}
              className="cursor-pointer"
            >
              Try Again
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Describe the work and set the payment amount.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g. Website redesign" {...register("title")} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Scope of work..."
                  {...register("description")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USDC)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("amount")}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount.message}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="seller">Seller Address</Label>
                  <Input id="seller" placeholder="0x..." {...register("seller")} />
                  {errors.seller && (
                    <p className="text-sm text-destructive">{errors.seller.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier Address (optional)</Label>
                  <Input id="supplier" placeholder="0x..." {...register("supplier")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform Address (also used as arbiter)</Label>
                <Input id="platform" placeholder="0x..." {...register("platform")} />
                {errors.platform && (
                  <p className="text-sm text-destructive">{errors.platform.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium leading-none">Split Percentages</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="sellerPercentage">Seller %</Label>
                    <Input id="sellerPercentage" type="number" {...register("sellerPercentage")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierPercentage">Supplier %</Label>
                    <Input
                      id="supplierPercentage"
                      type="number"
                      {...register("supplierPercentage")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platformPercentage">Platform %</Label>
                    <Input
                      id="platformPercentage"
                      type="number"
                      {...register("platformPercentage")}
                    />
                  </div>
                </div>
                {errors.platformPercentage && (
                  <p className="text-sm text-destructive">{errors.platformPercentage.message}</p>
                )}
              </div>

              {/* Deadline fields — only for scheduled mode */}
              {paymentMode === "scheduled" ? (
                <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium">Schedule Dates</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="fundingDeadline">Funding Deadline</Label>
                      <Input
                        id="fundingDeadline"
                        type="datetime-local"
                        {...register("fundingDeadline")}
                      />
                      {errors.fundingDeadline && (
                        <p className="text-sm text-destructive">{errors.fundingDeadline.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryDeadline">Delivery Deadline</Label>
                      <Input
                        id="deliveryDeadline"
                        type="datetime-local"
                        {...register("deliveryDeadline")}
                      />
                      {errors.deliveryDeadline && (
                        <p className="text-sm text-destructive">{errors.deliveryDeadline.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="autoReleaseDeadline">Auto Release Deadline</Label>
                      <Input
                        id="autoReleaseDeadline"
                        type="datetime-local"
                        {...register("autoReleaseDeadline")}
                      />
                      {errors.autoReleaseDeadline && (
                        <p className="text-sm text-destructive">{errors.autoReleaseDeadline.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium">Instant Payment</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">Funding:</span> 1 hour from now
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Delivery:</span> 7 days from now
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Auto Release:</span> 14 days from now
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  disabled={txStatus === "pending" || txStatus === "success"}
                  className="gap-2"
                >
                  {txStatus === "pending" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {txStatus === "success" && <CheckCircle2 className="h-4 w-4" />}
                  {txStatus === "idle" && "Create Payment"}
                  {txStatus === "pending" && "Processing..."}
                  {txStatus === "success" && "Success!"}
                  {txStatus === "failed" && "Retry Create Payment"}
                </Button>
                <Link href="/payments" className="cursor-pointer">
                  <Button type="button" variant="outline" disabled={txStatus === "pending"}>
                    Cancel
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-muted-foreground">
                Click "Create Payment" — your wallet will ask to confirm the transaction.
                No USDC approval needed for creating a payment. Approval is only needed when funding.
              </p>
            </CardContent>
          </Card>
        </form>
      </div>
    </AppShell>
  );
}
