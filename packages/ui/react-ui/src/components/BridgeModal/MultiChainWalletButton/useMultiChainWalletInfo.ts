import { useCallback, useMemo } from "react";
//import { useAccount, useDisconnect } from "wagmi";
import { clearChain, useBridgeModalStore } from "bridge-adapter-react";
import { EMPTY_BRIDGE_STEP_TITLE } from "../../../types/BridgeModal";
import { useSolanaWalletMultiButton } from "../WalletSelection/useSolanaWalletMultiButton";

function useAccount() {
  return {};
}

function useDisconnect() {
  return {};
}

export const useMultiChainWalletInfo = () => {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { buttonState, onDisconnect } = useSolanaWalletMultiButton();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const solanaWalletConnected =
    (sourceChain === "Solana" || targetChain === "Solana") &&
    buttonState === "connected";
  const evmWalletConnected =
    sourceChain !== "Solana" && targetChain !== "Solana" && isConnected;

  const disconnectChain = useCallback(
    (whichChain: "Solana" | "Ethereum", clearChainState = true) => {
      if (sourceChain === whichChain && clearChainState) {
        clearChain("source");
        useBridgeModalStore.setState((state) => {
          state.chain.sourceChain = EMPTY_BRIDGE_STEP_TITLE;
        });
      }
      if (targetChain === whichChain && clearChainState) {
        clearChain("target");
        useBridgeModalStore.setState((state) => {
          state.chain.targetChain = EMPTY_BRIDGE_STEP_TITLE;
        });
      }
      if (whichChain === "Solana" && onDisconnect) {
        onDisconnect();
      }
      if (whichChain === "Ethereum") {
        disconnect();
      }
    },
    [disconnect, onDisconnect, sourceChain, targetChain],
  );

  return useMemo(
    () => ({
      solanaWalletConnected,
      evmWalletConnected,
      disconnectChain,
    }),
    [solanaWalletConnected, evmWalletConnected, disconnectChain],
  );
};
