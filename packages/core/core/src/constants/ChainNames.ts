import type { Bridges } from "../types/Bridges";
import type { ChainName } from "../types/Chain";
import { CHAIN_NAMES } from "../types/Chain";

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
  AllBridgeCore: "allBridgeCore",
  DeBridge: "deBridge",
  Mayan: "mayan",
  Wormhole: "wormhole",
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
