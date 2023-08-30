import { UserCircle2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../../shared/ui/button";
import { useAccount } from "wagmi";
import { WalletIcon } from "../../../shared/ui/icons/WalletIcon";

export function EvmWalletDetail({
  switchWallet,
  className,
}: {
  switchWallet?: () => void | Promise<void>;
  className?: string;
}) {
  const { connector, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div
        className={cn("bsa-flex bsa-items-center bsa-px-5 bsa-py-3", className)}
      >
        <UserCircle2 className="bsa-mr-3 bsa-h-8 bsa-w-8" />{" "}
        <div className="bsa-text-lg">Not Connected</div>
      </div>
    );
  }

  return (
    <div className="bsa-flex bsa-w-full bsa-items-center">
      <div className="bsa-flex bsa-flex-grow bsa-items-center">
        <span className="bsa-text-sm">Connected with {connector?.name}</span>
        <WalletIcon
          walletName={connector?.name.toLowerCase() || ""}
          className="bsa-ml-2 bsa-max-h-[1.25rem] bsa-px-[0.125rem] bsa-py-[0.15625rem]"
        />
      </div>
      <Button
        variant="outline"
        onClick={switchWallet}
        className="bsa-text-sm"
        size="sm"
      >
        Change wallet
      </Button>
    </div>
  );
}
