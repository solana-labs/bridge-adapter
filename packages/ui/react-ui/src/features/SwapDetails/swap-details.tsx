import type { SwapInformation } from "@solana/bridge-adapter-base";
import type { FC } from "react";
import {
  setCurrentBridgeStep,
  setSwapInformation,
  useBridgeModalStore,
} from "@solana/bridge-adapter-react";
import { useSwapInfo } from "./use-swap-info";
import { SwapDetailsBase } from "./swap-details-base";

export const SwapDetails: FC<unknown> = () => {
  const { isLoadingSwapInfo, swapInfo } = useSwapInfo();
  const currentSwapInfo = useBridgeModalStore.use.swapInformation();

  const chooseSwapInfo = (swapInfo: SwapInformation) => {
    return () => {
      setSwapInformation(swapInfo);
      setCurrentBridgeStep({
        step: "MULTI_CHAIN_SELECTION",
      });
    };
  };

  return (
    <SwapDetailsBase
      currentSwapInfo={currentSwapInfo}
      isLoading={isLoadingSwapInfo}
      onSelectSwapInfo={chooseSwapInfo}
      swapInfo={swapInfo}
    />
  );
};
