import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "bridge-adapter-react";
import type { FC } from "react";
import { SwapReviewBase } from "./swap-review-base";

export const SwapReview: FC<unknown> = () => {
  const swapInformation = useBridgeModalStore.use.swapInformation();
  if (!swapInformation) {
    throw new Error("Swap information is not set");
  }

  return (
    <SwapReviewBase
      swapInformation={swapInformation}
      onBeginSwap={() => {
        setCurrentBridgeStep({ step: "PENDING_TRANSACTION" });
      }}
    />
  );
};
