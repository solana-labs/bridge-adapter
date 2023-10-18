import * as BridgeAdapter from "@solana/bridge-adapter-react";
import type { FC } from "react";
import type { SwapInformation } from "@solana/bridge-adapter-base";
import { SwapDetailsBase } from "./swap-details-base";
import { useSwapInfo } from "./use-swap-info";

export const SwapDetails: FC<unknown> = () => {
  const { isLoadingSwapInfo, routeErrors, swapInfo } = useSwapInfo();
  const currentSwapInfo =
    BridgeAdapter.useBridgeModalStore.use.swapInformation();

  const chooseSwapInfo = (info: SwapInformation) => {
    BridgeAdapter.setSwapInformation(info);
    BridgeAdapter.setCurrentBridgeStep({
      step: "MULTI_CHAIN_SELECTION",
    });
  };

  return (
    <SwapDetailsBase
      currentSwapInfo={currentSwapInfo}
      isLoading={isLoadingSwapInfo}
      onSelectSwapInfo={chooseSwapInfo}
      routeErrors={routeErrors}
      swapInfo={swapInfo}
    />
  );
};
