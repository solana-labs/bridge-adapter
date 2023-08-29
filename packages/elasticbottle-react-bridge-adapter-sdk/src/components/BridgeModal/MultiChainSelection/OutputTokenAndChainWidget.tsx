import { useBridgeModalStore } from "../../../providers/BridgeModalContext";
import { ChainAndTokenSelectButton } from "../ChainAndTokenSelect/ChainAndTokenSelectButton";
import { useTokenBalance } from "./useTokenBalance";

export function OutputTokenAndChainWidget() {
  const { targetToken } = useBridgeModalStore.use.token();
  const swapInformation = useBridgeModalStore.use.swapInformation();

  const tokenOfInterest = targetToken;

  const { error: errorGettingTokenBalance, tokenBalance } =
    useTokenBalance(tokenOfInterest);
  if (errorGettingTokenBalance) {
    throw errorGettingTokenBalance;
  }

  return (
    <div className="bsa-space-x-3 bsa-rounded-lg bsa-border bsa-p-5">
      <div className="bsa-flex bsa-justify-between">
        <div className="bsa-text-xl">
          {swapInformation?.targetToken.expectedOutputFormatted ?? "0.00"}
        </div>
        <div className="bsa-flex bsa-flex-col bsa-items-end bsa-space-y-2">
          <ChainAndTokenSelectButton
            chainDest={"target"}
            className="bsa-px-2"
          />
          <div className="bsa-min-w-max bsa-text-muted-foreground">
            Balance: {tokenBalance ?? "0"} {tokenOfInterest.symbol}
          </div>
        </div>
      </div>
    </div>
  );
}
