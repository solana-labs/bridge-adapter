import { Clock2, DollarSign, Droplet } from "lucide-react";
import { formatSwapFee, formatTime } from "../../../lib/utils";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { PendingTransactionButton } from "../PendingTransaction/PendingTransactionButton";

export function SwapReview() {
  const swapInformation = useBridgeModalStore.use.swapInformation();
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
      <PendingTransactionButton />
    </div>
  );
}
