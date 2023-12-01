import React from "react";
import type { ChainName } from "@solana/bridge-adapter-core";
import type { ChainSelectionType } from "@solana/bridge-adapter-react";
import type { FC } from "react";
import { Button } from "../../shared/ui/button";
import { ChainIcon } from "../../shared/ui/icons/ChainIcon";
import { cn } from "../../shared/lib/styles";
import { Skeleton } from "../../shared/ui/skeleton";

export interface ChainSelectBaseProps {
  chains?: ChainName[];
  error?: Error;
  isLoadingChains: boolean;
  labels?: {
    [key: string]: string;
    noSupportedChains: string;
  };
  onSelectChain: (c: ChainName) => void;
  chain: ChainSelectionType;
}

const LABELS = {
  noSupportedChains: "No supported chains found",
};

export const ChainSelectBase: FC<ChainSelectBaseProps> = ({
  chains,
  error,
  isLoadingChains,
  labels = LABELS,
  onSelectChain,
  chain,
}) => {
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
        {labels.noSupportedChains}{" "}
      </div>
    );
  }

  return (
    <div className="bsa-flex bsa-w-full bsa-gap-2">
      {chains.map((chainName) => {
        const isChainSelected = chainName === chain;
        return (
          <React.Fragment key={chainName}>
            <Button
              aria-label={`${chainName} Chain`}
              variant="outline"
              size="lg"
              className={cn({
                "bsa-h-12 bsa-w-12 bsa-p-1": true,
                "bsa-cursor-default bsa-bg-accent": isChainSelected,
              })}
              onClick={() => onSelectChain(chainName)}
            >
              <ChainIcon chainName={chainName} size="md" />
            </Button>
          </React.Fragment>
        );
      })}
    </div>
  );
};
