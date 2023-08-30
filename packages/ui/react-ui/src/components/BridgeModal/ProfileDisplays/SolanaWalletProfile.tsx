import { useWallet } from "@solana/wallet-adapter-react";
import { LogOut, UserCircle2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { PublicKeyLine } from "../../../shared/ui/PublicKeyLine";
import { Button } from "../../../shared/ui/button";
import { WalletAdapterIcon } from "../../../shared/ui/icons/WalletAdapterIcon";

export function SolanaWalletProfile({
  onDisconnect,
  className,
}: {
  onDisconnect?: () => void;
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { connected, disconnect, publicKey, wallet } = useWallet();

  if (!connected) {
    return (
      <div
        className={cn(
          "bsa-flex bsa-items-center bsa-rounded-xl bsa-bg-muted bsa-px-5 bsa-py-3",
          className,
        )}
      >
        <UserCircle2 className="bsa-mr-3 bsa-h-8 bsa-w-8" />{" "}
        <div className="bsa-text-lg">Not Connected</div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "bsa-flex bsa-items-center bsa-justify-between bsa-rounded-xl bsa-bg-muted bsa-px-5 bsa-py-3",
        className,
      )}
    >
      <div className="bsa-flex bsa-items-center">
        <WalletAdapterIcon
          wallet={wallet}
          className="bsa-mr-2 bsa-max-h-[2.5rem] bsa-px-2 bsa-py-[0.3125rem]"
        />
        <div>
          <PublicKeyLine publicKey={publicKey} isName={!publicKey} />
          <div className="bsa-text-sm bsa-text-muted-foreground">Solana</div>
        </div>
      </div>
      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={onDisconnect ? onDisconnect : disconnect}
      >
        <LogOut />
      </Button>
    </div>
  );
}
