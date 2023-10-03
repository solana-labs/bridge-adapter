import { Copy, CopyCheck } from "lucide-react";
import { cn } from "../lib/styles";
import { formatEvmAddress } from "../lib/utils";
import { useCopyAddress } from "./useCopyAddress";

export function AddressLine({
  address,
  isName,
  showCopyButton = true,
  className,
  textClassName,
}: {
  address?: string;
  isName: boolean;
  showCopyButton?: boolean;
  className?: string;
  textClassName?: string;
}) {
  const { copyAddress, isCopied } = useCopyAddress(address);

  const formattedAddress = isName ? address : formatEvmAddress(address);
  return (
    <div className={cn("bsa-flex bsa-items-center", className)}>
      <div className={cn("bsa-mr-1", textClassName)}>{formattedAddress} </div>
      {showCopyButton && (
        <div
          className={
            "bsa-inline-flex bsa-h-6 bsa-w-6 bsa-items-center bsa-justify-center bsa-rounded-md bsa-p-1 bsa-text-sm bsa-font-medium bsa-ring-offset-background bsa-transition-colors hover:bsa-bg-accent hover:bsa-text-accent-foreground focus-visible:bsa-outline-none focus-visible:bsa-ring-2 focus-visible:bsa-ring-ring focus-visible:bsa-ring-offset-2"
          }
          onClick={(e) => {
            e.stopPropagation();
            copyAddress();
          }}
          aria-label="Copy"
          role="button"
        >
          {isCopied ? <CopyCheck /> : <Copy />}
        </div>
      )}
    </div>
  );
}
