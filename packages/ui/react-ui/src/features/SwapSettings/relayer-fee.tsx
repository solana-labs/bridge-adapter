import type { FC } from "react";
import {
  setRelayerFee,
  useBridgeModalStore,
} from "@solana/bridge-adapter-react";
import { useState } from "react";
import type { RelayerFeeType } from "../../types/BridgeModal";
import { RelayerFeeBase } from "./relayer-fee-base";

export const RelayerFee: FC<unknown> = () => {
  const { active, targetFee, sourceFee }: RelayerFeeType =
    useBridgeModalStore.use.relayerFee();
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();

  const [, setToggleValue] = useState(active);
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

  const onSetRelayerFee = (target: string, fee: number) => {
    setRelayerFee({ [`${target}Fee`]: fee });
  };

  if (sourceChain === "Select a chain" || targetChain === "Select a chain") {
    return null;
  }

  return (
    <RelayerFeeBase
      active={active}
      error={error}
      onCheckedChange={onCheckedChange}
      onSetRelayerFee={onSetRelayerFee}
      sourceChain={sourceChain}
      targetChain={targetChain}
      sourceToken={sourceToken}
      targetToken={targetToken}
      sourceFee={sourceFee}
      targetFee={targetFee}
    />
  );
};
