"use client";

import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { Wallet, LogOut, AlertCircle, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatAddress } from "@/lib/utils";
import { arcTestnet } from "@/lib/chains";
import { ThemeToggle } from "@/components/theme-toggle";
import { CIRCLE_FAUCET_URL } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";
import { openReownModal, hasReown } from "@/components/reown-provider";
import * as React from "react";

export function TopBar() {
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: balanceData } = useBalance({ address, chainId: arcTestnet.id });
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const isWrongChain = isConnected && chainId !== arcTestnet.id;
  const rawBalance = balanceData ? balanceData.value : 0n;
  const balanceNum = Number(rawBalance) / 1e18;
  const balanceFormatted = balanceNum.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast({ title: "Address copied", description: formatAddress(address) });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = address;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        toast({ title: "Address copied", description: formatAddress(address) });
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast({ title: "Copy failed", description: "Please copy manually", variant: "destructive" });
      }
      document.body.removeChild(textarea);
    }
  };

  const handleConnect = () => {
    if (hasReown()) {
      openReownModal();
    } else {
      const injected = connectors.find((c) => c.type === "injected");
      if (injected) connect({ connector: injected });
      else if (connectors.length > 0) connect({ connector: connectors[0] });
    }
  };

  return (
    <header className="sticky top-0 z-30 hidden items-center justify-end gap-4 border-b border-border glass px-8 py-3 lg:flex">
      <ThemeToggle />

      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="flex h-1.5 w-1.5 rounded-full bg-[#b7c8a3] pulse-dot" />
        Testnet Live
      </span>

      <a href={CIRCLE_FAUCET_URL} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-xs text-muted-foreground hover:text-[#d8b15f]">
        Get Test USDC
      </a>

      {!isConnected ? (
        <Button onClick={handleConnect} isLoading={isPending} className="bg-primary text-primary-foreground hover:opacity-80" size="sm">
          <Wallet className="h-3.5 w-3.5" />
          Connect Wallet
        </Button>
      ) : isWrongChain ? (
        <Button
          variant="destructive"
          onClick={() => switchChain?.({ chainId: arcTestnet.id })}
          size="sm"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          Switch Network
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="cursor-pointer text-sm hover:bg-accent" size="sm">
              <span className="font-mono">{formatAddress(address ?? "")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#0d0e0f] border-border">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs text-muted-foreground">Balance</span>
              <span className="font-mono text-sm font-medium text-cream">{balanceFormatted} USDC</span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onSelect={(e) => { e.preventDefault(); copyAddress(); }}>
              <div className="flex w-full items-center justify-between">
                <span className="text-xs text-muted-foreground">Address</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm">{formatAddress(address ?? "")}</span>
                  {copied ? <Check className="h-3 w-3 text-[#b7c8a3]" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-default">
              <div className="flex w-full items-center justify-between">
                <span className="text-xs text-muted-foreground">Network</span>
                <span className="text-sm font-medium text-[#b7c8a3]">{arcTestnet.name}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={() => disconnect()}>
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
