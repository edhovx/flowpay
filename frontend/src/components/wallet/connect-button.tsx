"use client";

import { useAccount, useBalance, useDisconnect, useConnect } from "wagmi";
import { formatAddress } from "@/lib/utils";
import { arcTestnet } from "@/lib/chains";
import { Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { openReownModal, hasReown } from "@/components/reown-provider";
import * as React from "react";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const { data: balanceData } = useBalance({ address, chainId: arcTestnet.id });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const rawBalance = balanceData ? balanceData.value : 0n;
  const balance = (Number(rawBalance) / 1e18).toFixed(2);

  const handleConnect = () => {
    if (hasReown()) {
      openReownModal();
    } else {
      const injected = connectors.find((c) => c.type === "injected");
      if (injected) {
        connect({ connector: injected });
      } else if (connectors.length > 0) {
        connect({ connector: connectors[0] });
      }
    }
  };

  if (!mounted) {
    return (
      <Button className="gap-2" disabled>
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} className="gap-2 cursor-pointer">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 cursor-pointer">
          <Wallet className="h-4 w-4" />
          <span className="font-mono text-sm">{formatAddress(address ?? "")}</span>
          <span className="font-mono text-sm text-muted-foreground whitespace-nowrap">
            {balance} USDC
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="flex-col items-start gap-1">
          <span className="text-xs text-muted-foreground">Connected</span>
          <span className="font-mono text-sm break-all">{address}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex-col items-start gap-1">
          <span className="text-xs text-muted-foreground">Balance</span>
          <span className="font-mono text-sm font-medium whitespace-nowrap">
            {balance} USDC
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={() => disconnect()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
