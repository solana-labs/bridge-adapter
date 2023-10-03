import type { FC } from "react";
import type { ChainName } from "@solana/bridge-adapter-base";
import { useBridgeModalStore } from "@solana/bridge-adapter-react";
import type { BridgeStep, BridgeStepParams } from "../../types/BridgeModal";
import { EvmWalletConnectionList } from "./evm-wallet-selection";
import { SolanaWalletConnectionList } from "./solana-wallet-selecton";
import { AbsentChainError } from "../../errors";

type SolanaChainName = Extract<ChainName, "Solana">;

export const WalletSelection: FC<unknown> = () => {
  const params = useBridgeModalStore.use.currentBridgeStepParams();
  if (!hasChain(params)) {
    throw new AbsentChainError("Missing chain");
  }
  const { chain, onSuccess } = params;

  if (isSolana(chain)) {
    return <SolanaWalletConnectionList onSuccess={onSuccess} />;
  } else {
    return <EvmWalletConnectionList chain={chain} onSuccess={onSuccess} />;
  }
};

function isSolana(chain: ChainName): chain is SolanaChainName {
  return chain === "Solana";
}

function hasChain(
  params: BridgeStepParams<BridgeStep>,
): params is { chain: ChainName } {
  if (!params) {
    return false;
  }
  return "chain" in params;
}
