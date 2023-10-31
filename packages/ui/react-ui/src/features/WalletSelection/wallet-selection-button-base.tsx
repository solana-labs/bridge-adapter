import type { FC, HTMLProps } from "react";
import { useCallback } from "react";
import { Button } from "../../shared/ui/button";
import { cn } from "../../shared/lib/styles";

export interface WalletSelectionButtonBase
  extends HTMLProps<HTMLButtonElement> {
  canConnectWallet?: boolean;
  hasSourceChain?: boolean;
  hasTargetChain?: boolean;
  onSelect: () => void;
}

export const WalletSelectionButtonBase: FC<WalletSelectionButtonBase> = ({
  canConnectWallet = false,
  className,
  hasSourceChain = false,
  hasTargetChain = false,
  onSelect,
}) => {
  const onWalletSelect = useCallback(() => {
    if (!hasSourceChain || !hasTargetChain) return;

    onSelect();
  }, [hasSourceChain, hasTargetChain, onSelect]);

  const label = canConnectWallet ? "Connect Wallet" : "Select Tokens";

  return (
    <Button
      aria-label={label}
      size="lg"
      disabled={!canConnectWallet}
      className={cn("bsa-w-full", className)}
      variant={canConnectWallet ? "default" : "outline"}
      onClick={onWalletSelect}
    >
      {label}
    </Button>
  );
};
