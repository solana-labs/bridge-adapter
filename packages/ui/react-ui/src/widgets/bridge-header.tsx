import type { FC } from "react";
import { ChevronLeft, Settings } from "lucide-react";
import { cn } from "../shared/lib/styles";
import {
  goBackOneStep,
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "@solana/bridge-adapter-react";
import { BridgeStepToTitle } from "../types/BridgeModal";
import { Button } from "../shared/ui/button";
import { DialogHeader, DialogTitle } from "../shared/ui/dialog";
import { MultiChainWalletButton } from "../features/MultiChainWalletButton";

export interface BridgeHeaderProps {
  title?: string;
}

/**
 *  Widget
 *
 *  Header with controls
 */
export const BridgeHeader: FC<BridgeHeaderProps> = ({ title }) => {
  const currentBridgeStep = useBridgeModalStore.use.currentBridgeStep();

  let HeaderBody = (
    <DialogTitle
      className={cn({
        "bsa-items-right bsa-flex bsa-text-xl": true,
        "bsa-justify-between": !!title,
        "bsa-justify-end": !title,
      })}
    >
      <div className="bsa-pointer-events-none">{title}</div>
      <MultiChainWalletButton />
      <Button
        size="icon"
        variant="secondary"
        className="bsa-p-2"
        aria-label="swap settings"
        onClick={() => {
          setCurrentBridgeStep({
            step: "SWAP_SETTINGS",
          });
        }}
      >
        <Settings />
      </Button>
    </DialogTitle>
  );
  if (currentBridgeStep !== "MULTI_CHAIN_SELECTION") {
    HeaderBody = (
      <DialogTitle
        className={cn({
          "bsa-flex bsa-items-center bsa-text-xl": true,
          "bsa-justify-between": !!title,
          "bsa-justify-end": !title,
        })}
      >
        <Button
          size="icon"
          variant="secondary"
          className="bsa-p-2"
          aria-label="Go Back"
          onClick={() => {
            goBackOneStep();
          }}
        >
          <ChevronLeft />
        </Button>
        <div className="bsa-pointer-events-none bsa-ml-10 bsa-flex bsa-w-full bsa-flex-grow bsa-justify-center">
          {BridgeStepToTitle[currentBridgeStep]}
        </div>
      </DialogTitle>
    );
  }

  return (
    <DialogHeader aria-description="Modal to swap assets between various blockchains">
      {HeaderBody}
    </DialogHeader>
  );
};
