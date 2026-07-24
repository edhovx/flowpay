"use client";

import { AppShell } from "@/components/layout/app-shell";
import { AddressDisplay } from "@/components/address-display";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-12 p-8 lg:p-12">
        <div className="stagger-in">
          <p className="text-xs uppercase tracking-widest text-[#d8b15f]">Info</p>
          <h1 className="mt-2 text-4xl font-medium tracking-tight">Settings</h1>
        </div>

        {/* Contracts */}
        <div className="stagger-in" style={{ animationDelay: "100ms" }}>
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-medium">Contracts</h2>
          </div>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Escrow</p>
              <div className="mt-2"><AddressDisplay address="0x8155221aFF293f4a79e02116E1e47a5885f3294D" /></div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">USDC</p>
              <div className="mt-2"><AddressDisplay address="0x3600000000000000000000000000000000000000" /></div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="stagger-in" style={{ animationDelay: "200ms" }}>
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-medium">About</h2>
          </div>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Version</p>
              <p className="mt-2 text-sm font-medium text-cream">1.0.0</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Status</p>
              <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#b7c8a3]">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#b7c8a3] pulse-dot" />
                Live
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
