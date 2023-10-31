import { Copy, CopyCheck, ExternalLink } from "lucide-react";
import { useCopyAddress } from "../../shared/ui/useCopyAddress";

export function ViewAndCopyWallet({
  baseExplorerUrl = "",
  address = "",
}: {
  baseExplorerUrl?: string;
  address?: string;
}) {
  const { copyAddress, isCopied } = useCopyAddress(address);
  const explorerUrl = `${baseExplorerUrl}${address}`;
  return (
    <div className="bsa-flex bsa-items-center w-full">
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bsa-flex bsa-w-1/2 bsa-items-center bsa-justify-center bsa-text-sm bsa-text-[#2F98F9] hover:bsa-underline"
      >
        <span className="bsa-mr-3">View on explore</span>
        <ExternalLink />
      </a>
      <div
        className="bsa-flex bsa-w-1/2 bsa-items-center bsa-justify-center bsa-rounded-md bsa-p-1 bsa-text-sm bsa-ring-offset-background bsa-transition-colors  hover:bsa-bg-accent hover:bsa-text-accent-foreground focus-visible:bsa-outline-none focus-visible:bsa-ring-2 focus-visible:bsa-ring-ring focus-visible:bsa-ring-offset-2"
        onClick={copyAddress}
      >
        <span className="bsa-mr-3">Copy address</span>
        {isCopied ? <CopyCheck /> : <Copy />}
      </div>
    </div>
  );
}
