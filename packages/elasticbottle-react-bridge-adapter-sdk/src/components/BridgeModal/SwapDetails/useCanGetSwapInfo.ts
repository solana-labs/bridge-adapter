import { useBridgeModalStore } from "../../../providers/BridgeModalContext";

export function useCanGetSwapInfo() {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  return {
    canGetSwapInfo:
      !!sourceToken.address &&
      !!targetToken.address &&
      sourceToken.selectedAmountInBaseUnits !== "0",
  };
}
