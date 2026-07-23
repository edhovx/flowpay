"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatUnits, parseUnits, type Address } from "viem";
import { ESCROW_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS } from "@/lib/contracts";
import escrowAbi from "@/lib/abi/FlowPayEscrow.json";

const usdcAbi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
] as const;

export function useUSDCBalance() {
  const { address } = useAccount();

  const { data: balance } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: usdcAbi,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
    query: { enabled: !!address },
  });

  const { data: decimals } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: usdcAbi,
    functionName: "decimals",
  });

  return {
    balance: balance && decimals ? formatUnits(balance as bigint, decimals as number) : "0",
    isLoading: false,
  };
}

export function useCreatePayment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createPayment = (data: {
    title: string;
    description: string;
    seller: Address;
    supplier: Address;
    platform: Address;
    arbiter: Address;
    amount: string;
    sellerPercentage: number;
    supplierPercentage: number;
    platformPercentage: number;
    fundingDeadline: number;
    deliveryDeadline: number;
    autoReleaseTime: number;
  }) => {
    writeContract({
      address: ESCROW_CONTRACT_ADDRESS,
      abi: escrowAbi as any,
      functionName: "createPayment",
      args: [
        data.title,
        data.description,
        data.seller,
        data.supplier,
        data.platform,
        data.arbiter,
        parseUnits(data.amount, 6),
        BigInt(data.sellerPercentage),
        BigInt(data.supplierPercentage),
        BigInt(data.platformPercentage),
        BigInt(data.fundingDeadline),
        BigInt(data.deliveryDeadline),
        BigInt(data.autoReleaseTime),
      ],
    });
  };

  return { createPayment, hash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useFundPayment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const fundPayment = (paymentId: bigint) => {
    writeContract({
      address: ESCROW_CONTRACT_ADDRESS,
      abi: escrowAbi as any,
      functionName: "fundPayment",
      args: [paymentId],
    });
  };

  return { fundPayment, hash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useMarkDelivered() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const markDelivered = (paymentId: bigint) => {
    writeContract({
      address: ESCROW_CONTRACT_ADDRESS,
      abi: escrowAbi as any,
      functionName: "markDelivered",
      args: [paymentId],
    });
  };

  return { markDelivered, hash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useConfirmReceipt() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const confirmReceipt = (paymentId: bigint) => {
    writeContract({
      address: ESCROW_CONTRACT_ADDRESS,
      abi: escrowAbi as any,
      functionName: "confirmReceipt",
      args: [paymentId],
    });
  };

  return { confirmReceipt, hash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useOpenDispute() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const openDispute = (paymentId: bigint) => {
    writeContract({
      address: ESCROW_CONTRACT_ADDRESS,
      abi: escrowAbi as any,
      functionName: "openDispute",
      args: [paymentId],
    });
  };

  return { openDispute, hash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useResolveDispute() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const resolveDispute = (
    paymentId: bigint,
    releaseToSeller: boolean,
    sellerAmount: bigint,
    supplierAmount: bigint,
    platformAmount: bigint,
  ) => {
    writeContract({
      address: ESCROW_CONTRACT_ADDRESS,
      abi: escrowAbi as any,
      functionName: "resolveDispute",
      args: [paymentId, releaseToSeller, sellerAmount, supplierAmount, platformAmount],
    });
  };

  return { resolveDispute, hash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useRefundPayment() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const refundPayment = (paymentId: bigint) => {
    writeContract({
      address: ESCROW_CONTRACT_ADDRESS,
      abi: escrowAbi as any,
      functionName: "refundPayment",
      args: [paymentId],
    });
  };

  return { refundPayment, hash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useExecuteAutoRelease() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const executeAutoRelease = (paymentId: bigint) => {
    writeContract({
      address: ESCROW_CONTRACT_ADDRESS,
      abi: escrowAbi as any,
      functionName: "executeAutoRelease",
      args: [paymentId],
    });
  };

  return { executeAutoRelease, hash, isPending: isPending || isConfirming, isSuccess, error };
}

export function useApproveUSDC() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (spender: Address, amount: bigint) => {
    writeContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: usdcAbi,
      functionName: "approve",
      args: [spender, amount],
    });
  };

  return { approve, hash, isPending: isPending || isConfirming, isSuccess, error };
}

export function usePayment(paymentId: bigint | null) {
  return useReadContract({
    address: ESCROW_CONTRACT_ADDRESS,
    abi: escrowAbi as any,
    functionName: "getPayment",
    args: paymentId !== null ? [paymentId] : undefined,
    query: { enabled: paymentId !== null },
  });
}

export function usePaymentsByBuyer(address: Address | undefined) {
  return useReadContract({
    address: ESCROW_CONTRACT_ADDRESS,
    abi: escrowAbi as any,
    functionName: "getPaymentsByBuyer",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 3000,
      refetchOnWindowFocus: true,
    },
  });
}

export function usePaymentsBySeller(address: Address | undefined) {
  return useReadContract({
    address: ESCROW_CONTRACT_ADDRESS,
    abi: escrowAbi as any,
    functionName: "getPaymentsBySeller",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}
