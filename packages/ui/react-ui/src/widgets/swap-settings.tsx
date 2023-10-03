import { SlippageTolerance, RelayerFee } from "../features/SwapSettings";

/**
 *  Widget
 */
export function SwapSettings() {
  return (
    <div className="bsa-flex bsa-flex-col">
      <SlippageTolerance />
      <RelayerFee />
    </div>
  );
}
