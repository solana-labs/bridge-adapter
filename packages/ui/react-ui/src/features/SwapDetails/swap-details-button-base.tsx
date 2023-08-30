import { ChevronRight } from "lucide-react";
import type { FC, JSX, HTMLProps } from "react";
import { Button } from "../../shared/ui/button";
import { cn } from "../../shared/lib/styles";

interface SwapDetailsButtonBaseProps extends HTMLProps<HTMLButtonElement> {
  isAbleRetrieveDetails: boolean;
  isLoadingDetails: boolean;
  hasDetails: boolean;
  labels?: {
    [key: string]: string;
    idle: string;
    loading: string;
    done: string;
  };
  onClick: () => void;
}

const LABELS = {
  idle: "No Swap Route Found",
  loading: "Fetching Swap Route Details",
  done: "View Swap Route Details",
};

export const SwapDetailsButtonBase: FC<SwapDetailsButtonBaseProps> = ({
  className,
  hasDetails,
  isLoadingDetails,
  isAbleRetrieveDetails,
  labels = LABELS,
  onClick,
}) => {
  let ariaLabel: string = "Idle";
  let ButtonBody: JSX.Element = (
    <div role="status" aria-live="polite" aria-label={ariaLabel}>
      {labels.idle}
    </div>
  );
  if (isAbleRetrieveDetails && isLoadingDetails) {
    ariaLabel = "Loading";
    ButtonBody = (
      <div role="status" aria-live="polite" aria-label={ariaLabel}>
        {labels.loading}
      </div>
    );
  } else if (isAbleRetrieveDetails && !isLoadingDetails && hasDetails) {
    ariaLabel = "Finished";
    ButtonBody = (
      <>
        <div role="status" aria-live="polite" aria-label={ariaLabel}>
          {labels.done}
        </div>
        <ChevronRight />
      </>
    );
  }

  return (
    <Button
      aria-label="Swap Details"
      className={cn("bsa-w-full bsa-justify-between", className)}
      disabled={!isAbleRetrieveDetails}
      isLoading={isAbleRetrieveDetails && isLoadingDetails}
      onClick={onClick}
      size="lg"
      variant={isAbleRetrieveDetails ? "outline" : "ghost"}
    >
      {ButtonBody}
    </Button>
  );
};
