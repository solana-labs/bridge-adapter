import type { ChainDestType } from "@elasticbottle/core-bridge-adapter-sdk";
import { useQuery } from "@tanstack/react-query";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";

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
