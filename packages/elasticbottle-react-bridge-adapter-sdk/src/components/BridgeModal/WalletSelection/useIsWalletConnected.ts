import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount } from "wagmi";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";

export function useIsWalletConnected() {
  const { isConnected: isEvmWalletConnected } = useAccount();
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
  }

  return {
    isWalletConnected: isEvmWalletConnected && isSolanaWalletConnected,
    needEvmWalletConnection: true,
    evmChainNeeded:
      sourceToken.chain === "Solana" ? targetToken.chain : sourceToken.chain,
    needSolanaWalletConnection: true,
  };
}
