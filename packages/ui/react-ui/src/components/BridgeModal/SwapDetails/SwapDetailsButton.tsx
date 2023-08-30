import { ChevronRight } from "lucide-react";
import { setCurrentBridgeStep } from "bridge-adapter-react";
import { Button } from "../../../shared/ui/button";
import { useCanGetSwapInfo } from "./useCanGetSwapInfo";
import { useSwapInfo } from "./useSwapInfo";

export function SwapDetailButton() {
  const { isLoadingSwapInfo, swapInfo } = useSwapInfo();
  const { canGetSwapInfo } = useCanGetSwapInfo();
  let ButtonBody: string | JSX.Element = "No Swap Route Found";
  if (canGetSwapInfo && isLoadingSwapInfo) {
    ButtonBody = "Fetching Swap Route Details";
  } else if (canGetSwapInfo && !isLoadingSwapInfo && swapInfo) {
    ButtonBody = (
      <>
        <div>View Swap Route Details</div>
        <ChevronRight />
      </>
    );
  }
  return (
    <Button
      size={"lg"}
      disabled={!canGetSwapInfo}
      isLoading={canGetSwapInfo && isLoadingSwapInfo}
      className="bsa-mt-10 bsa-w-full bsa-justify-between"
      variant={canGetSwapInfo ? "outline" : "ghost"}
      onClick={() => {
        setCurrentBridgeStep({
          step: "SWAP_DETAILS",
        });
      }}
    >
      {ButtonBody}
    </Button>
  );
}
