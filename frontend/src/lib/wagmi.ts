import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arcTestnet } from "./chains";

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "";

// Single source of truth: Reown WagmiAdapter provides the wagmi config
// This ensures modal connections are reflected in all wagmi hooks
export const wagmiAdapter = new WagmiAdapter({
  networks: [arcTestnet],
  projectId,
  ssr: true,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
