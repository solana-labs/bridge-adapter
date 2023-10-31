import { useBridgeModalStore } from "@solana/bridge-adapter-react";

// FIXME: write test

export function useCanGetSwapInfo() {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();

  return {
    canGetSwapInfo:
      !!sourceToken.address &&
      !!targetToken.address &&
      sourceToken.selectedAmountInBaseUnits !== "0",
  };
}
