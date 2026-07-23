import { paymentSchema } from "@/lib/validations";

describe("paymentSchema", () => {
  const validData = {
    title: "Test Payment",
    description: "Test description",
    amount: "100",
    seller: "0x1234567890abcdef1234567890abcdef12345678",
    supplier: "0x0000000000000000000000000000000000000000",
    platform: "0x1234567890abcdef1234567890abcdef12345678",
    sellerPercentage: 90,
    supplierPercentage: 0,
    platformPercentage: 10,
    fundingDeadline: "2026-12-31T23:59",
    deliveryDeadline: "2027-01-31T23:59",
    autoReleaseDeadline: "2027-02-28T23:59",
  };

  it("validates correct data", () => {
    const result = paymentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects title too short", () => {
    const result = paymentSchema.safeParse({ ...validData, title: "ab" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid ethereum address", () => {
    const result = paymentSchema.safeParse({ ...validData, seller: "not-an-address" });
    expect(result.success).toBe(false);
  });

  it("rejects split not equal to 100", () => {
    const result = paymentSchema.safeParse({
      ...validData,
      sellerPercentage: 80,
      platformPercentage: 10,
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero amount", () => {
    const result = paymentSchema.safeParse({ ...validData, amount: "0" });
    expect(result.success).toBe(false);
  });
});
