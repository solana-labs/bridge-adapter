import { SlippageToleranceWidget } from "./SlippageToleranceWidget";
import { RelayerFeeWidget } from "./RelayerFeeWidget";

export function SwapSettings() {
  return (
    <div className="bsa-flex bsa-flex-col">
      <SlippageToleranceWidget />
      <RelayerFeeWidget />
    </div>
  );
}
