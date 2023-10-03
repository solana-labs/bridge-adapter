import type { FC } from "react";
import type {
  ChainDestType,
  TokenWithAmount,
} from "@solana/bridge-adapter-base";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { hasChainDest } from "../../shared/lib/utils";
import { setToken, useBridgeModalStore } from "@solana/bridge-adapter-react";
import { TokenSelectionBase } from "./token-selection-base";

export const TokenSelection: FC<unknown> = () => {
  const params = useBridgeModalStore.use.currentBridgeStepParams();
  if (!hasChainDest(params)) {
    throw new Error("Missing chainDest in params");
  }
  const { chainDest } = params;

  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const sdk = useBridgeModalStore.use.sdk();

  const [tokenSearch, setTokenSearch] = useState("");

  const {
    data: tokens,
    isInitialLoading,
    error,
  } = useQuery({
    queryFn: async () => {
      if (
        sourceChain === "Select a chain" &&
        targetChain === "Select a chain"
      ) {
        throw new Error("Either Source or Target chain must be selected");
      }
      return await sdk.getSupportedTokens(chainDest, {
        sourceChain: sourceChain === "Select a chain" ? undefined : sourceChain,
        targetChain: targetChain === "Select a chain" ? undefined : targetChain,
      });
    },
    queryKey: ["getTokens", sourceChain, targetChain, chainDest],
  });
  if (error) {
    console.error(error);
  }

  const onSearchToken = (value: string) => {
    setTokenSearch(value);
  };

  const onSetToken = (token: TokenWithAmount, c: ChainDestType) => {
    setToken(token, c).catch((e: unknown) => {
      console.error("ERROR: Something went wrong setting token", e);
    });
  };

  return (
    <TokenSelectionBase
      chainDest={chainDest}
      tokenSearch={tokenSearch}
      tokens={tokens}
      isInitialLoading={isInitialLoading}
      onSearchToken={onSearchToken}
      onSetToken={onSetToken}
    />
  );
};
