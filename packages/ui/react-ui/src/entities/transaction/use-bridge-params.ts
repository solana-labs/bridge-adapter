import type {
  SolanaOrEvmAccount,
  SwapInformation,
} from "@solana/bridge-adapter-base";
import {
  useBridgeModalStore,
  useEthereumWallet,
  useSolanaWallet as useWallet,
} from "@solana/bridge-adapter-react";

export function useBridgeParams(): {
  sourceAccount: SolanaOrEvmAccount | undefined;
  targetAccount: SolanaOrEvmAccount | undefined;
  swapInformation: SwapInformation;
} {
  const swapInformation = useBridgeModalStore.use.swapInformation();
  if (!swapInformation) {
    throw new Error("No swap information found");
  }
  const { signTransaction, publicKey } = useWallet();
  const { data: walletClient, isLoading: isLoadingWalletClient } =
    useEthereumWallet();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();

  if (sourceToken.chain === "Solana" && !signTransaction && !publicKey) {
    throw new Error("Source account is not a Solana account");
  } else if (
    sourceToken.chain !== "Solana" &&
    !walletClient &&
    !isLoadingWalletClient
  ) {
    throw new Error("Source account is not an EVM account");
  }
  if (targetToken.chain === "Solana" && !signTransaction && !publicKey) {
    throw new Error("Target account is not a Solana account");
  } else if (
    targetToken.chain !== "Solana" &&
    !walletClient &&
    !isLoadingWalletClient
  ) {
    throw new Error("Target account is not an EVM account");
  }

  return {
    sourceAccount:
      sourceToken.chain === "Solana"
        ? ({ signTransaction, publicKey } as SolanaOrEvmAccount)
        : walletClient ?? (undefined as SolanaOrEvmAccount | undefined),
    targetAccount:
      targetToken.chain === "Solana"
        ? ({ signTransaction, publicKey } as SolanaOrEvmAccount)
        : walletClient ?? (undefined as SolanaOrEvmAccount | undefined),
    swapInformation,
  };
}
