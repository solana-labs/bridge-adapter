import Debug from "debug";
import * as BridgeAdapterReact from "@solana/bridge-adapter-react";
import type { BridgeStatus } from "@solana/bridge-adapter-core";
import { PendingTransactionBase } from "./pending-transaction-base";
import { useCallback, useState } from "react";
import { useSubmitAndTrackTransaction } from "../../entities";

const debug = Debug("debug:react-ui:PendingTransaction");

const UNKNOWN_STATUS = {
  name: "",
  status: "PENDING",
  information: "",
} satisfies BridgeStatus;

export function PendingTransaction() {
  const { setNotification } = BridgeAdapterReact.useBridgeAdapter();

  const onError = useCallback(
    (e: Error) => {
      setNotification(e);
      BridgeAdapterReact.goBackOneStep();
    },
    [setNotification],
  );
  const [currentStatus, setCurrentStatus] = useState<BridgeStatus | undefined>(
    undefined,
  );
  const onStatusUpdate = useCallback((args: BridgeStatus) => {
    debug("Transaction Status:", args);
    setCurrentStatus(args);
    if (args.name === "Completed") {
      BridgeAdapterReact.setCurrentBridgeStep({
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
