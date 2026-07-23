"use client";

import Link from "next/link";
import { Wallet, AlertCircle, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectButton } from "@/components/wallet/connect-button";
import { CIRCLE_FAUCET_URL } from "@/lib/constants";

export default function ConnectWalletPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-md space-y-6 pt-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Wallet className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Connect Wallet</h1>
          <p className="mt-2 text-muted-foreground">
            Connect your wallet to start creating, funding, and settling payments.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              You need testnet USDC to use FlowPay. Request it from the faucet if you don't have any.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ConnectButton />
            <div className="border-t pt-3">
              <a
                href={CIRCLE_FAUCET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" className="w-full gap-2">
                  Get Test USDC
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-3 rounded-lg border border-dashed p-4 text-left text-sm text-muted-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            FlowPay will automatically prompt you to switch to the correct network if your wallet is
            not connected to the testnet.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-block cursor-pointer text-sm text-primary hover:underline"
        >
          Skip for now →
        </Link>
      </div>
    </AppShell>
  );
}
