import type { BridgeStatus } from "bridge-adapter-base";
import { useCallback, useState } from "react";
import { goBackOneStep, setCurrentBridgeStep } from "bridge-adapter-react";
import { useSubmitAndTrackTransaction } from "./use-submit-and-track-transaction";
import { PendingTransactionBase } from "./pending-transaction-base";

const UNKNOWN_STATUS = {
  name: "",
  status: "PENDING",
  information: "",
} satisfies BridgeStatus;

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

  return <PendingTransactionBase status={currentStatus ?? UNKNOWN_STATUS} />;
}
