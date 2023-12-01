export const CHAIN_NAMES = [
  "Arbitrum",
  "Avalanche",
  "BSC",
  "Ethereum",
  "Optimism",
  "Polygon",
  "Solana",
] as const;

export type ChainName = (typeof CHAIN_NAMES)[number];

export type ChainSourceAndTarget = {
  sourceChain: ChainName;
  targetChain: ChainName;
};
