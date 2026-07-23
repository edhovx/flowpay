export type PaymentStatus =
  "pending" | "funded" | "delivered" | "completed" | "disputed" | "refunded" | "cancelled";

export interface Payment {
  id: string;
  title: string;
  description: string;
  amount: string;
  buyer: string;
  seller: string;
  supplier: string;
  platform: string;
  arbiter: string;
  sellerPercentage: number;
  supplierPercentage: number;
  platformPercentage: number;
  fundingDeadline: number;
  deliveryDeadline: number;
  autoReleaseTime: number;
  status: PaymentStatus;
  createdAt: number;
  fundedAt: number | null;
  completedAt: number | null;
  deliveredAt: number | null;
  disputedAt: number | null;
  refundedAt: number | null;
  txHash: string | null;
}

export interface PaymentFormData {
  title: string;
  description: string;
  amount: string;
  seller: string;
  supplier: string;
  platform: string;
  sellerPercentage: number;
  supplierPercentage: number;
  platformPercentage: number;
  fundingDeadline: string;
  deliveryDeadline: string;
  autoReleaseDeadline: string;
}

export interface Transaction {
  id: string;
  paymentId: string;
  type: string;
  from: string;
  to: string;
  amount: string;
  status: PaymentStatus;
  timestamp: number;
  txHash: string;
}

export interface StatusBreakdownItem {
  status: PaymentStatus;
  count: number;
}

export interface DashboardStats {
  totalVolume: string;
  activePayments: number;
  escrowValue: string;
  disputes: number;
  statusBreakdown: StatusBreakdownItem[];
}

export type UserRole = "buyer" | "seller" | "supplier" | "platform" | "arbiter" | "visitor";
