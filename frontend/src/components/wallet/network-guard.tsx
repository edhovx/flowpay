"use client";

import { useAccount, useChainId } from "wagmi";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { arcTestnet } from "@/lib/chains";

export function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();

  const isCorrectNetwork = !isConnected || chainId === arcTestnet.id;

  const addNetwork = async () => {
    try {
      const ethereum = (
        window as unknown as { ethereum?: { request: (args: unknown) => Promise<unknown> } }
      ).ethereum;
      await ethereum?.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${arcTestnet.id.toString(16)}`,
            chainName: arcTestnet.name,
            nativeCurrency: {
              name: arcTestnet.nativeCurrency.name,
              symbol: arcTestnet.nativeCurrency.symbol,
              decimals: arcTestnet.nativeCurrency.decimals,
            },
            rpcUrls: [arcTestnet.rpcUrls.default.http[0]],
            blockExplorerUrls: [arcTestnet.blockExplorers.default.url],
          },
        ],
      });
    } catch (error) {
      toast({
        title: "Network switch failed",
        description: error instanceof Error ? error.message : "Could not switch network",
        variant: "destructive",
      });
    }
  };

  if (!isConnected || isCorrectNetwork) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <h2 className="text-xl font-semibold">Wrong Network</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        FlowPay runs on Arc Testnet. Please switch your wallet to continue.
      </p>
      <Button onClick={addNetwork}>Add / Switch to Arc Testnet</Button>
    </div>
  );
}
