import * as useBridgeAdapter from "@solana/bridge-adapter-react";
import type { BridgeStatus } from "@solana/bridge-adapter-base";
import { BridgeStatusNames } from "@solana/bridge-adapter-base";
import { Spinner } from "../../shared/ui/spinner";
import { useCallback, useState } from "react";
import { useSubmitAndTrackTransaction } from "../../entities";

export function PendingTransaction() {
  const { setNotification } = useBridgeAdapter.useBridgeAdapter();
  const onError = useCallback(
    (e: Error) => {
      setNotification(e);
      useBridgeAdapter.goBackOneStep();
    },
    [setNotification],
  );
  const [currentStatus, setCurrentStatus] = useState<BridgeStatus | undefined>(
    undefined,
  );
  const onStatusUpdate = useCallback((args: BridgeStatus) => {
    setCurrentStatus(args);
    const statusName = args.name as BridgeStatusNames;
    if (statusName === BridgeStatusNames.Completed) {
      useBridgeAdapter.setCurrentBridgeStep({
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
      <Spinner variant="default" className="bsa-h-20 bsa-w-20" />
      <div>{currentStatus?.information}</div>
    </div>
  );
}
