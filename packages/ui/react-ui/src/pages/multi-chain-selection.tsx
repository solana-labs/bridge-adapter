import type { FC, HTMLProps } from "react";
import { Separator } from "@radix-ui/react-separator";
import { SwapDetailsButton, SwapReviewButton } from "../features/SwapDetails";
import {
  useIsWalletConnected,
  WalletSelectionButton,
} from "../features/WalletSelection";
import {
  InputTokenAndChainWidget,
  OutputTokenAndChainWidget,
} from "../widgets";

export interface MultiChainSelectionProps extends HTMLProps<HTMLDivElement> {
  labels?: {
    [key: string]: string;
    from: string;
    to: string;
  };
}

const LABELS = {
  from: "Bridge From",
  to: "To",
};

export const MultiChainSelection: FC<MultiChainSelectionProps> = ({
  labels = LABELS,
}) => {
  const { isWalletConnected } = useIsWalletConnected();
  return (
    <div className="bsa-flex bsa-h-full bsa-flex-col bsa-space-y-4">
      <div className="bsa-flex bsa-flex-col bsa-space-y-4">
        <div className="bsa-text-muted-foreground">{labels.from}</div>
        <InputTokenAndChainWidget />
        <div className="bsa-flex bsa-w-full bsa-items-center bsa-justify-around bsa-text-muted-foreground">
          <Separator
            className="bsa-h-[2px] bsa-w-1/3 bsa-bg-muted"
            decorative
          />
          {labels.to}
          <Separator
            className="bsa-h-[2px] bsa-w-1/3 bsa-bg-muted"
            decorative
          />
        </div>
        <OutputTokenAndChainWidget />
      </div>
      <SwapDetailsButton />
      {isWalletConnected ? <SwapReviewButton /> : <WalletSelectionButton />}
    </div>
  );
};
