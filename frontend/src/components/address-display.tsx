"use client";

import { CopyButton } from "@/components/copy-button";
import { formatAddress, getArcScanAddressUrl } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface AddressDisplayProps {
  address: string;
  showCopy?: boolean;
  showLink?: boolean;
  label?: string;
}

export function AddressDisplay({
  address,
  showCopy = true,
  showLink = true,
  label,
}: AddressDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <span className="font-mono text-sm">{formatAddress(address)}</span>
      {showCopy && <CopyButton text={address} />}
      {showLink && (
        <a
          href={getArcScanAddressUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground"
          aria-label="View on ArcScan"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
