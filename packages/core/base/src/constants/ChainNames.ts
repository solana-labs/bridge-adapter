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

export const CHAIN_NAMES_TO_CHAIN_ID: Record<ChainName, number> = {
  Ethereum: 1,
  Solana: -1,
  Polygon: 137,
  Arbitrum: 42161,
  Optimism: 10,
  Avalanche: 43114,
  BSC: 56,
};
