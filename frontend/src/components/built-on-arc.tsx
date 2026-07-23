"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * ArcLogo — official Arc logo (from Arc Brand Kit).
 * Per guidelines: use latest version, don't modify, maintain clear space.
 */
export function ArcLogo({ className = "", height = 24 }: { className?: string; height?: number }) {
  return (
    <Image
      src="/arc-logo.png"
      alt="Arc"
      width={height * 2.91}
      height={height}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

/**
 * BuiltOnArc badge — "Built on Arc" with Arc logo.
 * Arc logo is secondary to FlowPay brand.
 */
export function BuiltOnArc({ variant = "default" }: { variant?: "default" | "compact" }) {
  if (variant === "compact") {
    return (
      <Link
        href="https://www.arc.io"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="text-[11px]">Built on</span>
        <ArcLogo height={14} />
      </Link>
    );
  }

  return (
    <Link
      href="https://www.arc.io"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <span className="font-medium">Built on</span>
      <ArcLogo height={18} />
    </Link>
  );
}

/**
 * BrandLockup — FlowPay logo | Arc logo with clear separator.
 * FlowPay is visually dominant; Arc is infrastructure only.
 */
export function BrandLockup() {
  return (
    <div className="flex items-center gap-3">
      <Link href="/" className="flex cursor-pointer items-center gap-2">
        <Image src="/icon.svg" alt="FlowPay" width={32} height={32} className="rounded-lg" />
        <span className="text-lg font-semibold">FlowPay</span>
      </Link>
      <div className="h-6 w-px bg-border" />
      <Link
        href="https://www.arc.io"
        target="_blank"
        rel="noopener noreferrer"
        className="flex cursor-pointer items-center text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArcLogo height={20} />
      </Link>
    </div>
  );
}
