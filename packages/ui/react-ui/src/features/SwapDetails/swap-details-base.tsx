import type { SwapInformation } from "@solana/bridge-adapter-base";
import type { FC } from "react";
import { useCallback } from "react";
import { Clock2, Compass, DollarSign } from "lucide-react";
import { cn } from "../../shared/lib/styles";
import {
  formatRouteInfo,
  formatSwapFee,
  formatTime,
  isSwapInfoEqual,
} from "../../shared/lib/utils";
import { Button } from "../../shared/ui/button";
import { Skeleton } from "../../shared/ui/skeleton";

interface SwapDetailsBaseProps {
  currentSwapInfo?: SwapInformation;
  isLoading: boolean;
  onSelectSwapInfo: (a: SwapInformation) => void;
  swapInfo?: SwapInformation[];
}

export const SwapDetailsBase: FC<SwapDetailsBaseProps> = ({
  currentSwapInfo,
  isLoading: isLoadingSwapInfo,
  onSelectSwapInfo,
  swapInfo,
}) => {
  let SwapDetailsBody = Array(3)
    .fill(0)
    .map((_, idx) => {
      return <Skeleton key={idx} className="bsa-h-10 bsa-w-full" />;
    });

  const onChooseSwapInfo = useCallback(
    (swapInfo: SwapInformation) => {
      return onSelectSwapInfo(swapInfo);
    },
    [onSelectSwapInfo],
  );

  if (!isLoadingSwapInfo && swapInfo) {
    SwapDetailsBody = swapInfo.map((swapInfo) => {
      const isCurrentlySelectedSwapInfo =
        !!currentSwapInfo && isSwapInfoEqual(swapInfo, currentSwapInfo);

      const route = formatRouteInfo(swapInfo.tradeDetails.routeInformation);

      return (
        <Button
          key={swapInfo.bridgeName + route}
          variant="outline"
          size="lg"
          className={cn({
            "bsa-h-full bsa-w-full bsa-flex-col bsa-items-start bsa-justify-center bsa-space-y-2":
              true,
            "bsa-bg-accent hover:bsa-cursor-default":
              isCurrentlySelectedSwapInfo,
          })}
          onClick={() => onChooseSwapInfo(swapInfo)}
          aria-label={`Use ${swapInfo.bridgeName} with Route ${route}`}
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
};
