"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import { formatUnits } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { arcTestnet } from "@/lib/chains";
import { formatAddress } from "@/lib/utils";
import { CIRCLE_FAUCET_URL } from "@/lib/constants";
import { ExternalLink } from "lucide-react";

export function WalletCard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address, chainId: arcTestnet.id });

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Connect your wallet to view balance.</p>
        </CardContent>
      </Card>
    );
  }

  const rawBalance = balance ? balance.value : 0n;
  const balanceNum = Number(rawBalance) / 1e18;
  const balanceFormatted = balanceNum.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const isWrongChain = chainId !== arcTestnet.id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Address</span>
          <span className="font-mono">{formatAddress(address ?? "")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Network</span>
          <span className={isWrongChain ? "text-destructive" : "text-success"}>
            {isWrongChain ? "Wrong Network" : arcTestnet.name}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Balance</span>
          <span className="font-medium">{balanceFormatted} USDC</span>
        </div>
        <div className="border-t pt-3">
          <a
            href={CIRCLE_FAUCET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="outline" size="sm" className="gap-2">
              Get Test USDC
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
