import type { FC } from "react";
import type { SlippageToleranceType } from "@solana/bridge-adapter-react";
import { Button } from "../../shared/ui/button";
import { cn } from "../../shared/lib/styles";
import { Input } from "../../shared/ui/input";
import { SLIPPING_TOLERANCE_AUTO } from "@solana/bridge-adapter-react";
import { useCallback } from "react";

export interface SlippageToleranceBaseProps {
  error?: string;
  labels?: {
    [key: string]: string;
    title: string;
  };
  onSetSlippage: (v: number | "auto") => void;
  onValueChange: (t: string) => void;
  slippage: string;
  slippageTolerance: SlippageToleranceType;
}

const LABELS = {
  title: "Slippage Tolerance",
};

export const SlippageToleranceBase: FC<SlippageToleranceBaseProps> = ({
  error,
  labels = LABELS,
  onSetSlippage,
  onValueChange,
  slippage,
  slippageTolerance,
}) => {
  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value) {
        onValueChange(value);
      }
    },
    [onValueChange],
  );

  return (
    <div className="bsa-space-y-3 bsa-rounded-lg bsa-border bsa-p-5">
      <p>{labels.title}</p>
      <div className="bsa-flex bsa-items-center bsa-justify-between">
        <Button
          variant={
            slippageTolerance === SLIPPING_TOLERANCE_AUTO
              ? "secondary"
              : "outline"
          }
          size="lg"
          onClick={() => {
            onSetSlippage(SLIPPING_TOLERANCE_AUTO);
          }}
        >
          Auto
        </Button>
        <div className="bsa-ml-4">
          <Input
            aria-label="Slippage Tolerance"
            className={cn(
              `bsa-rounded-br-none bsa-rounded-tr-none bsa-border-r-0 bsa-text-right bsa-text-xl focus-visible:bsa-ring-0`,
              slippageTolerance === SLIPPING_TOLERANCE_AUTO
                ? "bsa-text-muted-foreground bsa-opacity-50"
                : "",
            )}
            min={0}
            name="slippage-tolerance"
            onChange={onInputChange}
            placeholder="0.00"
            step={0.01}
            value={
              slippageTolerance === SLIPPING_TOLERANCE_AUTO
                ? slippage
                : slippageTolerance
            }
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
              : "",
          )}
        >
          %
        </div>
      </div>
    </div>
  );
};
