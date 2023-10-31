import * as BridgeAdapterReact from "@solana/bridge-adapter-react";
import type { BridgeStep } from "@solana/bridge-adapter-react";
import type { FC } from "react";
import { BridgeStepToTitle } from "../constants";
import { Button } from "../shared/ui/button";
import { ChevronLeft, Settings } from "lucide-react";
import { cn } from "../shared/lib/styles";
import { MultiChainWalletButton } from "../features/MultiChainWalletButton";

export interface BridgeHeaderProps {
  currentBridgeStep: BridgeStep;
  title?: string;
}

/**
 *  Widget
 *
 *  Header with controls
 */
export const BridgeHeader: FC<BridgeHeaderProps> = ({
  currentBridgeStep,
  title,
}) => {
  let HeaderBody = (
    <div
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
          BridgeAdapterReact.setCurrentBridgeStep({
            step: "SWAP_SETTINGS",
          });
        }}
      >
        <Settings />
      </Button>
    </div>
  );

  if (currentBridgeStep !== "MULTI_CHAIN_SELECTION") {
    HeaderBody = (
      <div
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
            BridgeAdapterReact.goBackOneStep();
          }}
        >
          <ChevronLeft />
        </Button>
        <div className="bsa-pointer-events-none bsa-ml-10 bsa-flex bsa-w-full bsa-flex-grow bsa-justify-center">
          {BridgeStepToTitle[currentBridgeStep]}
        </div>
      </div>
    );
  }

  return HeaderBody;
};
