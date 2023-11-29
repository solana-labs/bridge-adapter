import type { ChainName } from "@solana/bridge-adapter-core";
import { CHAIN_ALIASES } from "@solana/bridge-adapter-core";
import { clearChain, useBridgeModalStore } from "@solana/bridge-adapter-react";
import { EMPTY_BRIDGE_STEP_TITLE } from "../../constants";
import { useCallback, useMemo } from "react";
import { useEvmContext } from "@solana/bridge-adapter-react";
import { useSolanaWalletMultiButton } from "@solana/bridge-adapter-base-ui";

type SolEthChains = Extract<ChainName, "Solana" | "Ethereum">;

export const useMultiChainWalletInfo = () => {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { buttonState, onDisconnect } = useSolanaWalletMultiButton();
  const { isConnected, disconnect } = useEvmContext();

  const solanaWalletConnected =
    (sourceChain === CHAIN_ALIASES.Solana ||
      targetChain === CHAIN_ALIASES.Solana) &&
    buttonState === "connected";
  const evmWalletConnected =
    (sourceChain !== CHAIN_ALIASES.Solana ||
      targetChain !== CHAIN_ALIASES.Solana) &&
    isConnected;

  const disconnectChain = useCallback(
    (whichChain: SolEthChains, clearChainState = true) => {
      if (sourceChain === whichChain && clearChainState) {
        clearChain("source");
        useBridgeModalStore.setState((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          state.chain.sourceChain = EMPTY_BRIDGE_STEP_TITLE;
        });
      }
      if (targetChain === whichChain && clearChainState) {
        clearChain("target");
        useBridgeModalStore.setState((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          state.chain.targetChain = EMPTY_BRIDGE_STEP_TITLE;
        });
      }
      if (whichChain === CHAIN_ALIASES.Solana && onDisconnect) {
        onDisconnect();
      }
      if (whichChain === CHAIN_ALIASES.Ethereum) {
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
