import type { ChainName } from "bridge-adapter-base";
import { useCallback } from "react";
import { hasChainDest } from "../../shared/lib/utils";
import { setChain, useBridgeModalStore } from "bridge-adapter-react";
import { useChainInfo } from "./use-chain-info";
import { ChainSelectBase } from "./chain-select-base";

export function ChainSelect() {
  const params = useBridgeModalStore.use.currentBridgeStepParams();
  if (!hasChainDest(params)) {
    throw new Error("Missing chainDest in params");
  }
  const { chainDest } = params;
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const chainOfInterest = chainDest === "source" ? sourceChain : targetChain;

  const { chains, error, isLoadingChains } = useChainInfo(chainDest);

  const onChooseChain = useCallback(
    (chainName: ChainName) => {
      setChain({
        newChain: chainName,
        chainDestination: chainDest,
      }).catch((e: unknown) => {
        console.error("Something went wrong changing chain", e);
      });
    },
    [chainDest],
  );

  return (
    <ChainSelectBase
      chains={chains}
      error={error as Error}
      isLoadingChains={isLoadingChains}
      onSelectChain={onChooseChain}
      chain={chainOfInterest}
    />
  );
}
