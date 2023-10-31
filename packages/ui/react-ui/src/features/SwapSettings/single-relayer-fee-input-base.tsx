import type { FC } from "react";
import { useState } from "react";
import { cn } from "../../shared/lib/styles";
import { Input } from "../../shared/ui/input";

export interface SingleRelayerFeeInputBaseProps {
  active?: boolean;
  chain?: string;
  className?: string;
  labels?: {
    [key: string]: string;
    invalidInputValueError: string;
  };
  relayerFee?: number;
  setRelayerFee?: (relayerFee: number) => void;
  token?: string;
}

const LABELS = {
  invalidInputValueError: "Please enter a valid number",
};

export const SingleRelayerFeeInputBase: FC<SingleRelayerFeeInputBaseProps> = ({
  active = false,
  chain,
  className,
  labels = LABELS,
  relayerFee = 0,
  setRelayerFee = () => ({}),
  token,
}) => {
  const [error, setError] = useState("");

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const fee = parseInt(value);
      try {
        setRelayerFee(fee);
        setError("");
      } catch (_: unknown) {
        setError(labels.invalidInputValueError);
      }
    }
  };

  if (!chain || !token || chain === "Select a chain") {
    return null;
  }
  return (
    <div className={cn("", className)}>
      <label>
        On {chain}
        <div className="bsa-mt-4 bsa-flex bsa-items-center">
          <div>
            <Input
              aria-label="Relayer Fee"
              className={cn(
                `bsa-rounded-br-none bsa-rounded-tr-none bsa-border-r-0 bsa-text-right bsa-text-xl focus-visible:bsa-ring-0`,
              )}
              disabled={!active}
              min={0}
              name="relayer-fee"
              onChange={onInputChange}
              placeholder="0.00"
              step={1}
              type="number"
              value={relayerFee}
            />
            {error && (
              <div className="bsa-text-xs bsa-text-destructive-foreground">
                {error}
              </div>
            )}
          </div>
          <div
            className={cn(
              "bsa-flex bsa-h-10 bsa-w-1/5 bsa-items-center bsa-rounded-md bsa-rounded-bl-none bsa-rounded-tl-none bsa-border bsa-border-l-0 bsa-border-input bsa-bg-background bsa-pr-2 bsa-text-xs bsa-ring-offset-background",
              active ? "" : "bsa-cursor-not-allowed bsa-opacity-50",
            )}
          >
            {token}
          </div>
        </div>
      </label>
    </div>
  );
};
