import { useState } from "react";
import { cn } from "../../../lib/utils";
import {
  SLIPPING_TOLERANCE_AUTO,
  setSlippageTolerance,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import type { SlippageToleranceType } from "../../../types/BridgeModal";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export function SlippageToleranceWidget() {
  const slippageTolerance: SlippageToleranceType =
    useBridgeModalStore.use.slippageTolerance();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const tolerance = parseFloat(value);
      setInputValue(`${tolerance}`);
      setError("");
      try {
        setSlippageTolerance(tolerance);
      } catch (e) {
        setError("Please enter a valid number");
      }
    }
  };

  return (
    <div className="bsa-space-y-3 bsa-rounded-lg bsa-border bsa-p-5">
      <p>Slippage tolerance</p>
      <div className="bsa-flex bsa-items-center bsa-justify-between">
        <Button
          variant={
            slippageTolerance === SLIPPING_TOLERANCE_AUTO
              ? "secondary"
              : "outline"
          }
          size={"lg"}
          onClick={() => {
            setSlippageTolerance(SLIPPING_TOLERANCE_AUTO);
          }}
        >
          Auto
        </Button>
        <div className="bsa-ml-4">
          <Input
            placeholder="0.00"
            min={0}
            step={0.01}
            className={cn(
              `bsa-rounded-br-none bsa-rounded-tr-none bsa-border-r-0 bsa-text-right bsa-text-xl focus-visible:bsa-ring-0`,
              slippageTolerance === SLIPPING_TOLERANCE_AUTO
                ? "bsa-text-muted-foreground bsa-opacity-50"
                : ""
            )}
            value={
              slippageTolerance === SLIPPING_TOLERANCE_AUTO
                ? inputValue
                : slippageTolerance
            }
            onChange={onInputChange}
          />
          {error && (
            <div className="bsa-text-xs bsa-text-destructive-foreground">
              {error}
            </div>
          )}
        </div>
        <div
          className={cn(
            "bsa-h-10 bsa-rounded-md bsa-rounded-bl-none bsa-rounded-tl-none bsa-border bsa-border-l-0 bsa-border-input bsa-bg-background bsa-py-1 bsa-pr-3 bsa-text-xl bsa-ring-offset-background",
            slippageTolerance === SLIPPING_TOLERANCE_AUTO
              ? "bsa-text-muted-foreground bsa-opacity-50"
              : ""
          )}
        >
          %
        </div>
      </div>
    </div>
  );
}
