import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { Button } from "../../ui/button";
import { useCanConnectWallet } from "./useCanConnectWallet";
import { useIsWalletConnected } from "./useIsWalletConnected";

export function WalletSelectionButton() {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const {
    needEvmWalletConnection,
    needSolanaWalletConnection,
    evmChainNeeded,
  } = useIsWalletConnected();
  const canConnectWallet = useCanConnectWallet();

  return (
    <Button
      size={"lg"}
      disabled={!canConnectWallet}
      className="bsa-mt-10 bsa-w-full"
      variant={canConnectWallet ? "default" : "outline"}
      onClick={() => {
        if (
          sourceChain === "Select a chain" ||
          targetChain === "Select a chain"
        ) {
          return;
        }

        if (needSolanaWalletConnection) {
          setCurrentBridgeStep({
            step: "WALLET_SELECTION",
            params: {
              chain: "Solana",
              onSuccess() {
                console.log("needEvmWalletConnection", needEvmWalletConnection);
                if (needEvmWalletConnection) {
                  setCurrentBridgeStep({
                    step: "WALLET_SELECTION",
                    params: {
                      chain: evmChainNeeded,
                      onSuccess() {
                        setCurrentBridgeStep({
                          step: "MULTI_CHAIN_SELECTION",
                        });
                      },
                    },
                  });
                }
              },
            },
          });
        } else if (needEvmWalletConnection) {
          setCurrentBridgeStep({
            step: "WALLET_SELECTION",
            params: {
              chain: evmChainNeeded,
              onSuccess() {
                setCurrentBridgeStep({
                  step: "MULTI_CHAIN_SELECTION",
                });
              },
            },
          });
        }
      }}
    >
      {canConnectWallet ? "Connect Wallet" : "Select tokens"}
    </Button>
  );
}
