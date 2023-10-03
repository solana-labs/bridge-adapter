import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "@solana/bridge-adapter-react";
import type { FC } from "react";
import { useCallback } from "react";
import { useCanConnectWallet } from "./use-can-connect-wallet";
import { useIsWalletConnected } from "./use-is-wallet-connected";
import { WalletSelectionButtonBase } from "./wallet-selection-button-base";

export const WalletSelectionButton: FC<unknown> = () => {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const {
    needEvmWalletConnection,
    needSolanaWalletConnection,
    evmChainNeeded,
  } = useIsWalletConnected();
  const canConnectWallet = useCanConnectWallet();

  const onWalletSelect = useCallback(() => {
    if (needSolanaWalletConnection) {
      setCurrentBridgeStep({
        step: "WALLET_SELECTION",
        params: {
          chain: "Solana",
          onSuccess() {
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
  }, [evmChainNeeded, needEvmWalletConnection, needSolanaWalletConnection]);

  return (
    <WalletSelectionButtonBase
      className="bsa-mt-10"
      onSelect={onWalletSelect}
      canConnectWallet={canConnectWallet}
      hasSourceChain={Boolean(sourceChain)}
      hasTargetChain={Boolean(targetChain)}
    />
  );
};
