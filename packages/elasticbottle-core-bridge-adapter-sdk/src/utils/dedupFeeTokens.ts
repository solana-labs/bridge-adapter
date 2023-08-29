import type { FeeToken } from "../types/Token";

export function dedupFeesTokens(fees: FeeToken[]): FeeToken[] {
  const dedupFees = fees.reduce((prev, curr) => {
    const idx = prev.findIndex((fee) => fee.symbol === curr.symbol);
    if (idx !== -1) {
      prev[idx].selectedAmountInBaseUnits = (
        BigInt(prev[idx].selectedAmountInBaseUnits) +
        BigInt(curr.selectedAmountInBaseUnits)
      ).toString();
    } else {
      prev.push(curr);
    }
    return prev;
  }, [] as FeeToken[]);
  return dedupFees;
}
