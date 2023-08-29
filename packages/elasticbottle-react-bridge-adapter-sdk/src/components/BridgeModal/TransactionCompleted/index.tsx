import { CheckCircle } from "lucide-react";

export function CompletedTransaction() {
  return (
    <div className="bsa-flex bsa-h-80 bsa-w-full bsa-flex-col bsa-items-center bsa-justify-center bsa-space-y-5">
      <CheckCircle className="bsa-h-20 bsa-w-20" />
      <div className="bsa-text-2xl">Transaction Completed</div>
      <div className="bsa-text-muted-foreground">
        You may now exit the modal
      </div>
    </div>
  );
}
