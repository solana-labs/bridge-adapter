import { cn } from "../../../lib/utils";
import { Input } from "../../ui/input";
import { useState } from "react";

export interface SingleRelayerFeeInputProps {
  active?: boolean;
  chain?: string;
  token?: string;
  relayerFee?: number;
  setRelayerFee?: (relayerFee: number) => void;
  className?: string;
}
export function SingleRelayerFeeInput({
  active = false,
  chain,
  token,
  relayerFee = 0,
  setRelayerFee = () => ({}),
  className,
}: SingleRelayerFeeInputProps) {
  const [error, setError] = useState("");

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const fee = parseInt(value);
      try {
        setRelayerFee(fee);
        setError("");
      } catch (e) {
        setError("Please enter a valid number");
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
              disabled={!active}
              placeholder="0.00"
              type="number"
              min={0}
              step={1}
              className={cn(
                `bsa-rounded-br-none bsa-rounded-tr-none bsa-border-r-0 bsa-text-right bsa-text-xl focus-visible:bsa-ring-0`
              )}
              value={relayerFee}
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
              "bsa-flex bsa-h-10 bsa-w-1/5 bsa-items-center bsa-rounded-md bsa-rounded-bl-none bsa-rounded-tl-none bsa-border bsa-border-l-0 bsa-border-input bsa-bg-background bsa-pr-2 bsa-text-xs bsa-ring-offset-background",
              active ? "" : "bsa-cursor-not-allowed bsa-opacity-50"
            )}
          >
            {token}
          </div>
        </div>
      </label>
    </div>
  );
}
