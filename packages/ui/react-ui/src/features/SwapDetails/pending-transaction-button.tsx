import { setCurrentBridgeStep } from "bridge-adapter-react";
import type { FC } from "react";
import { PendingTransactionButtonBase } from "./pending-transaction-button-base";

export const PendingTransactionButton: FC<
  Parameters<typeof PendingTransactionButtonBase>[0]
> = (props) => {
  return (
    <PendingTransactionButtonBase
      className="bsa-mt-10"
      {...props}
      onClick={() => {
        setCurrentBridgeStep({ step: "PENDING_TRANSACTION" });
      }}
    />
  );
};
