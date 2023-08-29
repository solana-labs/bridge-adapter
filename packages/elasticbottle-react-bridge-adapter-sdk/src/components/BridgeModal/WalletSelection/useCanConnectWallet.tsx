import { useBridgeModalStore } from "../../../providers/BridgeModalContext";

export function useCanConnectWallet() {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();

  const canConnectWallet = !!sourceToken.address && !!targetToken.address;
  return canConnectWallet;
}
