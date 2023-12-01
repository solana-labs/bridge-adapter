import type { BridgeStatus } from "@solana/bridge-adapter-core";
import type { FC } from "react";
import { Spinner } from "../../shared/ui/spinner";

export interface PendingTransactionBaseProps {
  status: BridgeStatus;
}

export const PendingTransactionBase: FC<PendingTransactionBaseProps> = ({
  status,
}) => (
  <div
    role="status"
    aria-label="Transaction Status"
    className="bsa-flex bsa-h-80 bsa-w-full bsa-flex-col bsa-items-center bsa-justify-center bsa-space-y-5"
  >
    <Spinner variant="default" className="bsa-h-20 bsa-w-20" />
    <div>{status.information}</div>
  </div>
);
