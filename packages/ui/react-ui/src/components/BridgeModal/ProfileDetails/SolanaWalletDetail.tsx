import { useWallet } from "@solana/wallet-adapter-react";
import { UserCircle2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { WalletAdapterIcon } from "../../../shared/ui/icons/WalletAdapterIcon";
import { Button } from "../../../shared/ui/button";

export function SolanaWalletDetail({
  switchWallet,
  className,
}: {
  switchWallet?: () => Promise<void>;
  className?: string;
}) {
  const { connected, wallet } = useWallet();

  if (!connected) {
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
        <span className="bsa-text-sm">
          Connected with {wallet?.adapter?.name}
        </span>
        <WalletAdapterIcon
          wallet={wallet}
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
