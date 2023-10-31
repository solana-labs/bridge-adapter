import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "@solana/bridge-adapter-react";
import { SwapReviewButtonBase } from "./swap-review-button-base";

export function SwapReviewButton() {
  const swapInformation = useBridgeModalStore.use.swapInformation();
  const canReviewSwap = !!swapInformation;

  return (
    <SwapReviewButtonBase
      className="bsa-mt-10"
      isAbleReview={canReviewSwap}
      onClick={() => {
        setCurrentBridgeStep({
          step: "SWAP_REVIEW",
        });
      }}
    />
  );
}
