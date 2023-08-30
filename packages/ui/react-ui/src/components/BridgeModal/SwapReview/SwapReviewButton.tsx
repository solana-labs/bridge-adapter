import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "bridge-adapter-react";
import { Button } from "../../../shared/ui/button";

export function SwapReviewButton() {
  const swapInformation = useBridgeModalStore.use.swapInformation();
  const canReviewSwap = !!swapInformation;

  return (
    <Button
      size={"lg"}
      disabled={!canReviewSwap}
      className="bsa-mt-10 bsa-w-full"
      variant={canReviewSwap ? "default" : "outline"}
      onClick={() => {
        setCurrentBridgeStep({
          step: "SWAP_REVIEW",
        });
      }}
    >
      Review Swap
    </Button>
  );
}
