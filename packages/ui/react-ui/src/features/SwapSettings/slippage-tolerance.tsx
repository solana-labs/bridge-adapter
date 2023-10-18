import type { FC } from "react";
import type { SlippageToleranceType } from "@solana/bridge-adapter-react";
import { useCallback, useState } from "react";
import {
  setSlippageTolerance,
  useBridgeModalStore,
} from "@solana/bridge-adapter-react";
import { SlippageToleranceBase } from "./slippage-tolerance-base";

export const SlippageTolerance: FC<unknown> = () => {
  const slippageTolerance: SlippageToleranceType =
    useBridgeModalStore.use.slippageTolerance();

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const onInputChange = useCallback(
    (value: string) => {
      if (value) {
        const tolerance = parseFloat(String(value));
        setInputValue(`${tolerance}`);
        setError("");
        try {
          setSlippageTolerance(tolerance);
        } catch (e) {
          setError("Please enter a valid number");
        }
      }
    },
    [setInputValue, setError],
  );

  return (
    <SlippageToleranceBase
      error={error}
      slippage={inputValue}
      slippageTolerance={slippageTolerance}
      onSetSlippage={(value) => {
        setSlippageTolerance(value);
      }}
      onValueChange={onInputChange}
    />
  );
};
