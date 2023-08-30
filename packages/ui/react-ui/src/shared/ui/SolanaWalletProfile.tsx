//TODO:import { useWallet } from "@solana/wallet-adapter-react";
import { LogOut, UserCircle2 } from "lucide-react";
import { cn } from "../../shared/lib/styles";
import { PublicKeyLine } from "./PublicKeyLine";
import { Button } from "./button";
import { WalletAdapterIcon } from "./icons/WalletAdapterIcon";
import type { WalletAdapterIconProps } from "./icons/WalletAdapterIcon";
import type { PublicKey } from "@solana/web3.js";

export function SolanaWalletProfile({
  className,
  onDisconnect,
  isConnected,
  publicKey,
  wallet,
}: {
  className?: string;
  isConnected: boolean;
  onDisconnect: () => void;
  publicKey: PublicKey | null;
  wallet: WalletAdapterIconProps["wallet"] | null;
}) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  //TODO:const { connected, disconnect, publicKey, wallet } = useWallet();

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
        "bsa-flex bsa-items-center bsa-justify-between bsa-rounded-xl bsa-bg-muted bsa-px-5 bsa-py-3",
        className,
      )}
      role="status"
      aria-label="Connected"
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
        aria-label="Disconnect"
        size="icon"
        variant="ghost"
        onClick={onDisconnect}
      >
        <LogOut />
      </Button>
    </div>
  );
}
