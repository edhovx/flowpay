import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatAmount(amount: string | number, decimals = 6): string {
  const num = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  if (Number.isNaN(num)) return "0.00";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function getArcScanTxUrl(txHash: string): string {
  return `https://testnet.arcscan.app/tx/${txHash}`;
}

export function getArcScanAddressUrl(address: string): string {
  return `https://testnet.arcscan.app/address/${address}`;
}

export function getPaymentUrl(paymentId: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/payments/${paymentId}`;
  }
  return `/payments/${paymentId}`;
}
