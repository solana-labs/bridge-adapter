import type { ChainDestType } from "bridge-adapter-base";
import { useQuery } from "@tanstack/react-query";
import { useBridgeModalStore } from "bridge-adapter-react";

export function useChainInfo(chainDest: ChainDestType) {
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const sdk = useBridgeModalStore.use.sdk();
  const {
    data: chains,
    isInitialLoading: isLoadingChains,
    error,
  } = useQuery({
    queryFn: async () => {
      return await sdk.getSupportedChains();
    },
    queryKey: ["getChains", sourceChain, targetChain, chainDest],
  });

  return { chains, isLoadingChains, error };
}
