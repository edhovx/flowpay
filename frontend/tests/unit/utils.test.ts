import { cn, formatAddress, formatAmount, getArcScanTxUrl, getArcScanAddressUrl, getPaymentUrl } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates tailwind classes", () => {
    expect(cn("p-4", "p-6")).toBe("p-6");
  });
});

describe("formatAddress", () => {
  it("formats long address correctly", () => {
    const addr = "0x1234567890abcdef1234567890abcdef12345678";
    expect(formatAddress(addr)).toBe("0x1234...5678");
  });

  it("returns empty string for empty input", () => {
    expect(formatAddress("")).toBe("");
  });

  it("returns empty string for undefined input", () => {
    expect(formatAddress(undefined as unknown as string)).toBe("");
  });
});

describe("formatAmount", () => {
  it("formats string number with 6 decimals", () => {
    expect(formatAmount("1000")).toBe("1,000.000000");
  });

  it("formats number with 6 decimals", () => {
    expect(formatAmount(1000)).toBe("1,000.000000");
  });

  it("returns 0.00 for NaN", () => {
    expect(formatAmount("not a number")).toBe("0.00");
  });

  it("handles custom decimals", () => {
    expect(formatAmount("100", 2)).toBe("100.00");
  });
});

describe("getArcScanTxUrl", () => {
  it("builds correct tx url", () => {
    expect(getArcScanTxUrl("0xabc123")).toBe("https://testnet.arcscan.app/tx/0xabc123");
  });
});

describe("getArcScanAddressUrl", () => {
  it("builds correct address url", () => {
    expect(getArcScanAddressUrl("0xabc123")).toBe("https://testnet.arcscan.app/address/0xabc123");
  });
});

describe("getPaymentUrl", () => {
  it("returns relative path on server", () => {
    const url = getPaymentUrl("pay-1");
    expect(url).toContain("pay-1");
  });
});
