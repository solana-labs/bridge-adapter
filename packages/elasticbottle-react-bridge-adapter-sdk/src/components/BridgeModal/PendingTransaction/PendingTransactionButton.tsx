import { setCurrentBridgeStep } from "../../../providers/BridgeModalContext";
import { Button } from "../../ui/button";

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
