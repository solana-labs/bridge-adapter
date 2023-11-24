import type { ChainDestType } from "@solana/bridge-adapter-core";
import { useQuery } from "@tanstack/react-query";
import { useBridgeModalStore } from "@solana/bridge-adapter-react";

// FIXME: write tests

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
