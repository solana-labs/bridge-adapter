import { Clock2, DollarSign, Droplet } from "lucide-react";
import type { FC } from "react";
import type { SwapInformation } from "@solana/bridge-adapter-base";
import { formatSwapFee, formatTime } from "../../shared/lib/utils";
import { Card, CardContent, CardHeader } from "../../shared/ui/card";
import { PendingTransactionButtonBase } from "./pending-transaction-button-base";

interface SwapReviewBaseProps {
  onBeginSwap: () => void;
  swapInformation?: SwapInformation;
}

export const SwapReviewBase: FC<SwapReviewBaseProps> = ({
  onBeginSwap,
  swapInformation,
}) => {
  if (!swapInformation) {
    throw new Error("Swap information is not set");
  }

  const { sourceToken, targetToken } = swapInformation;
  return (
    <div className="bsa-h-full bsa-flex-col bsa-justify-between">
      <Card>
        <CardHeader className="bsa-text-sm">Review Details</CardHeader>
        <CardContent>
          <div className="bsa-space-y-6">
            <div className="bsa-flex bsa-items-center bsa-justify-between">
              <div className="bsa-text-muted-foreground">Paying Token</div>
              <div>
                {sourceToken.selectedAmountFormatted} {sourceToken.symbol} (
                {sourceToken.chain})
              </div>
            </div>
            <div className="bsa-flex bsa-items-center bsa-justify-between">
              <div className="bsa-text-muted-foreground">Receiving Token</div>
              <div>
                {targetToken.expectedOutputFormatted} {targetToken.symbol} (
                {targetToken.chain})
              </div>
            </div>
            <div className="bsa-flex bsa-items-center bsa-justify-between bsa-text-muted-foreground">
              <div className="bsa-flex bsa-items-center bsa-justify-start bsa-space-x-2">
                <Droplet />
                <div>Price Impact</div>
              </div>
              <div>{swapInformation.tradeDetails.priceImpact}%</div>
            </div>
            <div className="bsa-flex bsa-items-center bsa-justify-between bsa-text-muted-foreground">
              <div className="bsa-flex bsa-items-center bsa-justify-start bsa-space-x-2">
                <Clock2 />
                <div>Estimated Bridge Time</div>
              </div>
              <div>
                {formatTime(swapInformation.tradeDetails.estimatedTimeMinutes)}
              </div>
            </div>
            <div className="bsa-flex bsa-items-center bsa-justify-between bsa-text-muted-foreground">
              <div className="bsa-flex bsa-items-center bsa-justify-start bsa-space-x-2">
                <DollarSign />
                <div>Fees</div>
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
