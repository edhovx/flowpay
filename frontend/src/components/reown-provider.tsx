"use client";

import * as React from "react";
import { createAppKit } from "@reown/appkit/react";
import { wagmiAdapter } from "@/lib/wagmi";
import { arcTestnet } from "@/lib/chains";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "";

let openModal: (() => void) | null = null;
let initialized = false;

export function ReownProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (!projectId || initialized) return;
    initialized = true;

    try {
      const modal = createAppKit({
        adapters: [wagmiAdapter],
        networks: [arcTestnet],
        projectId,
        metadata: {
          name: "FlowPay",
          description: "Programmable USDC payments built on Arc",
          url: window.location.origin,
          icons: ["/icon.svg"],
        },
        features: {
          analytics: false,
          socials: ["google", "x", "github", "discord", "apple"],
          email: true,
        },
        themeMode: "dark",
        allWallets: "SHOW",
      });

      openModal = () => modal.open();
    } catch (e) {
      console.warn("Reown AppKit failed to init:", e);
    }
  }, []);

  return <>{children}</>;
}

export function openReownModal() {
  if (openModal) {
    openModal();
  } else {
    // Retry after a moment in case initialization is still running
    setTimeout(() => openModal?.(), 500);
  }
}

export function hasReown() {
  return !!projectId;
}
