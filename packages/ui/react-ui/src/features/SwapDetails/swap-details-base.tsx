import * as lib from "../../shared/lib/utils";
import type { FC } from "react";
import type { RouteError, SwapInformation } from "@solana/bridge-adapter-base";
import { Button } from "../../shared/ui/button";
import { Clock2, Compass, DollarSign } from "lucide-react";
import { cn } from "../../shared/lib/styles";
import { Separator } from "@radix-ui/react-separator";
import { Skeleton } from "../../shared/ui/skeleton";
import { useCallback } from "react";

type SwapRouteErrorType = RouteError<{ code: number; message: string }>;

export interface SwapDetailsBaseProps {
  currentSwapInfo?: SwapInformation;
  isLoading: boolean;
  onSelectSwapInfo: (a: SwapInformation) => void;
  routeErrors: SwapRouteErrorType[];
  swapInfo?: SwapInformation[];
}

export const SwapDetailsBase: FC<SwapDetailsBaseProps> = ({
  currentSwapInfo,
  isLoading: isLoadingSwapInfo,
  onSelectSwapInfo,
  routeErrors,
  swapInfo,
}) => {
  let SwapDetailsBody = Array(3)
    .fill(0)
    .map((_, idx) => {
      return <Skeleton key={idx} className="bsa-h-10 bsa-w-full" />;
    });

  const onChooseSwapInfo = useCallback(
    (info: SwapInformation) => {
      return onSelectSwapInfo(info);
    },
    [onSelectSwapInfo],
  );

  if (!isLoadingSwapInfo && swapInfo) {
    SwapDetailsBody = swapInfo.map((info) => {
      const isCurrentlySelectedSwapInfo =
        !!currentSwapInfo && lib.isSwapInfoEqual(info, currentSwapInfo);

      const route = lib.formatRouteInfo(info.tradeDetails.routeInformation);

      const hasFee = info.tradeDetails.fee.length > 0;

      const routeError = undefined;
      const hasError = Boolean(routeError);

      return (
        <Button
          aria-label={`Use ${info.bridgeName} with Route ${route}`}
          className={cn({
            "bsa-h-full bsa-w-full bsa-flex-col bsa-items-start bsa-justify-center bsa-space-y-2":
              true,
            "bsa-bg-accent hover:bsa-cursor-default":
              isCurrentlySelectedSwapInfo,
            "bsa-border-red-800 bsa-relative": hasError,
          })}
          disabled={hasError}
          key={info.bridgeName + route}
          onClick={() => onChooseSwapInfo(info)}
          size="lg"
          variant="outline"
        >
          <div className="bsa-flex bsa-w-full bsa-items-center bsa-space-x-2">
            <img
              className="bsa-h-10 bsa-w-10 bsa-rounded-md"
              src={info.targetToken.logoUri}
              alt={info.targetToken.name}
            />
            <div className="bsa-flex bsa-flex-col bsa-items-start">
              <div className="bsa-text-xl">
                {info.targetToken.expectedOutputFormatted}{" "}
                {info.targetToken.symbol}
              </div>
              <div className="bsa-text-sm bsa-text-muted-foreground">
                Min received: {info.targetToken.minOutputFormatted}{" "}
                {info.targetToken.symbol}
              </div>
            </div>
          </div>
          <div className="bsa-flex bsa-items-center bsa-space-x-2 bsa-text-sm bsa-text-muted-foreground">
            <Compass />
            <div>
              {route} via {info.bridgeName}
            </div>
          </div>
          <div className="bsa-flex bsa-w-full bsa-items-center bsa-justify-between">
            <div className="bsa-flex bsa-items-center bsa-space-x-1 bsa-text-sm bsa-text-muted-foreground">
              <Clock2 />
              <div>
                {lib.formatTime(info.tradeDetails.estimatedTimeMinutes)}
              </div>
            </div>
            <div className="bsa-flex bsa-items-center bsa-space-x-1 bsa-text-sm bsa-text-muted-foreground">
              <DollarSign />
              <div>
                {hasFee ? lib.formatSwapFee(info.tradeDetails.fee) : "No fee"}
              </div>
            </div>
          </div>
        </Button>
      );
    });
  }

  return (
    <div className="bsa-flex bsa-flex-col bsa-space-y-5">
      {SwapDetailsBody}
      {routeErrors?.length > 0 ? (
        <>
          <div className="bsa-flex bsa-w-full bsa-items-center bsa-justify-around bsa-text-muted-foreground">
            <Separator
              className="bsa-h-[2px] bsa-w-1/3 bsa-bg-muted"
              decorative
            />
            Other Routes
            <Separator
              className="bsa-h-[2px] bsa-w-1/3 bsa-bg-muted"
              decorative
            />
          </div>
          {routeErrors.map<SwapRouteErrorType>((re) => {
            return (
              <SwapRouteError key={`routeError-${re.index}`} routeError={re} />
            );
          })}
        </>
      ) : null}
    </div>
  );
};

function SwapRouteError({ routeError }: { routeError: SwapRouteErrorType }) {
  return (
    <div className="bsa-rounded-md bsa-bg-red-50 bsa-px-1 bsa-py-2">
      <div className="bsa-flex">
        <div className="bsa-ml-3">
          <h3 className="bsa-text-sm bsa-font-medium bsa-text-red-800 bsa-text-left">
            Route Error: {routeError?.reason ? routeError.reason.code : null}
          </h3>
          {routeError?.reason ? (
            <div className="bsa-mt-2 bsa-text-sm bsa-text-red-700">
              <ul
                role="list"
                className="bsa-list-disc bsa-space-y-1 bsa-pl-5 bsa-text-left"
              >
                <li>{routeError.reason.message}</li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
