import type { FC } from "react";
import { Button } from "../../shared/ui/button";
import { CheckCircle } from "lucide-react";

export interface CompletedTransactionProps {
  onComplete?: () => void;
}

export const CompletedTransaction: FC<CompletedTransactionProps> = ({
  onComplete,
}) => {
  return (
    <div className="bsa-flex bsa-h-80 bsa-w-full bsa-flex-col bsa-items-center bsa-justify-center bsa-space-y-5">
      <CheckCircle className="bsa-h-20 bsa-w-20" />
      <div className="bsa-text-2xl">Transaction Completed</div>
      <div className="bsa-text-muted-foreground">
        {onComplete ? (
          <Button onClick={onComplete}>Try another transfer</Button>
        ) : null}
      </div>
    </div>
  );
};
