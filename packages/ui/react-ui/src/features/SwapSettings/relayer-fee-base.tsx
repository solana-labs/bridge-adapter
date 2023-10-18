import type { ChainSelectionType } from "@solana/bridge-adapter-react";
import type { FC } from "react";
import type { TokenWithAmount } from "@solana/bridge-adapter-base";
import { SingleRelayerFeeInputBase } from "./single-relayer-fee-input-base";
import { Switch } from "../../shared/ui/switch";

export interface RelayerFeeBaseProps {
  active?: boolean;
  error?: string;
  labels?: {
    [key: string]: string;
    feeText: string;
  };
  onCheckedChange: (checked: boolean) => void;
  onSetRelayerFee: (t: string, f: number) => void;
  sourceChain: ChainSelectionType;
  sourceFee?: number;
  sourceToken: TokenWithAmount;
  targetChain: ChainSelectionType;
  targetFee?: number;
  targetToken: TokenWithAmount;
}

const LABELS = {
  feeText: "Relayer Fee",
};

export const RelayerFeeBase: FC<RelayerFeeBaseProps> = ({
  active,
  error,
  labels = LABELS,
  onCheckedChange,
  onSetRelayerFee,
  sourceChain,
  sourceFee,
  sourceToken,
  targetChain,
  targetFee,
  targetToken,
}) => {
  const handleSetRelayerFee = (target: string) => (fee: number) => {
    if (fee) {
      onSetRelayerFee(target, fee);
    }
  };

  if (sourceChain === "Select a chain" || targetChain === "Select a chain") {
    return null;
  }

  return (
    <div className="bsa-mt-5 bsa-rounded-lg bsa-border bsa-p-5">
      <div className="bsa-mb-5 bsa-flex bsa-items-center bsa-justify-between">
        <p>{labels.feeText}</p>{" "}
        <div className="bsa-ml-4">
          <Switch checked={active} onCheckedChange={onCheckedChange} />
          {error && (
            <div className="bsa-text-xs bsa-text-destructive-foreground">
              {error}
            </div>
          )}
        </div>
      </div>
      <div className="bsa-mb-8">
        <SingleRelayerFeeInputBase
          chain={sourceChain}
          token={sourceToken?.symbol}
          active={active}
          relayerFee={sourceFee}
          setRelayerFee={handleSetRelayerFee("source")}
        />
      </div>
      <div>
        <SingleRelayerFeeInputBase
          chain={targetChain}
          token={targetToken?.symbol}
          active={active}
          relayerFee={targetFee}
          setRelayerFee={handleSetRelayerFee("target")}
        />
      </div>
    </div>
  );
};
