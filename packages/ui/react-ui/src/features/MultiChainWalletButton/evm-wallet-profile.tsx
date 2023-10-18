import { LogOut, UserCircle2 } from "lucide-react";
import { AddressLine } from "../../shared/ui/AddressLine";
import { Button } from "../../shared/ui/button";
import { WalletIcon } from "../../shared/ui/icons/WalletIcon";
import type { WalletName } from "../../shared/ui/icons/WalletIcon";
import { cn } from "../../shared/lib/styles";

export function EvmWalletProfile({
  address,
  avatar,
  chainName,
  className,
  connectorName,
  ensName,
  isConnected,
  onDisconnect,
}: {
  address?: string;
  avatar?: string;
  chainName?: string;
  className?: string;
  connectorName?: WalletName;
  ensName?: string;
  isConnected: boolean;
  onDisconnect: () => void;
}) {
  const walletName = (connectorName?.toLowerCase() ?? "") as WalletName;

  if (!isConnected) {
    return (
      <div
        className={cn(
          "bsa-flex bsa-items-center bsa-rounded-xl bsa-bg-muted bsa-px-5 bsa-py-3",
          className,
        )}
        role="status"
        aria-label="Not Connected"
      >
        <UserCircle2 className="bsa-mr-3 bsa-h-8 bsa-w-8" />{" "}
        <div className="bsa-text-lg">Not Connected</div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "bsa-flex bsa-items-center bsa-justify-between bsa-rounded-xl bsa-bg-muted bsa-px-5 bsa-py-3 ",
        className,
      )}
      role="status"
      aria-label="Connected"
    >
      <div className="bsa-flex bsa-items-center">
        {avatar ? (
          <img
            className="bsa-mr-3 bsa-h-8 bsa-w-8 bsa-rounded-full"
            src={avatar}
            alt="Ens Avatar"
          />
        ) : (
          <WalletIcon
            walletName={walletName}
            className="bsa-mr-3 bsa-h-10 bsa-w-10"
          />
        )}
        <div>
          <AddressLine
            address={ensName ?? (address || "")}
            isName={!!ensName}
          />
          <div className="bsa-text-sm bsa-text-muted-foreground">
            {chainName}
          </div>
        </div>
      </div>
      <Button
        aria-label="Disconnect"
        size="icon"
        variant="ghost"
        onClick={() => onDisconnect()}
      >
        <LogOut />
      </Button>
    </div>
  );
}
