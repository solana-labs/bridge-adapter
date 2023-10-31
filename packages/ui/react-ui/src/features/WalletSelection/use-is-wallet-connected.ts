import {
  useBridgeModalStore,
  useEvmContext,
  useSolanaWallet as useWallet,
} from "@solana/bridge-adapter-react";
import Debug from "debug";

const warn = Debug("warn:react-ui:useIsWalletConnected");

export function useIsWalletConnected() {
  const { isConnected: isEvmWalletConnected } = useEvmContext();
  const { connected: isSolanaWalletConnected } = useWallet();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();

  if (sourceToken.chain === "Solana" && targetToken.chain === "Solana") {
    return {
      isWalletConnected: isSolanaWalletConnected,
      needEvmWalletConnection: false,
      // this should never be used since its solana. Added for typing completeness
      evmChainNeeded: sourceToken.chain,
      needSolanaWalletConnection: true,
    };
  } else if (sourceToken.chain !== "Solana" && targetToken.chain !== "Solana") {
    return {
      isWalletConnected: isEvmWalletConnected,
      needEvmWalletConnection: true,
      evmChainNeeded: sourceToken.chain,
      needSolanaWalletConnection: false,
    };
  } else {
    warn("Unsupported chain combination detected.");
  }

  return {
    isWalletConnected: isEvmWalletConnected && isSolanaWalletConnected,
    needEvmWalletConnection: true,
    evmChainNeeded:
      sourceToken.chain === "Solana" ? targetToken.chain : sourceToken.chain,
    needSolanaWalletConnection: true,
  };
}
