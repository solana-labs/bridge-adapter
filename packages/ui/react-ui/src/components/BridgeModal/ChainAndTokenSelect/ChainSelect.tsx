import type { ChainName } from "bridge-adapter-base";
import React from "react";
import { cn, hasChainDest } from "../../../lib/utils";
import { setChain, useBridgeModalStore } from "bridge-adapter-react";
import { Button } from "../../../shared/ui/button";
import { ChainIcon } from "../../../shared/ui/icons/ChainIcon";
import { Skeleton } from "../../../shared/ui/skeleton";
import { useChainInfo } from "./useChainInfo";

export function ChainSelect() {
  const params = useBridgeModalStore.use.currentBridgeStepParams();
  if (!hasChainDest(params)) {
    throw new Error("Missing chainDest in params");
  }
  const { chainDest } = params;
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const chainOfInterest = chainDest === "source" ? sourceChain : targetChain;

  const { chains, error, isLoadingChains } = useChainInfo(chainDest);

  const onChooseChain = (chainName: ChainName) => () => {
    setChain({
      newChain: chainName,
      chainDestination: chainDest,
    }).catch((e) => {
      console.error("Something went wrong changing chain", e);
    });
  };

  if (isLoadingChains) {
    return (
      <div className="bsa-grid bsa-w-full bsa-grid-cols-7 bsa-gap-1">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="bsa-h-12 bsa-w-12" />
          ))}
      </div>
    );
  }
  if (error) {
    throw error;
  }

  if (!chains || chains.length === 0) {
    return (
      <div className="bsa-text-secondary-foreground">
        No supported chains found
      </div>
    );
  }

  return (
    <div className="bsa-flex bsa-w-full bsa-gap-2">
      {chains.map((chainName) => {
        const isChainSelected = chainName === chainOfInterest;
        return (
          <React.Fragment key={chainName}>
            <Button
              variant={"outline"}
              size={"lg"}
              className={cn({
                "bsa-h-12 bsa-w-12 bsa-p-1": true,
                "bsa-cursor-default bsa-bg-accent": isChainSelected,
              })}
              onClick={onChooseChain(chainName)}
            >
              <ChainIcon chainName={chainName} size={"md"} />
            </Button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
