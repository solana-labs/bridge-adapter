import type { FC } from "react";
import { setCurrentBridgeStep } from "@solana/bridge-adapter-react";
import { useCanGetSwapInfo } from "./use-can-get-swap-info";
import { useSwapInfo } from "./use-swap-info";
import { SwapDetailsButtonBase } from "./swap-details-button-base";

export const SwapDetailsButton: FC<unknown> = () => {
  const { isLoadingSwapInfo, swapInfo } = useSwapInfo();
  const { canGetSwapInfo } = useCanGetSwapInfo();

  return (
    <SwapDetailsButtonBase
      isLoadingDetails={isLoadingSwapInfo}
      isAbleRetrieveDetails={canGetSwapInfo}
      hasDetails={Boolean(swapInfo)}
      className="bsa-mt-10"
      onClick={() => {
        setCurrentBridgeStep({ step: "SWAP_DETAILS" });
      }}
    />
  );
};
