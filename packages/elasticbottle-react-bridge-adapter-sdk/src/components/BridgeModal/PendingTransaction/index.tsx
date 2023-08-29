import type { BridgeStatus } from "@elasticbottle/core-bridge-adapter-sdk";
import { useCallback, useState } from "react";
import {
  goBackOneStep,
  setCurrentBridgeStep,
} from "../../../providers/BridgeModalContext";
import { Spinner } from "../../ui/spinner";
import { useSubmitAndTrackTransaction } from "./useSubmitAndTrackTransaction";

export function PendingTransaction() {
  const onError = useCallback((e: Error) => {
    console.error("Something went wrong during swap", e);
    goBackOneStep();
  }, []);
  const [currentStatus, setCurrentStatus] = useState<BridgeStatus | undefined>(
    undefined
  );
  const onStatusUpdate = useCallback((args: BridgeStatus) => {
    setCurrentStatus(args);
    console.log("args", args);
    if (args.name === "Completed") {
      setCurrentBridgeStep({
        step: "TRANSACTION_COMPLETED",
      });
    }
  }, []);

  useSubmitAndTrackTransaction({
    onError,
    onStatusUpdate,
  });

  return (
    <div className="bsa-flex bsa-h-80 bsa-w-full bsa-flex-col bsa-items-center bsa-justify-center bsa-space-y-5">
      <Spinner variant={"default"} className="bsa-h-20 bsa-w-20" />
      <div>{currentStatus?.information}</div>
    </div>
  );
}
