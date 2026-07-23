"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AddressDisplay } from "@/components/address-display";
import { ExternalLink, Globe, Shield, Info } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6 p-6 lg:p-8">
        <div className="stagger-in">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Network and contract information</p>
        </div>

        {/* Network */}
        <div className="glass-card card-glow stagger-in rounded-2xl" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-2 border-b border-border/40 p-5 pb-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base font-semibold">Network</h3>
          </div>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Chain ID</p>
              <p className="text-sm font-semibold">5042002</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Network Name</p>
              <p className="text-sm font-semibold">Arc Testnet</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">RPC URL</p>
              <p className="font-mono text-xs">https://rpc.testnet.arc.network</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Explorer</p>
              <a href="https://testnet.arcscan.app" target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-1 font-mono text-xs text-primary hover:underline">
                testnet.arcscan.app <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Currency</p>
              <p className="text-sm font-semibold">USDC</p>
            </div>
          </div>
        </div>

        {/* Contracts */}
        <div className="glass-card card-glow stagger-in rounded-2xl" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-2 border-b border-border/40 p-5 pb-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base font-semibold">Contract Info</h3>
          </div>
          <div className="space-y-5 p-5">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Escrow Contract</p>
              <AddressDisplay address="0x8155221aFF293f4a79e02116E1e47a5885f3294D" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">USDC Token</p>
              <AddressDisplay address="0x3600000000000000000000000000000000000000" />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass-card card-glow stagger-in rounded-2xl" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-2 border-b border-border/40 p-5 pb-3">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base font-semibold">About</h3>
          </div>
          <div className="grid gap-5 p-5 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Version</p>
              <p className="text-sm font-semibold">1.0.0</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</p>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-500">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
                Live on Arc Testnet
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
