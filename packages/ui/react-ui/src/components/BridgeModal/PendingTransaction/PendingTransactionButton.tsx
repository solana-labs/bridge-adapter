import { setCurrentBridgeStep } from "bridge-adapter-react";
import { Button } from "../../../shared/ui/button";

export function PendingTransactionButton() {
  return (
    <Button
      size={"lg"}
      className="bsa-mt-10 bsa-w-full"
      onClick={() => {
        setCurrentBridgeStep({
          step: "PENDING_TRANSACTION",
        });
      }}
    >
      Begin Swap
    </Button>
  );
}
