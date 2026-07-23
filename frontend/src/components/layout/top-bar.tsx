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
    <header className="sticky top-0 z-30 hidden items-center justify-end gap-2.5 border-b border-border/40 glass px-6 py-2.5 lg:flex">
      <ThemeToggle />

      {/* Testnet Live badge */}
      <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-500">
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
        Testnet Live
      </div>

      {/* Faucet */}
      <a href={CIRCLE_FAUCET_URL} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
        <span className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 text-xs font-medium transition-all hover:border-primary/30 hover:bg-accent">
          Get Test USDC <ExternalLink className="h-3 w-3" />
        </span>
      </a>

      {/* Wallet */}
      {!isConnected ? (
        <Button onClick={handleConnect} isLoading={isPending} className="gap-2 rounded-full shadow-lg shadow-primary/20 btn-glow" size="sm">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      ) : isWrongChain ? (
        <Button
          variant="destructive"
          onClick={() => switchChain?.({ chainId: arcTestnet.id })}
          className="gap-2 rounded-full"
          size="sm"
        >
          <AlertCircle className="h-4 w-4" />
          Switch Network
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 cursor-pointer rounded-full border-border/60 bg-card/50" size="sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="h-3 w-3 text-primary" />
              </div>
              <span className="font-mono text-sm">{formatAddress(address ?? "")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-xl border-border/60 shadow-xl glass-card">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
              <span className="font-mono text-xs text-muted-foreground">Balance</span>
              <span className="whitespace-nowrap font-mono text-sm font-bold">
                {balanceFormatted} USDC
              </span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer rounded-lg"
              onSelect={(e) => { e.preventDefault(); copyAddress(); }}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-mono text-sm text-muted-foreground">Address</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm">{formatAddress(address ?? "")}</span>
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-default rounded-lg">
              <div className="flex w-full items-center justify-between">
                <span className="font-mono text-sm text-muted-foreground">Network</span>
                <span className="font-mono text-sm font-medium text-emerald-500">
                  {arcTestnet.name}
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer rounded-lg text-destructive focus:text-destructive"
              onClick={() => disconnect()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
