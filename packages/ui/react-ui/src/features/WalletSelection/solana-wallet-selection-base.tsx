import type { FC } from "react";
import type { Wallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { Button } from "../../shared/ui/button";
import { WalletAdapterIcon } from "../../shared/ui/icons/WalletAdapterIcon";

export type SolanaWalletData = {
  adapter: Pick<Wallet["adapter"], "name" | "icon">;
};

export interface SolanaWalletConnectionListBaseProps {
  buttonState: string;
  onConnect?: () => void;
  onSelectWallet: (a: SolanaWalletData["adapter"]["name"]) => void;
  onSuccess?: () => void;
  wallets: SolanaWalletData[];
}

export const SolanaWalletConnectionListBase: FC<
  SolanaWalletConnectionListBaseProps
> = ({ buttonState, onConnect, onSelectWallet, wallets, onSuccess }) => {
  useEffect(() => {
    switch (buttonState) {
      case "connected": {
        onSuccess?.();
        break;
      }
      case "connecting":
      case "disconnecting":
        /**
         *  TODO: Add a visual indicator to show that connection is in progress.
         *  - [] Add loader or something
         *
         *  MetaMask wallet loads its iframe quite forever. Should show something to accent this
         */
        break;
      case "has-wallet":
        onConnect && onConnect();
        break;
    }
  }, [buttonState, onConnect, onSuccess]);

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-4">
      {wallets.map((wallet) => (
        <Button
          aria-label={`${wallet.adapter.name} Wallet`}
          key={wallet.adapter.name}
          onClick={() => {
            onSelectWallet(wallet.adapter.name);
          }}
          variant="outline"
          className="bsa-flex bsa-w-full bsa-items-center bsa-justify-between bsa-rounded-xl bsa-py-6"
        >
          {wallet.adapter.name}
          <WalletAdapterIcon
            wallet={wallet}
            className="bsa-max-h-[2.5rem] bsa-px-2 bsa-py-[0.3125rem]"
          />
        </Button>
      ))}
    </div>
  );
};
