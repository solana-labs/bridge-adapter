import type { SwapInformation } from "bridge-adapter-base";
import { Clock2, Compass, DollarSign } from "lucide-react";
import {
  cn,
  formatRouteInfo,
  formatSwapFee,
  formatTime,
  isSwapInfoEqual,
} from "../../../lib/utils";
import {
  setCurrentBridgeStep,
  setSwapInformation,
  useBridgeModalStore,
} from "bridge-adapter-react";
import { Button } from "../../../shared/ui/button";
import { Skeleton } from "../../../shared/ui/skeleton";
import { useSwapInfo } from "./useSwapInfo";

export function SwapDetails() {
  const { isLoadingSwapInfo, swapInfo } = useSwapInfo();
  const currentSwapInfo = useBridgeModalStore.use.swapInformation();

  let SwapDetailsBody = Array(3)
    .fill(0)
    .map((_, idx) => {
      return <Skeleton key={idx} className="bsa-h-10 bsa-w-full" />;
    });

  const chooseSwapInfo = (swapInfo: SwapInformation) => {
    return () => {
      setSwapInformation(swapInfo);
      setCurrentBridgeStep({
        step: "MULTI_CHAIN_SELECTION",
      });
    };
  };

  if (!isLoadingSwapInfo && swapInfo) {
    SwapDetailsBody = swapInfo.map((swapInfo) => {
      const isCurrentlySelectedSwapInfo =
        !!currentSwapInfo && isSwapInfoEqual(swapInfo, currentSwapInfo);

      const route = formatRouteInfo(swapInfo.tradeDetails.routeInformation);

      return (
        <Button
          key={swapInfo.bridgeName + route}
          variant={"outline"}
          size={"lg"}
          className={cn({
            "bsa-h-full bsa-w-full bsa-flex-col bsa-items-start bsa-justify-center bsa-space-y-2":
              true,
            "bsa-bg-accent hover:bsa-cursor-default":
              isCurrentlySelectedSwapInfo,
          })}
          onClick={chooseSwapInfo(swapInfo)}
        >
          <div className="bsa-flex bsa-w-full bsa-items-center bsa-space-x-2">
            <img
              className="bsa-h-10 bsa-w-10 bsa-rounded-md"
              src={swapInfo.targetToken.logoUri}
              alt={swapInfo.targetToken.name}
            />
            <div className="bsa-flex bsa-flex-col bsa-items-start">
              <div className="bsa-text-xl">
                {swapInfo.targetToken.expectedOutputFormatted}{" "}
                {swapInfo.targetToken.symbol}
              </div>
              <div className="bsa-text-sm bsa-text-muted-foreground">
                Min received: {swapInfo.targetToken.minOutputFormatted}{" "}
                {swapInfo.targetToken.symbol}
              </div>
            </div>
          </div>
          <div className="bsa-flex bsa-items-center bsa-space-x-2 bsa-text-sm bsa-text-muted-foreground">
            <Compass />
            <div>
              {route} via {swapInfo.bridgeName}
            </div>
          </div>
          <div className="bsa-flex bsa-w-full bsa-items-center bsa-justify-between">
            <div className="bsa-flex bsa-items-center bsa-space-x-1 bsa-text-sm bsa-text-muted-foreground">
              <Clock2 />
              <div>
                {formatTime(swapInfo.tradeDetails.estimatedTimeMinutes)}
              </div>
            </div>
            <div className="bsa-flex bsa-items-center bsa-space-x-1 bsa-text-sm bsa-text-muted-foreground">
              <DollarSign />
              <div>{formatSwapFee(swapInfo.tradeDetails.fee)}</div>
            </div>
          </div>
        </Button>
      );
    });
  }

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-5">{SwapDetailsBody}</div>
  );
}
