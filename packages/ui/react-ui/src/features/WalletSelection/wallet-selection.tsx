import type { ChainName } from "bridge-adapter-base";
import { useBridgeModalStore } from "bridge-adapter-react";
import type { BridgeStep, BridgeStepParams } from "../../types/BridgeModal";
import { EvmWalletConnectionList } from "./evm-wallet-selection";
import { SolanaWalletConnectionList } from "./solana-wallet-selecton";

function hasChain(
  params: BridgeStepParams<BridgeStep>,
): params is { chain: ChainName } {
  if (!params) {
    return false;
  }
  return "chain" in params;
}

export function WalletSelection() {
  const params = useBridgeModalStore.use.currentBridgeStepParams();
  if (!hasChain(params)) {
    throw new Error("Missing chain in params");
  }
  const { chain, onSuccess } = params;
  if (chain === "Solana") {
    return <SolanaWalletConnectionList />;
  } else {
    return <EvmWalletConnectionList chain={chain} onSuccess={onSuccess} />;
  }
}
