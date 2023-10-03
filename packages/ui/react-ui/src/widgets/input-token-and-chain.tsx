import { useEffect, useState } from "react";
import {
  TOKEN_AMOUNT_ERROR_INDICATOR,
  setTokenAmount,
  useBridgeModalStore,
} from "@solana/bridge-adapter-react";
import { Input } from "../shared/ui/input";
import { ChainAndTokenSelectButton } from "../features/ChainAndTokenSelect";
import { useIsWalletConnected } from "../features/WalletSelection";
import { useTokenBalance } from "../features/MultiChainSelection";

/**
 *  Widget
 */
export function InputTokenAndChainWidget() {
  const { sourceToken } = useBridgeModalStore.use.token();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const tokenOfInterest = sourceToken;
  const chainDest = "source";

  const { error: errorGettingTokenBalance, tokenBalance } =
    useTokenBalance(tokenOfInterest);
  if (errorGettingTokenBalance) {
    throw errorGettingTokenBalance;
  }
  const { isWalletConnected } = useIsWalletConnected();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setError("");
    try {
      setTokenAmount(value, chainDest);
    } catch (e) {
      setError("Please enter a valid number");
    }
  };

  useEffect(() => {
    if (
      tokenOfInterest.selectedAmountFormatted !== TOKEN_AMOUNT_ERROR_INDICATOR
    ) {
      setInputValue(tokenOfInterest.selectedAmountFormatted);
      setError("");
    }
  }, [tokenOfInterest.selectedAmountFormatted]);

  return (
    <div className="bsa-space-x-3 bsa-rounded-lg bsa-border bsa-p-5">
      <div className="bsa-flex bsa-justify-between">
        <div>
          <Input
            placeholder="0.00"
            className="bsa-border-none bsa-text-xl focus-visible:bsa-ring-0"
            value={
              tokenOfInterest.selectedAmountFormatted ===
              TOKEN_AMOUNT_ERROR_INDICATOR
                ? inputValue
                : tokenOfInterest.selectedAmountFormatted
            }
            onChange={onInputChange}
            disabled={!isWalletConnected}
          />
          {error && (
            <div className="bsa-text-xs bsa-text-destructive-foreground">
              {error}
            </div>
          )}
        </div>
        <div className="bsa-flex bsa-flex-col bsa-items-end bsa-space-y-2">
          <ChainAndTokenSelectButton
            chainDest={chainDest}
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
