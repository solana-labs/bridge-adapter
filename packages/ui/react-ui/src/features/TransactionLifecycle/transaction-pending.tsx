import type { BridgeStatus } from "@solana/bridge-adapter-base";
import { useCallback, useState } from "react";
import {
  goBackOneStep,
  setCurrentBridgeStep,
} from "@solana/bridge-adapter-react";
import { Spinner } from "../../shared/ui/spinner";
import { useSubmitAndTrackTransaction } from "./use-submit-and-track-transaction";

export function PendingTransaction() {
  const onError = useCallback((e: Error) => {
    console.error("Something went wrong during swap", e);
    goBackOneStep();
  }, []);
  const [currentStatus, setCurrentStatus] = useState<BridgeStatus | undefined>(
    undefined,
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
