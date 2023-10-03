import type { PublicKey } from "@solana/web3.js";
import { Copy, CopyCheck } from "lucide-react";
import { formatPublicKey } from "../lib/utils";
import { cn } from "../lib/styles";
import { useCopyAddress } from "./useCopyAddress";

export function PublicKeyLine({
  publicKey,
  isName,
  showCopyButton = true,
  className,
  textClassName,
}: {
  publicKey?: PublicKey;
  isName: boolean;
  showCopyButton?: boolean;
  className?: string;
  textClassName?: string;
}) {
  const { copyAddress, isCopied } = useCopyAddress(publicKey?.toBase58());

  const formattedAddress = isName
    ? publicKey?.toBase58()
    : formatPublicKey(publicKey ?? null);
  return (
    <div className={cn("bsa-flex bsa-items-center", className)}>
      <div className={cn("bsa-mr-1", textClassName)}>{formattedAddress}</div>
      {showCopyButton && (
        <div
          className={
            "bsa-inline-flex bsa-h-6 bsa-w-6 bsa-items-center bsa-justify-center bsa-rounded-md bsa-p-1 bsa-text-sm bsa-font-medium bsa-ring-offset-background bsa-transition-colors hover:bsa-bg-accent  hover:bsa-text-accent-foreground focus-visible:bsa-outline-none focus-visible:bsa-ring-2 focus-visible:bsa-ring-ring focus-visible:bsa-ring-offset-2"
          }
          onClick={copyAddress}
          aria-label="Copy"
          role="button"
        >
          {isCopied ? <CopyCheck /> : <Copy />}
        </div>
      )}
    </div>
  );
}
