import type { ChainDestType } from "@solana/bridge-adapter-base";
import type { FC } from "react";
import {
  setCurrentBridgeStep,
  useBridgeModalStore,
} from "@solana/bridge-adapter-react";
import { ChainAndTokenSelectButtonBase } from "./chain-and-token-select-button-base";

export interface ChainAndTokenSelectButtonProps {
  className: string;
  chainDest: ChainDestType;
}

export const ChainAndTokenSelectButton: FC<ChainAndTokenSelectButtonProps> = ({
  chainDest,
  className,
}) => {
  const { sourceToken, targetToken } = useBridgeModalStore.use.token();
  const { sourceChain, targetChain } = useBridgeModalStore.use.chain();
  const tokenOfInterest = chainDest === "source" ? sourceToken : targetToken;
  const chainOfInterest = chainDest === "source" ? sourceChain : targetChain;

  return (
    <ChainAndTokenSelectButtonBase
      className={className}
      onSelect={() => {
        setCurrentBridgeStep({
          step: "TOKEN_CHAIN_SELECTION",
          params: { chainDest },
        });
      }}
      chain={chainOfInterest}
      token={tokenOfInterest}
    />
  );
};
