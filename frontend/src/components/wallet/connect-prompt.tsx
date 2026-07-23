"use client";

import { useAccount } from "wagmi";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConnect } from "wagmi";

export function ConnectPrompt({
  message = "Connect your wallet to continue",
}: {
  message?: string;
}) {
  const { connect, connectors, isPending } = useConnect();
  const { isConnected } = useAccount();

  if (isConnected) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <Wallet className="h-12 w-12 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button onClick={() => connect({ connector: connectors[0] })} isLoading={isPending}>
        Connect Wallet
      </Button>
    </div>
  );
}
