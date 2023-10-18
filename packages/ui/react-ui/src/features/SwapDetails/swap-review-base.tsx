import { Clock2, DollarSign, Droplet } from "lucide-react";
import type { FC, HTMLProps } from "react";
import type { SwapInformation } from "@solana/bridge-adapter-base";
import { PendingTransactionButtonBase } from "./pending-transaction-button-base";
import { formatSwapFee, formatTime } from "../../shared/lib/utils";
import { Card, CardContent, CardHeader } from "../../shared/ui/card";

export interface SwapReviewBaseProps extends HTMLProps<HTMLDivElement> {
  onBeginSwap: () => void;
  labels?: {
    [key: string]: string;
    fees: string;
    header: string;
    impact: string;
    source: string;
    target: string;
    timeEstimation: string;
  };
  swapInformation?: SwapInformation;
}

const LABELS = {
  fees: "Fees",
  header: "Review Details",
  impact: "Price Impact",
  source: "Paying Token",
  target: "Receiving Token",
  timeEstimation: "Estimated Bridge Time",
};

export const SwapReviewBase: FC<SwapReviewBaseProps> = ({
  onBeginSwap,
  labels = LABELS,
  swapInformation,
}) => {
  if (!swapInformation) {
    throw new Error("Swap information is not set");
  }

  const { sourceToken, targetToken } = swapInformation;
  return (
    <div className="bsa-h-full bsa-flex-col bsa-justify-between">
      <Card>
        <CardHeader className="bsa-text-sm">{labels.header}</CardHeader>
        <CardContent>
          <div className="bsa-space-y-6">
            <div className="bsa-flex bsa-items-center bsa-justify-between">
              <div className="bsa-text-muted-foreground">{labels.source}</div>
              <div>
                {sourceToken.selectedAmountFormatted} {sourceToken.symbol} (
                {sourceToken.chain})
              </div>
            </div>
            <div className="bsa-flex bsa-items-center bsa-justify-between">
              <div className="bsa-text-muted-foreground">{labels.target}</div>
              <div>
                {targetToken.expectedOutputFormatted} {targetToken.symbol} (
                {targetToken.chain})
              </div>
            </div>
            <div className="bsa-flex bsa-items-center bsa-justify-between bsa-text-muted-foreground">
              <div className="bsa-flex bsa-items-center bsa-justify-start bsa-space-x-2">
                <Droplet />
                <div>{labels.impact}</div>
              </div>
              <div>{swapInformation.tradeDetails.priceImpact}%</div>
            </div>
            <div className="bsa-flex bsa-items-center bsa-justify-between bsa-text-muted-foreground">
              <div className="bsa-flex bsa-items-center bsa-justify-start bsa-space-x-2">
                <Clock2 />
                <div>{labels.timeEstimation}</div>
              </div>
              <div>
                {formatTime(swapInformation.tradeDetails.estimatedTimeMinutes)}
              </div>
            </div>
            <div className="bsa-flex bsa-items-center bsa-justify-between bsa-text-muted-foreground">
              <div className="bsa-flex bsa-items-center bsa-justify-start bsa-space-x-2">
                <DollarSign />
                <div>{labels.fees}</div>
              </div>
              <div>{formatSwapFee(swapInformation.tradeDetails.fee)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <PendingTransactionButtonBase
        className="bsa-mt-10"
        onClick={onBeginSwap}
        aria-label="Begin Swap"
      />
    </div>
  );
};
