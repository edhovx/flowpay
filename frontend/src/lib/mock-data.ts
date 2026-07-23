import { Payment, DashboardStats, Transaction } from "@/lib/types";
import { PAYMENT_STATUS } from "@/lib/constants";

const now = Math.floor(Date.now() / 1000);
const day = 86400;

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "pay-1",
    title: "Website Development",
    description: "Build a new marketing website with CMS integration.",
    amount: "2500.00",
    buyer: "0x1111111111111111111111111111111111111111",
    seller: "0x2222222222222222222222222222222222222222",
    supplier: "0x3333333333333333333333333333333333333333",
    platform: "0x4444444444444444444444444444444444444444",
    arbiter: "0x5555555555555555555555555555555555555555",
    sellerPercentage: 90,
    supplierPercentage: 0,
    platformPercentage: 10,
    fundingDeadline: now + day * 3,
    deliveryDeadline: now + day * 10,
    autoReleaseTime: now + day * 17,
    status: "pending",
    createdAt: now - day * 2,
    fundedAt: null,
    completedAt: null,
    deliveredAt: null,
    disputedAt: null,
    refundedAt: null,
    txHash: null,
  },
  {
    id: "pay-2",
    title: "Smart Contract Audit",
    description: "Security audit for DeFi protocol v2.",
    amount: "12000.00",
    buyer: "0x1111111111111111111111111111111111111111",
    seller: "0x6666666666666666666666666666666666666666",
    supplier: "0x0000000000000000000000000000000000000000",
    platform: "0x4444444444444444444444444444444444444444",
    arbiter: "0x5555555555555555555555555555555555555555",
    sellerPercentage: 95,
    supplierPercentage: 0,
    platformPercentage: 5,
    fundingDeadline: now - day * 1,
    deliveryDeadline: now + day * 7,
    autoReleaseTime: now + day * 14,
    status: "funded",
    createdAt: now - day * 5,
    fundedAt: now - day * 2,
    completedAt: null,
    deliveredAt: null,
    disputedAt: null,
    refundedAt: null,
    txHash: "0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1",
  },
  {
    id: "pay-3",
    title: "UI/UX Design System",
    description: "Design tokens, components, and style guide.",
    amount: "4800.00",
    buyer: "0x1111111111111111111111111111111111111111",
    seller: "0x2222222222222222222222222222222222222222",
    supplier: "0x7777777777777777777777777777777777777777",
    platform: "0x4444444444444444444444444444444444444444",
    arbiter: "0x5555555555555555555555555555555555555555",
    sellerPercentage: 80,
    supplierPercentage: 10,
    platformPercentage: 10,
    fundingDeadline: now - day * 10,
    deliveryDeadline: now - day * 3,
    autoReleaseTime: now - day * 1,
    status: "delivered",
    createdAt: now - day * 15,
    fundedAt: now - day * 12,
    completedAt: null,
    deliveredAt: now - day * 3,
    disputedAt: null,
    refundedAt: null,
    txHash: "0xdef456def456def456def456def456def456def456def456def456def456def4",
  },
  {
    id: "pay-4",
    title: "Mobile App Backend",
    description: "API and database architecture for iOS and Android app.",
    amount: "8500.00",
    buyer: "0x1111111111111111111111111111111111111111",
    seller: "0x8888888888888888888888888888888888888888",
    supplier: "0x0000000000000000000000000000000000000000",
    platform: "0x4444444444444444444444444444444444444444",
    arbiter: "0x5555555555555555555555555555555555555555",
    sellerPercentage: 92,
    supplierPercentage: 0,
    platformPercentage: 8,
    fundingDeadline: now - day * 20,
    deliveryDeadline: now - day * 12,
    autoReleaseTime: now - day * 5,
    status: "completed",
    createdAt: now - day * 30,
    fundedAt: now - day * 28,
    completedAt: now - day * 5,
    deliveredAt: now - day * 6,
    disputedAt: null,
    refundedAt: null,
    txHash: "0x7890127890127890127890127890127890127890127890127890127890127890",
  },
  {
    id: "pay-5",
    title: "Logo and Brand Identity",
    description: "Logo redesign and brand guidelines.",
    amount: "1500.00",
    buyer: "0x1111111111111111111111111111111111111111",
    seller: "0x2222222222222222222222222222222222222222",
    supplier: "0x0000000000000000000000000000000000000000",
    platform: "0x4444444444444444444444444444444444444444",
    arbiter: "0x5555555555555555555555555555555555555555",
    sellerPercentage: 95,
    supplierPercentage: 0,
    platformPercentage: 5,
    fundingDeadline: now - day * 2,
    deliveryDeadline: now + day * 4,
    autoReleaseTime: now + day * 11,
    status: "disputed",
    createdAt: now - day * 4,
    fundedAt: now - day * 3,
    completedAt: null,
    deliveredAt: null,
    disputedAt: now - day * 1,
    refundedAt: null,
    txHash: "0xaaa111aaa111aaa111aaa111aaa111aaa111aaa111aaa111aaa111aaa111aaa1",
  },
];

export const MOCK_STATS: DashboardStats = {
  totalVolume: "29800.00",
  activePayments: 3,
  escrowValue: "14800.00",
  disputes: 1,
  statusBreakdown: [
    { status: "pending", count: 1 },
    { status: "funded", count: 1 },
    { status: "delivered", count: 1 },
    { status: "completed", count: 1 },
    { status: "disputed", count: 1 },
  ],
};

export const MOCK_TRANSACTIONS: Transaction[] = MOCK_PAYMENTS.flatMap((p) => {
  const txs: Transaction[] = [];
  if (p.txHash) {
    txs.push({
      id: `${p.id}-fund`,
      paymentId: p.id,
      type: "Fund",
      from: p.buyer,
      to: "Escrow",
      amount: p.amount,
      status: p.status,
      timestamp: p.fundedAt ?? p.createdAt,
      txHash: p.txHash,
    });
  }
  if (p.completedAt) {
    txs.push({
      id: `${p.id}-release`,
      paymentId: p.id,
      type: "Release",
      from: "Escrow",
      to: p.seller,
      amount: p.amount,
      status: "completed",
      timestamp: p.completedAt,
      txHash: `${p.txHash?.slice(0, -2)}aa`,
    });
  }
  return txs;
});

export function getPaymentById(id: string): Payment | undefined {
  return MOCK_PAYMENTS.find((p) => p.id === id);
}

export function getPaymentsByBuyer(address: string): Payment[] {
  return MOCK_PAYMENTS.filter((p) => p.buyer.toLowerCase() === address.toLowerCase());
}

export function getPaymentsBySeller(address: string): Payment[] {
  return MOCK_PAYMENTS.filter((p) => p.seller.toLowerCase() === address.toLowerCase());
}

export function getStatusLabel(status: string): string {
  return PAYMENT_STATUS[status] || status;
}
