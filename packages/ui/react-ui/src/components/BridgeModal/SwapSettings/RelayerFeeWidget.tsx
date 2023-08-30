import { useState } from "react";
import { setRelayerFee, useBridgeModalStore } from "bridge-adapter-react";
import type { RelayerFeeType } from "../../../types/BridgeModal";
import { Switch } from "../../../shared/ui/switch";
import { SingleRelayerFeeInput } from "./SingleRelayerFeeInput";

export function RelayerFeeWidget() {
  const { active, targetFee, sourceFee }: RelayerFeeType =
    useBridgeModalStore.use.relayerFee();
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [toggleValue, setToggleValue] = useState(active);
  const [error, setError] = useState("");

  const onCheckedChange = (checked: boolean) => {
    setToggleValue(checked);
    setError("");
    try {
      setRelayerFee({ active: checked });
    } catch (e) {
      setError("Please enter a valid number");
    }
  };

  const onSetRelayerFee = (target: string) => (fee: number) => {
    if (target && fee) {
      setRelayerFee({ [`${target}Fee`]: fee });
    }
  };

  if (sourceChain === "Select a chain" || targetChain === "Select a chain") {
    return null;
  }

  return (
    <div className="bsa-mt-5 bsa-rounded-lg bsa-border bsa-p-5">
      <div className="bsa-mb-5 bsa-flex bsa-items-center bsa-justify-between">
        <p>Relayer Fee</p>{" "}
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
        <SingleRelayerFeeInput
          chain={sourceChain}
          token={sourceToken?.symbol}
          active={active}
          relayerFee={sourceFee}
          setRelayerFee={onSetRelayerFee("source")}
        />
      </div>
      <div>
        <SingleRelayerFeeInput
          chain={targetChain}
          token={targetToken?.symbol}
          active={active}
          relayerFee={targetFee}
          setRelayerFee={onSetRelayerFee("target")}
        />
      </div>
    </div>
  );
}
