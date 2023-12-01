import type { Token } from "@solana/bridge-adapter-core";
import { formatUnits, parseUnits } from "viem";
import { setToken, useBridgeModalStore } from "@solana/bridge-adapter-react";
import { useTokenInfo } from "./use-token-info";
import { TokenSelectBase } from "./token-select-base";
import { hasChainDest } from "../../shared/lib/utils";

export function TokenSelect() {
  const params = useBridgeModalStore.use.currentBridgeStepParams();
  if (!hasChainDest(params)) {
    throw new Error("Missing chainDest in params");
  }
  const { chainDest } = params;
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const chainOfInterest = chainDest === "source" ? sourceChain : targetChain;
  const tokenOfInterest = chainDest === "source" ? sourceToken : targetToken;

  const { error, isLoadingTokens, tokens } = useTokenInfo(chainDest);
  if (error) {
    throw error;
  }

  const onTokenClick = (token: Token) => {
    return () => {
      setToken(
        {
          ...token,
          selectedAmountFormatted: tokenOfInterest.selectedAmountFormatted,
          selectedAmountInBaseUnits: formatUnits(
            parseUnits(tokenOfInterest.selectedAmountFormatted, token.decimals),
            token.decimals,
          ),
        },
        chainDest,
      ).catch((e: unknown) => {
        console.error("ERROR: Something went wrong setting token", e);
      });
    };
  };
  return (
    <TokenSelectBase
      isLoadingTokens={isLoadingTokens}
      onSelectToken={onTokenClick}
      chain={chainOfInterest}
      tokens={tokens}
    />
  );
}
