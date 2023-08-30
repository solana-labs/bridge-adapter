import type { FC, HTMLProps } from "react";
import { cn } from "../../shared/lib/styles";
import { Button } from "../../shared/ui/button";

interface SwapReviewButtonBaseProps extends HTMLProps<HTMLButtonElement> {
  isAbleReview: boolean;
  labels?: {
    [key: string]: string;
    text: string;
  };
  onClick: () => void;
}

const LABELS = {
  text: "Review Swap",
};

export const SwapReviewButtonBase: FC<SwapReviewButtonBaseProps> = ({
  className,
  isAbleReview,
  labels = LABELS,
  onClick,
}) => (
  <Button
    aria-label="Review Swap"
    size="lg"
    disabled={!isAbleReview}
    className={cn("bsa-w-full", className)}
    variant={isAbleReview ? "default" : "outline"}
    onClick={onClick}
  >
    {labels.text}
  </Button>
);
