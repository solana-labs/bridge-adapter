import type { ChainName } from "../types/Chain";
import {
  arbitrum,
  avalanche,
  bsc,
  mainnet,
  optimism,
  polygon,
} from "viem/chains";

export function chainNameToViemChain(chainName: ChainName) {
  switch (chainName) {
    case "Ethereum": {
      return mainnet;
    }
    case "Arbitrum": {
      return arbitrum;
    }
    case "Optimism": {
      return optimism;
    }
    case "Avalanche": {
      return avalanche;
    }
    case "BSC": {
      return bsc;
    }
    case "Polygon": {
      return polygon;
    }
    case "Solana": {
      throw new Error("Viem does not support Solana");
    }
    default: {
      throw new Error("Invalid chain name");
    }
  }
}

export const SOLANA_FAKE_CHAIN_ID = -1;
export function chainNameToChainId(
  chainName: ChainName,
  solanaChainOverride: number = SOLANA_FAKE_CHAIN_ID,
) {
  if (chainName === "Solana") {
    return solanaChainOverride;
  }
  const chain = chainNameToViemChain(chainName);
  return chain.id;
}
