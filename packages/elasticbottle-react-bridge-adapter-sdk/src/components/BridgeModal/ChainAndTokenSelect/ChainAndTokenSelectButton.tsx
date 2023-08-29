import type { ChainDestType } from "@elasticbottle/core-bridge-adapter-sdk";
import { Ban, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "../../../providers/BridgeModalContext";
import { Button } from "../../ui/button";
import { ChainIcon } from "../../ui/icons/ChainIcon";

export function ChainAndTokenSelectButton({
  chainDest,
  className,
}: {
  chainDest: ChainDestType;
  className?: string;
}) {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const tokenOfInterest = chainDest === "source" ? sourceToken : targetToken;
  const chainOfInterest = chainDest === "source" ? sourceChain : targetChain;
  const isTokenChosen = !!tokenOfInterest.address;

  let TokenDisplay = (
    <div className="bsa-relative bsa-flex bsa-flex-grow bsa-items-center bsa-space-x-2 bsa-py-1">
      <ChainIcon
        size={"sm"}
        chainName={chainOfInterest}
        className="bsa-absolute bsa-bottom-0 bsa-left-0.5 bsa-rounded-full bsa-border bsa-border-accent bsa-bg-accent bsa-p-1"
      />
      <img
        className="bsa-h-8 bsa-w-8"
        src={tokenOfInterest.logoUri}
        alt={tokenOfInterest.name}
      />
      <div className="bsa-max-w-[100px] bsa-overflow-hidden bsa-text-ellipsis bsa-whitespace-nowrap">
        {tokenOfInterest.name}
      </div>
    </div>
  );

  if (!isTokenChosen) {
    TokenDisplay = (
      <>
        <Ban className="bsa-h-4 bsa-w-4 bsa-text-muted-foreground" />
        <div className="bsa-text-sm bsa-text-muted-foreground">
          Select Token
        </div>
      </>
    );
  }

  return (
    <Button
      variant={isTokenChosen ? "ghost" : "secondary"}
      size={"lg"}
      className={cn("bsa-w-max bsa-space-x-2", className)}
      onClick={() => {
        setCurrentBridgeStep({
          step: "TOKEN_CHAIN_SELECTION",
          params: { chainDest },
        });
      }}
    >
      {TokenDisplay}
      <ChevronRight />
    </Button>
  );
}
