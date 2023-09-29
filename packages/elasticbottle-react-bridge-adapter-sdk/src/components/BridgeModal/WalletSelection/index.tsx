import type { ChainName } from "@elasticbottle/core-bridge-adapter-sdk";
import { useBridgeModalStore } from "../../../providers/BridgeModalContext";
import type { BridgeStep, BridgeStepParams } from "../../../types/BridgeModal";
import { EvmWalletConnectionList } from "./EvmWalletSelection";
import { SolanaWalletConnectionList } from "./SolanaWalletSelection";

function hasChain(
  params: BridgeStepParams<BridgeStep>
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
