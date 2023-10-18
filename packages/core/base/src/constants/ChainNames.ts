import type { Bridges } from "../types/Bridges";
import type { ChainName } from "../types/Chain";

export const CHAIN_NAMES = [
  "Ethereum",
  "Solana",
  "Polygon",
  "Avalanche",
  "Arbitrum",
  "Optimism",
  "BSC",
] as const;

export const CHAIN_ALIASES: Record<ChainName, ChainName> = {
  [CHAIN_NAMES[0]]: CHAIN_NAMES[0],
  [CHAIN_NAMES[1]]: CHAIN_NAMES[1],
  [CHAIN_NAMES[2]]: CHAIN_NAMES[2],
  [CHAIN_NAMES[3]]: CHAIN_NAMES[3],
  [CHAIN_NAMES[4]]: CHAIN_NAMES[4],
  [CHAIN_NAMES[5]]: CHAIN_NAMES[5],
  [CHAIN_NAMES[6]]: CHAIN_NAMES[6],
};

export const BRIDGE_ALIASES: Record<string, Bridges> = {
  DeBridge: "deBridge",
  Mayan: "mayan",
  Wormhole: "wormhole",
  AllBridgeCore: "allBridgeCore",
};

export const CHAIN_NAMES_TO_CHAIN_ID: Record<ChainName, number> = {
  Ethereum: 1,
  Solana: -1,
  Polygon: 137,
  Arbitrum: 42161,
  Optimism: 10,
  Avalanche: 43114,
  BSC: 56,
};
