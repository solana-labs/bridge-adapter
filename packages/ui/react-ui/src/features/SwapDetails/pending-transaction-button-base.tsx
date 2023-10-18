import type { FC, HTMLProps } from "react";
import { Button } from "../../shared/ui/button";
import { cn } from "../../shared/lib/styles";

export interface PendingTransactionButtonBaseProps
  extends HTMLProps<HTMLButtonElement> {
  labels?: {
    text: string;
  };
  onClick: () => void;
}

const LABELS = {
  text: "Begin Swap",
};

export const PendingTransactionButtonBase: FC<
  PendingTransactionButtonBaseProps
> = ({ className, labels = LABELS, onClick }) => {
  return (
    <Button size="lg" className={cn("bsa-w-full", className)} onClick={onClick}>
      {labels.text}
    </Button>
  );
};
