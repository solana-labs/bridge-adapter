import { useBridgeModalStore } from "@solana/bridge-adapter-react";

export function useCanConnectWallet() {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();

  const canConnectWallet =
    Boolean(sourceToken.address) && Boolean(targetToken.address);

  return canConnectWallet;
}
