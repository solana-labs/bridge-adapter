import type { FC } from "react";
import { Separator } from "@radix-ui/react-separator";
import { SwapDetailsButton, SwapReviewButton } from "../features/SwapDetails";
import {
  WalletSelectionButton,
  useIsWalletConnected,
} from "../features/WalletSelection";
import {
  InputTokenAndChainWidget,
  OutputTokenAndChainWidget,
} from "../widgets";

export const MultiChainSelection: FC<unknown> = () => {
  const { isWalletConnected } = useIsWalletConnected();
  return (
    <div className="bsa-flex bsa-h-full bsa-flex-col bsa-space-y-4">
      <div className="bsa-flex bsa-flex-col bsa-space-y-4">
        <div className="bsa-text-muted-foreground">Bridge From</div>
        <InputTokenAndChainWidget />
        <div className="bsa-flex bsa-w-full bsa-items-center bsa-justify-around bsa-text-muted-foreground">
          <Separator
            className="bsa-h-[2px] bsa-w-1/3 bsa-bg-muted"
            decorative={true}
          />
          To
          <Separator
            className="bsa-h-[2px] bsa-w-1/3 bsa-bg-muted"
            decorative={true}
          />
        </div>
        <OutputTokenAndChainWidget />
      </div>
      <SwapDetailsButton />
      {isWalletConnected ? <SwapReviewButton /> : <WalletSelectionButton />}
    </div>
  );
};
