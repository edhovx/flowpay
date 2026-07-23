import { type Address, zeroAddress } from "viem";

export const USDC_CONTRACT_ADDRESS: Address =
  (process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as Address) ||
  ("0x3600000000000000000000000000000000000000" as Address);

export const ESCROW_CONTRACT_ADDRESS: Address =
  (process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS as Address) || zeroAddress;

export const IS_CONFIGURED = ESCROW_CONTRACT_ADDRESS !== zeroAddress;
