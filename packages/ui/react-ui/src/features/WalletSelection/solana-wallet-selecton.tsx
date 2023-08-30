import { useEffect } from "react";
import { withErrorBoundary } from "react-error-boundary";
import { useBridgeModalStore } from "bridge-adapter-react";
import { useSolanaWalletMultiButton } from "@solana/bridge-adapter-base-ui";
import type { BridgeStepParams } from "../../types/BridgeModal";
import { Button } from "../../shared/ui/button";
import { WalletAdapterIcon } from "../../shared/ui/icons/WalletAdapterIcon";

function SolanaWalletConnectionListBase() {
  const { buttonState, onConnect, onSelectWallet, wallets } =
    useSolanaWalletMultiButton();
  const { onSuccess } =
    useBridgeModalStore.use.currentBridgeStepParams() as BridgeStepParams<"WALLET_SELECTION">;

  useEffect(() => {
    switch (buttonState) {
      case "connected": {
        console.log("connected");
        onSuccess?.();
        break;
      }
      case "connecting":
      case "disconnecting":
        console.log(buttonState);
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
}

// TODO: Figure out a way to detect this
export const SolanaWalletConnectionList = withErrorBoundary(
  SolanaWalletConnectionListBase,
  {
    fallback: (
      <>
        <div>Error initializing wallet connection list.</div>
        <div>
          Did you wrap the{" "}
          <pre className="bsa-inline-block">{"<BridgeModal/>"}</pre> component
          in a{" "}
          <pre className="bsa-inline-block">{"<SolanaWalletProvider/>"}</pre>?
        </div>
      </>
    ),
    onError(errors) {
      console.error("Original Error", errors);
    },
  },
);
