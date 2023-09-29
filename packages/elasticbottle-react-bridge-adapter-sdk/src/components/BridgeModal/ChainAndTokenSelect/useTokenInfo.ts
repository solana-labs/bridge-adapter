import type { ChainDestType } from "@elasticbottle/core-bridge-adapter-sdk";
import { useQuery } from "@tanstack/react-query";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";

export function useTokenInfo(chainDest: ChainDestType) {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const sdk = useBridgeModalStore.use.sdk();
  const {
    data: tokens,
    isLoading: isLoadingTokens,
    error,
  } = useQuery({
    queryFn: async () => {
      if (chainDest === "source" && sourceChain === "Select a chain") {
        return [];
      }
      if (chainDest === "target" && targetChain === "Select a chain") {
        return [];
      }

      return await sdk.getSupportedTokens(
        chainDest,
        {
          sourceChain:
            sourceChain === "Select a chain" ? undefined : sourceChain,
          targetChain:
            targetChain === "Select a chain" ? undefined : targetChain,
        },
        { sourceToken, targetToken }
      );
    },
    queryKey: [
      "getTokens",
      sourceChain,
      targetChain,
      chainDest,
      sourceToken,
      targetToken,
    ],
  });
  return { tokens, isLoadingTokens, error };
}
